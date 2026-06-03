---
title: "Day 29 · 现代 CNN 架构"
description: "深度卷积网络演进史：从 LeNet 到 EfficientNet，ResNet 为什么有效，模型 zoo 怎么用"
pubDate: 2026-06-24
section: learn
tags: ["CNN", "架构", "Week5"]
difficulty: intermediate
---

## 🎯 今日目标

理解现代 CNN 架构的演进逻辑：残差连接、通道注意力、复合缩放。学会使用 model zoo 加载预训练模型。

---

## 1. 从 LeNet 到 ResNet：架构演进史

```
LeNet(1998) → AlexNet(2012) → VGG(2014) → GoogLeNet(2015) → ResNet(2015) → ... → EfficientNet(2019)
```

### 1.1 AlexNet（2012）—— 深度学习复兴

ImageNet 竞赛冠军，top-5 错误率从 40% 降到 15%。关键创新：
- ReLU 激活（比 Sigmoid/Tanh 快很多）
- Dropout 正则化
- GPU 并行训练（2 张卡）

```python
# PyTorch 内置 AlexNet
import torchvision.models as models

alexnet = models.alexnet(weights='DEFAULT')  # 加载预训练权重
print(alexnet)
# 输出：AlexNet(
#   (features): Sequential(...)
#   (avgpool): AdaptiveAvgPool2d(...)
#   (classifier): Sequential(
#     (0): Dropout(p=0.5)
#     (1): Linear(9216, 4096)
#     (2): ReLU(inplace=True)
#     ...
#     (6): Linear(4096, 1000)  # ImageNet 1000 类
#   )
# )
```

### 1.2 VGG（2014）—— 小卷积核的胜利

用 3×3 小卷积核堆叠替代大卷积核：
- 2 个 3×3 = 5×5 感受野，但参数更少（13+13 vs 25）
- 3 个 3×3 = 7×7 感受野
- 结构简洁，容易加深

```python
# VGG16 / VGG19
vgg16 = models.vgg16(weights='DEFAULT')
vgg19 = models.vgg19(weights='DEFAULT')
print(f"VGG16 参数: {sum(p.numel() for p in vgg16.parameters()) / 1e6:.1f}M")
# VGG16 参数: 138.0M（非常大！）
```

### 1.3 ResNet（2015）—— 残差连接革命

核心问题：**网络加深后为什么会退化？**

假设最优解是恒等映射（输入=输出），普通网络需要学习一个复杂函数才能做到。而 ResNet 直接让 `F(x) + x = x`，只需让 `F(x) = 0`。

这就是**残差连接（Skip Connection）**：

```python
# 残差块的核心
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_channels)
        
        # 残差连接：如果输入输出通道不同，需要投影
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_channels, out_channels, 1, stride, bias=False),
                nn.BatchNorm2d(out_channels)
            )
    
    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)  # 残差相加！
        out = F.relu(out)
        return out
```

ResNet 在 ImageNet 上 top-5 错误率降到 **3.57%**，超越了人类水平（~5%）。

---

## 2. 常见现代架构速览

### 2.1 ResNet 变体

```python
from torchvision.models import resnet18, resnet34, resnet50, resnet101, resnet152

# 18/34：BasicBlock（两个 3×3 卷积）
# 50/101/152： BottleneckBlock（1×1→3×3→1×1，减少参数）

resnet = resnet50(weights='DEFAULT')
print(f"ResNet50 参数: {sum(p.numel() for p in resnet.parameters()) / 1e6:.1f}M")
# ResNet50 参数: 25.6M
```

### 2.2 DenseNet——密集连接

每一层都与后面所有层连接，特征复用：

```python
from torchvision.models import densenet121

densenet = densenet121(weights='DEFAULT')
# DenseNet121: 8M 参数（比 ResNet50 少很多）
```

### 2.3 MobileNet——轻量化

专为移动/边缘设备设计，使用深度可分离卷积：

```python
from torchvision.models import mobilenet_v2, mobilenet_v3_small, mobilenet_v3_large

mobile = mobilenet_v3_small(weights='DEFAULT')
print(f"MobileNetV3_Small 参数: {sum(p.numel() for p in mobile.parameters()) / 1e6:.2f}M")
# MobileNetV3_Small 参数: 2.54M（非常轻量！）
```

### 2.4 EfficientNet——复合缩放

EfficientNet 的核心洞察：深度、宽度、分辨率应该**按比例**同时缩放。

```python
from torchvision.models import efficientnet_b0, efficientnet_b1, efficientnet_b7

effnet = efficientnet_b0(weights='DEFAULT')
print(f"EfficientNet-B0 参数: {sum(p.numel() for p in effnet.parameters()) / 1e6:.2f}M")
# EfficientNet-B0 参数: 5.3M（比 ResNet50 少很多，但精度相当）
```

---

