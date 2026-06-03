---
title: "Day 18 · 优化器与学习率"
description: "SGD/Adam/RMSProp对比、学习率调度策略、动量概念，对比不同优化器收敛速度"
pubDate: 2026-06-13
section: learn
tags: ["深度学习", "优化器", "Week3"]
difficulty: intermediate
---

## 🎯 今日目标

掌握深度学习中的优化器和学习率策略：
- SGD、Momentum、Adam、RMSProp 的原理
- 学习率调度的策略
- 理解为什么 Adam 是最常用的选择

---

## 1. 标准 SGD（随机梯度下降）

```python
W = W - lr × ∂L/∂W
```

**问题**：
- 收敛慢（每步方向可能不一致）
- 容易陷入局部最优或鞍点
- 对学习率敏感

---

## 2. 带动量的 SGD（Momentum）

**物理类比**：小球下山，有惯性

```python
v = β × v + (1-β) × ∂L/∂W   # 速度（累积历史梯度）
W = W - lr × v               # 用速度更新，而不是瞬时梯度
```

**效果**：
- 减少震荡（方向一致时加速）
- 跳出局部最优（惯性冲出去）
- β 通常取 0.9

```
# 无动量：每步独立方向
↓ ↗ ↑ ↘ ↓ ...

# 有动量：累积方向，平滑收敛
↓ ↓ ↓ ↘ → →
```

---

## 3. RMSProp（自适应学习率）

**问题**：不同参数需要不同的学习率

```python
# 累积梯度平方（对历史梯度做指数加权移动平均）
r = β × r + (1-β) × (∂L/∂W)²

# 用梯度的「均方根」归一化更新
W = W - lr × (∂L/∂W) / √(r + ε)
```

**效果**：
- 梯度大的参数 → 学习率自动变小
- 梯度小的参数 → 学习率自动变大
- 适合非稳态问题（如 RNN）

---

## 4. Adam（Adaptive Moment Estimation）

**当前默认最优选择**，结合 Momentum + RMSProp：

```python
# 1. Momentum（一阶矩估计）
m = β₁ × m + (1-β₁) × ∂L/∂W

# 2. RMSProp（二阶矩估计）
v = β₂ × v + (1-β₂) × (∂L/∂W)²

# 3. 偏差修正（训练初期 m,v 偏向0，需要修正）
m̂ = m / (1 - β₁ᵗ)
v̂ = v / (1 - β₂ᵗ)

# 4. 更新
W = W - lr × m̂ / (√v̂ + ε)
```

**默认参数**：β₁=0.9, β₂=0.999, ε=10⁻⁸

> 💡 **一句话**：Adam = Momentum（累积历史方向）+ RMSProp（自适应缩放学习率）

---

## 5. 学习率调度

固定学习率的缺点：开始时需要大步探索，后期需要小步精调。

### 常见策略

| 策略 | 原理 | 使用场景 |
|------|------|---------|
| **Step Decay** | 每 N 个 epoch 降为 lr×γ | 简单有效 |
| **Cosine Annealing** | 余弦曲线从 lr_max 到 lr_min | PyTorch 常用 |
| **Warmup** | 前期逐渐增大，避免早期震荡 | Transformer 训练 |
| **Reduce on Plateau** | 验证集不提升时降低 lr | 通用 |

```python
# Step Decay 例子
if epoch % 30 == 0:
    lr = lr * 0.5

# Cosine Annealing（PyTorch 内置）
from torch.optim.lr_scheduler import CosineAnnealingLR
scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)
```

---

## 6. 对比实验

