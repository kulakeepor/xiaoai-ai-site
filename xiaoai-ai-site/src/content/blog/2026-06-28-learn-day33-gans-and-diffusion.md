---
title: "Day 33 · GAN 与 Diffusion"
description: "生成对抗网络原理：Generator vs Discriminator，DCGAN 实战，Diffusion 模型直观理解"
pubDate: 2026-06-28
section: learn
tags: ["生成模型", "GAN", "Diffusion", "Week5"]
difficulty: advanced
---

## 🎯 今日目标

理解 GAN 的对抗训练思想，掌握 DCGAN 的实现细节，了解 Diffusion 模型的核心原理和为什么它最近这么火。

---

## 1. 什么是生成模型？

之前的模型都是**判别模型**（给输入，预测标签）。生成模型相反：

```
判别模型：P(y|x) —— 给输入 x，预测类别 y
生成模型：P(x)  —— 学习数据分布，能生成新的、从未见过的样本
```

生成模型的应用：
- 图像生成（人脸、风景、艺术风格迁移）
- 数据增强（生成更多训练数据）
- 图像超分辨率
- 文本→图片（Midjourney、DALL-E）
- 视频生成

---

## 2. GAN 原理——对抗训练

### 2.1 核心思想

GAN 包含两个网络：

- **Generator（生成器）**：输入随机噪声 z，输出假图片 G(z)
- **Discriminator（判别器）**：输入图片，输出一个概率（真/假）

**对抗**：G 努力生成骗过 D 的图片，D 努力不被 G 骗。

```
随机噪声 z ──→ [Generator] ──→ 假图片 G(z)
                                    ↓
真图片 x ──→ [Discriminator] ──→ 概率 D(x) ∈ [0,1]
                  ↑
                  │
           训练目标不同：
           G 想让 D(G(z)) → 1（让假图片被判别为真）
           D 想让 D(x) → 1（真图片）且 D(G(z)) → 0（假图片）
```

### 2.2 损失函数

GAN 的损失函数是一个**最小最大博弈**：

```
min_G max_D  V(D, G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]
```

解释：
- D 的目标：最大化 V → D(x) 接近 1（真图），D(G(z)) 接近 0（假图）
- G 的目标：最小化 V → 让 D(G(z)) 接近 1（让判别器认为假图是真的）

```python
# PyTorch 实现
criterion = nn.BCELoss()

# 真图片标签 = 1，假图片标签 = 0
real_labels = torch.ones(batch_size, 1)
fake_labels = torch.zeros(batch_size, 1)

# 训练判别器：让真图判为1，假图判为0
d_real = discriminator(real_images)
d_fake = discriminator(generator(fake_images))
d_loss = criterion(d_real, real_labels) + criterion(d_fake, fake_labels)
d_loss.backward()

# 训练生成器：让假图被判为1（骗过判别器）
d_fake = discriminator(generator(fake_images))
g_loss = criterion(d_fake, real_labels)  # 目标是 1，不是 0！
g_loss.backward()
```

### 2.3 GAN 的训练技巧（DCGAN 经验）

原始 GAN 很难训练，经常遇到模式崩溃（mode collapse）。DCGAN 提出了几个关键经验：

```python
# DCGAN 经验：
# 1. 用 BatchNorm（除生成器输出和判别器输入层）
# 2. LeakyReLU 替代 ReLU（判别器）
# 3. 避免使用 Pooling，用 stride=2 的转置卷积/卷积
# 4. 移除全连接层
# 5. 用 Adam 优化器，lr=0.0002，beta1=0.5
```

---

## 3. DCGAN 实战

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt

