---
title: "Day 13 · 模型评估与调优"
description: "混淆矩阵详解、ROC曲线与AUC、交叉验证原理、GridSearch调参，附实战"
pubDate: 2026-06-08
section: learn
tags: ["机器学习", "模型评估", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

掌握模型评估和调优的完整方法：
- 混淆矩阵的完整解读
- ROC 曲线和 AUC 的含义
- 交叉验证的原理和作用
- GridSearchCV 自动调参

---

## 1. 混淆矩阵（Confusion Matrix）详解

|  | 预测：正 | 预测：负 |
|--|---------|---------|
| **实际：正** | TP（真阳性）| FN（假阴性）|
| **实际：负** | FP（假阳性）| TN（真阴性）|

**四个格的含义**：
- **TP**：实际正，预测正 → 找对了 ✅
- **TN**：实际负，预测负 → 找对了 ✅
- **FP**：实际负，预测正 → 误报了 ❌（假警报）
- **FN**：实际正，预测负 → 漏报了 ❌（漏网之鱼）

---

## 2. ROC 曲线与 AUC

**ROC 曲线**（Receiver Operating Characteristic）：

把分类阈值从 0 调到 1，描画出"真阳性率 vs 假阳性率"的曲线

```
Y轴（召回率/TPR）：TP/(TP+FN)  → 找出了多少正样本
X轴（FPR）     ：FP/(FP+TN)  → 误报了多少负样本
```

**AUC**（Area Under Curve）：
- ROC 曲线下的面积
- AUC = 1 → 完美模型
- AUC = 0.5 → 随机瞎猜
- AUC = 0.7~0.8 → 还可以
- AUC = 0.8~0.9 → 很好

> 📊 **一句话**：AUC 越接近 1，模型区分正负样本的能力越强

---

## 3. 为什么需要交叉验证？

**简单划分的问题**：一次 train_test_split 可能刚好切到了"简单"或"难"的数据，导致结果不稳定。

**k 折交叉验证**：

```
数据分成 k 份（比如5份）
→ 取其中 1 份做验证，4 份做训练
→ 重复 k 次，每次选不同的那份做验证
→ 取 k 次结果的平均值
```

```
Fold 1: [验证][训练][训练][训练][训练]
Fold 2: [训练][验证][训练][训练][训练]
Fold 3: [训练][训练][验证][训练][训练]
Fold 4: [训练][训练][训练][验证][训练]
Fold 5: [训练][训练][训练][训练][验证]
         ↓
最终结果 = 平均 k 次的得分
```

**优势**：结果更稳定、充分利用数据（每次都用 n-1 份训练）

---

## 4. GridSearchCV 自动调参

**网格搜索**：把参数所有组合列出来，逐一尝试，找最优

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=500, n_features=10, random_state=42)

# 1. 定义参数网格
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10, None],
    'min_samples_split': [2, 5, 10]
}

# 2. 创建模型
rf = RandomForestClassifier(random_state=42)

# 3. 网格搜索 + 5折交叉验证
grid = GridSearchCV(
    rf, 
    param_grid, 
    cv=5, 
    scoring='accuracy',
    n_jobs=-1  # 用所有CPU核心
)

grid.fit(X, y)

print(f"最佳参数: {grid.best_params_}")
print(f"最佳交叉验证得分: {grid.best_score_:.3f}")
```

> ⚠️ **注意**：GridSearchCV 的结果仍然需要独立的测试集来最终评估，防止信息泄露

---

## 🧪 互动练习

### 练习 1：混淆矩阵

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 计算题：</strong>混淆矩阵如下，求精确率和召回率<br>TP=70, FN=30, FP=15, TN=85</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. 精确率=0.70，召回率=0.82</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 精确率=0.82，召回率=0.70</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 精确率=0.70，召回率=0.85</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 精确率=TP/(TP+FP)=70/(70+15)=0.824，召回率=TP/(TP+FN)=70/(70+30)=0.70。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。精确率=TP/(TP+FP)=70/85≈0.82，召回率=TP/(TP+FN)=70/100=0.70。
  </div>
</div>

---

### 练习 2：AUC 理解

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>AUC=0.3 表示模型比随机猜测（0.5）更差，说明模型有问题，应该反过来用（预测正的当负的，负的当正的）。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">✓ 正确</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> AUC=0.3 意味着模型有逆向判断能力（比瞎猜还差），把预测反转后 AUC 就变成 0.7 了，是一个可用的模型。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是「正确」。AUC=0.3 表示模型反向能力很强，把正负预测反过来就变成 AUC=0.7 的可用模型。
  </div>
</div>

---

### 练习 3：交叉验证

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>交叉验证为什么要把数据分成 k 份，而不是只用一次 train_test_split？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">A. k 折交叉验证计算更快</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">B. 单次划分结果不稳定，k 次平均更可靠，减少运气成分</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 交叉验证可以让模型在更多数据上训练</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 单次划分可能刚好切到"简单"或"困难"的数据，导致结果不稳定。k 折交叉验证通过 k 次不同划分求平均，结果更稳定可靠。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。单次划分有运气成分，k 折交叉验证通过 k 次不同划分求平均，让评估结果更稳定、可信度更高。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 混淆矩阵 | TP/TN/FP/FN 四个格，全面描述分类器表现 |
| 精确率 | 预测为正中，有多少是真阳性（避免假警报）|
| 召回率 | 所有正中，找出了多少（避免漏诊）|
| ROC / AUC | 曲线下面积，越接近 1 越好，0.5=瞎猜 |
| 交叉验证 | k 次划分训练/验证，结果更稳定可靠 |
| GridSearchCV | 参数网格搜索 + 交叉验证，自动找最优参数 |

---

## 🎯 今日任务

1. 运行 GridSearchCV 代码，观察最优参数是什么
2. 用 `make_classification` 生成数据，对比单次划分 vs 5折交叉验证的得分差异
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
    if (isCorrect && window.markDayDone) window.markDayDone(13);
  }
</script>
