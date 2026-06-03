---
title: "Day 34 · 大语言模型基础"
description: "从 Transformer 到 GPT/BERT：注意力机制回顾、词元化、预训练与微调范式、Hugging Face 实战"
pubDate: 2026-06-29
section: learn
tags: ["LLM", "Transformer", "HuggingFace", "Week5"]
difficulty: advanced
---

## 🎯 今日目标

理解 GPT 和 BERT 的区别，掌握词元化（Tokenization）原理，了解预训练 + 指令微调流程，学会用 Hugging Face Transformers 做文本生成和分类。

---

## 1. Transformer 回顾（Attention 机制）

Day 21 已经学了 Attention 机制。这里做一个快速的系统梳理。

### 1.1 Self-Attention 的核心

```
输入序列：[x1, x2, x3, ...]
输出序列：[y1, y2, y3, ...]，每个 y 由整个输入序列加权决定

Query(Q), Key(K), Value(V)：
- Q = x · W_Q（我在找什么）
- K = x · W_K（我包含什么信息）
- V = x · W_V（我要传递什么信息）

Attention(Q,K,V) = softmax(Q·K^T / √d_k) · V
```

### 1.2 Transformer 的核心模块

```
Transformer Encoder（BERT 用）：
Input → Embedding → Positional Encoding → [N×Encoder Layer] → Output
                                            ↓
                                    Multi-Head Self-Attention
                                    + Add & Norm
                                    + Feed Forward
                                    + Add & Norm

Transformer Decoder（GPT 用）：
Input → Embedding → Positional Encoding → [N×Decoder Layer] → Output
                                            ↓
                                    Masked Self-Attention（遮住未来）
                                    + Cross-Attention（看 Encoder 输出）
                                    + Feed Forward
```

---

## 2. 词元化（Tokenization）

### 2.1 为什么需要 Tokenization？

模型只认识数字，不认识文字。Tokenization 就是把文本切成模型认识的"词块"。

### 2.2 常见 Tokenizer 类型

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

text = "Hello, world! AI is amazing."

tokens = tokenizer.tokenize(text)
print(tokens)
# ['hello', ',', 'world', '!', 'ai', 'is', 'amazing', '.']

ids = tokenizer.encode(text)
print(ids)
# [101, 7592, 1010, 2088, 999, 1040, 2003, 6429, 1012, 102]

decoded = tokenizer.decode(ids)
print(decoded)
# [CLS] Hello, world! AI is amazing. [SEP]
```

### 2.3 BPE / WordPiece / SentencePiece

| 方法 | 代表模型 | 核心思想 |
|------|---------|---------|
| BPE | GPT-2, GPT-3, GPT-4 | 频数合并，词根+词缀 |
| WordPiece | BERT | 最大化词库概率 |
| SentencePiece | T5, XLNet | 基于语言模型，统一处理空格 |

```python
# BPE Tokenizer：英文按子词切分
tokenizer = AutoTokenizer.from_pretrained('gpt2')
print(tokenizer.tokenize("transformers are AMAZING!"))
# ['transform', 'ers', 'Ġare', 'ĠAM', 'AZ', 'ING', '!']
# Ġ 表示空格
# 不认识的词会被切分成子词（解决 OOV 问题）

# 中文 Tokenizer：按字符级别
tokenizer = AutoTokenizer.from_pretrained('bert-base-chinese')
print(tokenizer.tokenize("深度学习很有趣"))
# ['深', '度', '学', '习', '很', '有', '趣']

# 查看词表大小
print(f"词表大小: {tokenizer.vocab_size}")
# BERT: 30522, GPT-2: 50257
```

---

## 3. GPT vs BERT：两种预训练范式

### 3.1 BERT：双向编码器（Encoder-only）

BERT 的训练任务是 **MLM（Masked Language Model）**：随机遮住 15% 的词，让模型预测被遮住的词。

```
输入：[CLS] 我 喜欢 [MASK] 习 [SEP]
目标：预测 [MASK] = "学"

优势：能看到左右两侧上下文（双向）
劣势：不能做文本生成（只适合理解任务）
```

```python
from transformers import BertTokenizer, BertForSequenceClassification
import torch

model_name = 'bert-base-chinese'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)

text = "这部电影太精彩了！"
inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=128)
outputs = model(**inputs)
print(outputs.logits)  # [batch, num_labels]
```

### 3.2 GPT：单向解码器（Decoder-only）

GPT 的训练任务是 **CLM（Causal Language Model）**：给定前文，预测下一个词。

```
输入：[CLS] 我 喜欢 深度
目标：预测下一个词 = "学习"

优势：天然适合文本生成
劣势：只能看到前文（单向），不能同时看全文
```

```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer

model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# 文本生成
input_text = "The future of AI is"
inputs = tokenizer(input_text, return_tensors='pt')

# 生成：方法一：greedy
with torch.no_grad():
    outputs = model.generate(inputs['input_ids'], max_length=30, do_sample=False)
    print(tokenizer.decode(outputs[0]))
    # The future of AI is a term that has been used to describe a range of...

# 生成：方法二：temperature sampling
outputs = model.generate(inputs['input_ids'], max_length=30, do_sample=True, 
                         temperature=0.8, top_k=50)
