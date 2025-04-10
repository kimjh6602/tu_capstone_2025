import os
import torch
import numpy as np
from PIL import Image
from models import get_instrumented_model
from config import Config

# 출력 디렉토리 생성
output_dir = 'data/lookbook_inversion/images'
os.makedirs(output_dir, exist_ok=True)

# 디바이스 설정
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 모델 로드
config = Config(
    model='StyleGAN2',
    layer='style',
    output_class='lookbook',
    components=80,
    use_w=True,
    batch_size=1,
)
inst = get_instrumented_model(config.model, config.output_class, config.layer, device, use_w=config.use_w)
model = inst.model

# 이미지 생성 함수
def generate_image(seed, truncation=0.7, size=256):
    torch.manual_seed(seed)
    z = model.sample_latent(1, seed=seed)
    w = [z] * model.get_max_latents()
    model.truncation = truncation
    img_array = model.sample_np(w)
    img = Image.fromarray((img_array * 255).astype(np.uint8)).resize((size, size))
    return img

# 여러 개 생성
n_images = 1000
for seed in range(n_images):
    img = generate_image(seed)
    img.save(os.path.join(output_dir, f"lookbook_{seed:04d}.jpg"))
    print(f"[{seed}] 저장 완료")

print(f"✅ 총 {n_images}장 생성 완료! → {output_dir}")
