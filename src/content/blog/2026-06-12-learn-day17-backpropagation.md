---
title: "Day 17 · 反向传播（BP）原理"
description: "链式法则、梯度下降回顾、手推BP推导、用NumPy实现完整反向传播算法"
pubDate: 2026-06-12
section: learn
tags: ["深度学习", "反向传播", "Week3"]
difficulty: intermediate
---

## 🎯 今日目标

深度理解反向传播（Backpropagation）：
- 链式法则——BP 的数学基础
- 反向传播的计算流程
- 用 NumPy 亲手实现完整的 BP 算法

---

## 1. 链式法则（Chain Rule）

BP 的核心数学工具。

**链式法则**：复合函数的导数 = 各部分导数的乘积

```
如果 y = f(g(x))

则 dy/dx = df/dg × dg/dx
```

**例子**：
```
y = (2x + 1)³

设 u = 2x + 1, y = u³

dy/dx = dy/du × du/dx = 3u² × 2 = 6(2x+1)²
```

---

## 2. 梯度下降回顾

**目标**：找到让损失函数 L 最小化的参数 W

```
W = W - α × ∂L/∂W

α = 学习率
∂L/∂W = 损失函数对 W 的梯度
```

梯度指向函数上升最快的方向，所以减去梯度就是下降。

---

## 3. 反向传播：链式法则的应用

数据从前往后传，梯度从后往前传。

**计算图示例**：

```
输入 x → [×W₁] → z₁ → [σ] → a₁ → [×W₂] → z₂ → [σ] → a₂ → [×W₃] → z₃ → Loss
```

**反向传播**：

```
∂Loss/∂W₃ = ∂Loss/∂a₂ × ∂a₂/∂z₂ × ∂z₂/∂W₃
         = δ₃ × a₂

∂Loss/∂W₂ = δ₂ × a₁
∂Loss/∂W₁ = δ₁ × x
```

其中每层的 δ（delta）是误差反向传播时的中间量。

---

## 4. 手推 BP（以单样本二分类为例）

```
网络：x → [W₁] → z₁ → [σ] → a₁ → [W₂] → z₂ → [σ] → a₂ = ŷ
损失：L = -[y·log(a₂) + (1-y)·log(1-a₂)]
```

**前向传播**（算出所有中间值）：
```
z₁ = W₁·x + b₁
a₁ = σ(z₁)
z₂ = W₂·a₁ + b₂
a₂ = σ(z₂)  ← 预测概率
```

**反向传播**（从后往前，逐层求导）：

**Step 1：输出层误差**
```
∂L/∂a₂ = -y/a₂ + (1-y)/(1-a₂)   （交叉熵导数）
∂a₂/∂z₂ = σ(z₂)(1-σ(z₂)) = a₂(1-a₂)
∂L/∂z₂ = ∂L/∂a₂ × ∂a₂/∂z₂ = a₂ - y   （神奇！误差直接是 a₂-y）
```

**Step 2：更新 W₂, b₂**
```
∂L/∂W₂ = ∂L/∂z₂ × ∂z₂/∂W₂ = (a₂ - y) × a₁ᵀ
∂L/∂b₂ = ∂L/∂z₂ = a₂ - y
```

**Step 3：传播到隐藏层**
```
∂L/∂a₁ = W₂ᵀ × ∂L/∂z₂
∂L/∂z₁ = ∂L/∂a₁ ⊙ σ'(z₁)   （⊙ = 逐元素乘法）
```

> 🔑 **核心洞察**：交叉熵 + Sigmoid 的组合让输出层梯度简化为 `a₂ - y`，计算极简！

---

## 5. NumPy 完整实现

