---
title: "Day 27 · Hugging Face Transformers"
description: "Hugging Face生态、Pipeline快速推理、AutoModel加载、Tokenizer、模型微调与推理实战"
pubDate: 2026-06-22
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: intermediate
---

## 🎯 今日目标

了解 Hugging Face Transformers 生态：
- 为什么 Hugging Face 是 NLP 必备工具
- Pipeline：3行代码完成推理
- AutoModel + AutoTokenizer：通用加载方式
- 模型微调基础
- 常见任务类型

---

## 1. 为什么是 Hugging Face？

Hugging Face = NLP 领域的 PyTorch Hub，提供：

```
① 预训练模型：100,000+ 模型（BERT、GPT、T5、LLama 等）
② Tokenizer：统一分词接口
③ Datasets：海量数据集加载
④ Transformers：统一的模型框架
```

> 🔑 **以前做 NLP：自己实现模型 + 爬数据 + 训练 → Hugging Face：下载预训练模型 + 微调 = 几分钟搞定**

---

## 2. Pipeline：3行代码做推理

```python
from transformers import pipeline

# 情感分类（英文）
classifier = pipeline("sentiment-analysis")
result = classifier("I love using PyTorch and Hugging Face!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

# 情感分类（中文，需要指定模型）
classifier = pipeline("sentiment-analysis",
                     model="uer/roberta-base-finetuned-jd-binary-chinese")
result = classifier("这个产品太棒了，非常好用！")
# [{'label': 'positive', 'score': 0.98...}]

# 问答（给定文本，从文本中找答案）
qa = pipeline("question-answering")
context = "PyTorch is a deep learning framework developed by Meta."
question = "Who developed PyTorch?"
result = qa(question=question, context=context)
# {'answer': 'Meta', 'score': 0.99..., 'start': 44, 'end': 48}

# 文本生成
generator = pipeline("text-generation", model="gpt2")
result = generator("In a shocking finding, scientists discovered that",
                   max_length=50, num_return_sequences=2)

# 翻译
translator = pipeline("translation_en_to_fr")
result = translator("The weather is nice today.")
# [{'translation_text': "Le temps est nice aujourd'hui."}]

# 命名实体识别（NER）
ner = pipeline("ner", grouped_entities=True)
result = ner("Elon Musk is the CEO of Tesla and SpaceX.")
```

---

## 3. AutoModel + AutoTokenizer

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# 指定模型名称（从 Hugging Face Hub 下载）
model_name = "bert-base-uncased"

# 加载 tokenizer（分词器）
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 加载模型（用于分类任务）
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2    # 二分类
)

# 分词
text = "Hugging Face is amazing!"
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)

# 前向传播
outputs = model(**inputs)
print(outputs.logits)   # tensor([[-0.2,  0.5]]) → 第2类概率更高

# 推理
import torch
probs = torch.softmax(outputs.logits, dim=1)
print(probs)   # tensor([[0.32, 0.68]])
```

---

## 4. 模型微调（Fine-tuning）

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from transformers import TrainingArguments, Trainer
from datasets import load_dataset

# 加载数据和模型
dataset = load_dataset("yelp_polarity")   # 情感分析数据集
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# 预处理
def tokenize(batch):
    return tokenizer(batch["text"], padding=True, truncation=True, max_length=256)

dataset = dataset.map(tokenize, batched=True)
dataset.set_format("torch", columns=["input_ids", "attention_mask", "label"])

# 模型
model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=2
)

# 训练配置
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=64,
    learning_rate=2e-5,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

# Trainer（封装了训练循环）
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"].select(range(1000)),  # 快速演示用小数据
    eval_dataset=dataset["test"].select(range(500)),
)

trainer.train()
```

---

## 5. 常见 Pipeline 类型

| 任务 | pipeline name |
|------|--------------|
| 情感分类 | `sentiment-analysis` |
| 文本生成 | `text-generation` |
| 问答 | `question-answering` |
| 翻译 | `translation_en_to_fr` 等 |
| 摘要 | `summarization` |
| 命名实体识别 | `ner` |
| 完形填空 | `fill-mask` |
| 对话 | `conversational` |

---

## 🧪 互动练习

### 练习 1：Pipeline

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>Hugging Face Pipeline 的核心价值是什么？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">A. 把预训练模型 + 分词 + 推理封装成一行调用的极简接口，让没有深度学习背景的人也能快速用上 SOTA 模型</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">B. 替代 PyTorch，成为新的深度学习框架</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 用于数据预处理</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Pipeline 把模型加载 + 分词 + 推理 + 后处理封装成一键调用，降低 NLP 使用门槛。可以理解为"AI 能力的 App Store"。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。Pipeline 的价值是极简化：数据预处理 + 模型加载 + 推理 + 后处理，一行搞定，不需要懂底层。
  </div>
</div>

---

### 练习 2：AutoModel

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 实战题：</strong>`AutoTokenizer.from_pretrained("bert-base-uncased")` 的作用是什么？为什么要先分词再送入模型？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. Tokenizer 负责把文本切分成模型认识的 token（子词），处理未知词（OOV），添加特殊标记（[CLS]、[SEP]）。模型只能处理数字 ID，不能直接处理原始文本。</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. Tokenizer 把文本转成图片，方便模型处理</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. Tokenizer 负责训练模型</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Tokenizer 把文本转为 token ID，处理子词切分、特殊符号（[CLS]/[SEP]/[PAD]）、OOV（用子词表示未知词）。模型只认数字，必须经过 Tokenizer。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。Tokenizer = 文本→数字（token ID），负责子词切分、特殊符号、OOV 处理。模型只能处理数字，必须先分词。
  </div>
</div>

---

### 练习 3：模型 vs Pipeline

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 扩展思考：</strong>什么场景用 Pipeline，什么场景用 AutoModel？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">A. 快速原型/推理/不需要训练 → Pipeline（极简）；需要微调/自定义训练/复杂任务 → AutoModel</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">B. 两者完全等价，随意替换</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">C. Pipeline 比 AutoModel 更快</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> Pipeline 是高级封装，适合快速推理。AutoModel 是底层接口，适合需要自定义训练循环、特征提取、中间层输出等场景。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。Pipeline 适合快速推理；AutoModel 适合需要自定义训练、微调、中间层分析等复杂场景。
  </div>
</div>

---

## 📝 今日小结

| 工具 | 用途 |
|------|------|
| `pipeline` | 极简推理接口，一行搞定常见 NLP 任务 |
| `AutoTokenizer` | 加载与模型配套的分词器 |
| `AutoModel` | 加载预训练模型 |
| `Trainer` | 封装好的训练循环（基于 PyTorch） |
| `Datasets` | Hugging Face 数据集库 |

---

## 🎯 今日任务

1. 安装 `pip install transformers` 并运行情感分类代码
2. 尝试不同的 Pipeline 任务（问答、NER、文本生成）
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
    if (isCorrect && window.markDayDone) window.markDayDone(27);
  }
</script>
