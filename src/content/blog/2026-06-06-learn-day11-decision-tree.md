---
title: "Day 11 · 决策树与随机森林"
description: "决策树构造过程、信息增益与熵、随机森林集成思想，附 sklearn 实战"
pubDate: 2026-06-06
section: learn
tags: ["机器学习", "集成学习", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

理解决策树和随机森林：
- 什么是信息熵和信息增益
- 决策树如何自动选择分裂特征
- 随机森林为什么比单棵决策树更强

---

## 1. 什么是决策树？

**本质**：一系列 if-else 规则的可视化树状结构

**例子**：判断一个人是否愿意买健身课

```
年龄 < 30?
├── 否 → 有空闲时间?
│         ├── 否 → 不买
│         └── 是 → 买 ✅
└── 是 → 月收入 > 8000?
          ├── 否 → 可能会买
          └── 是 → 买 ✅
```

> 🔑 **直观理解**：从根节点开始，每个节点问一个问题，根据答案往下走，最后叶子节点给出预测结果。

---

## 2. 信息熵（Entropy）

**熵**：描述数据"混乱程度"的指标

```
H = -Σ p_i × log₂(p_i)

p_i = 第 i 类在数据中出现的比例
```

**几何意义**：
- 数据完全纯净（同一类）→ 熵 = 0
- 数据完全混乱（各类均匀）→ 熵 = 1
- 熵越高，数据越混乱

**例子**：
- 数据集全是"买" → H = 0（纯净）
- 数据集买/不买各一半 → H = 1（最混乱）

---

## 3. 信息增益（Information Gain）

决策树在每个节点问"哪个问题最好"？用信息增益判断：

```
信息增益 = 父节点熵 - 加权平均子节点熵

→ 分裂后熵降低越多（数据越纯净），信息增益越大
```

**构建过程**：
1. 计算当前节点的熵
2. 对每个可能的分裂方式，计算加权子节点熵
3. 信息增益 = 当前熵 - 加权子节点熵
4. **选择信息增益最大的特征进行分裂**
5. 递归重复，直到满足停止条件

> 🔑 **一句话**：决策树是一个"不断问问题、让数据越来越纯净"的算法

---

## 4. 决策树的常见问题

### 过拟合

树太深，记住了个别样本的噪声。

**解决**：限制树的深度（`max_depth`）、最小样本数（`min_samples_split`）

### 偏向于多值特征

有些特征取值很多（如"用户ID"），会人为拉高信息增益。

**解决**：用信息增益率（Gini Impurity 的改进）代替信息增益

---

## 5. 随机森林（Random Forest）

**核心思想**：一群树投票，比一棵树的判断更可靠

```
随机森林 = Bootstrap + 随机特征选择 + 投票

1. Bootstrap：从数据中有放回抽样，每棵树的训练数据略有不同
2. 随机特征：每棵树只用到部分特征（增加多样性）
3. 投票：所有树的预测结果众数输出
```

**为什么更强**：
- 单棵树：错误决策影响大
- 森林：多数树对 → 错误被抵消

**sklearn 参数**：
- `n_estimators`：树的数量（越多越好，但有上限）
- `max_depth`：每棵树的深度限制
- `min_samples_split`：节点分裂所需最小样本数

---

## 6. sklearn 实战：鸢尾花分类

```python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. 加载数据
iris = load_iris()
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. 单棵决策树
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)
dt_pred = dt.predict(X_test)
print(f"决策树准确率: {accuracy_score(y_test, dt_pred):.3f}")

# 3. 随机森林
rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)
print(f"随机森林准确率: {accuracy_score(y_test, rf_pred):.3f}")

# 4. 特征重要性
print(f"\n特征重要性: {dict(zip(iris.feature_names, rf.feature_importances_))}")
```

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>决策树在选择分裂特征时，用什么标准来判断"哪个特征最好"？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. 分裂后节点数量最多的特征</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">B. 分裂后树深度最浅的特征</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">C. 分裂后信息增益最大的特征（数据最纯净）</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 决策树选择使信息增益最大的特征进行分裂——即让子节点比父节点更纯净的特征。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 C。决策树用信息增益（分裂后熵降低程度）判断特征好坏，选择让数据最纯净的分裂方式。
  </div>
</div>

---

### 练习 2：随机森林优势

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>随机森林为什么比单棵决策树更不容易过拟合？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 随机森林的每棵树都更深更大</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 多棵树独立预测后投票，个别树的错误被抵消</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 随机森林使用了更复杂的损失函数</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 随机森林通过 Bootstrap 抽样和随机特征选择让每棵树略有不同，投票机制使多数正确的判断占主导，错误决策被分散抵消。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。随机森林通过集成多棵树的投票来抵消单棵树的错误预测，降低了过拟合风险。
  </div>
</div>

---

### 练习 3：代码观察

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_moons(n_samples=500, noise=0.4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 无限深度的树（容易过拟合）
dt = DecisionTreeClassifier(max_depth=None, random_state=42)
dt.fit(X_train, y_train)
print(f"深树 - 训练: {accuracy_score(y_train, dt.predict(X_train)):.3f}, 测试: {accuracy_score(y_test, dt.predict(X_test)):.3f}")

# 限制深度
dt2 = DecisionTreeClassifier(max_depth=5, random_state=42)
dt2.fit(X_train, y_train)
print(f"浅树 - 训练: {accuracy_score(y_train, dt2.predict(X_train)):.3f}, 测试: {accuracy_score(y_test, dt2.predict(X_test)):.3f}")

# 随机森林
rf = RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42)
rf.fit(X_train, y_train)
print(f"森林 - 训练: {accuracy_score(y_train, rf.predict(X_train)):.3f}, 测试: {accuracy_score(y_test, rf.predict(X_test)):.3f}")
```

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>运行上面代码，「深树」和「森林」的测试集准确率哪个更高？为什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. 森林更高，因为集成抵消了过拟合</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. 深树更高，因为不受任何限制更灵活</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. 两者相同，因为用了同样的训练数据</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 即使随机森林里的每棵树都是无限深度（max_depth=None），整体测试准确率也会高于单棵深树——因为多棵树投票把单棵树过拟合的噪声抵消了。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。随机森林的多树投票机制能有效抑制单棵树的过拟合，即使每棵树都无深度限制，整体泛化能力仍然更强。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 信息熵 | 数据的混乱程度，0=纯净，1=最混乱 |
| 信息增益 | 分裂后熵降低多少，选择使数据更纯净的特征 |
| 决策树 | 递归问问题，让数据越来越纯净 |
| 随机森林 | 多棵不同决策树投票，抵消错误，提升泛化能力 |
| Bootstrap | 有放回抽样，让每棵树训练数据略有不同 |

---

## 🎯 今日任务

1. 运行鸢尾花分类代码，对比决策树和随机森林准确率
2. 运行月亮数据集代码，观察过拟合现象
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
    if (isCorrect && window.markDayDone) window.markDayDone(11);
  }
</script>
