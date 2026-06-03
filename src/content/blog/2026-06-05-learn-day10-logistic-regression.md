---
title: "Day 10 · 逻辑回归与分类"
description: "用逻辑回归做分类：Sigmoid函数、交叉熵损失、准确率/精确率/召回率/F1，附互动练习"
pubDate: 2026-06-05
section: learn
tags: ["机器学习", "分类", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

理解分类任务如何用逻辑回归解决：
- Sigmoid 函数如何把连续值变成概率
- 交叉熵损失是什么
- 分类模型的评估指标：准确率、精确率、召回率、F1

---

## 1. 分类 vs 回归

**回归**：预测连续数值（房价、温度、销售额）

**分类**：预测类别标签（是/否、猫/狗/鸟）

```
线性回归：y = 0.85  →  房价85万
逻辑回归：P(是猫) = 0.92  →  92%概率是猫
```

> 🔑 **关键区别**：回归输出数值，分类输出概率（0~1 之间）

---

## 2. Sigmoid 函数

线性输出是任意实数，分类需要 0~1 的概率。Sigmoid 解决这个问题：

```
σ(x) = 1 / (1 + e^(-x))
```

**几何意义**：把任意实数压缩到 (0, 1) 区间

```
x → -∞    →  σ ≈ 0
x = 0     →  σ = 0.5
x → +∞    →  σ ≈ 1
```

**为什么叫「逻辑回归」？**：它用了 Sigmoid（逻辑函数），所以叫逻辑回归。虽然名字带"回归"，但做的是分类任务。

---

## 3. 决策边界

Sigmoid 输出概率，需要一个阈值来判断类别：

| 概率 P | 预测类别 |
|--------|---------|
| P ≥ 0.5 | 正类（阳性）|
| P < 0.5 | 负类（阴性）|

**例子**：判断邮件是否为垃圾邮件
- P(垃圾) = 0.87 → **预测：垃圾邮件**
- P(垃圾) = 0.23 → **预测：正常邮件**

---

## 4. 交叉熵损失（Binary Cross-Entropy）

分类不用 MSE（容易梯度消失），用交叉熵：

```
BCE = -[ y·log(ŷ) + (1-y)·log(1-ŷ) ]

y = 真实标签（0 或 1）
ŷ = 预测概率
```

**为什么用对数？**：
- 预测越正确，对数损失越接近 0
- 预测越错误，对数损失越趋向无穷大
- 对错误预测惩罚更重

---

## 5. 分类评估指标

### 混淆矩阵

|  | 预测：正 | 预测：负 |
|--|---------|---------|
| **实际：正** | TP（真阳性）| FN（假阴性）|
| **实际：负** | FP（假阳性）| TN（真阴性）|

### 四个核心指标

| 指标 | 公式 | 含义 |
|------|------|------|
| **准确率** | (TP+TN)/(TP+TN+FP+FN) | 整体预测对多少 |
| **精确率** | TP/(TP+FP) | 预测为正的里面，有多少真阳性 |
| **召回率** | TP/(TP+FN) | 所有正样本里，找出了多少 |
| **F1** | 2×(P×R)/(P+R) | 精确率和召回率的调和平均 |

> 📊 **记忆口诀**：准确率 =「你对了吗」，精确率 =「你说正的对了几分」，召回率 =「正的你找出来多少」

---

## 6. sklearn 实战

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, confusion_matrix, classification_report
)

# 1. 生成二分类数据
X, y = make_classification(
    n_samples=500, n_features=10, 
    n_informative=5, random_state=42
)

# 2. 划分训练/测试集
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# 3. 训练逻辑回归
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 4. 预测
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]  # 正类概率

# 5. 评估
print(f"准确率:  {accuracy_score(y_test, y_pred):.3f}")
print(f"精确率:  {precision_score(y_test, y_pred):.3f}")
print(f"召回率:  {recall_score(y_test, y_pred):.3f}")
print(f"F1分数:  {f1_score(y_test, y_pred):.3f}")
print()
print("混淆矩阵:")
print(confusion_matrix(y_test, y_pred))
```

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>逻辑回归（Logistic Regression）是一种回归算法，用来预测连续数值。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 虽然名字带"回归"，但逻辑回归是分类算法！它用 Sigmoid 把输出映射成概率，做二分类。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「错误」。逻辑回归虽然名字带"回归"，但实际上是分类算法，用于二分类任务。
  </div>
</div>

---

### 练习 2：指标理解

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 场景分析：</strong>在癌症筛查中，我们希望尽量找出所有可能的癌症患者，即使误诊率高一些也没关系。应该重点关注哪个指标？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 精确率 - 预测为癌症的里面有多少是真的</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 召回率 - 所有癌症患者里找出了多少</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 准确率 - 整体预测对多少</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 癌症筛查宁可误诊也不能漏诊，所以重点是召回率——把所有癌症患者都找出来，即使有一些误诊也可以接受。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B（召回率）。癌症筛查漏诊的代价极高，宁可多误诊也不能放过，所以要重点关注召回率。
  </div>
</div>

---

### 练习 3：计算题

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 计算题：</strong>假设混淆矩阵为：TP=80, FN=20, FP=10, TN=90。计算准确率和召回率。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. 准确率=0.85，召回率=0.70</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 准确率=0.85，召回率=0.80</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 准确率=0.80，召回率=0.85</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 准确率=(80+90)/(80+90+20+10)=0.85，召回率=80/(80+20)=0.80。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。准确率=(TP+TN)/总数=(80+90)/200=0.85，召回率=TP/(TP+FN)=80/100=0.80。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 逻辑回归 | 用 Sigmoid 把数值变成概率，做二分类 |
| Sigmoid | 把任意实数压缩到 (0,1)，输出概率 |
| 交叉熵 | 分类专用损失函数，对错误预测惩罚更重 |
| 准确率 | 整体对多少，但类别不平衡时会失真 |
| 精确率 | 预测为正中，有多少是真阳性 |
| 召回率 | 所有正中，找出了多少（漏诊代价高时重点关注）|
| F1 | 精确率和召回率的调和平均，平衡两者 |

---

## 🎯 今日任务

1. 运行 sklearn 代码，观察混淆矩阵和各项指标
2. 思考：如果垃圾邮件识别（误判正常邮件为垃圾比漏判更严重），应该关注哪个指标？
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
    if (isCorrect && window.markDayDone) window.markDayDone(10);
  }
</script>
