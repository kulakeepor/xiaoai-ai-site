---
title: "Day 31 · 语义分割"
description: "像素级分类：FCN、U-Net、DeepLab 系列。感受野与分辨率的矛盾，空洞卷积，迁移学习"
pubDate: 2026-06-26
section: learn
tags: ["语义分割", "U-Net", "Week5"]
difficulty: intermediate
---

## 🎯 今日目标

理解语义分割的核心挑战（全局上下文 vs 空间分辨率），掌握 FCN 和 U-Net 的设计哲学，会用分割工具做实战。

---

## 1. 语义分割 vs 实例分割 vs 全景分割

```
图像分类：整张图 → 1个类别
目标检测：图片 → [物体框1:类别A, 物体框2:类别B, ...]
语义分割：图片 → [像素1:类别A, 像素2:类别B, 像素3:类别A, ...]  ← 像素级
实例分割：图片 → [物体1的像素:类别A, 物体2的像素:类别A, ...]   ← 区分同类不同个体
全景分割：语义分割 + 实例分割结合
```

**语义分割**要求对图片中每个像素分类，但不区分同类不同个体（两只狗都是"狗"）。

---

## 2. FCN（2014）—— 端到端分割的开山之作

### 2.1 核心问题：全连接层破坏空间信息

分类网络（VGG/ResNet）的最后是 Global Average Pooling 或展平 + 全连接，输出的是特征向量，**没有空间信息**。

FCN 的解决思路：**用卷积替代全连接层**。

```python
# VGG16 的最后 3 层原本是：
# (6): Linear(4096, 4096)
# (7): Linear(4096, 4096)
# (8): Linear(4096, 1000)

# FCN 把它们变成 1×1 卷积：
self.classifier = nn.Sequential(
    nn.Conv2d(4096, 4096, 1),
    nn.ReLU(inplace=True),
    nn.Dropout2d(0.5),
    nn.Conv2d(4096, num_classes, 1)  # num_classes 是分割的类别数
)
# 输出：[batch, num_classes, H, W] —— 空间信息保留！
```

### 2.2 上采样：还原空间分辨率

CNN 过程中特征图一直在缩小（stride=2 的卷积/池化让 H×W 越来越小），需要**上采样**还原到原图尺寸。

```python
# 三种上采样方式：
# 1. 双线性插值（固定权重，不可学习）
F.interpolate(output, size=input_size, mode='bilinear', align_corners=False)

# 2. 转置卷积（Transposed Conv，可学习）
nn.ConvTranspose2d(in_channels, out_channels, kernel_size=2, stride=2)

# 3. 亚像素卷积（PixelShuffle）
nn.PixelShuffle(upscale_factor=2)
```

### 2.3 FCN-8s：跳级连接融合多尺度

低层特征有更多细节（边缘、纹理），高层特征有更强语义。

```python
# FCN-8s：从 3 个不同尺度融合
score_fr = conv7_upsampled    # 32× 上采样（粗粒度）
score_pool4 = pool4_conv      # 16× 上采样（中粒度）
score_pool3 = pool3_conv      # 8× 上采样（细粒度）

# 融合：粗粒度 + 细粒度
score = score_fr + score_pool4 + score_pool3
upsample_pred = F.interpolate(score, size=原图尺寸, mode='bilinear')
```

---

## 3. U-Net（2015）—— 医学图像分割经典

### 3.1 核心架构：对称 Encoder-Decoder

```
Encoder（下采样）                    Decoder（上采样）
                                          ↑ skip connections
[64] → [128] → [256] → [512]           [512] → [256] → [128] → [64]
   conv     conv     conv     conv   convT    conv    conv    convT
   pool     pool     pool     pool         concat   concat   concat
```

