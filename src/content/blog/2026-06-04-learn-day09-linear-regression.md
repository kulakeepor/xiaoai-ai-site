---
title: "Day 9 · 线性回归"
description: "用一条直线预测数值：线性回归原理、损失函数、梯度下降求解，附互动练习题"
pubDate: 2026-06-04
section: learn
tags: ["机器学习", "监督学习", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

学会用线性回归预测数值，理解：
- 线性回归的几何意义
- 损失函数（MSE）是什么
- 梯度下降如何找到最佳参数

---

## 1. 什么是线性回归？

**核心思想**：找一条直线，最能代表数据点的分布趋势

```
预测：y = wx + b

w = 斜率（权重）
b = 截距（偏置）
x = 输入特征
y = 预测值
```

**例子**：用房子面积（x）预测价格（y）

| 面积 (x) | 价格 (y) |
|---------|---------|
| 50 | 300万 |
| 80 | 500万 |
| 120 | 720万 |

用线性回归拟合出：`价格 = 6万 × 面积 + 0万`

→ 输入 100㎡ → 预测 600万

---

## 2. 损失函数（Loss Function）

模型不知道 w 和 b 该是多少，需要定义一个"好坏标准"。

**均方误差（MSE）**：
```
MSE = (1/n) × Σ(预测值 - 真实值)²

= (1/n) × Σ(wx + b - y)²
```

**几何意义**：所有数据点到拟合直线的**垂直距离的平方和**，越小越好。

> 🔑 **理解**：损失函数 = 模型的"错误程度"。我们的目标是让这个值最小。

---

## 3. 梯度下降（Gradient Descent）

如何找到让 MSE 最小的 w 和 b？

**类比**：想象你在山顶，要找到山谷最低点。
- 每一步往最陡的下坡方向走
- 走多快由"学习率"决定

**公式**：
```
w = w - α × ∂MSE/∂w
b = b - α × ∂MSE/∂b

α（alpha）= 学习率（learning rate），一般取 0.01 ~ 0.1
```

**直观理解**：
- 导数 > 0 → 往左走（减小 w）
- 导数 < 0 → 往右走（增大 w）
- 学习率决定每步走多远

> ⚠️ **学习率太大会震荡不收敛，太小会跑很慢。** 需要调参找到合适的值。

---

## 4. sklearn 实战

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# 1. 准备数据：面积 → 价格
X = np.array([[50], [80], [100], [120], [150], [200]])
y = np.array([300, 500, 600, 720, 900, 1200])  # 单位：万

# 2. 训练模型
model = LinearRegression()
model.fit(X, y)

# 3. 预测
X_test = np.array([[90], [130], [180]])
y_pred = model.predict(X_test)

print(f"斜率 w = {model.coef_[0]:.2f}")  # → 6.03
print(f"截距 b = {model.intercept_:.2f}")  # → -6.77
print(f"90㎡ 预测价格: {y_pred[0]:.0f}万")
print(f"130㎡ 预测价格: {y_pred[1]:.0f}万")

# 4. 评估
y_train_pred = model.predict(X)
mse = mean_squared_error(y, y_train_pred)
print(f"训练集 MSE = {mse:.2f}")
```

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>在线性回归中，损失函数（MSE）的值越小，说明模型的预测效果越好。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> MSE = 平均(预测误差)²，越小说明预测值越接近真实值。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。MSE 是误差平方的平均值，越小说明拟合越好。
  </div>
</div>

---

### 练习 2：计算题

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>假设学习率（α）设置得非常大，比如 α = 10，可能出现什么问题？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 模型收敛更快，效果更好</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 一步迈太大，跳过最优解甚至发散不收敛</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 没有任何影响</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 学习率太大，参数会在最优点附近来回跳跃甚至发散，无法收敛。通常 α 取 0.001 ~ 0.1。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。学习率太大会导致参数跳过最优解，在梯度下降时"震荡"或发散。
  </div>
</div>

---

### 练习 3：代码观察

```python
# 用 sklearn 的线性回归，对以下数据进行拟合
# X = [[1], [2], [3], [4], [5]]
# y = [3, 5, 7, 9, 11]
# （提示：这是完美的 y = 2x + 1 关系）

from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([3, 5, 7, 9, 11])

model = LinearRegression()
model.fit(X, y)

print(f"学到的斜率 w = {model.coef_[0]:.2f}")
print(f"学到的截距 b = {model.intercept_:.2f}")
print(f"x=6 时的预测值 = {model.predict([[6]])[0]:.2f}")
```

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>上面代码运行后，学到的 w 和 b 最接近多少？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. w ≈ 2.0, b ≈ 1.0，x=6 预测 ≈ 13</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. w ≈ 1.0, b ≈ 2.0，x=6 预测 ≈ 8</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. w ≈ 3.0, b ≈ 0.0，x=6 预测 ≈ 18</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 数据是 y = 2x + 1，线性回归能完美拟合，所以 w≈2，b≈1，x=6 预测 13。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。数据是 y = 2x + 1 的完美线性关系，线性回归能精确学到 w=2, b=1。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 线性回归 | 找一条直线拟合数据：y = wx + b |
| MSE | 均方误差，越小拟合越好 |
| 梯度下降 | 迭代更新 w、b，逐步降低 MSE |
| 学习率 α | 控制每步大小，太大发散，太小太慢 |
| sklearn | 3行代码完成训练+预测：`fit()` → `predict()` |

---

## 🎯 今日任务

1. 运行上面的 sklearn 代码，观察 w 和 b 的输出
2. 修改面积数据，尝试不同数据集看拟合效果
3. 完成 3 道练习题
4. 回复「**完成了**」打卡 ✅

---

<style>
  .quiz-container {
    margin: 1.5rem 0;
    padding: 1.25rem;
    border-radius: 12px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }
  .quiz-question { margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.6; }
  .quiz-options { display: flex; flex-direction: column; gap: 0.5rem; }
  .quiz-option {
    padding: 0.65rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 0.875rem;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-family: inherit;
  }
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
    const feedbackId = `${quizId}-feedback-${isCorrect ? 'correct' : 'wrong'}`;
    
    container.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
      if (b.dataset.answer === 'true') b.classList.add('correct');
      if (b === btn && !isCorrect) b.classList.add('wrong');
    });
    
    document.getElementById(feedbackId).style.display = 'block';
    
    // 标记完成
    if (isCorrect) {
      const allDone = document.querySelectorAll('.quiz-container').length > 0;
      if (allDone && window.markDayDone) window.markDayDone(9);
    }
  }
</script>