```python
import numpy as np

class SimpleBP:
    def __init__(self, layer_sizes):
        """layer_sizes: [输入维度, 隐藏层维度, ..., 输出维度]"""
        self.weights = []
        self.biases = []
        for i in range(len(layer_sizes) - 1):
            # Xavier 初始化
            w = np.random.randn(layer_sizes[i+1], layer_sizes[i]) * np.sqrt(2 / layer_sizes[i])
            b = np.zeros((layer_sizes[i+1], 1))
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    
    def sigmoid_grad(self, z):
        s = self.sigmoid(z)
        return s * (1 - s)
    
    def forward(self, X):
        self.activations = [X]
        self.zs = []
        for i, (W, b) in enumerate(zip(self.weights, self.biases)):
            z = W @ self.activations[-1] + b
            self.zs.append(z)
            a = self.sigmoid(z) if i < len(self.weights) - 1 else self._softmax(z)
            self.activations.append(a)
        return self.activations[-1]
    
    def _softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=0, keepdims=True))
        return exp_z / np.sum(exp_z, axis=0, keepdims=True)
    
    def backward(self, y, lr=0.01):
        m = y.shape[1]  # 样本数
        num_layers = len(self.weights)
        
        # 输出层误差 (交叉熵 + softmax 的导数简化)
        delta = self.activations[-1] - y
        
        # 反向传播
        for i in reversed(range(num_layers)):
            W = self.weights[i]
            
            # 梯度
            dW = delta @ self.activations[i].T / m
            db = np.sum(delta, axis=1, keepdims=True) / m
            
            # 更新参数
            self.weights[i] -= lr * dW
            self.biases[i] -= lr * db
            
            # 传播到前一层
            if i > 0:
                delta = (W.T @ delta) * self.sigmoid_grad(self.zs[i-1])
    
    def train(self, X, Y, epochs=1000, lr=0.1):
        for e in range(epochs):
            a = self.forward(X)
            self.backward(Y, lr=lr)
            if e % 200 == 0:
                loss = -np.mean(Y * np.log(a + 1e-8))
                print(f"Epoch {e}: loss = {loss:.4f}")

# 测试
np.random.seed(42)
X = np.random.randn(2, 100)  # 2个特征，100个样本
Y = np.eye(2) @ (X[0,:] + X[1,:] > 0).astype(int)  # 简单二分类

nn = SimpleBP([2, 8, 2])
nn.train(X, Y, epochs=1000, lr=0.5)
```

---

## 🧪 互动练习

### 练习 1：链式法则

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 计算题：</strong>如果 y = sin(3x + 1)，求 dy/dx。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. cos(3x+1)</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 3cos(3x+1)</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. -3cos(3x+1)</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> dy/dx = d(sin u)/du × du/dx = cos(3x+1) × 3 = 3cos(3x+1)，用到了链式法则。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。y = sin(u), u = 3x+1, dy/du = cos(u), du/dx = 3，所以 dy/dx = 3cos(3x+1)。
  </div>
</div>

---

### 练习 2：BP 方向

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>反向传播（Backpropagation）的方向是从输出层向输入层传播梯度。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> BP 从输出层的损失函数开始，用链式法则把梯度反向传播（输出→隐藏→输入），逐层计算参数梯度。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。反向传播的方向是**从后往前**（输出→隐藏→输入），与前向传播方向相反。
  </div>
</div>

---

### 练习 3：梯度计算

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>为什么交叉熵 + Sigmoid 的组合在反向传播时「梯度计算很简洁」？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. 因为 ∂L/∂z = a - y，直接是预测值减真实值，不需要再乘 σ'(z)</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. 因为 Sigmoid 的导数恒等于 1</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 因为交叉熵不需要求导</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 交叉熵导数乘以 Sigmoid 导数后神奇地抵消了 σ'(z)，只剩下 a-y，计算极简且误差信号强。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。这是深度学习中的经典技巧——交叉熵 + Sigmoid 的组合让梯度变成 a-y，简洁高效。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 链式法则 | 复合函数求导：dy/dx = dy/du × du/dx |
| 反向传播 | 从输出层反向计算各层参数梯度 |
| BP 流程 | 前向算出激活值 → 反向算 δ → 更新 W,b |
| 梯度消失 | 链式法则多层连乘，梯度指数级减小 |
| 核心洞察 | 交叉熵 + Sigmoid → 梯度 = a - y，极简 |

---

## 🎯 今日任务

1. 运行 NumPy BP 代码，观察 loss 随训练下降
2. 手推一遍交叉熵 + Sigmoid 的 BP 过程（上面的推导）
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
    if (isCorrect && window.markDayDone) window.markDayDone(17);
  }
</script>