# 超参数
LATENT_DIM = 100
IMG_SIZE = 64
BATCH_SIZE = 64
EPOCHS = 5
LR = 0.0002
BETA1 = 0.5

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 数据集
transform = transforms.Compose([
    transforms.Resize(IMG_SIZE),
    transforms.CenterCrop(IMG_SIZE),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)  # [-1, 1] 范围
])
dataset = datasets.CIFAR10('./data', download=True, transform=transform)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# 生成器：噪声 z → 图片
class Generator(nn.Module):
    def __init__(self, latent_dim=100, ngf=64):
        super().__init__()
        self.net = nn.Sequential(
            # 输入: latent_dim × 1 × 1
            nn.ConvTranspose2d(latent_dim, ngf*8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf*8), nn.ReLU(True),
            # 4×4
            nn.ConvTranspose2d(ngf*8, ngf*4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*4), nn.ReLU(True),
            # 8×8
            nn.ConvTranspose2d(ngf*4, ngf*2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf*2), nn.ReLU(True),
            # 16×16
            nn.ConvTranspose2d(ngf*2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf), nn.ReLU(True),
            # 32×32
            nn.ConvTranspose2d(ngf, 3, 4, 2, 1, bias=False),
            nn.Tanh()  # 输出 [-1, 1]
            # 64×64
        )
    
    def forward(self, z):
        return self.net(z.view(-1, LATENT_DIM, 1, 1))

