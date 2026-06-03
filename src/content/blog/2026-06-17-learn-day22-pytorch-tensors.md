---
title: "Day 22 · PyTorch 张量"
description: "PyTorch核心数据结构、张量创建、索引切片、形状变换、GPU加速，用代码理解张量的本质"
pubDate: 2026-06-17
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: beginner
---

## 🎯 今日目标

掌握 PyTorch 的核心数据结构：
- 什么是张量（Tensor）
- 张量的创建、索引、切片
- 形状变换（reshape、view、transpose）
- GPU 加速（cuda）
- 和张量相关的常见操作

---

## 1. 张量是什么？

**张量（Tensor）**：PyTorch 中的基本数据结构，可以理解为"多维数组"

```
0维张量 = 一个数（标量）
1维张量 = 向量（一维数组）
2维张量 = 矩阵（二维数组）
3维+   = 高维数组
```

> 🔑 **NumPy 的 ndarray 就是张量的"表亲"**，PyTorch 张量几乎和 NumPy 数组用法一样，但多了 GPU 支持和自动求导能力。

---

## 2. 张量的创建

```python
import torch
import numpy as np

# 从 Python 列表创建
a = torch.tensor([1, 2, 3, 4])
print(a)          # tensor([1, 2, 3, 4])
print(a.dtype)    # torch.int64

# 指定数据类型
b = torch.tensor([1.0, 2.0, 3.0], dtype=torch.float32)

# 从 NumPy 数组创建（共享内存！）
np_arr = np.array([[1, 2], [3, 4]])
c = torch.from_numpy(np_arr)       # 共享底层数据
d = torch.tensor(np_arr)           # 复制一份

# 快速创建特殊张量
e = torch.zeros(3, 4)             # 全 0，形状 (3,4)
f = torch.ones(2, 3)              # 全 1，形状 (2,3)
g = torch.full((2, 2), 7.0)      # 全 7
h = torch.eye(3)                  # 单位矩阵（对角为1）
i = torch.rand(3, 3)             # [0,1) 均匀分布随机
j = torch.randn(3, 3)             # 标准正态分布 N(0,1)
k = torch.arange(0, 10, step=2)   # [0, 2, 4, 6, 8]
l = torch.linspace(0, 1, steps=5) # [0, 0.25, 0.5, 0.75, 1]
```

---

## 3. 索引与切片

```python
x = torch.arange(12).reshape(3, 4)   # tensor([[ 0,  1,  2,  3],
                                       #          [ 4,  5,  6,  7],
                                       #          [ 8,  9, 10, 11]])

# 基本索引
print(x[0])          # tensor([0, 1, 2, 3])        第1行
print(x[1, 2])      # tensor(6)                    第2行第3列
print(x[:, 0])       # tensor([0, 4, 8])           所有行的第1列

# 切片
print(x[1:, 2:])     # tensor([[ 6,  7],           行1,2 的列2,3
                     #          [10, 11]])
print(x[::2, ::2])  # tensor([[ 0,  2],           跳2取2
                     #          [ 8, 10]])

# 条件索引（布尔掩码）
mask = x > 6
print(x[mask])      # tensor([ 7,  8,  9, 10, 11])
print(torch.where(x > 6, x, torch.zeros_like(x)))  # 大于6保留，否则0

# 用 torch.masked_select 提取满足条件的元素
indices = torch.nonzero(x > 6).squeeze()
print(x[indices])   # tensor([ 7,  8,  9, 10, 11])
```

---

## 4. 形状变换

