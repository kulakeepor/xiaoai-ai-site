---
title: "Day 19 · CNN（卷积神经网络）"
description: "卷积操作原理、滤波器与池化、Channel与Feature Map、经典CNN架构，用PyTorch搭建简易CNN图像分类"
pubDate: 2026-06-14
section: learn
tags: ["深度学习", "CNN", "Week3"]
difficulty: intermediate
---

## 🎯 今日目标

理解 CNN 的核心概念：
- 卷积操作的工作原理
- 滤波器（Kernel）、池化、Feature Map
- 为什么 CNN 适合图像任务
- 用 PyTorch 搭建一个简易 CNN

---

## 1. 为什么需要 CNN？

**全连接网络的问题**：3×224×224 的图片展平成 150,528 维，参数爆炸

**CNN 的核心洞察**：图像的局部模式有空间结构

```
全连接：每个像素独立连接
CNN：让神经元只看局部（感受野），参数复用
```

> 🔑 **空间结构 + 局部感受野 + 参数共享** = CNN 的三大核心思想

---

## 2. 卷积操作原理

**滤波器（Kernel / Filter）**：一个小的权重矩阵（如 3×3）

```
输入图像（5×5）：
1 1 1 0 0
0 1 1 1 0
0 0 1 1 1
0 0 1 1 0
0 1 1 0 0

滤波器（3×3）：
1 0 1
0 1 0
1 0 1

卷积输出（3×3）：
逐位置相乘后求和 → 得到一个数 → 滑动
```

**滑动窗口**：滤波器在图像上从左到右、从上到下滑动，每步输出一个数。

**输出特征图（Feature Map）**：滤波器提取的某种特征（边缘/纹理/形状）

---

## 3. 几个重要概念

### 填充（Padding）

在外围加一圈 0，防止图像越卷越小：
```
Valid（无填充）：越卷越小
Same（零填充）：保持尺寸
```

### 步幅（Stride）

滑动步长，stride=2 跳着滑，输出尺寸更小

### 多个滤波器

每个滤波器生成一个 Feature Map，多个滤波器 = 多通道输出

```
输入 (H, W, C_in)
↓  × K 个滤波器
输出 (H', W', C_out)   ← C_out = K
```

---

## 4. 池化（Pooling）

**目的**：降维、减少计算、增强鲁棒性

**最大池化（Max Pooling）**：取局部最大值
```
2×2 池化，stride=2：
[1 3]
[2 4] → 4
```

**平均池化（Avg Pooling）**：取局部平均值

```
特点：没有参数，不参与训练，只做固定操作
```

---

## 5. 经典 CNN 架构

| 架构 | 年份 | 创新点 |
|------|------|--------|
| LeNet | 1998 | 早期 CNN，用于手写数字识别 |
| AlexNet | 2012 | ReLU、Dropout、GPU训练，ImageNet 冠军 |
| VGG | 2014 | 3×3 小滤波器堆叠，结构简单 |
| ResNet | 2015 | 残差连接，解决深层网络退化问题 |

---

## 6. PyTorch 搭建简易 CNN

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# 简易 CNN
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)   # 28→28
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)  # 28→28
        self.pool = nn.MaxPool2d(2, 2)                              # 28→14
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.conv1(x))   # Conv → ReLU
        x = self.pool(x)               # Pool
        x = self.relu(self.conv2(x))   # Conv → ReLU
        x = self.pool(x)               # Pool: 28→14→7
        x = x.view(-1, 64 * 7 * 7)    # Flatten
        x = self.relu(self.fc1(x))
        x = self.fc2(x)                # 输出10类 logits
        return x

# 数据加载
transform = transforms.Compose([
    transforms.ToTensor(),  # [0,255] → [0,1]
    transforms.Normalize((0.1307,), (0.3081,))  # MNIST 标准化
])
train_ds = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_ds = datasets.MNIST('./data', train=False, transform=transform)

train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
test_loader = DataLoader(test_ds, batch_size=1000)

# 训练
model = SimpleCNN()
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

for epoch in range(3):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
    
    # 测试
    model.eval()
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            output = model(data)
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
    print(f"Epoch {epoch+1}: 准确率 = {100*correct/len(test_ds):.2f}%")
```

---

## 🧪 互动练习

### 练习 1：卷积概念

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>CNN 中「感受野」指的是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. 滤波器的数量</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 神经元能看到的输入图像区域大小</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 图像的分辨率</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 感受野（Receptive Field）是神经元能"看到"的输入区域。浅层神经元感受野小（看局部边缘），深层感受野大（看全局）。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。感受野是神经元能"看到"的输入图像区域。堆叠卷积层可以让感受野越来越大。
  </div>
</div>

---

### 练习 2：池化作用

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>最大池化（Max Pooling）会把局部区域里最大的值保留下来，因此具有平移不变性——物体稍微移动，输出仍然相似。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Max Pooling 保留最显著的特征，平移几个像素后最大值的来源可能一样，输出基本不变——这就是平移不变性，对图像分类很重要。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。Max Pooling 提取局部最显著特征，因此对平移、轻微形变有鲁棒性，是 CNN 的重要组成部分。
  </div>
</div>

---

### 练习 3：CNN vs 全连接

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>对于 224×224×3 的彩色图像，全连接层需要多少参数？相比之下 CNN 的优势是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. 参数一样多，CNN 的优势是计算更快</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 全连接层参数爆炸（224²×3×K），CNN 用小滤波器和参数共享大幅减少参数量</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 全连接层参数更少</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 224×224×3=150K 输入，连到 1000 输出就是 150M 参数。CNN 用 3×3 小滤波器和参数共享，参数量大幅减少，同时更好地捕捉空间结构。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。全连接层参数量 = 输入维度 × 隐藏层维度，图像展平后参数量巨大。CNN 的小滤波器和权重共享让参数大幅减少。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 卷积 | 滤波器在图像上滑动，提取局部特征 |
| 滤波器/Kernel | 小矩阵（3×3），每个学习不同的特征 |
| 池化 | 降维，Max Pooling 提取最显著值，有平移不变性 |
| 感受野 | 神经元能看到的输入区域大小 |
| 参数共享 | 同一个滤波器在整张图上复用，大幅减少参数量 |
| 经典架构 | LeNet → AlexNet → VGG → ResNet |

---

## 🎯 今日任务

1. 运行 PyTorch CNN 代码（需要 `torch` 和 `torchvision`），观察准确率变化
2. 尝试把 `conv1` 的通道数从 32 改成 64，观察参数量和效果变化
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
    if (isCorrect && window.markDayDone) window.markDayDone(19);
  }
</script>
