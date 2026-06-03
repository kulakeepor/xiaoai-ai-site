---
title: "Day 21 · Attention 机制 + Week 3 小测"
description: "Seq2Seq问题、Attention原理、Self-Attention核心思想、Week 3综合小测"
pubDate: 2026-06-16
section: learn
tags: ["深度学习", "Attention", "Week3"]
difficulty: intermediate
---

## 🎯 今日目标

理解 Attention 机制（现代 AI 的核心）：
- Seq2Seq 问题和瓶颈
- Attention 的解决方案
- Self-Attention 的核心原理
- Week 3 综合小测

---

## 1. Seq2Seq 的问题

**Seq2Seq**：输入序列 → Encoder → 上下文向量 → Decoder → 输出序列

```
机器翻译：
"I love AI" → [Encoder] → [c] → [Decoder] → "我爱AI"
```

**瓶颈**：所有信息被压缩到一个固定长度的上下文向量 `c`

```
问题：
- 短句还好，AI 能记住
- 长句/长序列 → c 被"压缩"，信息丢失
- 距离远的词很难关联（如主语和谓语）
```

> 🔑 **这就是 RNN/LSTM 在长序列上表现差的本质原因**

---

## 2. Attention 机制

**核心思想**：不再把所有信息压到一个向量里，而是让 Decoder 每步都能"看"到输入的所有位置

```
传统 Seq2Seq：
  "我爱你" → [Encoder] → [c] → [Decoder] → "I love you"
                    ↑
               只有一个向量

Attention：
  "我爱你" → [Encoder] → h1, h2, h3 → [Decoder] → "I love you"
                                        ↑           ↑
                                      每次看所有h  加权组合
```

**加权组合**：根据当前解码位置，计算对每个输入位置的"关注度"

```
Decoder 位置 3（生成"love"）时：
  对"爱"的关注度 = 0.85
  对"我"的关注度 = 0.10
  对"你"的关注度 = 0.05
  → context = 0.85×h_爱 + 0.10×h_我 + 0.05×h_你
```

---

## 3. Attention 的数学原理

### 三步走

**Step 1：计算 Query、Key、Value**

```
Query (Q) = 当前要生成的位置（来自 Decoder）
Key (K)   = 所有输入位置的"索引"
Value (V) = 所有输入位置的实际内容
```

**Step 2：计算注意力分数**

```
score = Q · Kᵀ   （点积，代表相似度）
```

**Step 3：Softmax 归一化 + 加权求和**

```
注意力权重 = softmax(score / √d_k)
context = Σ(注意力权重_i × Value_i)
```

> 📊 **一句话**：Attention = 用 Query 查 Key，算相似度，取 Value 的加权平均

---

## 4. Self-Attention（自注意力）

**核心区别**：Query、Key、Value 都来自同一个序列

```
Self-Attention：
"I am learning AI"
每个词 -> 查自己和其他词的关系
"learning" 关注 "I"（主语关系）→ 高权重
"learning" 关注 "AI"（宾语关系）→ 高权重
"learning" 关注 "am"（时态关系）→ 较高权重
```

**优势**：
- 任意位置直接交互（摆脱 RNN 的链式依赖）
- 可并行计算（比 RNN 快很多）
- 长距离依赖建模能力强

> 💡 **Transformer = 多层 Self-Attention 堆叠**，这就是 GPT、BERT 等大模型的基础

---

## 5. 代码理解 Attention