## 3. Model Zoo 实战：加载预训练模型

### 3.1 torchvision.models

```python
import torchvision.models as models

# 方式一：weights 参数（推荐，PyTorch 1.10+）
model = models.resnet50(weights='DEFAULT')  # 加载预训练
model = models.resnet50(weights=None)        # 不加载（随机初始化）

# 方式二：AUTO 自动（最新写法）
from torchvision.models import resnet50, ResNet50_Weights
model = resnet50(weights=ResNet50_Weights.DEFAULT)

# 列出所有可用权重
print(ResNet50_Weights.meta)
# {'format': 'pt', 'task': 'image_classification', ...}
```

### 3.2 替换分类头（迁移学习）

```python
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights

# 加载预训练 ResNet50，替换分类头用于自己的数据集
model = resnet50(weights=ResNet50_Weights.DEFAULT)
num_features = model.fc.in_features        # 2048
model.fc = nn.Linear(num_features, 10)     # 替换为 10 类分类器

# 冻结 backbone（只训练新分类头）
for param in model.parameters():
    param.requires_grad = False
model.fc.weight.requires_grad = True
model.fc.bias.requires_grad = True

# 现在只有新分类头的参数会更新
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
```

### 3.3 提取特征（Feature Extraction）

```python
from torchvision.models import resnet50, ResNet50_Weights
import torch

model = resnet50(weights=ResNet50_Weights.DEFAULT)
model = nn.Sequential(*list(model.children())[:-1])  # 去掉最后 FC 层
model.eval()

# 提取单张图片的特征向量（2048维）
from torchvision import transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

from PIL import Image
img = Image.open('photo.jpg')
input_tensor = preprocess(img).unsqueeze(0)

with torch.no_grad():
    features = model(input_tensor)
    print(features.shape)  # torch.Size([1, 2048, 1, 1])
    features = features.squeeze()  # torch.Size([2048])
```

---

## 4. torchvision.ops 常用模块

```python
import torchvision.ops as ops

# NMS（非极大值抑制）：去除重复检测框
boxes = torch.tensor([[10, 10, 50, 50], [12, 12, 52, 52], [80, 80, 120, 120]], dtype=torch.float32)
scores = torch.tensor([0.9, 0.85, 0.8])
keep = ops.nms(boxes, scores, iou_threshold=0.5)
print(keep)  # 保留最高分框，去除重叠框

# RoI Pooling（用于目标检测）
roi_pooled = ops.roi_pool(img, rois, output_size=7)

# Feature Pyramid Network (FPN) 多尺度特征
```

---

## 5. 模型比较总结

| 模型 | 年份 | Top-1 准确率 | 参数量 | 适合场景 |
|------|------|-------------|--------|----------|
| ResNet50 | 2015 | 76.1% | 25.6M | 通用，基准首选 |
| ResNet101 | 2015 | 77.1% | 42.5M | 需要更高精度 |
| DenseNet121 | 2017 | 74.4% | 8.0M | 参数效率高 |
| MobileNetV3-S | 2019 | 67.7% | 2.5M | 移动/边缘端 |
| EfficientNet-B0 | 2019 | 77.1% | 5.3M | 精度+效率平衡 |
| EfficientNet-B7 | 2019 | 84.4% | 66M | 最高精度 |

---

## 🧪 练习题

**Q1.** ResNet 的残差连接解决了什么问题？

A.梯度消失/爆炸  
B.网络退化（越深精度越差）  
C.过拟合  
D.收敛速度慢  

---

**Q2.** 用 `model.children()` 和 `list()` 提取 ResNet 特征时，以下哪个是正确的？

A. `list(model.children())[:-1]` → 去掉最后一个 FC 层  
B. `list(model.children())[:-1]` → 去掉第一个卷积层  
C. `list(model.children())[1:]` → 去掉最后一个 FC 层  

---

**Q3.** MobileNet 的核心创新是使用了什么？

A.残差连接  
B.深度可分离卷积（Depthwise Separable Conv）  
C.注意力机制  
D.复合缩放  

---

## 📝 今日小结

| 概念 | 关键词 |
|------|--------|
| 残差连接 | `out += shortcut(x)`，让网络更容易学习恒等映射 |
| 预训练模型 | `weights='DEFAULT'` 一行加载 ImageNet 1000 类 |
| 特征提取 | 去掉 FC 层，用前面的特征做自己任务 |
| 轻量化 | MobileNet（2.5M）、EfficientNet（5.3M） |

---

## 🎯 今日任务

1. 尝试加载 `efficientnet_b0`，替换分类头为 10 类，打印参数量
2. 用 ResNet50 提取一张图片的 2048 维特征向量
3. 对比 `resnet18` / `resnet50` / `efficientnet_b0` 的参数量和结构差异
4. 回复「**Day 29 完成**」打卡 ✅
