---
title: "Day 16 · 激活函数与损失函数"
description: "Sigmoid/ReLU/Tanh/LeakyReLU激活函数对比、MSE/CrossEntropy损失函数、激活函数可视化"
pubDate: 2026-06-11
section: learn
tags: ["深度学习", "神经网络", "Week3"]
difficulty: beginner
---

## 🎯 今日目标

掌握深度学习中常用的激活函数和损失函数：
- 常见激活函数及其优缺点
- 损失函数的选择原则
- ReLU 为什么成为默认首选

---

## 1. 为什么需要激活函数？

没有激活函数 = 线性变换，无论多少层，最终都是线性组合：

```
y = W₃(W₂(W₁x + b₁) + b₂) + b₃ = Wx + b（还是线性）
```

激活函数引入**非线性**，让网络能拟合任意复杂函数。

> 🔑 **一句话**：没有激活函数，多层网络 = 单层网络

---

## 2. 常见激活函数

### Sigmoid

```
σ(x) = 1 / (1 + e^(-x))
```

- 输出范围：(0, 1)
- 适合二分类输出层
- **致命问题**：梯度消失（x 很大或很小，梯度≈0）

```
σ(x)
 1 ┤━━━━━━━━━━━━━━━━
   │
0.5┤━━━━━━━
   │
  0┗━━━━━━━━━━━━━━━━→ x
       (梯度在两端趋近于0)
```

### Tanh

```
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))
```

- 输出范围：(-1, 1)
- 零中心，比 Sigmoid 收敛更快
- **问题**：同样存在梯度消失

### ReLU（Rectified Linear Unit）— 默认首选

```
ReLU(x) = max(0, x)
       = x, if x > 0
         0, if x ≤ 0
```

- 计算极快（一个比较操作）
- 缓解梯度消失
- **问题**：Dead ReLU（负半轴永远输出 0，梯度=0）

### Leaky ReLU

```
LeakyReLU(x) = x,  if x > 0
               0.01x, if x ≤ 0
```

- 负半轴有微小斜率（0.01），避免 Dead ReLU
- 实践中效果通常比 ReLU 稍好

### 对比总结

| 函数 | 范围 | 计算 | 梯度消失 | Dead ReLU |
|------|------|------|---------|-----------|
| Sigmoid | (0,1) | 慢 | 严重 | 无 |
| Tanh | (-1,1) | 慢 | 严重 | 无 |
| ReLU | [0,∞) | 极快 | 较轻 | 有 |
| LeakyReLU | (-∞,∞) | 快 | 较轻 | 无 |

> 💡 **实践默认选择**：隐藏层用 ReLU，输出层根据任务选择（分类→Softmax，回归→线性）

---

## 3. 损失函数

### 均方误差（MSE）

```
MSE = (1/n) × Σ(ŷ - y)²
```

- 用于回归任务
- 对离群点（outliers）惩罚很大

### 交叉熵（Cross-Entropy）

```
CE = -Σ y_i × log(ŷ_i)
```

- 用于分类任务
- 梯度包含 (ŷ - y)，误差大时梯度大，收敛快
- **分类任务首选**

### 何时用哪个？

| 任务 | 损失函数 |
|------|---------|
| 回归（房价、温度）| MSE / MAE |
| 二分类 | 二元交叉熵（BCE）|
| 多分类 | 类别交叉熵（CCE）|

---

## 4. 代码可视化对比

