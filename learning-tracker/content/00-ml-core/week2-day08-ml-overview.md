# 📚 AI 学习内容创作 · Week 2

**学习路径**：从零基础到读懂 AI 论文  
**当前阶段**：Week 2 · 机器学习核心概念（Day 8-14）  
**起始日**：2026-06-03  
**学习原则**：边理论边代码，每天一个小目标

---

## 📖 Week 2 目录

| Day | 日期 | 主题 | 状态 |
|-----|------|------|------|
| Day 8 | 06-03 | 机器学习全景图 | 🔄 创作中 |
| Day 9 | 06-04 | 线性回归 | ⬜ |
| Day 10 | 06-05 | 逻辑回归与分类 | ⬜ |
| Day 11 | 06-06 | 决策树与随机森林 | ⬜ |
| Day 12 | 06-07 | 无监督学习 | ⬜ |
| Day 13 | 06-08 | 模型评估与调优 | ⬜ |
| Day 14 | 06-09 | 正则化与特征工程 + Week 2 小测 | ⬜ |

---

## Day 8 · 机器学习全景图

**🎯 今日目标**：建立对机器学习的整体认知，知道全貌在哪里

### 核心概念

#### 1. 什么是机器学习？（对比规则编程）

**规则编程**（传统方式）：
```
输入 → 人工写的规则 → 输出
```
程序员手写 if-else 规则，适合规则明确的任务（如：计算器）

**机器学习**：
```
输入 + 输出（数据） → 模型自动学习规则 → 输出/预测
```
模型从数据中自动发现规律，适合规则难以明确描述的任务（如：识别猫狗图片）

> 🔑 **一句话理解**：机器学习 = 让计算机从数据中自动找规律，而不是人写规则

---

#### 2. 机器学习的三大类型

**① 监督学习（Supervised Learning）**
- 学习数据：输入 + **有标签的输出**
- 例子：教模型认识猫 → 给它看1000张标注了"这是猫/这是狗"的图片
- 典型任务：分类（判断类别）、回归（预测数值）

**② 无监督学习（Unsupervised Learning）**
- 学习数据：输入 + **没有标签**
- 例子：让模型自己发现数据的结构
- 典型任务：聚类（自动分组）、降维（压缩特征）

**③ 强化学习（Reinforcement Learning）**
- 学习方式：通过**与环境互动**，根据奖励/惩罚调整行为
- 例子：AlphaGo 下棋，每步根据胜负获得反馈
- 典型任务：游戏 AI、机器人控制

> 📊 **快速记忆**：监督 = 有老师（带标签），无监督 = 自学（无标签），强化 = 试错（靠反馈）

---

#### 3. 训练集 / 验证集 / 测试集

把数据分成三份，这是机器学习的基本功：

| 数据集 | 作用 | 占比 |
|--------|------|------|
| **训练集** | 模型学习的材料 | ~70-80% |
| **验证集** | 调参和选模型用 | ~10-15% |
| **测试集** | 最终评估模型真实效果 | ~10-15% |

> ⚠️ **重要原则**：测试集一定要是模型**从头到尾没见过**的数据，否则你测的是"背答案"，不是真实能力

---

#### 4. 欠拟合 vs 过拟合

这是初学者最容易踩的坑，也是面试必问：

**欠拟合（Underfitting）**
- 模型太简单，没学好
- 表现：训练集、测试集效果都不好
- 解决：换更复杂的模型、增加特征、减少正则化

**过拟合（Overfitting）**
- 模型太复杂，死记硬背了训练数据
- 表现：训练集效果很好，测试集效果差
- 解决：加正则化、加数据、简化模型

> 🎨 **一句话图解**：欠拟合 = 画不出轮廓，过拟合 = 死记硬背，恰好拟合 = 学会了规律

---

### 🧪 代码演示：过拟合与欠拟合

```python
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# 1. 生成非线性数据（两个半月牙形）
X, y = make_moons(n_samples=200, noise=0.3, random_state=42)

# 2. 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. 欠拟合示例：线性模型（太简单）
model_under = LogisticRegression()
model_under.fit(X_train, y_train)
print(f"欠拟合 - 训练集准确率: {accuracy_score(y_train, model_under.predict(X_train)):.2f}")
print(f"欠拟合 - 测试集准确率: {accuracy_score(y_test, model_under.predict(X_test)):.2f}")

# 4. 过拟合示例：深度决策树（太复杂）
model_over = DecisionTreeRegressor(max_depth=None)  # 不限制深度
model_over.fit(X_train, y_train)
print(f"过拟合 - 训练集准确率: {accuracy_score(y_train, model_over.predict(X_train)):.2f}")
print(f"过拟合 - 测试集准确率: {accuracy_score(y_test, model_over.predict(X_test)):.2f}")
```

**预期输出**：
```
欠拟合 - 训练集准确率: 0.82, 测试集准确率: 0.80
过拟合 - 训练集准确率: 1.00, 测试集准确率: 0.72
```

---

### 📝 今日练习

**概念题**：为什么测试集准确率高、训练集准确率低是欠拟合的表现？

**代码题**：用 sklearn 生成 `make_circles` 数据（类似圆环），分别用 LogisticRegression 和更复杂的模型训练，观察过拟合/欠拟合现象。

---

### 📚 推荐资源

- **B站**：[3Blue1Brown 机器学习系列](https://www.bilibili.com/video/BV1tX4y1x7mM)（形象理解ML整体框架）
- **文档**：[Scikit-learn 官方教程 - 机器学习入门](https://scikit-learn.org/stable/tutorial/statistical_inference/index.html)

---

*创作状态：✅ 内容已创作，等待学员（申亮）学习 + 反馈*
*下次推送时间：2026-06-04 10:00*
