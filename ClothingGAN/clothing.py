# -*- coding: utf-8 -*-
"""
CPU 환경에서 실행 가능한 ClothingGAN 코드 (VSCode용)
필요한 의존성: ninja, gradio, fbpca, boto3, requests==2.23.0, urllib3==1.25.11, nltk, imageio, scikit-image 등
(필요 시 pip install 명령어를 터미널에서 실행하세요.)
"""

import os
import torch
import numpy as np
from PIL import Image
import imageio
from skimage import img_as_ubyte
import gradio as gr

# 모델 관련 모듈 (models, decomposition, config 등)
from models import get_instrumented_model
from decomposition import get_or_compute
from config import Config

# CPU 환경에서 실행하도록 설정
device = torch.device('cpu')
torch.autograd.set_grad_enabled(False)
torch.backends.cudnn.benchmark = False

# 모델 설정 및 로드
selected_model = 'lookbook'
config = Config(
    model='StyleGAN2',
    layer='style',
    output_class=selected_model,
    components=80,
    use_w=True,
    batch_size=5_000,
)
inst = get_instrumented_model(config.model, config.output_class, config.layer, device, use_w=config.use_w)
path_to_components = get_or_compute(config, inst)
model = inst.model

# latent component 로드
comps = np.load(path_to_components)
lst = comps.files
latent_dirs = []
latent_stdevs = []
load_activations = False

for item in lst:
    if load_activations:
        if item == 'act_comp':
            for i in range(comps[item].shape[0]):
                latent_dirs.append(comps[item][i])
        if item == 'act_stdev':
            for i in range(comps[item].shape[0]):
                latent_stdevs.append(comps[item][i])
    else:
        if item == 'lat_comp':
            for i in range(comps[item].shape[0]):
                latent_dirs.append(comps[item][i])
        if item == 'lat_stdev':
            for i in range(comps[item].shape[0]):
                latent_stdevs.append(comps[item][i])

# 진행률 표시 함수 (ipywidgets 사용)
from ipywidgets import IntProgress, HTML, VBox
from IPython.display import display

def log_progress(sequence, every=1, size=None, name='Items'):
    is_iterator = False
    if size is None:
        try:
            size = len(sequence)
        except TypeError:
            is_iterator = True
        if size is not None:
            if every is None:
                every = 1 if size <= 200 else int(size / 200)
        else:
            assert every is not None, 'sequence is iterator, set every'
    if is_iterator:
        progress = IntProgress(min=0, max=1, value=1)
        progress.bar_style = 'info'
    else:
        progress = IntProgress(min=0, max=size, value=0)
        label = HTML()
        box = VBox(children=[label, progress])
        display(box)

    index = 0
    try:
        for index, record in enumerate(sequence, 1):
            if index == 1 or index % every == 0:
                if is_iterator:
                    label.value = f'{name}: {index} / ?'
                else:
                    progress.value = index
                    label.value = f'{name}: {index} / {size}'
            yield record
    except Exception as e:
        progress.bar_style = 'danger'
        raise e
    else:
        progress.bar_style = 'success'
        progress.value = index
        label.value = f"{name}: {index}"

# 방향 관련 함수들
def name_direction(sender):
    if not text.value:
        print('Please name the direction before saving')
        return
    if num in named_directions.values():
        target_key = list(named_directions.keys())[list(named_directions.values()).index(num)]
        print(f'Direction already named: {target_key}')
        print('Overwriting...')
        del(named_directions[target_key])
    named_directions[text.value] = [num, start_layer.value, end_layer.value]
    save_direction(random_dir, text.value)
    for item in named_directions:
        print(item, named_directions[item])

def save_direction(direction, filename):
    filename += ".npy"
    np.save(filename, direction, allow_pickle=True, fix_imports=True)
    print(f'Latent direction saved as {filename}')

def mix_w(w1, w2, content, style):
    for i in range(0, 5):
        w2[i] = w1[i] * (1 - content) + w2[i] * content
    for i in range(5, 16):
        w2[i] = w1[i] * (1 - style) + w2[i] * style
    return w2

def display_sample_pytorch(seed, truncation, directions, distances, scale, start, end, w=None, disp=True, save=None, noise_spec=None):
    model.truncation = truncation
    if w is None:
        w = model.sample_latent(1, seed=seed).detach().cpu().numpy()
        w = [w] * model.get_max_latents()
    else:
        w = [np.expand_dims(x, 0) for x in w]

    for l in range(start, end):
        for i in range(len(directions)):
            w[l] = w[l] + directions[i] * distances[i] * scale
    # CPU에서는 torch.cuda.empty_cache() 불필요
    out = model.sample_np(w)
    final_im = Image.fromarray((out * 255).astype(np.uint8)).resize((500, 500), Image.LANCZOS)
    if save is not None:
        print(f"Saving image as out/{seed}_{save:05}.png")
        final_im.save(f'out/{seed}_{save:05}.png')
    if disp:
        final_im.show()
    return final_im

