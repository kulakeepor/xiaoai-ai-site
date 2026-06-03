---
title: "Day 14 · 正则化与特征工程 + Week 2 小测"
description: "L1/L2正则化原理、特征标准化/归一化、Week 2 综合小测"
pubDate: 2026-06-09
section: learn
tags: ["机器学习", "正则化", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

掌握防止过拟合的两个核心武器，以及 Week 2 综合小测：
- L1/L2 正则化原理
- 特征标准化 vs 归一化
- Week 2 综合测验（10道题）

---

## 1. 正则化：给损失函数加"惩罚项"

**核心思想**：模型过拟合是因为参数太大。正则化 = 在损失函数里加入参数的惩罚，让参数变小。

**无正则化**：
```
Loss = MSE（只关心预测误差）
```

**有正则化**：
```
Loss = MSE + λ × R(w)

R(w) = 惩罚项（参数越大，惩罚越重）
λ   = 正则化强度（超参数，需要调）
```

---

## 2. L1 正则化（Lasso）

```
R(w) = Σ|w_i|   （所有参数绝对值的和）
```

**特点**：
- 会让部分参数直接变成 0 → **特征选择**（自动筛掉不重要特征）
- 产生稀疏解（很多 w = 0）
- 适合特征数量很多、但大部分特征无用的场景

```
Loss = MSE + λ×Σ|w_i|
```

---

## 3. L2 正则化（Ridge）

```
R(w) = Σw_i²    （所有参数平方的和）
```

**特点**：
- 让参数变小，但不会变成 0
- 所有特征都保留，只是权重降低
- 适合特征相关性很强的场景（如多重共线性）

```
Loss = MSE + λ×Σw_i²
```

---

## 4. L1 vs L2 对比

| | L1（Lasso）| L2（Ridge）|
|--|-----------|-----------|
| 惩罚项 | Σ|w| | Σw² |
| 参数结果 | 趋向 0（稀疏）| 趋向小（非零）|
| 作用 | 自动特征选择 | 让所有参数变小 |
| 适用 | 特征多但有用少 | 特征都重要 |

> 💡 **实践中**：ElasticNet = L1 + L2 结合，取两者优点

---

## 5. 特征标准化 vs 归一化

**为什么需要？** 不同特征的数值范围差异巨大，直接用会导致：
- 梯度下降收敛慢
- 大数值特征主导模型

### 标准化（Standardization / Z-score）

```
x' = (x - μ) / σ

均值变成 0，标准差变成 1
```

### 归一化（Normalization / Min-Max）

```
x' = (x - x_min) / (x_max - x_min)

数据压缩到 [0, 1] 区间
```

| | 标准化 | 归一化 |
|--|--------|--------|
| 公式 | (x-μ)/σ | (x-x_min)/(x_max-x_min) |
| 范围 | 近似 [-3, 3] | [0, 1] |
| 适用 | 有 outliers（极端值）| 数据范围已知，无 outliers |
| 算法 | 线性模型、神经网络 | KNN、SVM、神经网络 |

> ⚠️ **树模型（决策树、随机森林）不需要标准化**，树模型基于阈值分裂，对数值范围不敏感

---

## 6. sklearn 实战

```python
from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np

# 生成有噪声的回归数据
X, y = make_regression(n_samples=200, n_features=10, noise=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 标准化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 对比无正则化、L1、L2
from sklearn.linear_model import LinearRegression

models = {
    '无正则化': LinearRegression(),
    'L2 (Ridge, α=1)': Ridge(alpha=1),
    'L1 (Lasso, α=1)': Lasso(alpha=1),
}

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    train_mse = mean_squared_error(y_train, model.predict(X_train_scaled))
    test_mse = mean_squared_error(y_test, model.predict(X_test_scaled))
    print(f"{name} - 训练MSE: {train_mse:.1f}, 测试MSE: {test_mse:.1f}")
    print(f"  参数范围: [{model.coef_.min():.3f}, {model.coef_.max():.3f}]")
    print()
```

---

## 📊 Week 2 综合小测

### 小测说明

回复「**我的答案是：X A B C ...**」（按顺序给出10道题的答案）来提交测验。

---

**Q1.** 机器学习中，把数据划分为训练集、验证集、测试集，主要目的是？

A. 让模型在更多数据上训练  
B. 避免测试集信息泄露，获得可靠评估  
C. 提高模型准确率  

---

**Q2.** 「模型在训练集上表现很好，但在测试集上表现差」，这是什么现象？

A. 欠拟合  
B. 过拟合  
C. 正好拟合  

---

**Q3.** 线性回归预测房价，已知 w=3.5, b=-20，输入面积=80㎡，预测价格是多少？

A. 260万  
B. 280万  
C. 300万  

---

**Q4.** 以下哪种损失函数最适合二分类任务？

A. MSE（均方误差）  
B. BCE（交叉熵）  
C. MAE（平均绝对误差）  

---

**Q5.** 在癌症早筛场景中（漏诊代价极高），应该优先关注哪个指标？

A. 准确率  
B. 精确率  
C. 召回率  

---

**Q6.** K-Means 属于哪种类型的机器学习？

A. 监督学习  
B. 无监督学习  
C. 强化学习  

---

**Q7.** 随机森林通过什么方式提升泛化能力？

A. 增加树的数量  
B. Bootstrap抽样 + 多树投票  
C. 减小树的最大深度  

---

**Q8.** 交叉验证的主要目的是？

A. 减少训练时间  
B. 减少过拟合  
C. 让评估结果更稳定可靠  

---

**Q9.** L1 正则化（Lasso）的主要作用是？

A. 让所有参数变小但不为零  
B. 让部分参数直接变成零（特征选择）  
C. 增加模型复杂度  

---

**Q10.** 树模型（决策树、随机森林）需要对特征做标准化吗？

A. 必须做，否则模型不收敛  
B. 不需要，树模型对数值范围不敏感  
C. 标准化后效果更好，没有例外  

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| L1（Lasso）| 惩罚 Σ\|w\|，让参数变0，自动特征选择 |
| L2（Ridge）| 惩罚 Σw²，让参数变小但不为零 |
| 标准化 | (x-μ)/σ，适合有 outliers 的数据 |
| 归一化 | (x-x_min)/(x_max-x_min)，压缩到 [0,1] |
| 树模型 | 不需要标准化，对数值范围不敏感 |

---

## 🎯 今日任务

1. 运行 sklearn 对比代码，观察 L1/L2 对参数的影响
2. 完成 Week 2 小测（10道题），回复答案
3. 回复「**完成了 Week 2**」打卡 ✅

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
    if (isCorrect && window.markDayDone) window.markDayDone(14);
  }
</script>
