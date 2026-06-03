---
title: "Day 23 · 自动微分 (Autograd)"
description: "PyTorch自动微分核心机制、计算图原理、梯度计算与清零、训练模式与评估模式，用代码理解BP的工程实现"
pubDate: 2026-06-18
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: beginner
---

## 🎯 今日目标

掌握 PyTorch 自动微分机制：
- 计算图（Computational Graph）是什么
- `requires_grad` 和梯度追踪
- 反向传播与 `.backward()`
- 梯度清零与累积
- `torch.no_grad()` 评估模式

---

## 1. 什么是自动微分？

**Day 17 我们学了 BP 的数学原理**——手动链式法则求梯度。

**自动微分（Autograd）** 就是把这个过程自动化：PyTorch 记录所有运算操作，构建计算图，然后自动求导。

```
前向传播（Forward）：
  x → [乘法] → y → [加法] → z
  y = 3x, z = y + 2 = 3x + 2

反向传播（Backward）：
  dz/dx = dz/dy × dy/dx = 1 × 3 = 3

PyTorch 的 Autograd：自动完成以上计算图构建 + 链式求导
```

---

## 2. requires_grad：开启梯度追踪

```python
import torch

# 默认不追踪梯度
x = torch.tensor([1.0, 2.0])    # requires_grad = False
print(x.requires_grad)           # False

# 创建时开启
x = torch.tensor([1.0, 2.0], requires_grad=True)
print(x.requires_grad)           # True

# 或者用 .requires_grad_() 原地开启
y = torch.ones(2)
y.requires_grad_(True)

# 用 requires_grad 创建张量，所有后续操作都会被追踪
a = torch.tensor([2.0], requires_grad=True)
b = torch.tensor([3.0], requires_grad=True)
c = a * b                        # 前向传播，追踪记录
d = c + 1
print(d.grad_fn)                 # <AddBackward0> 记录了运算类型
```

---

## 3. 反向传播：.backward()

```python
# 回顾 Day 17 的例子：L = w₁·x₁ + w₂·x₂，偏导 ∂L/∂w₁ = x₁
x = torch.tensor([1.0, 2.0], requires_grad=True)
w = torch.tensor([0.5, 1.5], requires_grad=True)

L = (w * x).sum()   # L = 0.5×1 + 1.5×2 = 3.5

L.backward()        # 反向传播！

print(w.grad)       # tensor([1., 2.])  → ∂L/∂w = x
print(x.grad)       # tensor([0.5, 1.5]) → ∂L/∂x = w

# 更复杂的例子：MLP 一层
x = torch.randn(3, requires_grad=True)
W = torch.randn(3, 4, requires_grad=True)
b = torch.randn(4, requires_grad=True)

y = x @ W + b                # 矩阵乘法 + 加法
loss = y.sum()

loss.backward()               # 梯度自动计算到 W 和 b
print(W.grad)                 # tensor(...)
print(b.grad)                 # tensor(...)
```

---

## 4. 计算图与原地操作

```python
# 每次调用 .backward() 会释放计算图
# 如果要多次反向传播，需要 retain_graph=True
loss.backward(retain_graph=True)   # 保留计算图，可以再backward一次

# 原地操作要小心！
# ❌ 错误示例：
# x = torch.tensor([1.0], requires_grad=True)
# x.add_(2)    # 原地加法，会报错（计算图冲突）

# ✅ 正确做法：
y = x + 2     # 新建张量，不影响计算图

# detach()：断开梯度追踪
z = x.detach()    # 从计算图分离，不再追踪梯度
```

---

## 5. 梯度清零：optimizer.zero_grad()

```python
# ⚠️ 关键点：梯度会累积，不会自动清零！
# 如果不清零，下一次反向传播会把上一次的结果加上去

w = torch.tensor([1.0], requires_grad=True)
optimizer = torch.optim.SGD([w], lr=0.1)

for epoch in range(3):
    loss = w ** 2          # loss = w²，dL/dw = 2w
    loss.backward()
    print(f"Epoch {epoch}: w.grad = {w.grad}")  # 第一次: 2, 第二次: 4, 第三次: 6 ❌
    optimizer.step()        # w = w - lr * grad
    optimizer.zero_grad()   # ✅ 每次迭代后清零！

# 正确结果：每次迭代梯度都是 2w，w 逐步收敛
```