```python
import numpy as np
import matplotlib.pyplot as plt

# 定义激活函数
def sigmoid(x): return 1 / (1 + np.exp(-np.clip(x, -500, 500)))
def tanh(x): return np.tanh(x)
def relu(x): return np.maximum(0, x)
def leaky_relu(x, alpha=0.01): return np.where(x > 0, x, alpha * x)

# 绘图
x = np.linspace(-5, 5, 200)
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# 激活函数
axes[0].plot(x, sigmoid(x), label='Sigmoid')
axes[0].plot(x, tanh(x), label='Tanh')
axes[0].plot(x, relu(x), label='ReLU')
axes[0].plot(x, leaky_relu(x), label='LeakyReLU')
axes[0].axhline(0, color='gray', linewidth=0.5)
axes[0].axvline(0, color='gray', linewidth=0.5)
axes[0].set_title('激活函数')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# 梯度（导数）
def sigmoid_grad(x):
    s = sigmoid(x)
    return s * (1 - s)
def tanh_grad(x): return 1 - np.tanh(x)**2
def relu_grad(x): return (x > 0).astype(float)
def leaky_relu_grad(x, alpha=0.01): return np.where(x > 0, 1, alpha)

axes[1].plot(x, sigmoid_grad(x), label='Sigmoid 梯度')
axes[1].plot(x, tanh_grad(x), label='Tanh 梯度')
axes[1].plot(x, relu_grad(x), label='ReLU 梯度')
axes[1].axhline(0, color='gray', linewidth=0.5)
axes[1].axvline(0, color='gray', linewidth=0.5)
axes[1].set_title('激活函数梯度')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('activation_comparison.png')
print("梯度图已保存为 activation_comparison.png")
```

---

## 🧪 互动练习

### 练习 1：ReLU 的问题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>ReLU 有「Dead ReLU」问题，指的是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. ReLU 计算太慢</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 负半轴永远输出 0，对应神经元再也不会被激活（梯度=0）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. ReLU 输出始终为正，无法处理负数</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Dead ReLU 指神经元输出卡在 0（负输入），梯度永远为 0，无法恢复。LeakyReLU 通过给负半轴小斜率解决这个问题。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。Dead ReLU 指神经元对所有负输入都输出 0，梯度为 0，永远不更新。解决方案是 LeakyReLU/PReLU/ELU 等。
  </div>
</div>

---

### 练习 2：激活函数选择

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 应用题：</strong>一个图片分类神经网络，隐藏层应该用什么激活函数？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. Sigmoid（输出范围 0-1 适合概率）</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. ReLU（计算快、缓解梯度消失，CNN/RNN 默认首选）</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. Tanh（零中心，比 Sigmoid 收敛快，但仍有梯度消失）</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 现代 CNN/RNN 的隐藏层几乎都用 ReLU——计算极快、对梯度消失有缓解，是默认首选。Tanh 在 LSTM 中仍有使用。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。ReLU 是现代神经网络隐藏层的默认激活函数，计算极快且能有效缓解梯度消失问题。
  </div>
</div>

---

### 练习 3：损失函数选择

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>交叉熵比 MSE 更适合分类任务，因为它在预测错误时梯度更大，收敛更快。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 交叉熵的梯度包含 (ŷ - y)，预测越错梯度越大，收敛越快。MSE 在分类任务中梯度小且包含 σ'(x) 项，收敛很慢。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。交叉熵在分类任务中梯度更大、收敛更快，而 MSE 包含 Sigmoid 导数项，容易梯度消失。
  </div>
</div>

---

## 📝 今日小结

| 激活函数 | 特点 | 使用场景 |
|---------|------|---------|
| Sigmoid | (0,1)，二分类输出 | 输出层（二分类概率）|
| Tanh | (-1,1)，零中心 | LSTM、Seq2Seq |
| ReLU | max(0,x)，计算快 | **隐藏层默认首选** |
| LeakyReLU | 负斜率，避免Dead ReLU | 替代 ReLU 的首选 |

| 损失函数 | 适用 |
|---------|------|
| MSE | 回归任务 |
| Cross-Entropy | 分类任务 |

---

## 🎯 今日任务

1. 运行代码生成激活函数对比图，观察曲线和梯度差异
2. 思考：为什么 Sigmoid 用于输出层（二分类）很合适？
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
    if (isCorrect && window.markDayDone) window.markDayDone(16);
  }
</script>