print(tokenizer.decode(outputs[0]))
```

### 3.3 对比总结

| | BERT | GPT |
|---|---|---|
| 架构 | Encoder-only | Decoder-only |
| 注意力 | 双向（能看到全文） | 单向（只看前文） |
| 预训练任务 | MLM（完形填空） | CLM（预测下一个词） |
| 擅长任务 | 理解：分类、NER、问答 | 生成：写作、代码、对话 |
| 代表模型 | BERT-base/large, RoBERTa | GPT-2/3/4, LLaMA, ChatGLM |
| 参数规模 | 110M ~ 340M | 175B+（GPT-3）|

---

## 4. 预训练 + 指令微调（Pre-train + SFT）

大模型的成本主要在预训练。预训练需要海量的文本数据（CommonCrawl, Wikipedia, BooksCorpus）和巨大的算力（成千上万张 GPU）。

微调（Fine-tuning）则便宜得多：

```python
# 方式一：全参数微调（所有参数都更新）
# 缺点：需要 GPU 显存大（至少 A100 80G × 多卡）

# 方式二：LoRA（Low-Rank Adaptation）—— 参数高效微调
# 核心：冻结原模型参数，只训练低秩矩阵的增量
from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=8,                          # 低秩维度
    lora_alpha=16,                # 缩放因子
    target_modules=['q_proj', 'v_proj'],  # 应用在哪些层
    lora_dropout=0.05,
    task_type='CAUSAL_LM'
)

# 在原模型上套一层 LoRA
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()
# 可训练参数：0.1%（比如 7B 模型只需 70M 参数）
```

---

## 5. Hugging Face Transformers 实战

### 5.1 文本分类（BERT）

```python
from transformers import pipeline

# 方式一：pipeline（最简单，3行搞定）
classifier = pipeline('sentiment-analysis', model='uer/roberta-base-finetuned-jd-binary-chinese')
result = classifier("这个产品非常好用，强烈推荐！")
print(result)
# [{'label': 'positive', 'score': 0.9928}]

# 方式二：AutoModel 加载
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = 'uer/roberta-base-finetuned-jd-binary-chinese'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

text = "差评，东西坏了，质量不行。"
inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=128)
with torch.no_grad():
    logits = model(**inputs).logits
    pred = torch.argmax(logits, dim=1)
print(f"预测: {'positive' if pred==1 else 'negative'}")
```

### 5.2 问答系统

```python
from transformers import pipeline

qa = pipeline('question-answering', model='uer/roberta-base-chinese-finetuned-dianping')
context = """
BERT 是 Google 在 2018 年提出的预训练模型，在 NLP 领域产生了巨大影响。
它创新性地使用 MLM（遮蔽语言模型）任务进行预训练。
"""
question = "BERT 是哪一年提出的？"

result = qa(question=question, context=context)
print(f"答案: {result['answer']}，置信度: {result['score']:.3f}")
# 答案: 2018，置信度: 0.9872
```

### 5.3 文本生成（GPT-2 / ChatGLM）

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# 加载中文 GPT（ChatGLM-3B 需要更多显存，用 smaller 版本演示）
tokenizer = AutoTokenizer.from_pretrained('gpt2-medium-chinese-cluecorpussmall', trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained('gpt2-medium-chinese-cluecorpussmall', trust_remote_code=True)

prompt = "人工智能的发展将"
inputs = tokenizer(prompt, return_tensors='pt')
outputs = model.generate(inputs['input_ids'], max_length=50, do_sample=True, temperature=0.9)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

---

## 🧪 练习题

**Q1.** BERT 和 GPT 的核心区别是？

A.BERT 用 Decoder，GPT 用 Encoder  
B.BERT 是双向注意，MLM 预训练；GPT 是单向注意，CLM 预训练  
C.BERT 只能做生成，GPT 只能做分类  
D.GPT 的词表比 BERT 大  

---

**Q2.** Tokenizer 的 BPE 算法核心思想是？

A.按空格分词  
B.按中文字符分词  
C.频数最高的词片优先保留，其余切分  
D.按标点符号分词  

---

**Q3.** LoRA 微调的核心优势是？

A.比全参数微调精度更高  
B.冻结原模型，只训练少量低秩矩阵，大幅降低显存需求  
C.不需要 GPU  
D.训练速度更快且不需要数据  

---

## 📝 今日小结

| 概念 | 核心要点 |
|------|---------|
| Tokenization | 把文本切成子词（BPE/WordPiece），解决 OOV |
| BERT | Encoder 双向，MLM 任务，理解任务强 |
| GPT | Decoder 单向，CLM 任务，生成任务强 |
| LoRA | 低秩矩阵微调，0.1% 参数即可微调大模型 |
| HuggingFace | `pipeline`、`AutoModel`、`AutoTokenizer` 三件套 |

---

## 🎯 今日任务

1. 用 `bert-base-chinese` tokenizer 对中文句子分词，观察词表
2. 用 GPT-2 生成一段文本，尝试不同的 `temperature` 和 `top_k` 值
3. 理解"预训练"和"微调"的区别：预训练学什么？微调学什么？
4. 回复「**Day 34 完成**」打卡 ✅
