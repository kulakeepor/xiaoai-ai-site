---
title: "Day 26 · 迁移学习与 Fine-tuning"
description: "迁移学习核心思想、预训练模型加载、特征提取与微调策略、torchvision模型库实战"
pubDate: 2026-06-21
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: intermediate
---

## 🎯 今日目标

掌握迁移学习和微调的工程实践：
- 迁移学习的核心思想
- 预训练模型的加载与使用
- 两种模式：特征提取 vs 微调（Fine-tune）
- torchvision 内置预训练模型
- 常见陷阱与注意事项

---

## 1. 迁移学习的核心思想

**传统做法**：从零训练，数据少容易过拟合

**迁移学习**：站在巨人的肩膀上
```
ImageNet 预训练模型：
- 学过 120 万张图片，1000 个类别
- 学到了丰富的视觉特征（边缘、纹理、形状、物体部件）

新任务（猫狗分类，只有 1 万张图）：
- 复用预训练学到的特征 + 只训练自己的分类层
- 用少量数据就能达到好效果
```

> 🔑 **迁移学习 = 把预训练模型的知识迁移到新任务**，数据少时尤其关键

---

## 2. torchvision 预训练模型

```python
import torchvision.models as models

# 加载预训练 ResNet-18（ImageNet 1000 类）
model = models.resnet18(weights='IMAGENET1K_V1')
print(model)   # 看到最后的 fc 层是 1000 维

# 常用预训练模型
resnet18  = models.resnet18(weights='IMAGENET1K_V1')
resnet34  = models.resnet34(weights='IMAGENET1K_V1')
resnet50  = models.resnet50(weights='IMAGENET1K_V1')
vgg16     = models.vgg16(weights='IMAGENET1K_V1')
densenet  = models.densenet121(weights='IMAGENET1K_V1')
mobilenet = models.mobilenet_v2(weights='IMAGENET1K_V1')
efficientnet = models.efficientnet_b0(weights='IMAGENET1K_V1')

# 加载不带权重的（随机初始化，用于从零训练）
model = models.resnet18(weights=None)

# 查看模型最后层（分类头）
print(model.fc)   # Linear(in_features=512, out_features=1000, bias=True)
```

---

## 3. 模式一：特征提取（Feature Extraction）

**冻结 backbone，只训练新加的分类头**

```python
import torch.nn as nn
from torchvision import models

# 加载预训练模型
model = models.resnet18(weights='IMAGENET1K_V1')

# 冻结所有参数（不更新梯度）
for param in model.parameters():
    param.requires_grad = False

# 替换最后的分类头（ImageNet 1000类 → 猫狗 2类）
in_features = model.fc.in_features      # 512
model.fc = nn.Linear(in_features, 2)    # 新分类层，默认 requires_grad=True

# 此时只有 model.fc 的参数会更新
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)

# 训练（只更新最后一层）
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)          # 前向
    loss = nn.CrossEntropyLoss()(outputs, labels)
    loss.backward()                   # 反向（只有 fc 的梯度）
    optimizer.step()
```

> 💡 **特征提取适合**：新任务的数据少、预训练模型和目标任务相似度高

---

## 4. 模式二：微调（Fine-tuning）

**解冻部分或全部层，全模型训练**

```python
model = models.resnet18(weights='IMAGENET1K_V1')

# 方案 A：微调最后几层（较常用）
# 冻结前面的层，微调后面的层
for param in model.parameters():
    param.requires_grad = False

# ResNet 的结构：conv1→bn1→relu→maxpool→layer1→layer2→layer3→layer4→avgpool→fc
# 解冻 layer4（最后的残差块）和 fc
for param in model.layer4.parameters():
    param.requires_grad = True
for param in model.fc.parameters():
    param.requires_grad = True

optimizer = torch.optim.Adam([
    {'params': model.layer4.parameters(), 'lr': 1e-4},   # 低学习率
    {'params': model.fc.parameters(), 'lr': 1e-3}        # 较高学习率
])

# 方案 B：全模型微调（当数据充足时）
model = models.resnet18(weights='IMAGENET1K_V1')
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)  # 全模型用更小的学习率
```