> 🔑 **梯度累积 = 多步累积在一起再更新**（常用于大 batch 分片训练）
> **梯度清零 = 每步独立更新**（正常训练用法）

---

## 6. torch.no_grad()：评估模式

```python
model = MyModel()

# 训练时：追踪梯度
model.train()          # 显式声明训练模式
for data, target in train_loader:
    optimizer.zero_grad()
    output = model(data)
    loss = criterion(output, target)
    loss.backward()         # ✅ 需要追踪梯度
    optimizer.step()

# 评估时：不追踪梯度（省内存 + 快很多）
model.eval()           # 显式声明评估模式
with torch.no_grad():  # ✅ 关闭梯度追踪
    total_loss = 0
    for data, target in test_loader:
        output = model(data)
        loss = criterion(output, target)
        total_loss += loss.item()

# 推理时也一样
with torch.no_grad():
    prediction = model(input_data)
```

> 📊 **`model.eval()` vs `model.train()`**：eval 模式会关闭 Dropout、BatchNorm 的训练行为；no_grad 只关闭梯度追踪。两者通常一起用。

---

## 🧪 互动练习

### 练习 1：梯度追踪

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>创建张量时，`requires_grad=True` 的作用是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">A. 开启梯度追踪，后续所有操作会被记录，用于自动求导</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">B. 把张量移到 GPU 上</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 锁定张量，使其值不可改变</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> `requires_grad=True` 告诉 PyTorch "这个张量需要被求导"，后续所有操作会记录到计算图中，调用 .backward() 时自动计算梯度。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。requires_grad=True 是开启梯度追踪，和 GPU 无关（那是 .to('cuda')）。
  </div>
</div>

---

### 练习 2：梯度清零

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 实战题：</strong>训练循环中，`optimizer.zero_grad()` 放在哪里？放在 `loss.backward()` 之前还是之后？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. loss.backward() 之后</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. loss.backward() 之前</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 无所谓，前后都可以</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 正确顺序：先 zero_grad() 清零旧梯度 → 再 backward() 计算新梯度 → 最后 step() 更新参数。如果在 backward() 之后清零，当前的梯度就丢了。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。正确顺序：zero_grad() → backward() → step()。先清零旧梯度，再计算新梯度，最后更新参数。
  </div>
</div>

---

### 练习 3：no_grad

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>`torch.no_grad()` 只用于评估阶段，可以省内存和加速，和 Dropout、BatchNorm 的行为无关。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">✗ 不完全对</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 正确理解：no_grad 只关闭梯度追踪。Dropout/BN 的行为由 model.eval() 控制。评估时通常两个都开：model.eval() + with no_grad()。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是"不完全对"。no_grad 只关梯度追踪；Dropout/BN 的训练/评估行为由 model.train() / model.eval() 控制。正确做法：评估 = model.eval() + with no_grad()。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 代码 | 说明 |
|------|------|------|
| 开启追踪 | `x.requires_grad_(True)` | 所有后续操作被记录 |
| 反向传播 | `loss.backward()` | 自动计算所有requires_grad张量的梯度 |
| 梯度清零 | `optimizer.zero_grad()` | 每次迭代前清零，否则梯度累积 |
| 评估模式 | `with torch.no_grad()` | 关闭梯度追踪，省内存加速 |
| 训练模式 | `model.train()` | 开启 Dropout、BN 训练行为 |
| 评估模式 | `model.eval()` | 切换 Dropout、BN 评估行为 |

---

## 🎯 今日任务

1. 运行 PyTorch Autograd 代码，理解计算图的构建和反向传播
2. 尝试修改代码，验证梯度清零/不清零的区别
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
    if (isCorrect && window.markDayDone) window.markDayDone(23);
  }
</script>