# 判别器：图片 → 真/假
class Discriminator(nn.Module):
    def __init__(self, ndf=64):
        super().__init__()
        self.net = nn.Sequential(
            # 输入: 3 × 64 × 64
            nn.Conv2d(3, ndf, 4, 2, 1, bias=False), nn.LeakyReLU(0.2, True),
            # 32×32
            nn.Conv2d(ndf, ndf*2, 4, 2, 1, bias=False), nn.BatchNorm2d(ndf*2), nn.LeakyReLU(0.2, True),
            # 16×16
            nn.Conv2d(ndf*2, ndf*4, 4, 2, 1, bias=False), nn.BatchNorm2d(ndf*4), nn.LeakyReLU(0.2, True),
            # 8×8
            nn.Conv2d(ndf*4, ndf*8, 4, 2, 1, bias=False), nn.BatchNorm2d(ndf*8), nn.LeakyReLU(0.2, True),
            # 4×4
            nn.Conv2d(ndf*8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()  # 输出 [0, 1]
        )
    
    def forward(self, img):
        return self.net(img).view(-1, 1).squeeze(1)

G = Generator(LATENT_DIM).to(device)
D = Discriminator().to(device)

opt_G = optim.Adam(G.parameters(), lr=LR, betas=(BETA1, 0.999))
opt_D = optim.Adam(D.parameters(), lr=LR, betas=(BETA1, 0.999))

# 训练循环
fixed_noise = torch.randn(64, LATENT_DIM, device=device)

for epoch in range(EPOCHS):
    for batch_idx, (real_images, _) in enumerate(dataloader):
        real_images = real_images.to(device)
        batch_size = real_images.size(0)
        
        # 训练判别器
        D.zero_grad()
        noise = torch.randn(batch_size, LATENT_DIM, device=device)
        fake_images = G(noise)
        
        d_loss = (F.binary_cross_entropy(D(real_images), torch.ones_like(D(real_images))) +
                  F.binary_cross_entropy(D(fake_images.detach()), torch.zeros_like(D(fake_images))))
        d_loss.backward()
        opt_D.step()
        
        # 训练生成器
        G.zero_grad()
        noise = torch.randn(batch_size, LATENT_DIM, device=device)
        fake_images = G(noise)
        g_loss = F.binary_cross_entropy(D(fake_images), torch.ones_like(D(fake_images)))
        g_loss.backward()
        opt_G.step()
        
        if batch_idx % 100 == 0:
            print(f"Epoch [{epoch+1}/{EPOCHS}] Batch [{batch_idx}] "
                  f"D_loss: {d_loss.item():.4f} G_loss: {g_loss.item():.4f}")

# 可视化固定噪声生成的图片
with torch.no_grad():
    fake = G(fixed_noise).cpu()
    grid = torch.zeros(8, 3, IMG_SIZE, 8*IMG_SIZE)
    for i in range(64):
        grid[:, :, (i%8)*IMG_SIZE:(i%8+1)*IMG_SIZE, i//8*IMG_SIZE:(i//8+1)*IMG_SIZE] = fake[i]
    plt.imshow(grid.permute(2, 3, 0, 1).reshape(IMG_SIZE*8, IMG_SIZE*8, 3) * 0.5 + 0.5)
    plt.savefig('dcgan_samples.png')
```

---

## 4. Diffusion 模型——DALL-E 2 / Stable Diffusion 的核心技术

### 4.1 直观理解：教 AI"逆向噪声"

Diffusion 的核心思想非常优雅：**先往图片里一步步加噪声直到变成纯噪声，再学一个逆向过程从噪声还原图片**。

```
去噪过程（逆向）：纯噪声 ──→ 稍清晰的图 ──→ 更清晰 ──→ ... ──→ 真实图片
加噪过程（正向）：真实图片 ──→ 稍噪声 ──→ 更噪声 ──→ ... ──→ 纯噪声（已知！）
```

**为什么叫 Diffusion？** 这个过程类似于物理中的扩散（从有序到无序）。

### 4.2 训练目标

正向过程是**已知的**（固定 schedule 加噪声）。模型只需要学习**逆向过程**。

```python
# 简化的 Diffusion 训练步骤
for real_image in dataloader:
    # 随机选时间步 t
    t = torch.randint(0, T, (batch_size,))
    
    # 随机生成噪声
    noise = torch.randn_like(real_image)
    
    # 在 t 步给图片加噪声（公式：x_t = sqrt(ᾱ_t) * x_0 + sqrt(1-ᾱ_t) * noise）
    noisy_image = add_noise(real_image, t, noise)
    
    # 模型预测噪声（而不是直接预测原图）
    predicted_noise = model(noisy_image, t)
    
    # 损失：预测噪声 vs 真实噪声
    loss = MSE(predicted_noise, noise)
    loss.backward()
```

### 4.3 推理：逐步去噪

```python
# 推理：从纯噪声开始，逐步去噪
x = torch.randn(1, 3, 256, 256).to(device)  # 纯噪声

for t in reversed(range(T)):  # T 步，从 T 到 0
    x = denoise(x, t)  # 模型预测噪声，然后减掉

# 最终的 x 就是生成的图片
```

### 4.4 为什么 Diffusion 这么火？

| | GAN | Diffusion |
|---|---|---|
| 生成质量 | 好但有时模式崩溃 | 极高，细节丰富 |
| 训练稳定性 | 不稳定（需要技巧） | 稳定（损失函数简单） |
| 多模态 | 难支持 | 自然（CLIP 文本条件） |
| 典型应用 | 单图生成 | DALL-E 2, Stable Diffusion, Imagen |

---

## 🧪 练习题

**Q1.** GAN 训练中，判别器和生成器的目标分别是？

A.两者都最大化自己的输出  
B.D 最大化分类准确率，G 最小化 D 的准确率  
C.D 最小化分类误差，G 最大化 D 的准确率  
D.两者目标完全相同  

---

**Q2.** DCGAN 的核心技巧中，判别器激活函数通常用？

A.ReLU  
B.LeakyReLU（防止神经元"死亡"）  
C.Sigmoid  
D.Tanh  

---

**Q3.** Diffusion 模型与 GAN 的核心区别是？

A.GAN 用对抗训练，Diffusion 用逐步加噪/去噪的重建方式  
B.GAN 不需要判别器  
C.Diffusion 训练更不稳定  
D.GAN 只能生成图像，不能生成其他模态  

---

## 📝 今日小结

| 模型 | 核心机制 | 优缺点 |
|------|---------|--------|
| GAN | 对抗训练（Generator vs Discriminator） | 训练难，但推理快 |
| Diffusion | 逐步加噪→去噪 | 训练稳，质量高，但推理慢（多步） |
| VAE | 变分自编码器 | 训练稳定，但生成质量不如前两者 |

---

## 🎯 今日任务

1. 运行 DCGAN 代码（需要 GPU 或足够时间），观察生成的 CIFAR-10 图片
2. 理解"对抗训练"：为什么 Generator 的 loss 是让 D(G(z)) 接近 1？
3. 了解 Stable Diffusion 的工作流程（文本编码 → CLIP → UNet → VAE 解码）
4. 回复「**Day 33 完成**」打卡 ✅