def generate_mov(seed, truncation, direction_vec, scale, layers, n_frames, out_name='out', noise_spec=None, loop=True):
    if not os.path.exists('out'):
        os.makedirs('out')
    movieName = f'out/{out_name}.mp4'
    offset = -10
    step = 20 / n_frames
    imgs = []
    for i in log_progress(range(n_frames), name="Generating frames"):
        print(f'\r{i} / {n_frames}', end='')
        w = model.sample_latent(1, seed=seed).cpu().numpy()
        model.truncation = truncation
        w = [w] * model.get_max_latents()
        for l in layers:
            if l < model.get_max_latents():
                w[l] = w[l] + direction_vec * offset * scale
        out = model.sample_np(w)
        imgs.append(out)
        offset += step
    if loop:
        imgs += imgs[::-1]
    with imageio.get_writer(movieName, mode='I') as writer:
        for image in log_progress(list(imgs), name="Creating animation"):
            writer.append_data(img_as_ubyte(image))

def generate_image(seed1, seed2, content, style, truncation, c0, c1, c2, c3, c4, c5, c6, start_layer, end_layer):
    seed1 = int(seed1)
    seed2 = int(seed2)
    scale = 1
    params = {
        'c0': c0,
        'c1': c1,
        'c2': c2,
        'c3': c3,
        'c4': c4,
        'c5': c5,
        'c6': c6
    }
    param_indexes = {
        'c0': 0,
        'c1': 1,
        'c2': 2,
        'c3': 3,
        'c4': 4,
        'c5': 5,
        'c6': 6
    }
    directions = []
    distances = []
    for k, v in params.items():
        directions.append(latent_dirs[param_indexes[k]])
        distances.append(v)
    w1 = model.sample_latent(1, seed=seed1).detach().cpu().numpy()
    w1 = [w1] * model.get_max_latents()
    im1 = model.sample_np(w1)
    w2 = model.sample_latent(1, seed=seed2).detach().cpu().numpy()
    w2 = [w2] * model.get_max_latents()
    im2 = model.sample_np(w2)
    combined_im = np.concatenate([im1, im2], axis=1)
    input_im = Image.fromarray((combined_im * 255).astype(np.uint8))
    mixed_w = mix_w(w1, w2, content, style)
    generated_im = display_sample_pytorch(seed1, truncation, directions, distances, scale, int(start_layer), int(end_layer), w=mixed_w, disp=False)
    return input_im, generated_im

# Gradio UI 구성
slider_max_val = 20
slider_min_val = -20

truncation_slider = gr.Slider(minimum=0, maximum=1, value=0.5, label="Truncation")
start_layer_input = gr.Number(value=0, label="Start Layer")
end_layer_input = gr.Number(value=14, label="End Layer")
seed1_input = gr.Number(value=0, label="Seed 1")
seed2_input = gr.Number(value=0, label="Seed 2")
content_slider = gr.Slider(label="Structure", minimum=0, maximum=1, value=0.5)
style_slider = gr.Slider(label="Style", minimum=0, maximum=1, value=0.5)
c0_slider = gr.Slider(label="Sleeve & Size", minimum=slider_min_val, maximum=slider_max_val, value=0)
c1_slider = gr.Slider(label="Dress - Jacket", minimum=slider_min_val, maximum=slider_max_val, value=0)
c2_slider = gr.Slider(label="Female Coat", minimum=slider_min_val, maximum=slider_max_val, value=0)
c3_slider = gr.Slider(label="Coat", minimum=slider_min_val, maximum=slider_max_val, value=0)
c4_slider = gr.Slider(label="Graphics", minimum=slider_min_val, maximum=slider_max_val, value=0)
c5_slider = gr.Slider(label="Dark", minimum=slider_min_val, maximum=slider_max_val, value=0)
c6_slider = gr.Slider(label="Less Cleavage", minimum=slider_min_val, maximum=slider_max_val, value=0)

inputs = [
    seed1_input, seed2_input, content_slider, style_slider, truncation_slider,
    c0_slider, c1_slider, c2_slider, c3_slider, c4_slider, c5_slider, c6_slider,
    start_layer_input, end_layer_input
]

# Gradio 인터페이스 실행 (웹 브라우저에서 실행됨)
gr.Interface(generate_image, inputs, ["image", "image"], live=True, title="ClothingGAN").launch()
