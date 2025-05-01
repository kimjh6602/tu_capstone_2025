from PIL import Image, ImageEnhance
# remove PIL.ImageQt imports; implement PyQt5-only conversion
def pil2qpixmap(pil_img):
    # Ensure RGBA for correct channel order
    if pil_img.mode != "RGBA":
        pil_img = pil_img.convert("RGBA")
    w, h = pil_img.size
    data = pil_img.tobytes("raw", "RGBA")
    # Create QImage from raw data
    qimg = QImage(data, w, h, QImage.Format_RGBA8888)
    return QPixmap.fromImage(qimg)

from palette import *
from util import *
from transfer import *
import numpy as np
from PyQt5.QtGui import QImage, QPixmap, QColor
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QFileDialog, QColorDialog, QHBoxLayout, QVBoxLayout, QComboBox
from PyQt5.QtCore import Qt
from harmonization import auto_palette

html_color = lambda color : '#%02x%02x%02x' % (color[0],color[1],color[2])
color_np = lambda color : np.array([color.red(),color.green(),color.blue()])

class Window(QWidget):
    K = 0
    palette_button = []
    Source = ''
    image_label = None
    img = None
    img_lab = None
    palette_color = (np.zeros((7,3)) + 239).astype(int)
    sample_level = 16
    sample_colors = sample_RGB_color(sample_level)
    sample_weight_map = []
    means = []
    means_weight = []

    def __init__(self):
        super().__init__()
        self.setWindowTitle('Palette Based Photo Recoloring')
        self.UiComponents()
        self.show()

    def palette2mean(self):
        mean = np.zeros(self.palette_color.shape)
        for i in range(self.palette_color.shape[0]):
            rgb = Image.new('RGB', (1,1), html_color(self.palette_color[i]))
            mean[i] = np.array(rgb2lab(rgb).getpixel((0,0)))
        return mean.astype(int)

    def mean2palette(self):
        palette = np.zeros(self.means.shape)
        for i in range(self.means.shape[0]):
            lab = Image.new('LAB', (1,1), html_color(self.means[i].astype(int)))
            palette[i] = np.array(lab2rgb(lab).getpixel((0,0)))
        return palette.astype(int)

    def calc_palettes(self, k):
        self.K = k
        colors = self.img_lab.getcolors(self.img_lab.width * self.img_lab.height)
        bins = {}
        for count, pixel in colors:
            bins[pixel] = count
        bins = sample_bins(bins)
        self.means, self.means_weight = k_means(bins, k=self.K, init_mean=True)
        self.palette_color = self.mean2palette()
        self.set_palette_color()

    def pixmap_open_img(self, k):
        self.img = Image.open(self.Source)
        self.img_lab = rgb2lab(self.img)
        self.calc_palettes(k)
        return pil2qpixmap(self.img)

    def style_transfer(self):
        options = QFileDialog.Options()
        file_name, _ = QFileDialog.getOpenFileName(
            self, '이미지 스타일 열기', '',
            'Images (*.jpg *.jpeg *.png *.webp *.tiff *.bmp);;All Files (*)', options=options)
        if not file_name:
            return
        style_img = Image.open(file_name)
        style_img_lab = rgb2lab(style_img)
        colors = style_img_lab.getcolors(style_img.width * style_img.height)
        bins = {pixel: count for count, pixel in colors}
        bins = sample_bins(bins)
        style_means, _ = k_means(bins, k=self.K, init_mean=True)
        style_palette = np.zeros(style_means.shape)
        for i in range(self.K):
            lab = Image.new('LAB', (1,1), html_color(style_means[i].astype(int)))
            style_palette[i] = np.array(lab2rgb(lab).getpixel((0,0)))
        self.palette_color = style_palette.astype(int)
        self.set_palette_color()
        self.img = img_color_transfer(
            self.img_lab, self.means, style_means,
            self.sample_weight_map, self.sample_colors, self.sample_level)
        resized = pil2qpixmap(self.img).scaledToHeight(512)
        self.image_label.setPixmap(resized)

    def auto(self):
        self.palette_color = auto_palette(self.palette_color, self.means_weight)
        self.set_palette_color()
        self.img = img_color_transfer(
            self.img_lab, self.means, self.palette2mean(),
            self.sample_weight_map, self.sample_colors, self.sample_level)
        resized = pil2qpixmap(self.img).scaledToHeight(512)
        self.image_label.setPixmap(resized)

    def clicked(self, idx):
        if idx >= self.K:
            return
        curr = QColor(*self.palette_color[idx])
        clr = QColorDialog.getColor(initial=curr, options=QColorDialog.DontUseNativeDialog)
        if not clr.isValid():
            return
        self.palette_color[idx] = color_np(clr)
        self.set_palette_color()
        self.img = img_color_transfer(
            self.img_lab, self.means, self.palette2mean(),
            self.sample_weight_map, self.sample_colors, self.sample_level)
        resized = pil2qpixmap(self.img).scaledToHeight(512)
        self.image_label.setPixmap(resized)

    def init_palette_color(self):
        for i, btn in enumerate(self.palette_button):
            btn.setStyleSheet(f'background-color:{html_color(self.palette_color[i])};border:0px')

    def set_palette_color(self):
        for i in range(self.K):
            self.palette_button[i].setStyleSheet(f'background-color:{html_color(self.palette_color[i])};border:0px')

    def open_file(self):
        opts = QFileDialog.Options()
        fn, _ = QFileDialog.getOpenFileName(
            self, '이미지 열기', '', 'Images (*.jpg *.png *.webp *.tiff);;All Files (*)', options=opts)
        if not fn:
            return
        self.Source = fn
        pm = self.pixmap_open_img(5).scaledToHeight(512)
        self.image_label.setPixmap(pm)
        self.sample_weight_map = rbf_weights(self.means, self.sample_colors)

    def reset(self):
        pm = self.pixmap_open_img(self.K).scaledToHeight(512)
        self.image_label.setPixmap(pm)

    def save_file(self):
        opts = QFileDialog.Options()
        fn, _ = QFileDialog.getSaveFileName(
            self, '이미지 저장', '', 'PNG (*.png);;JPG (*.jpg);;All Files (*)', options=opts)
        if not fn:
            return
        if '.' not in fn:
            fn += '.png'
        self.img.save(fn)

    def set_number_of_palettes(self, text):
        self.K = int(text)
        for i in range(self.K, 7):
            self.palette_button[i].setStyleSheet('background-color:#EFEFEF;border:0px')
        self.calc_palettes(self.K)

    def UiComponents(self):
        self.main_layout = QVBoxLayout(self)
        self.image_label = QLabel()
        image_layout = QHBoxLayout()
        image_layout.addWidget(self.image_label)

        # Palette buttons
        palette_widget = QWidget()
        palette_layout = QVBoxLayout(palette_widget)
        for i in range(7):
            btn = QPushButton()
            btn.clicked.connect(lambda _, x=i: self.clicked(x))
            self.palette_button.append(btn)
            palette_layout.addWidget(btn)
        self.init_palette_color()
        image_layout.addWidget(palette_widget)
        self.main_layout.addLayout(image_layout)

        # Controls
        ctrl_layout = QHBoxLayout()
        combo = QComboBox()
        for i in range(3,8): combo.addItem(str(i))
        combo.setCurrentText('5')
        combo.activated[str].connect(self.set_number_of_palettes)
        ctrl_layout.addWidget(combo)
        for text, slot in [('Open', self.open_file), ('Reset', self.reset), ('Save', self.save_file)]:
            btn = QPushButton(text)
            btn.clicked.connect(slot)
            ctrl_layout.addWidget(btn)
        self.main_layout.addLayout(ctrl_layout)

        # Auto and Style
        auto_layout = QHBoxLayout()
        for text, slot in [('Auto', self.auto), ('Style Transfer', self.style_transfer)]:
            btn = QPushButton(text)
            btn.clicked.connect(slot)
            auto_layout.addWidget(btn)
        self.main_layout.addLayout(auto_layout)

if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    win = Window()
    sys.exit(app.exec_())