```python
a = torch.arange(12)            # tensor([0, 1, 2, ..., 11])

# reshape：任意重塑（要求元素总数不变）
b = a.reshape(3, 4)           # tensor([[ 0,  1,  2,  3],
                               #          [ 4,  5,  6,  7],
                               #          [ 8,  9, 10, 11]])
c = a.reshape(-1, 3)           # -1 表示自动推断：4×3
d = a.reshape(2, 3, 2)         # 3维张量

# view：类似 reshape，但要求连续内存（更快）
e = a.view(4, 3)              # tensor([[ 0,  1,  2],
                               #          [ 3,  4,  5],
                               #          [ 6,  7,  8],
                               #          [ 9, 10, 11]])
# view 和 reshape 的区别：view 需要内存连续，reshape 不要求

# transpose：交换维度
f = torch.randn(2, 3, 4)      # (2, 3, 4) → (4, 3, 2)
g = f.transpose(0, 2)           # 第0维和第2维交换

# permute：多维度置换
h = f.permute(2, 1, 0)        # (2,3,4) → (4,3,2)，等效于 transpose

# squeeze / unsqueeze：删/增维度
i = torch.randn(1, 3, 1, 8)
j = i.squeeze()                # (1,3,1,8) → (3,8)，删除所有 size=1 的维度
k = i.squeeze(dim=2)          # 只删除第2维（如果是1的话）
l = torch.randn(3, 4).unsqueeze(dim=0)  # (3,4) → (1,3,4)，在第0维插入
```

---

## 5. GPU 加速

```python
# 检查 GPU 是否可用
print(torch.cuda.is_available())   # True / False
print(torch.cuda.device_count())   # GPU 数量

# 把张量移到 GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
x = torch.randn(1000, 1000)

# 方式1：.to(device)
x_gpu = x.to(device)

# 方式2：.cuda() / .cpu()
x_gpu = x.cuda()
x_cpu = x_gpu.cpu()

# 在 GPU 上做运算
y = torch.randn(1000, 1000).to(device)
z = x_gpu @ y  # 矩阵乘法，GPU 上快很多

# 创建时直接指定设备
w = torch.zeros(100, 100, device=device)

# 模型也要移到 GPU
model = model.to(device)
# 输入数据同样
outputs = model(inputs.to(device))
```

---

## 🧪 互动练习

### 练习 1：张量创建

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>`torch.zeros(3, 4)` 创建的张量形状是什么？数据类型的默认值是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">A. 形状 (3, 4)，默认值 torch.float32</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">B. 形状 (3, 4)，默认值 torch.int64</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 形状 (4, 3)，默认值 torch.float64</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> `torch.zeros(3, 4)` 创建 3 行 4 列的二维张量。PyTorch 默认 dtype 是 float32（torch.float32），除非显式指定。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。torch.zeros(3, 4) 的参数是 (行, 列) = (3, 4)。PyTorch 默认 dtype 是 float32。
  </div>
</div>

---

### 练习 2：形状变换

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 实战题：</strong>`torch.arange(12).reshape(-1, 3)` 的输出形状是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. (3, 4)</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. (4, 3)</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. (12,)</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> arange(12) 有 12 个元素。reshape(-1, 3) 表示"列数固定为 3，行数自动计算"，12 ÷ 3 = 4，所以形状是 (4, 3)。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。12 个元素，reshape(-1, 3) 的 -1 自动计算行数 = 12/3 = 4，所以是 (4, 3)。
  </div>
</div>

---

### 练习 3：GPU 操作

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>如果 `torch.cuda.is_available()` 返回 False，说明当前机器没有 NVIDIA 显卡。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">✗ 不对</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 不一定是硬件问题。可能是：① CUDA 驱动没装 ② PyTorch 是 CPU 版本（需要重新装 `torch.cuda` 版）③ 环境变量配置问题。NVIDIA 显卡存在但 is_available 返回 False 的情况很常见。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是"不对"。可能是驱动问题、PyTorch 是 CPU 版本、或环境变量问题，不一定是硬件问题。
  </div>
</div>

---

## 📝 今日小结

| 操作 | 代码 | 说明 |
|------|------|------|
| 创建 | `torch.tensor([1,2,3])` | 从列表创建 |
| 特殊 | `torch.zeros/ones/rand/randn` | 全0/全1/随机 |
| 索引 | `x[0, 1:]` | 行切片 |
| 变形 | `x.reshape(3, 4)` | 重塑形状 |
| 维度 | `x.squeeze()` / `unsqueeze()` | 删/增 size=1 维度 |
| GPU | `x.to('cuda')` | 移到 GPU |
| 设备 | `torch.device('cuda' if ... else 'cpu')` | 自适应设备 |

---

## 🎯 今日任务

1. 在 Python 里运行张量创建代码（需要 `pip install torch`）
2. 尝试创建一个 3×3 随机矩阵，做索引切片操作
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
    if (isCorrect && window.markDayDone) window.markDayDone(22);
  }
</script>