**U-Net 关键设计**：
- **对称结构**：左边编码器（提取特征），右边解码器（恢复空间分辨率）
- **Skip Connections**：每层解码器与对应编码器 concat，弥补下采样丢失的空间细节
- **大量数据增强**：U-Net 原始论文用弹性形变等增强，在少量数据上也能训练

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class UNet(nn.Module):
    def __init__(self, in_channels=3, out_channels=1):
        super().__init__()
        
        # Encoder（下采样路径）
        self.enc1 = self._make_layer(in_channels, 64)
        self.enc2 = self._make_layer(64, 128)
        self.enc3 = self._make_layer(128, 256)
        self.enc4 = self._make_layer(256, 512)
        
        # Bottleneck
        self.bottleneck = self._make_layer(512, 1024)
        
        # Decoder（上采样路径）
        self.up4 = nn.ConvTranspose2d(1024, 512, 2, stride=2)
        self.dec4 = self._make_layer(1024, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.dec3 = self._make_layer(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.dec2 = self._make_layer(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.dec1 = self._make_layer(128, 64)
        
        # 输出层
        self.out = nn.Conv2d(64, out_channels, 1)
        self.pool = nn.MaxPool2d(2)
    
    def _make_layer(self, in_ch, out_ch):
        return nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
        )
    
    def forward(self, x):
        # Encoder
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        e4 = self.enc4(self.pool(e3))
        
        # Bottleneck
        b = self.bottleneck(self.pool(e4))
        
        # Decoder（带 skip connections）
        d4 = self.dec4(torch.cat([self.up4(b), e4], dim=1))
        d3 = self.dec3(torch.cat([self.up3(d4), e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        
        return self.out(d1)
```

### 3.2 U-Net 在 PyTorch 中的实际使用

```python
# 使用 segmentations_models_pytorch 库（支持 U-Net + 多种 backbone）
# pip install segmentations-models-pytorch

import segmentation_models_pytorch as smp

model = smp.Unet(
    encoder_name='resnet34',       # 用 ResNet34 做 backbone
    encoder_weights='imagenet',    # ImageNet 预训练权重
    in_channels=3,
    classes=1,                     # 二分割（细胞/背景）
    # classes=21                   # 多分割（Cityscapes 21类）
)
```

---

## 4. DeepLab 系列——空洞卷积与 ASPP

### 4.1 空洞卷积（Dilated / Atrous Convolution）

问题：下采样可以增大感受野，但会丢失空间细节。

解决：**空洞卷积**在卷积核内部插入"空洞"，增大感受野但不丢失分辨率。

```python
# 普通 3×3 卷积：覆盖 3×3 区域
# 空洞率=2 的 3×3 卷积：覆盖 7×7 区域（但仍只有 9 个参数）

nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=2, dilation=2)
#                    spacing ↑            ↑ 空洞率
# 实际覆盖: 1 + 2*2 = 5 → 实际感受野是 5×5
```

### 4.2 ASPP 模块（Atrous Spatial Pyramid Pooling）

用多个不同空洞率的卷积并行处理，捕获多尺度信息：

```python
# DeepLabV3+ 的 ASPP 模块
class ASPP(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.atrous1 = nn.Conv2d(in_channels, out_channels, 1)
        self.atrous6 = nn.Conv2d(in_channels, out_channels, 3, padding=6, dilation=6)
        self.atrous12 = nn.Conv2d(in_channels, out_channels, 3, padding=12, dilation=12)
        self.atrous18 = nn.Conv2d(in_channels, out_channels, 3, padding=18, dilation=18)
        self.global_pool = nn.AdaptiveAvgPool2d(1)
    
    def forward(self, x):
        return torch.cat([
            self.atrous1(x),
            self.atrous6(x),
            self.atrous12(x),
            self.atrous18(x),
            self.global_pool(x).expand_as(x)  # 全局上下文
        ], dim=1)
```

---

## 5. 分割实战：Cityscapes 街景分割

```python
import segmentation_models_pytorch as smp
import torch

# 加载 DeepLabV3+，用 MobileNet backbone（轻量）
model = smp.DeepLabV3Plus(
    encoder_name='mobilenet_v2',
    encoder_weights='imagenet',
    in_channels=3,
    classes=19,  # Cityscapes 19 类
)

# 推理
model.eval()
dummy_input = torch.randn(1, 3, 512, 1024)  # Cityscapes 比例

with torch.no_grad():
    output = model(dummy_input)  # [1, 19, 512, 1024]
    pred_mask = output.argmax(dim=1)  # [1, 512, 1024] 每个像素的类别

print(f"输出尺寸: {output.shape}")  # torch.Size([1, 19, 512, 1024])
print(f"预测类别范围: {pred_mask.min()} ~ {pred_mask.max()}")
```

---

## 🧪 练习题

**Q1.** U-Net 的 Skip Connections 的主要作用是？

A.加速模型收敛  
B.在下采样过程中补充空间细节信息  
C.减少模型参数量  
D.防止过拟合  

---

**Q2.** 空洞卷积（Dilated Convolution）的核心优势是？

A.减少参数量  
B.在不降低分辨率的情况下增大感受野  
C.加速训练  
D.提高分类精度  

---

**Q3.** FCN 用 1×1 卷积替代全连接层后，输出变成什么形式？

A.[batch, num_classes]（和全连接一样）  
B.[batch, num_classes, H, W]（保留空间分辨率）  
C.[batch, H*W, num_classes]  
D.[batch, 1, 1, num_classes]  

---

## 📝 今日小结

| 模型 | 核心思想 | 适合场景 |
|------|---------|---------|
| FCN | 全卷积化 + 上采样 | 基准网络 |
| U-Net | 对称Encoder-Decoder + skip | 医学/小数据集 |
| DeepLabV3+ | 空洞卷积 + ASPP + 解码器 | 语义分割标杆 |

---

## 🎯 今日任务

1. 用 `segmentations_models_pytorch` 加载一个 U-Net 模型，打印结构
2. 了解 Dice Loss 和 IoU Loss（分割任务的常用损失函数）
3. 思考：分割任务为什么比检测任务更难？和分类相比呢？
4. 回复「**Day 31 完成**」打卡 ✅