```python
import torch
import torch.nn.functional as F
import math

def self_attention(Q, K, V, mask=None):
    """
    Q, K, V: (batch, seq_len, d_k)
    返回: context, attention_weights
    """
    d_k = Q.size(-1)
    
    # 1. 计算点积注意力
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)  # (batch, seq, seq)
    
    # 2. Mask（遮盖未来位置，用于训练）
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # 3. Softmax → 注意力权重
    attention_weights = F.softmax(scores, dim=-1)  # (batch, seq, seq)
    
    # 4. 加权求和
    context = torch.matmul(attention_weights, V)   # (batch, seq, d_v)
    
    return context, attention_weights

# 测试
batch, seq_len, d_k = 2, 5, 8
Q = torch.randn(batch, seq_len, d_k)
K = torch.randn(batch, seq_len, d_k)
V = torch.randn(batch, seq_len, d_k)

context, weights = self_attention(Q, K, V)
print(f"输出形状: {context.shape}")      # (2, 5, 8)
print(f"注意力权重形状: {weights.shape}") # (2, 5, 5)

# 查看某词的注意力分布（如第3个词关注哪些词）
print(f"第3个词的注意力分布: {weights[0, 2, :].numpy()}")
```

---

## 📊 Week 3 综合小测

回复「**我的答案：X A B C...**」（按顺序给10道题答案）

---

**Q1.** 多层神经网络如果不使用激活函数，无论多少层最终等价于什么？

A. 单层感知机（线性）  
B. 多层感知机  
C. 无法确定  

---

**Q2.** ReLU 的优点不包括以下哪一项？

A. 计算极快（一个比较操作）  
B. 输出范围在 (0,1) 之间  
C. 能缓解梯度消失问题  

---

**Q3.** 反向传播（BP）计算梯度的方向是什么？

A. 从输入层到输出层  
B. 从输出层到输入层  
C. 同时从两端向中间  

---

**Q4.** 交叉熵损失函数比 MSE 更适合分类任务，主要因为？

A. 交叉熵计算更简单  
B. 交叉熵在预测错误时梯度更大，收敛更快  
C. MSE 不能用于分类  

---

**Q5.** Momentum 优化器的核心思想是什么？

A. 随机丢弃部分神经元防止过拟合  
B. 累积历史梯度方向，减少震荡，加速收敛  
C. 自适应调整每个参数的学习率  

---

**Q6.** CNN 中，滤波器（Kernel）的权重是如何更新的？

A. 人工设定，不可改变  
B. 与其他神经元一样通过反向传播学习  
C. 随机初始化后固定不变  

---

**Q7.** LSTM 解决 RNN 梯度消失问题的关键是什么？

A. 使用更小的学习率  
B. 用门控机制选择性记住/遗忘信息，避免无效信号传播  
C. 减少网络层数  

---

**Q8.** Attention 机制的核心是什么？

A. 让 Encoder 记住所有信息  
B. 用 Query、Key、Value 的点积相似度，对 Value 做加权求和  
C. 完全替代了 RNN 的循环结构  

---

**Q9.** Self-Attention 和普通 Attention 的区别是？

A. Self-Attention 的 Q、K、V 来自同一个序列  
B. Self-Attention 只能用于图像  
C. Self-Attention 不需要计算点积  

---

**Q10.** 为什么 Transformer 比 RNN 更适合处理长序列？

A. Transformer 层数更多  
B. Transformer 用 Self-Attention 让任意位置直接交互，无链式依赖，可并行计算  
C. RNN 无法处理序列数据  

---

## 📝 今日小结

| 概念 | 理解 |
|------|------|
| Seq2Seq | 编码器-解码器架构，中间用单个向量传递所有信息 |
| Attention | 让 Decoder 每步都能"关注"到输入的所有位置 |
| Q/K/V | Query=查询，Key=索引，Value=内容 |
| Self-Attention | Q、K、V 来自同一个序列，任意位置直接交互 |
| Transformer | 多层 Self-Attention 堆叠，并行计算，取代 RNN |

---

## 🎯 今日任务

1. 运行 Self-Attention 代码，观察注意力权重的分布（越远离对角线的权重越大，说明关注了较远位置）
2. 完成 Week 3 小测（10道题）
3. 回复「**完成了 Week 3**」打卡 ✅

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
    if (isCorrect && window.markDayDone) window.markDayDone(21);
  }
</script>
