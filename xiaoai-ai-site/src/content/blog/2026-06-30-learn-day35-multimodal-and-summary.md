---
title: "Day 35 · 多模态与 Week 5 总结"
description: "CLIP 图文对齐、视觉问答、多模态模型概览，Week 5 知识点串线，30天学习路径回顾"
pubDate: 2026-06-30
section: learn
tags: ["多模态", "CLIP", "Week5"]
difficulty: advanced
---

## 🎯 今日目标

了解多模态学习的核心问题（图文对齐），掌握 CLIP 的原理和应用，理解不同模态如何融合，最后做一个 Week 5 的知识点串线。

---

## 1. 什么是多模态学习？

现实世界中的信息天然是多模态的：
- **视觉**：图片、视频
- **语言**：文本、语音
- **音频**：音乐、声音效果
- **触觉**：压力、振动

多模态学习的核心挑战：**不同模态的"表示空间"不同，如何对齐？**

```
图片：像素矩阵（high, width, 3）
文本：token ID 序列
音频：波形信号

→ 如何让"一只猫"的图片和"a cat"的文本在同一个空间？
```

---

## 2. CLIP——图文对齐的里程碑

### 2.1 CLIP 的核心思想

CLIP（Contrastive Language-Image Pre-training）用**对比学习**让图文在同一个向量空间对齐。

```
训练数据：4 亿张图片 + 配对文本描述

对比学习目标：
- 正样本对：同一张图片和它的描述 → 距离近
- 负样本对：不同图片和描述 → 距离远

用 InfoNCE loss 最大化正样本对相似度，最小化负样本对相似度
```

```python
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained('openai/clip-vit-base-patch32')
processor = CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')

# 图片和文本
image = Image.open('cat.jpg')
text = ['a cat', 'a dog', 'a bird']

# 编码
inputs = processor(text=text, images=image, return_tensors='pt', padding=True)
outputs = model(**inputs)

# 计算相似度
logits_per_image = outputs.logits_per_image  # 图片对每个文本的得分
probs = logits_per_image.softmax(dim=1)       # 归一化为概率

print(f"概率: {probs}")
# tensor([[0.9523, 0.0431, 0.0046]]) → 最可能是"a cat"
```

### 2.2 CLIP 的零样本能力

CLIP 训练时见过 4 亿图文对，所以可以在任意类别上做**零样本分类**，不需要在目标数据集上训练：

```python
# 零样本图像分类（ImageNet 1000类）
text_labels = [
    'a cat', 'a dog', 'a car', 'a airplane', ...  # ImageNet 1000 个类名
]
# CLIP 只需要这些文本，不需要训练样本！
inputs = processor(text=text_labels, images=image, return_tensors='pt')
```

### 2.3 CLIP 开启的潮流

CLIP 之后，多模态模型迎来了爆发：
- **DALL-E 2**：CLIP 引导生成（用 CLIP 指导扩散模型生成）
- **Stable Diffusion**：CLIP Text Encoder 提供文本条件
- **BLIP**：图文Captioning + VQA
- **LLaVA**：开源多模态 GPT（LLM + CLIP）

---

## 3. LLaVA：开源多模态 GPT

LLaVA（Large Language and Vision Assistant）是最流行的开源多模态模型之一。

```python
# pip install llava
# 注意：需要足够显存（至少 12GB）

from llava.model import LlavaForConditionalGeneration
from llava.conversation import conv_templates
import torch

# 加载模型（7B 参数）
model = LlavaForConditionalGeneration.from_pretrained(
    'liuhaotian/llava-v1.6-7b',
    torch_dtype=torch.float16  # 节省显存
)

# 图文对话
prompt = "Describe what you see in this image."
image = 'example.jpg'

inputs = model.build_inputs(prompt, image)
outputs = model.generate(**inputs)
response = model.decode(outputs[0])
print(response)
# "I see a cat sitting on a wooden table..."
```

---

## 4. 多模态融合方式总结

| 融合方式 | 代表模型 | 说明 |
|---------|---------|------|
| 早期融合（Early Fusion） | 简单拼接像素+token | 在输入层融合 |
| 晚期融合（Late Fusion） | 分别编码后融合 | 在特征层融合 |
| 交叉注意力（Cross-Attention） | Flamingo, LLaMA-Adapter | Decoder 交叉注意力看Encoder |
| 门控机制（Gating） | 有选择地融合不同模态 | 动态权重 |

---

## 5. Week 5 知识点串线

把 Week 4 和 Week 5 的知识串联成一张图：

