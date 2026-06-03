---
title: "Day 24 · 数据集与数据加载"
description: "Dataset与DataLoader、自定义数据集、数据预处理、DataLoader参数详解与调优策略"
pubDate: 2026-06-19
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: beginner
---

## 🎯 今日目标

掌握 PyTorch 数据加载工具：
- `Dataset` 和 `DataLoader` 的关系
- 内置数据集的使用（torchvision.datasets）
- 自定义 Dataset 的写法
- DataLoader 参数详解（batch_size、shuffle、num_workers）
- 数据预处理（transform）

---

## 1. Dataset 和 DataLoader 的关系

```
Dataset：数据的抽象（只管"数据在哪、怎么读取"）
DataLoader：批量的加载器（只管"怎么批量、怎么加速"）
```

```
Dataset: [样本1, 样本2, 样本3, ..., 样本N]
             ↓
DataLoader: batch1=[样本1,2,3,4], batch2=[样本5,6,7,8], ...
```

> 🔑 **Dataset 负责「读什么」，DataLoader 负责「怎么读」**

---

## 2. torchvision 内置数据集

```python
from torchvision import datasets, transforms

# 图像数据集（自动下载）
transform = transforms.Compose([
    transforms.ToTensor(),                    # PIL → [0,1] 张量
    transforms.Normalize((0.5,), (0.5,))   # 标准化到 [-1, 1]
])

# MNIST 手写数字
train_ds = datasets.MNIST(
    root='./data',
    train=True,                # 训练集
    download=True,            # 自动下载
    transform=transform       # 数据预处理
)
test_ds = datasets.MNIST(
    root='./data',
    train=False,
    transform=transform
)

# CIFAR-10 / CIFAR-100
train_ds = datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
train_ds = datasets.CIFAR100(root='./data', train=True, download=True, transform=transform)

# FashionMNIST（MNIST 升级版）
train_ds = datasets.FashionMNIST(root='./data', train=True, download=True, transform=transform)

# ImageFolder（从文件夹自动分类）
# 目录结构：train/dog/xxx.jpg, train/cat/yyy.jpg, ...
photo_ds = datasets.ImageFolder(root='./train', transform=transform)
print(photo_ds.classes)    # ['cat', 'dog']
print(photo_ds.class_to_idx)  # {'cat': 0, 'dog': 1}
```

---

## 3. 自定义 Dataset

```python
import torch
from torch.utils.data import Dataset, DataLoader

class MyDataset(Dataset):
    """自定义数据集模板"""
    def __init__(self, data_path, transform=None):
        # 1. 加载数据路径/列表（而非全部加载到内存）
        self.samples = []  # [(img_path, label), ...]
        self.transform = transform
        
        with open(data_path, 'r') as f:
            for line in f:
                img_path, label = line.strip().split(',')
                self.samples.append((img_path, int(label)))
    
    def __len__(self):
        # 必须：返回数据集大小
        return len(self.samples)
    
    def __getitem__(self, idx):
        # 必须：返回单个样本
        img_path, label = self.samples[idx]
        
        # 读取图像
        from PIL import Image
        image = Image.open(img_path).convert('RGB')
        
        # 数据增强/预处理
        if self.transform:
            image = self.transform(image)
        
        return image, label

# 使用
dataset = MyDataset('./data/train.csv', transform=train_transform)
print(len(dataset))    # 调用 __len__
img, label = dataset[0]  # 调用 __getitem__

# 包装成 DataLoader
dataloader = DataLoader(dataset, batch_size=32, shuffle=True, num_workers=4)
```

---

## 4. DataLoader 参数详解

```python
loader = DataLoader(
    dataset,
    batch_size=32,         # 每批样本数（显存相关，调大=省迭代次数但占显存）
    shuffle=True,          # 每个 epoch 打乱顺序（训练集 True，测试集 False）
    num_workers=4,         # 并行加载进程数（加速，但 macOS 上要设 0）
    pin_memory=True,       # 锁页内存，GPU 训练时开启加速数据传输
    drop_last=True,        # 丢弃最后不完整batch（训练开，测试关）
    sampler=None,          # 自定义采样策略（如按类别分层采样）
    collate_fn=None,       # 自定义批次组装方式
)

# 遍历
for epoch in range(3):
    for batch_idx, (images, labels) in enumerate(loader):
        # images: (batch, C, H, W) 或 (batch, seq_len)
        # labels: (batch,)
        pass
```

### batch_size 怎么选？

| batch_size | 优点 | 缺点 |
|-----------|------|------|
| 小（8-32） | 泛化好，显存低 | 迭代慢，梯度震荡 |
| 中（64-128）| 平衡，常用默认值 | — |
| 大（256+） | 迭代快，梯度稳定 | 显存高，可能泛化差 |

---

## 5. 数据预处理：transforms

