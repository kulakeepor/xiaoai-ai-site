---
title: "Day 8 · 机器学习全景图"
description: "从零理解机器学习：监督/无监督/强化学习、训练集划分、欠拟合与过拟合，带互动练习题"
pubDate: 2026-06-03
section: learn
tags: ["机器学习", "入门", "Week2"]
difficulty: beginner
---

## 🎯 今日目标

建立对机器学习的整体认知，知道全貌在哪里，学完能回答：
- 机器学习跟传统编程有什么区别？
- 监督/无监督/强化学习分别是什么？
- 什么是欠拟合和过拟合？

---

## 1. 什么是机器学习？

**传统编程**（人写规则 → 计算机执行）：
```
输入数据 + 人工规则 → 输出结果
```
程序员手写 if-else 规则，适合规则明确的任务（计算器、编译器等）。

**机器学习**（计算机从数据中找规律）：
```
输入数据 + 期望输出 → 计算机自动发现规则 → 预测新数据
```
模型从数据中自动发现规律，适合规则难以描述的任务（识别图片、理解语音、预测房价等）。

> 🔑 **一句话**：机器学习 = 让计算机从数据中**自动找规律**，而不是人写规则。

---

## 2. 机器学习的三大类型

### ① 监督学习（Supervised Learning）

**有老师的学习** —— 每个训练样本都有「正确答案（标签）」。

```
输入：一堆标注了"这是猫/这是狗"的图片
      ↓
模型学习：找出猫和狗的区别规律
      ↓
输出：给新图片，能判断是猫还是狗
```

**典型任务**：分类（判断类别）、回归（预测数值）
**常见算法**：线性回归、逻辑回归、决策树、随机森林、SVM

---

### ② 无监督学习（Unsupervised Learning）

**自学成才** —— 没有标签，让模型自己发现数据结构。

```
输入：一堆没有标注的图片
      ↓
模型学习：自己发现相似性，自动分组
      ↓
输出：把相似的图片自动聚成几组（但不知道每组叫什么名字）
```

**典型任务**：聚类（自动分组）、降维（压缩特征）
**常见算法**：K-Means、层次聚类、PCA

---

### ③ 强化学习（Reinforcement Learning）

**试错学习** —— 通过和环境互动，根据奖励/惩罚调整行为。

```
智能体 → 执行动作 → 环境反馈（奖励或惩罚）→ 调整策略 → 继续尝试
```

**典型例子**：AlphaGo 下棋、机器人走路、游戏 AI
**核心概念**：Agent（智能体）、Environment（环境）、Reward（奖励）、Policy（策略）

---

> 📊 **记忆口诀**：监督 = 有标签（老师批作业），无监督 = 无标签（自学），强化 = 试错（靠反馈）

---

## 3. 数据划分：训练集 / 验证集 / 测试集

把数据分成三份，各司其职：

| 数据集 | 作用 | 大概占比 |
|--------|------|---------|
| **训练集** | 给模型学习的材料 | 70-80% |
| **验证集** | 调参、选模型用（避免测试集信息泄露） | 10-15% |
| **测试集** | 最终评估模型真实效果（**必须没用过的数据**） | 10-15% |

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

> ⚠️ **关键原则**：测试集一定是模型**从头到尾没见过**的数据。如果用测试集调参，你测的是「背答案能力」，不是真实水平。

---

## 4. 欠拟合 vs 过拟合

这是机器学习最核心的概念，也是面试必问。

### 欠拟合（Underfitting）

**模型太简单**，连训练数据都没学好。

```
表现：训练集效果差 ❌，测试集效果也差 ❌
原因：模型表达能力不足 / 特征不够 / 训练不足
解决：换更复杂模型、增加特征、减少正则化
```

### 过拟合（Overfitting）

**模型太复杂**，死记硬背了训练数据，没学会真正的规律。

```
表现：训练集效果好 ✅，测试集效果差 ❌
原因：模型太复杂、训练数据太少、噪声干扰
解决：加正则化、加更多数据、简化模型、用验证集调参
```

### 恰好拟合（Good Fit）

```
表现：训练集效果好 ✅，测试集效果也好 ✅
→ 这就是我们的目标！
```

> 🎨 **图解**：欠拟合 = 画不出轮廓，过拟合 = 死记硬背，恰好 = 真正学会了规律

---

## 🧪 互动练习

### 练习 1：概念题

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>在机器学习中，如果我们用测试集数据来调整模型参数，这种做法是正确的。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">✗ 错误</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 测试集是「最后」的评估数据。如果用测试集调参，就等于「用考题备考」，失去了评估的意义。应该用验证集调参，测试集留到最后一次性使用。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 正确答案是「错误」。测试集应该留到模型训练和调参全部完成后才使用。如果用测试集调参，就失去了独立评估的意义。
  </div>
</div>

