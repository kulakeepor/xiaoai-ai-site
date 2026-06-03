---
title: "Day 12 · 无监督学习"
description: "K-Means聚类原理、肘部法则选K、聚类评估指标，附 sklearn 实战"
pubDate: 2026-06-07
section: learn
tags: ["机器学习", "无监督学习", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

理解无监督学习中最常用的聚类任务：
- K-Means 的工作原理
- 如何用肘部法则选择最佳 K 值
- 聚类的评估方法

---

## 1. 什么是无监督学习？

**关键区别**：数据**没有标签**，模型自己发现数据结构

```
监督学习：有 y（标签）→ 模型学"X → y"的映射
无监督学习：只有 X → 模型发现 X 内部的规律
```

**典型任务**：
- **聚类（Clustering）**：把相似的数据自动分组
- **降维（Dimensionality Reduction）**：把高维数据压缩到低维（如 PCA）
- **异常检测（Anomaly Detection）**：发现异常数据点

> 🔑 **核心思想**：没有"正确答案"，让模型自己探索数据的内在结构

---

## 2. K-Means 聚类

**目标**：把数据分成 K 个簇（cluster），每个簇内数据点尽量相似

### 算法步骤

```
1. 随机选择 K 个初始质心（centroid）
2. 分配：把每个数据点分配给最近的质心 → 形成 K 个簇
3. 更新：重新计算每个簇的质心（取均值）
4. 重复 2-3，直到质心不再明显变化
```

### 直观理解

```
初始：随机放K个点作为质心
       ×₁        ×₃
      ×    ×    ×
         ×₂    ×
              ↓
迭代：每个点找最近的质心，重新算中心
     不断重复，直到收敛
```

---

## 3. 如何选 K？（肘部法则）

K 太小 → 欠拟合，K 太大 → 过拟合

**肘部法则（Elbow Method）**：画"簇内误差平方和（SSE）"随 K 变化的曲线

```
SSE = Σ(每个点到所属质心的距离²)

K 增加 → SSE 下降
```

**选择原则**：找曲线"拐点"（像手肘的那个点）

```
SSE
  ↓
  ······
  ···
  ···
  ·············→ K
      ↑ 肘部 = 最佳K
```

---

## 4. sklearn 实战

```python
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

# 1. 生成聚类数据
X, _ = make_blobs(
    n_samples=300, 
    centers=4,      # 真实有4个簇
    cluster_std=1.0,
    random_state=42
)

# 2. 肘部法则：测试不同 K 值
sse = []
silhouette = []
K_range = range(2, 10)

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    sse.append(km.inertia_)  # SSE（簇内误差平方和）
    silhouette.append(silhouette_score(X, km.labels_))

# 3. 打印轮廓系数
for k, s in zip(K_range, silhouette):
    print(f"K={k}: SSE={sse[k-2]:.1f}, 轮廓系数={s:.3f}")

# 4. 用最佳K训练
best_k = 4  # 假设用肘部法则确定K=4
km_best = KMeans(n_clusters=best_k, random_state=42, n_init=10)
labels = km_best.fit_predict(X)
print(f"\n质心坐标:\n{km_best.cluster_centers_}")
```

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>K-Means 是一种监督学习算法。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> K-Means 是无监督学习——数据没有标签，算法自己决定数据点属于哪个簇。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「错误」。K-Means 是无监督学习，数据没有标签，让算法自己发现数据中的簇结构。
  </div>
</div>

---

### 练习 2：肘部法则

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>用肘部法则选 K 时，SSE 随 K 增加怎么变化？K 在哪个点最佳？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. SSE 随 K 增加而增加，K 越大越好</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. SSE 随 K 增加而下降，在拐点（下降速度明显变缓处）最佳</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. SSE 和 K 无关，始终不变</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> K 增加时每个簇变小，SSE 下降。最佳 K 在曲线"拐点"——下降速度从陡变缓的位置（像手肘）。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。肘部法则找 SSE 下降速度明显变缓的拐点——K 太小欠拟合，K 太大过拟合。
  </div>
</div>

---

### 练习 3：代码应用

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 场景题：</strong>某电商平台有用户的浏览、购买、评价数据，想对用户做「用户分群」（如高价值用户、潜力用户、休眠用户），应该用什么算法？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. K-Means 聚类，不需要标签，算法自动把用户分成若干群</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. 逻辑回归，需要先给用户打标签才能训练</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 线性回归，预测用户的购买金额</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 用户分群正是 K-Means 聚类的典型应用——不需要提前知道有哪些类型，让算法自己发现"高价值/潜力/休眠"等用户群。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。用户分群是典型的聚类任务，K-Means 可以把用户自动分成若干群，是电商用户运营的常用手段。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 无监督学习 | 数据无标签，模型自己发现结构 |
| K-Means | 随机K个质心 → 分配 → 更新 → 重复，直到收敛 |
| 肘部法则 | 画SSE-K曲线，找"拐点"确定最佳K |
| 轮廓系数 | 衡量簇内紧密度和簇间分离度，范围[-1,1]，越大越好 |
| 应用场景 | 用户分群、图像压缩、文档聚类、异常检测 |

---

## 🎯 今日任务

1. 运行 sklearn K-Means 代码，用肘部法则找到数据中的最佳 K
2. 修改 `make_blobs` 的 `centers` 参数，观察 K-Means 能否正确识别
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
    if (isCorrect && window.markDayDone) window.markDayDone(12);
  }
</script>