```
卷积神经网络
├── 架构演进：LeNet → ResNet → EfficientNet
├── 核心：残差连接、深度可分离卷积、复合缩放
└── 工具：torchvision.models（Model Zoo）

目标检测
├── 两阶段：R-CNN → Fast R-CNN → Faster R-CNN
├── 单阶段：YOLOv1 → v3 → v5/v8（工业主流）
└── 核心：Anchor Boxes、NMS、IoU

语义分割
├── FCN（全卷积）：卷积替代 FC，保留空间
├── U-Net（Encoder-Decoder + Skip）：医学图像
└── DeepLab（空洞卷积 + ASPP）：多尺度

模型部署
├── TorchScript：PyTorch 原生，JIT 编译
├── ONNX：跨框架，中立格式
├── TensorRT：NVIDIA GPU 极致优化
└── Flask API：简单 HTTP 推理服务

生成模型
├── GAN（对抗训练）：Generator vs Discriminator
├── Diffusion（去噪扩散）：逐步加噪/去噪，训练稳定
└── CLIP（图文对齐）：对比学习，零样本分类

大语言模型
├── Transformer 架构：Attention is All You Need
├── BERT：Encoder，双向，MLM（理解任务）
├── GPT：Decoder，单向，CLM（生成任务）
└── 微调：LoRA（参数高效）

多模态
├── CLIP：图文对比学习，零样本分类
└── LLaVA：LLM + 视觉编码器，图文对话
```

---

## 6. 完整学习路径回顾（Day 8 - Day 35）

| 周 | Day | 核心内容 |
|----|-----|---------|
| Week 2 | Day 8-14 | ML 核心：回归、分类、树模型、聚类、评估 |
| Week 3 | Day 15-21 | DL 理论：神经网络、CNN/RNN/LSTM、Attention |
| Week 4 | Day 22-28 | PyTorch 框架：张量、Autograd、DataLoader、训练循环、迁移学习、HuggingFace、综合实战 |
| Week 5 | Day 29-35 | 进阶应用：CNN架构、目标检测、分割、部署、GAN、LLM、多模态 |

---

## 🧪 Week 5 综合练习

**Q1.** CLIP 的训练目标是？

A.让模型预测被遮住的词  
B.用对比学习让匹配的图片-文本对的向量相似，不匹配的远离  
C.生成图片对应的文本描述  
D.做图像分割  

---

**Q2.** 以下哪个不是多模态模型？

A.CLIP  
B.LLaVA  
C.BERT  
D.GPT-4V  

---

**Q3.** YOLOv8 相比 Faster R-CNN 的主要优势是？

A.精度更高  
B.两阶段检测  
C.单阶段，速度快，适合实时场景  
D.不需要 NMS  

---

**Q4.** TorchScript 的 trace 和 script 区别是？

A.trace 更快  
B.trace 用输入追踪执行路径（无控制流），script 编译代码（有控制流）  
C.两者完全等价  
D.script 更快  

---

**Q5.** 残差连接（Skip Connection）为什么有效？

A.让网络更深同时保持梯度流动，减少退化  
B.减少参数量  
C.加快推理速度  
D.提高分类精度  

---

## 📝 Week 5 小结

| Day | 主题 | 关键词 |
|-----|------|--------|
| Day 29 | CNN 架构 | ResNet、残差连接、EfficientNet、Model Zoo |
| Day 30 | 目标检测 | YOLO、Anchor Boxes、NMS、两阶段 vs 单阶段 |
| Day 31 | 语义分割 | FCN、U-Net、空洞卷积、ASPP |
| Day 32 | 模型部署 | TorchScript、ONNX、TensorRT、Flask API |
| Day 33 | GAN/Diffusion | 对抗训练、DCGAN、扩散模型、去噪过程 |
| Day 34 | 大语言模型 | Transformer、BERT/GPT、Tokenization、LoRA |
| Day 35 | 多模态 | CLIP、LLaVA、图文对齐、零样本学习 |

---

## 🎯 今日任务

1. 完成 Week 5 小测（回复「**我的答案：...**」）
2. 回顾从 Day 8 到 Day 35，你学到的最重要的 3 个概念是什么？
3. 回复「**Week 5 完成！**」打卡 ✅

---

**🎓 恭喜完成从 Day 8 到 Day 35 的深度学习进阶之旅！**

你已经掌握了：
- 现代 CNN 架构和 PyTorch 框架
- 目标检测、语义分割两大核心任务
- 模型部署的全套工具链
- 生成模型（GAN + Diffusion）
- 大语言模型基础
- 多模态学习入门

下一步方向建议：
- 选一个感兴趣的方向深入（CV / NLP / 生成 / 部署）
- 做一个小项目把知识点串起来
- 持续关注领域最新进展（论文 + 代码）