```python
import numpy as np
import matplotlib.pyplot as plt

def sgd(theta, grad, lr): return theta - lr * grad
def momentum(theta, v, grad, lr, beta=0.9):
    v[:] = beta * v + (1-beta) * grad
    return theta - lr * v
def rmsprop(theta, r, grad, lr, beta=0.999, eps=1e-8):
    r[:] = beta * r + (1-beta) * grad**2
    return theta - lr * grad / np.sqrt(r + eps)
def adam(theta, m, v, grad, lr, t, beta1=0.9, beta2=0.999, eps=1e-8):
    m[:] = beta1 * m + (1-beta1) * grad
    v[:] = beta2 * v + (1-beta2) * grad**2
    m_hat = m / (1 - beta1**t)
    v_hat = v / (1 - beta2**t)
    return theta - lr * m_hat / np.sqrt(v_hat + eps)

# 目标函数：Rosenbrock 香蕉函数（经典的测试函数）
def rosenbrock(x, y):
    return (1 - x)**2 + 100*(y - x**2)**2

# 梯度
def grad(x, y):
    dx = -2*(1 - x) - 400*x*(y - x**2)
    dy = 200*(y - x**2)
    return np.array([dx, dy])

# 从 (0,0) 开始，不同优化器走100步
starts = [(0, 0)]
optimizers = {
    'SGD(lr=0.001)': lambda θ, *_: sgd(θ, grad(*θ), 0.001),
    'Momentum': lambda θ, v, *_: momentum(θ, v, grad(*θ), 0.01),
    'RMSProp': lambda θ, r, *_: rmsprop(θ, r, grad(*θ), 0.1),
    'Adam': lambda θ, m, v, *_: adam(θ, m, v, grad(*θ), 0.1, 1),
}

for name, opt_fn in optimizers.items():
    θ = np.array([0.0, 0.0])
    if 'Momentum' in name: v = np.zeros(2)
    elif 'RMSProp' in name: r = np.zeros(2)
    elif 'Adam' in name: m, v = np.zeros(2), np.zeros(2)
    
    history = [tuple(θ)]
    for t in range(1, 101):
        if 'Momentum' in name: θ = opt_fn(θ, v)
        elif 'RMSProp' in name: θ = opt_fn(θ, r)
        elif 'Adam' in name: θ = opt_fn(θ, m, v)
        else: θ = opt_fn(θ, None)
        history.append(tuple(θ))
    print(f"{name}: 最终值={θ}, 距离最优(1,1)={[abs(θ[0]-1), abs(θ[1]-1)]}")
```

---

## 🧪 互动练习

### 练习 1：Momentum 原理

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>Momentum 的 β=0.9 是什么意思？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. 每次更新权重保留 10% 的旧值</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 速度累积时，约 90% 来自历史梯度，10% 来自当前梯度</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 学习率降低为原来的 90%</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> v = 0.9×v + 0.1×g，速度 v 约 90% 来自历史累积，10% 来自当前梯度。β 越大，惯性越强。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。v = β×v + (1-β)×g，β=0.9 意味着历史梯度占 90%，当前梯度只占 10%，速度具有很强的惯性。
  </div>
</div>

---

### 练习 2：Adam 组合

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>Adam 结合了 Momentum（一阶矩估计）和 RMSProp（二阶矩估计）的思想。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Adam = Momentum（累积历史梯度方向）+ RMSProp（自适应学习率缩放），兼具两者优点，是目前最常用的优化器。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。Adam 名字中的 "Adaptive Moment Estimation" 正是指它用了一阶矩（Momentum）和二阶矩（RMSProp）的组合。
  </div>
</div>

---

### 练习 3：学习率选择

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>训练神经网络时，为什么学习率不能一直保持不变？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 训练初期需要大学习率快速探索，后期需要小学习率精调收敛</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. 固定学习率会让模型无法收敛</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 学习率必须随训练样本数减少</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 初期大学习率快速接近最优区域，后期小学习率避免在最优解附近震荡无法收敛，这就是学习率调度（LR Schedule）的意义。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。初期需要大学习率快速探索，后期需要小学习率精调——这是学习率调度存在的意义（Cosine Annealing、Step Decay 等）。
  </div>
</div>

---

## 📝 今日小结

| 优化器 | 核心思想 | 适用场景 |
|--------|---------|---------|
| SGD | 原始梯度下降 | 简单任务 |
| Momentum | 累积速度，减少震荡 | 通用 |
| RMSProp | 自适应学习率 | RNN、非稳态 |
| **Adam** | Momentum + RMSProp | **默认首选** |

| 学习率策略 | 说明 |
|-----------|------|
| Step Decay | 每 N epoch 降低 lr |
| Cosine Annealing | 余弦曲线下降 |
| Warmup | 前期逐渐增大 |

---

## 🎯 今日任务

1. 运行对比代码，观察不同优化器在 Rosenbrock 函数上的收敛差异
2. 思考：在实际训练中，为什么 Adam 通常效果最好？
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
    if (isCorrect && window.markDayDone) window.markDayDone(18);
  }
</script>