```python
from torchvision import transforms

# 训练时的增强（让模型见过更多"变化"）
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),      # 随机裁剪到 224
    transforms.RandomHorizontalFlip(p=0.5),  # 50% 概率水平翻转
    transforms.RandomRotation(15),          # ±15° 随机旋转
    transforms.ColorJitter(brightness=0.2),  # 亮度抖动
    transforms.ToTensor(),                  # PIL → Tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet 统计量
                         std=[0.229, 0.224, 0.225])
])

# 评估/测试时（不做增强，只做必要的预处理）
test_transform = transforms.Compose([
    transforms.Resize(256),                # 缩放到 256
    transforms.CenterCrop(224),             # 中心裁剪到 224
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])
```

---

## 🧪 互动练习

### 练习 1：Dataset 核心方法

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>自定义 Dataset 类时，哪两个方法必须实现？它们分别返回什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">A. __len__ 返回数据集大小（样本总数）；__getitem__ 返回单个样本（数据和标签）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">B. __init__ 返回所有数据；__getitem__ 返回批次</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. __len__ 返回所有数据；__getitem__ 返回数据集大小</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Dataset 的核心契约：__len__ → 数据集大小（len(dataset) 调用）；__getitem__(idx) → 单个样本（dataset[idx] 调用），返回 (data, label)。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。__len__ 返回样本数量；__getitem__(idx) 返回 dataset[idx]，即单个样本 (数据, 标签)。
  </div>
</div>

---

### 练习 2：shuffle

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 实战题：</strong>训练集和测试集 DataLoader 的 shuffle 参数分别应该怎么设置？为什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">A. 训练集 shuffle=True（打乱顺序防过拟合）；测试集 shuffle=False（不需要，节省计算）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">B. 训练集 shuffle=False（保持稳定）；测试集 shuffle=True（全面评估）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 两者都 shuffle=True</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 训练集打乱：让模型每次见到不同顺序的样本，防止记忆顺序而非学习规律。测试集不打乱：测试的是"模型是否学到了稳定的能力"，不需要随机性。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。训练集 shuffle=True 防过拟合，测试集 shuffle=False 省计算且评估稳定。
  </div>
</div>

---

### 练习 3：数据增强

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>数据增强（Data Augmentation）的目的是什么？训练集和测试集是否都做同样的增强？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. 目的减少数据量；训练增强，测试也增强</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 目的扩充数据多样性，提升泛化能力；训练增强（造多样性），测试只做必要的标准化（不能随机增强，否则评估不稳定）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 目的加快训练速度；只训练时增强</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 数据增强通过随机变换（翻转、裁剪、变色）扩充训练数据多样性，让模型见过更多"变体"，从而提升泛化能力。测试时只能做确定性预处理（Resize、CenterCrop），否则同一输入得到不同结果，评估不稳定。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。数据增强让模型见过更多变体，提升泛化能力。测试时只做标准化，不做随机变换，否则每次评估结果不同。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 代码/说明 |
|------|--------|
| Dataset | 抽象数据源，实现 `__len__` + `__getitem__` |
| DataLoader | 批量加载，`batch_size`、`shuffle`、`num_workers` |
| torchvision.datasets | MNIST、CIFAR-10、FashionMNIST、ImageFolder 等内置数据集 |
| transforms | 数据预处理 + 增强（训练：随机变换，测试：确定性） |
| batch_size | 显存与泛化的平衡点，常见 32/64/128 |
| num_workers | macOS 上设 0，Linux 可设 4-8 |

---

## 🎯 今日任务

1. 运行 MNIST DataLoader 代码，观察每个 batch 的形状
2. 尝试修改 batch_size 和 shuffle 参数，观察变化
3. 完成 3 道练习题
4. 回复「**完成了**」打卡 ✅

---

<style>
  .quiz-container { margin: 1.5rem 0; padding: 1.25rem; border-radius: 12px; background: var(--color-surface); border: 1px solid var(--color-border); }
  .quiz-question { margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.6; }
  .quiz-options { display: flex; flex-direction: column; gap: 0.5rem; }
  .quiz-option { padding: 0.65rem 1rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg); color: var(--color-text); font-size: 0.875rem; cursor: pointer; text-align: left; transition: all 0.2s; font-family: inherit; }
  .quiz-option:hover { border-color: var(--color-primary); background: var(--color-surface); }
  .quiz-option.correct, .quiz-option.selected.correct { background: #d1fae5; border-color: #10b981; color: #065f46; }
  .quiz-option.wrong, .quiz-option.selected.wrong { background: #fee2e2; border-color: #ef4444; color: #991b1b; }
  .quiz-feedback { margin-top: 0.75rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; line-height: 1.5; }
  .quiz-correct { background: #d1fae5; color: #065f46; }
  .quiz-wrong { background: #fee2e2; color: #991b1b; }
</style>

<script>
  function checkAnswer(btn, quizId) {
    const isCorrect = btn.dataset.answer === 'true';
    const container = btn.closest('.quiz-container');
    container.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
      if (b.dataset.answer === 'true') b.classList.add('correct');
      if (b === btn && !isCorrect) b.classList.add('wrong');
    });
    document.getElementById(`${quizId}-feedback-${isCorrect ? 'correct' : 'wrong'}`).style.display = 'block';
    if (isCorrect && window.markDayDone) window.markDayDone(24);
  }
</script>