> 💡 **微调策略**：
> - 层越靠后，学习率越高（浅层学通用特征不需大改）
> - 常用学习率： backbone 1e-4 ~ 5e-5，头部 1e-3 ~ 1e-4

---

## 5. 实战：猫狗二分类

```python
import torchvision.models as models
import torch.nn as nn

# 加载预训练 ResNet-18
model = models.resnet18(weights='IMAGENET1K_V1')

# 替换分类头：1000类 → 2类
in_features = model.fc.in_features   # 512
model.fc = nn.Linear(in_features, 2)  # 猫/狗

# 训练配置
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# 训练循环
for epoch in range(10):
    model.train()
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    
    # 验证
    model.eval()
    correct = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            pred = outputs.argmax(dim=1)
            correct += pred.eq(labels).sum().item()
    
    print(f"Epoch {epoch+1}: 准确率 = {100*correct/len(val_ds):.2f}%")

# 保存
torch.save(model.state_dict(), 'cat_dog_model.pt')

# 加载（用于推理）
model.load_state_dict(torch.load('cat_dog_model.pt'))
model.eval()
```

---

## 🧪 互动练习

### 练习 1：迁移学习原理

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>迁移学习为什么在小数据集上特别有效？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. 预训练模型记忆了大量数据，直接复用不需要训练</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. 预训练模型在 ImageNet 上学到了通用的视觉特征（边缘、纹理、形状），这些特征对大多数图像任务都有用，只需要微调分类头</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. 小数据集上无法训练，只能用预训练模型</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> ImageNet 特征是通用的（边缘→纹理→部件→物体层级），新任务只需在预训练特征基础上加自己的分类头，微调即可。小数据也能训得动。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。预训练模型学到的特征是通用的（边缘、纹理等底层特征→高层语义），这些特征大多数视觉任务都通用，所以迁移有效。
  </div>
</div>

---

### 练习 2：特征提取 vs 微调

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 实战题：</strong>特征提取（冻结 backbone）和微调（全模型训练）分别适合什么场景？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">A. 数据少 + 任务相似 → 特征提取；数据多 + 任务差异大 → 微调</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">B. 数据少 → 微调；数据多 → 特征提取</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. 两者完全一样，随便用</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 数据少+任务相似（都是图像分类）→ 冻结 backbone，只训分类头（防止过拟合）。数据多+任务差异大（从 ImageNet 迁移到医学影像）→ 全模型微调。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 A。数据少+任务相似 → 特征提取（防止过拟合）。数据多/任务差异大 → 微调（需要更多适配）。
  </div>
</div>

---

### 练习 3：学习率设置

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>微调时，整个模型用同一个学习率训练。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">✓ 正确</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">✗ 不对</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 微调时常用差异学习率：backbone 用很小 lr（如 1e-5），分类头用较大 lr（如 1e-3）。因为预训练的通用特征已经很好，不需要大改；分类头需要大一些的 lr 来适应新任务。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是"不对"。通常 backbone 用很小的学习率（1e-5~1e-4），分类头用较大的（1e-3~1e-4），这样既不破坏预训练特征，又能适应新任务。
  </div>
</div>

---

## 📝 今日小结

| 概念 | 说明 |
|------|------|
| 迁移学习 | 复用预训练模型的特征和权重 |
| 特征提取 | 冻结 backbone，只训练新分类头（数据少时推荐） |
| 微调 | 解冻部分/全部层，全模型训练（数据多时推荐） |
| 差异学习率 | backbone lr 小，分类头 lr 大 |
| 预训练模型 | torchvision.models（ResNet/VGG/EfficientNet/MobileNet） |

---

## 🎯 今日任务

1. 运行猫狗分类代码，尝试分别用特征提取和微调，对比效果
2. 完成 3 道练习题
3. 回复「**完成了**」打卡 ✅

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
    if (isCorrect && window.markDayDone) window.markDayDone(26);
  }
</script>
