---
title: "Day 20 · RNN/LSTM（序列模型）"
description: "序列数据处理思维、RNN梯度消失问题、LSTM门机制原理，用PyTorch搭建LSTM文本分类器"
pubDate: 2026-06-15
section: learn
tags: ["深度学习", "RNN", "LSTM", "Week3"]
difficulty: intermediate
---

## 🎯 今日目标

理解决序列模型的核心概念：
- 序列数据的独特性
- RNN 的结构和梯度消失问题
- LSTM/GRU 的门机制原理
- 用 PyTorch 搭建 LSTM 文本分类器

---

## 1. 序列数据的独特性

**传统 ML/CNN 的问题**：假设样本之间独立

**序列数据**：前面和后面有关联（时间依赖）
```
文本：今天天气很____（填什么？要看前文）
股价：昨天跌了，今天可能还____
语音：前几个音节决定下一个音节
```

**序列模型的目标**：处理"变长输入 + 考虑上下文"

---

## 2. RNN 结构

**核心思想**：每个时间步的隐藏状态包含历史信息

```
x₁ → [RNN] → h₁
        ↓
x₂ → [RNN] → h₂  (h₁ 作为记忆传入)
        ↓
x₃ → [RNN] → h₃  (h₂ 作为记忆传入)
```

**公式**：
```
h_t = tanh(W_xh · x_t + W_hh · h_{t-1} + b)
```

> 🔑 **RNN 的问题是**：梯度会随时间反向传播连乘，导致梯度消失或爆炸

---

## 3. RNN 的梯度消失问题

**问题本质**：沿时间反向传播（BPTT）

```
∂L/∂W = Σ (∂L_t / ∂W) 
       = Σ (∂L_t / ∂h_t) × (∂h_t / ∂h_{t-1}) × ... × (∂h_1 / ∂W)
```

其中 `∂h_t/∂h_{t-1}` 包含 W 的连乘：

```
∂h_t/∂h_{t-1} = tanh' × W
               ≈ W（tanh' ≈ 1）
```

- W > 1 → 梯度爆炸（数值爆炸，无法训练）
- W < 1 → 梯度消失（早期信号传不回去，长依赖丢失）

**长依赖丢失**：
```
文本：今天早上我吃了[包子]，很饱。到了晚上我吃了[披萨]。
RNN：记住[包子]，但到"晚上"时信息早消失了 → 忘了早上吃了什么
```

---

## 4. LSTM：门控机制

**核心思想**：让网络自己决定什么该记住、什么该忘记

LSTM 有三个门：

### ① 遗忘门（Forget Gate）
```
f = σ(W_f · [h_{t-1}, x_t] + b_f)
```
决定细胞状态中**什么信息要丢弃**（0=完全遗忘，1=完全保留）

### ② 输入门（Input Gate）
```
i = σ(W_i · [h_{t-1}, x_t] + b_i)
C̃ = tanh(W_C · [h_{t-1}, x_t] + b_C)
```
决定**什么新信息**要写入

### ③ 输出门（Output Gate）
```
o = σ(W_o · [h_{t-1}, x_t] + b_o)
h_t = o × tanh(C_t)
```
决定**输出什么**（基于当前细胞状态）

### 细胞状态更新
```
C_t = f × C_{t-1} + i × C̃
```

> 💡 **类比**：遗忘门像"橡皮擦"，输入门像"笔"，细胞状态像"草稿纸"

---

## 5. PyTorch LSTM 文本分类

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from collections import Counter
import re

# 简易文本分类（情感分析：正面/负面）
class TextClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes=2):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(hidden_dim * 2, num_classes)  # bidirectional → ×2
    
    def forward(self, x):
        # x: (batch, seq_len)
        embedded = self.embedding(x)                      # (batch, seq_len, embed_dim)
        output, (hidden, cell) = self.lstm(embedded)       # LSTM 输出
        # 双向拼接最后隐藏状态
        hidden = torch.cat((hidden[-2], hidden[-1]), dim=1)  # (batch, hidden*2)
        return self.fc(hidden)

# 简单分词 + 词表构建
def tokenize(text):
    return re.findall(r'\w+', text.lower())

# 训练
model = TextClassifier(vocab_size=5000, embed_dim=64, hidden_dim=128)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

# 示例输入
batch = torch.randint(1, 1000, (32, 20))  # batch=32, seq_len=20
target = torch.randint(0, 2, (32,))

model.train()
optimizer.zero_grad()
output = model(batch)  # (32, 2)
loss = criterion(output, target)
loss.backward()
optimizer.step()

print(f"批次损失: {loss.item():.4f}")
```

---

## 🧪 互动练习

### 练习 1：RNN vs LSTM

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>RNN 难以处理长序列的根本原因是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 梯度沿时间反向传播时连乘，导致梯度消失/爆炸</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. RNN 只能处理固定长度的序列</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. RNN 的激活函数用错了</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> BPTT 时 `∂h_t/∂h_{t-1}` 的连乘导致梯度指数级变化——这就是 RNN 梯度消失/爆炸的根源，也是 LSTM 用门机制解决的核心问题。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。RNN 梯度消失的根源是 BPTT 时 ∂h_t/∂h_{t-1} 随时间步指数级衰减或爆炸，LSTM 的门控机制从根本上解决了这个问题。
  </div>
</div>

---

### 练习 2：LSTM 门的作用

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 分析题：</strong>LSTM 的遗忘门（Forget Gate）输出接近 0 意味着什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. 当前输入被忽略</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. 细胞状态中的历史信息被"擦除"或遗忘</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 神经元永久死亡</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 遗忘门 f_t = σ(W_f·[h_{t-1}, x_t])，f_t 接近 0 意味着细胞状态 C_{t-1} 被清零，历史信息被选择性遗忘。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。遗忘门控制细胞状态的保留程度（f_t × C_{t-1}），接近 0 表示完全遗忘历史。
  </div>
</div>

---

### 练习 3：Transformer vs RNN

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 扩展思考：</strong>现在 NLP 主流是 Transformer，RNN/LSTM 为什么被取代了？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. Transformer 用 Self-Attention 并行计算，解决了 RNN 的长依赖问题，同时训练速度更快</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. LSTM 太复杂，计算成本太高</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. RNN/LSTM 的精度太低</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Transformer 的 Self-Attention 让任意位置可以直接交互（摆脱了 RNN 的链式传递），并行度高、长依赖建模能力强，所以成为 NLP 主流。明天 Day 21 就讲 Attention！
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。Transformer 用 Self-Attention 直接建模任意位置之间的关系，并行计算效率高，长依赖问题比 RNN 更彻底，所以成为 NLP 主流。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| 序列模型 | 处理变长输入 + 考虑上下文依赖 |
| RNN | 隐藏状态包含历史，链式传递信息 |
| BPTT | 沿时间反向传播，梯度消失/爆炸的根源 |
| LSTM | 门控机制（遗忘/输入/输出）选择性记忆 |
| 遗忘门 | 决定丢弃哪些历史信息（0=全忘，1=全记）|
| 细胞状态 | LSTM 的"记忆总线"，贯穿整个序列 |

---

## 🎯 今日任务

1. 运行 PyTorch LSTM 代码，观察前向传播是否正常
2. 思考：如果要预测"今天天气很____"，RNN 和 LSTM 分别是怎么记住"天气"这个词的？
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
    if (isCorrect && window.markDayDone) window.markDayDone(20);
  }
</script>