---

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 单选题：</strong>以下哪种机器学习类型属于「无监督学习」？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 给模型看标注了「正面/负面」的电影评论，训练情感分类器</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 给模型看大量未标注的客户数据，让它自动把相似客户分成几组</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 训练一个 AlphaGo 下棋，每步根据输赢获得奖励信号</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">D. 用房价历史数据训练模型，预测新房源的价格</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 选项 B 是聚类任务，没有标签，让模型自己发现数据结构——这正是无监督学习的特征。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。「给客户自动分组」是聚类，属于无监督学习——数据没有标签，模型自己发现结构。
  </div>
</div>

---

### 练习 2：代码观察题

```python
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import accuracy_score

# 生成两个半月牙形的数据（非线性）
X, y = make_moons(n_samples=200, noise=0.3, random_state=42)

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 模型1：线性模型（欠拟合示例）
model_lr = LogisticRegression()
model_lr.fit(X_train, y_train)
train_acc = accuracy_score(y_train, model_lr.predict(X_train))
test_acc = accuracy_score(y_test, model_lr.predict(X_test))
print(f"线性模型 - 训练集: {train_acc:.2f}, 测试集: {test_acc:.2f}")

# 模型2：深度决策树（过拟合示例）
model_dt = DecisionTreeRegressor(max_depth=None)  # 不限制深度
model_dt.fit(X_train, y_train)
train_acc2 = accuracy_score(y_train, model_dt.predict(X_train))
test_acc2 = accuracy_score(y_test, model_dt.predict(X_test))
print(f"决策树   - 训练集: {train_acc2:.2f}, 测试集: {test_acc2:.2f}")
```

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>运行上面代码，哪个模型出现了「过拟合」？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">线性模型（LogisticRegression）</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">深度决策树（DecisionTreeRegressor）</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 决策树 max_depth=None 时会不断分裂，直到每个样本都被完美分类——这叫「死记硬背」。训练集准确率接近 100%，但测试集准确率明显下降。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是深度决策树。线性模型因为太简单反而是「欠拟合」，而决策树不限制深度时容易「过拟合」。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 一句话理解 |
|------|-----------|
| 机器学习 | 让计算机从数据中自动找规律 |
| 监督学习 | 有标签，有老师教（分类/回归） |
| 无监督学习 | 无标签，自己发现结构（聚类/降维） |
| 强化学习 | 试错，靠奖励/惩罚信号学习 |
| 欠拟合 | 模型太笨，训练集都学不好 |
| 过拟合 | 模型太聪明，死记硬背训练数据 |
| 训练/验证/测试集 | 7:1.5:1.5，测试集要留到最后 |

---

## 🎯 今日任务

1. 运行上面的代码示例，观察欠拟合和过拟合的输出差异
2. 完成上面的 3 道练习题
3. 回复「**完成了**」就算今日打卡 ✅

---

<style>
  .quiz-container {
    margin: 1.5rem 0;
    padding: 1.25rem;
    border-radius: 12px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }
  
  .quiz-question {
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  
  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
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
  
  .quiz-option:hover {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }
  
  .quiz-option.correct,
  .quiz-option.selected.correct {
    background: #d1fae5;
    border-color: #10b981;
    color: #065f46;
  }
  
  .quiz-option.wrong,
  .quiz-option.selected.wrong {
    background: #fee2e2;
    border-color: #ef4444;
    color: #991b1b;
  }
  
  .quiz-feedback {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .quiz-correct {
    background: #d1fae5;
    color: #065f46;
  }
  
  .quiz-wrong {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .completed-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: #d1fae5;
    color: #065f46;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 500;
  }
</style>

<script>
  // 进度追踪
  const STORAGE_KEY = 'xiaoi-learn-progress';
  const DAY_KEY = 'day8';
  
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
  }
  
  function saveProgress(key, value) {
    const p = getProgress();
    p[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }
  
  // 恢复已完成状态
  const saved = getProgress();
  if (saved[DAY_KEY]) {
    document.querySelectorAll('.quiz-container').forEach(c => {
      c.style.opacity = '0.6';
    });
  }
  
  function checkAnswer(btn, quizId) {
    const isCorrect = btn.dataset.answer === 'true';
    const container = btn.closest('.quiz-container');
    const feedbackId = `${quizId}-feedback-${isCorrect ? 'correct' : 'wrong'}`;
    
    // 禁用所有选项
    container.querySelectorAll('.quiz-option').forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
      if (b.dataset.answer === 'true') b.classList.add('correct');
      if (b === btn && !isCorrect) b.classList.add('wrong');
    });
    
    // 显示反馈
    document.getElementById(feedbackId).style.display = 'block';
    
    // 如果全对，标记完成
    const allContainers = document.querySelectorAll('.quiz-container');
    const allDone = Array.from(allContainers).every(c => 
      c.querySelector('.quiz-feedback[style*="block"], .quiz-feedback:not([style*="display:none"])')
    );
    
    // 检查是否本容器已答对
    const thisCorrect = Array.from(container.querySelectorAll('.quiz-option')).some(b => 
      b.classList.contains('correct')
    );
    
    if (thisCorrect) {
      saveProgress(DAY_KEY, true);
    }
  }
</script>
