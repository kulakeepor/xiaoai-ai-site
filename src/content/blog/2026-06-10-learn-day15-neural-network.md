---
title: "Day 15 · 神经网络基础"
description: "神经元模型、层与深度概念、前向传播流程，用NumPy亲手实现单层神经网络"
pubDate: 2026-06-10
section: learn
tags: ["深度学习", "神经网络", "Week3"]
difficulty: beginner
---

## 🎯 今日目标

理解神经网络的基本单元和前向传播：
- 神经元模型（输入、权重、偏置、激活）
- 感知机和多层神经网络
- 前向传播的计算流程
- 用 NumPy 实现单层神经网络

---

## 1. 神经元：神经网络的基本单元

**神经元**（Neuron）= 生物神经元的简化版

```
输入 x₁, x₂, x₃
    ↓
权重 w₁, w₂, w₃（每条连接有不同的强度）
    ↓
加权求和：z = x₁w₁ + x₂w₂ + x₃w₃ + b
    ↓
激活函数：a = σ(z)
    ↓
输出 a（神经元的活性）
```

**类比**：神经元 = 接收信号 → 加权处理 → 判断是否"激活"

---

## 2. 感知机（Perceptron）

最简单的神经元模型（没有激活函数）：

```
输出 ŷ = sign(w·x + b)
sign(z) = +1  如果 z ≥ 0
          -1  如果 z < 0
```

**局限**：只能处理线性可分问题（与/或/非），无法解决异或（XOR）

> 🔑 **感知机的缺陷**：单层感知机只能画一条直线，无法解决非线性问题（如 XOR）。这推动了多层网络的发展。

---

## 3. 多层神经网络

```
输入层 → 隐藏层 → 隐藏层 → 输出层
(3个)    (4个)     (4个)     (2个)
```

**术语**：
- **输入层**：接收原始特征（不计算）
- **隐藏层**：中间层，"黑箱"，负责特征提取
- **输出层**：最终预测结果
- **层数**：隐藏层数 + 1（不算输入层）
- **深度**：层数很深 → Deep Learning

---

## 4. 前向传播（Forward Propagation）

数据从输入到输出的计算过程：

```
输入层：[x₁, x₂]
   ↓
隐藏层₁：a₁ = σ(w₁·x + b₁)
         a₂ = σ(w₂·x + b₂)
         a₃ = σ(w₃·x + b₃)
   ↓
隐藏层₂：a₄ = σ(w₄·a + b₄)
   ↓
输出层：ŷ = softmax(w_out·a + b_out)
```

**向量化表示**（一次计算整层）：

```python
z1 = W1 @ x + b1   # @ = 矩阵乘法
a1 = sigmoid(z1)
z2 = W2 @ a1 + b2
a2 = sigmoid(z2)
z3 = W3 @ a2 + b3
ŷ = softmax(z3)
```

---

## 5. 用 NumPy 实现单层神经网络

```python
import numpy as np

class SimpleNN:
    def __init__(self, input_size, hidden_size, output_size):
        # Xavier 初始化（权重不宜过大或过小）
        self.W1 = np.random.randn(hidden_size, input_size) / np.sqrt(input_size / 2)
        self.b1 = np.zeros((hidden_size, 1))
        self.W2 = np.random.randn(output_size, hidden_size) / np.sqrt(hidden_size / 2)
        self.b2 =.zeros((output_size, 1))
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    
    def forward(self, X):
        """X: shape (n_features, n_samples)"""
        # 隐藏层
        self.z1 = self.W1 @ X + self.b1
        self.a1 = self.sigmoid(self.z1)
        # 输出层
        self.z2 = self.W2 @ self.a1 + self.b2
        # 用 softmax 归一化成概率
        exp_z = np.exp(self.z2 - np.max(self.z2, axis=0, keepdims=True))
        self.a2 = exp_z / np.sum(exp_z, axis=0, keepdims=True)
        return self.a2

# 测试
nn = SimpleNN(input_size=2, hidden_size=4, output_size=2)
X = np.array([[0.5], [0.3]])  # 两个特征，一个样本
prob = nn.forward(X)
print(f"预测概率: {prob.flatten()}")  # [p(class0), p(class1)]
```

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>单层感知机（Perceptron）可以解决 XOR 问题。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 单层感知机只能处理线性可分问题，XOR 是非线性问题，需要至少两层神经网络（多层感知机）才能解决。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「错误」。XOR 是非线性问题，单层感知机只能解决线性可分问题，XOR 正是感知机的经典失败案例。
  </div>
</div>

---

### 练习 2：前向传播

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 计算题：</strong>神经网络的「深度」是指什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 所有层的节点总数</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 隐藏层的数量（层数越多越"深"）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 输入层节点的数量</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> "深度"指的是网络的层数（通常指隐藏层数）。深度学习 = 很深的神经网络（几十上百层）。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。"深度"指网络的层数，层数越多网络越"深"，这就是"Deep Learning"名字的由来。
  </div>
</div>

---

### 练习 3：NumPy

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 代码题：</strong>在 NumPy 中，`W @ x` 表示什么运算？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. W 和 x 对应元素相乘（逐元素乘法）</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 矩阵乘法（W 的列数必须等于 x 的行数）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. W 减去 x</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> `@` 是 NumPy 的矩阵乘法运算符，也叫"dot product"。神经网络的向量化计算全靠它。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。`@` 是 NumPy 矩阵乘法运算符，是神经网络向量化的核心。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 神经元 | 接收输入 → 加权求和 → 激活函数 → 输出 |
| 感知机 | 简化版神经元，只能处理线性问题 |
| 多层网络 | 输入层 + 隐藏层 + 输出层，能处理非线性问题 |
| 前向传播 | 数据从输入层逐层计算到输出层的过程 |
| 深度学习 | 很多隐藏层的神经网络 |
| Xavier 初始化 | 权重初始化方法，防止梯度消失/爆炸 |

---

## 🎯 今日任务

1. 运行 NumPy 实现代码，观察 softmax 输出概率
2. 思考：为什么权重初始化不能全为 0？
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
    if (isCorrect && window.markDayDone) window.markDayDone(15);
  }
</script>
