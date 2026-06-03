---
title: "Day 28 · 综合实战"
description: "用 PyTorch 从头搭建一个完整的图像分类项目：数据加载→模型定义→训练→评估→推理，串联所有知识点"
pubDate: 2026-06-23
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: intermediate
---

## 🎯 今日目标

综合实战：用 PyTorch 完整走一遍图像分类项目流程，串联 Week 4 所有知识点。

**目标**：用 ResNet-18 微调，完成 FashionMNIST 分类（10类服装）

---

## 1. 项目结构

```
fashion_mnist_project/
├── train.py          # 训练脚本
├── eval.py           # 评估脚本
├── infer.py          # 推理脚本
└── utils.py         # 工具函数
```

---

## 2. utils.py：工具函数

```python
import torch
import matplotlib.pyplot as plt
import numpy as np

# 类别名称
FASHION_CLASSES = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 
                    'Coat', 'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

def show_images(images, labels, preds=None, n=8):
    """可视化一批图片"""
    fig, axes = plt.subplots(2, 4, figsize=(12, 5))
    for i, ax in enumerate(axes.flat):
        img = images[i].cpu().numpy().squeeze()
        ax.imshow(img, cmap='gray')
        title = FASHION_CLASSES[labels[i]]
        if preds is not None:
            title += f'\n→ {FASHION_CLASSES[preds[i]]}'
            if preds[i] != labels[i]:
                ax.set_title(title, color='red')
            else:
                ax.set_title(title, color='green')
        ax.axis('off')
    plt.tight_layout()
    plt.show()

def get_device():
    """获取最佳设备"""
    if torch.cuda.is_available():
        return torch.device('cuda')
    elif torch.backends.mps.is_available():
        return torch.device('mps')
    return torch.device('cpu')

def save_model(model, optimizer, epoch, acc, path='best_model.pt'):
    """保存模型检查点"""
    torch.save({
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'accuracy': acc,
    }, path)

def load_model(model, optimizer, path):
    """加载模型检查点"""
    checkpoint = torch.load(path, map_location=get_device())
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    return checkpoint['epoch'], checkpoint['accuracy']
```

---

## 3. train.py：训练脚本

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import resnet18, ResNet18_Weights
import numpy as np
from utils import FASHION_CLASSES, get_device, show_images, save_model

# 配置
BATCH_SIZE = 64
EPOCHS = 10
LR = 1e-3
DEVICE = get_device()

print(f"Using device: {DEVICE}")

# 数据加载（Day 22, 24）
train_transform = transforms.Compose([
    transforms.Resize(224),                   # ResNet 需要 224×224
    transforms.Grayscale(num_output_channels=3),  # 1通道→3通道（ResNet输入）
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])
test_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

train_ds = datasets.FashionMNIST('./data', train=True, download=True, transform=train_transform)
test_ds = datasets.FashionMNIST('./data', train=False, transform=test_transform)
train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
test_loader = DataLoader(test_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

# 模型（Day 26：迁移学习 + Day 25：nn.Module）
model = resnet18(weights=ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, 10)  # 替换分类头
model = model.to(DEVICE)

# 损失函数 + 优化器
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)

# 训练（Day 25：完整训练循环）
best_acc = 0.0
for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for batch_idx, (images, labels) in enumerate(train_loader):
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        
        if (batch_idx + 1) % 200 == 0:
            print(f"Epoch [{epoch+1}/{EPOCHS}] "
                  f"Batch [{batch_idx+1}/{len(train_loader)}] "
                  f"Loss: {loss.item():.4f}")
    
    scheduler.step()
    
    # 评估
    model.eval()
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            outputs = model(images)
            _, predicted = outputs.max(1)
            test_total += labels.size(0)
            test_correct += predicted.eq(labels).sum().item()
    
    test_acc = 100 * test_correct / test_total
    train_acc = 100 * correct / total
    
    print(f"\nEpoch {epoch+1}/{EPOCHS} | "
          f"Train Acc: {train_acc:.2f}% | "
          f"Test Acc: {test_acc:.2f}% | "
          f"LR: {scheduler.get_last_lr()[0]:.6f}\n")
    
    # 保存最佳模型
    if test_acc > best_acc:
        best_acc = test_acc
        save_model(model, optimizer, epoch, test_acc)
        print(f"✅ 最佳模型已保存！准确率: {best_acc:.2f}%")

print(f"\n训练完成！最佳测试准确率: {best_acc:.2f}%")
```

---

## 4. eval.py：评估脚本

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import resnet18
from sklearn.metrics import confusion_matrix, classification_report
import numpy as np
from utils import get_device, FASHION_CLASSES

DEVICE = get_device()

# 加载数据
test_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])
test_ds = datasets.FashionMNIST('./data', train=False, transform=test_transform)
test_loader = DataLoader(test_ds, batch_size=100, shuffle=False)

# 加载模型
model = resnet18()
model.fc = nn.Linear(model.fc.in_features, 10)
checkpoint = torch.load('best_model.pt', map_location=DEVICE)
model.load_state_dict(checkpoint['model_state_dict'])
model = model.to(DEVICE)
model.eval()

# 预测
all_preds = []
all_labels = []
with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(DEVICE)
        outputs = model(images)
        _, preds = outputs.max(1)
        all_preds.extend(preds.cpu().numpy())
        all_labels.extend(labels.numpy())

# 混淆矩阵 + 报告
cm = confusion_matrix(all_labels, all_preds)
print("\n分类报告：")
print(classification_report(all_labels, all_preds, target_names=FASHION_CLASSES))
```

---

## 5. infer.py：推理脚本

```python
import torch
from torchvision import transforms
from PIL import Image
from torchvision.models import resnet18
from utils import FASHION_CLASSES, get_device

DEVICE = get_device()

# 加载模型
model = resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 10)
model.load_state_dict(torch.load('best_model.pt', map_location=DEVICE)['model_state_dict'])
model.eval()

# 图片预处理
infer_transform = transforms.Compose([
    transforms.Resize(224),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# 推理函数
def predict(image_path):
    image = Image.open(image_path).convert('RGB')
    img_tensor = infer_transform(image).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        output = model(img_tensor)
        probs = torch.softmax(output, dim=1)
        pred_idx = output.argmax(dim=1).item()
        confidence = probs[0, pred_idx].item()
    
    print(f"预测: {FASHION_CLASSES[pred_idx]}")
    print(f"置信度: {confidence*100:.2f}%")
    return pred_idx, confidence

# 测试
predict('./test_sample.png')
```

---

## 🧪 综合练习：Week 4 小测

回复「**我的答案：A B C...**」回答 5 道题

---

**Q1.** `torch.zeros(3, 4, requires_grad=True)` 创建的张量，`requires_grad` 默认值是？

A. True  
B. False（默认就是这个，不传就是 False）  
C. 取决于上下文

---

**Q2.** `optimizer.zero_grad()` 在训练循环中的正确位置是？

A. `loss.backward()` 之后  
B. `optimizer.step()` 之后  
C. `loss.backward()` 之前（先清零再前向）

---

**Q3.** `model.eval()` 和 `torch.no_grad()` 的关系是？

A. 两者完全等价，可以互相替换  
B. `model.eval()` 切换模型模式（Dropout/BN），`torch.no_grad()` 关闭梯度追踪，通常同时使用  
C. `model.eval()` 只在 PyTorch Lightning 中使用

---

**Q4.** 迁移学习中，"冻结 backbone" 指的是？

A. 删除 backbone 部分  
B. 固定 backbone 的参数不更新，只训练新加的分类头  
C. 把 backbone 移到 CPU 上

---

**Q5.** Hugging Face `AutoTokenizer.from_pretrained("bert-base-uncased")` 的作用是？

A. 加载预训练权重  
B. 加载与 BERT 模型配套的分词器（把文本转为 token ID）  
C. 直接做文本分类

---

## 📝 Week 4 小结

| Day | 内容 |
|-----|------|
| Day 22 | 张量：创建/索引/形状变换/GPU |
| Day 23 | Autograd：计算图/梯度追踪/backward |
| Day 24 | 数据集：Dataset/DataLoader/transforms |
| Day 25 | 训练循环：nn.Module/前向→损失→反向→更新 |
| Day 26 | 迁移学习：特征提取/微调/差异学习率 |
| Day 27 | Hugging Face：Pipeline/AutoModel/Tokenizer |

---

## 🎯 今日任务

1. 运行 FashionMNIST 训练代码（需要 `torch` + `torchvision` + `scikit-learn`）
2. 观察训练/测试准确率变化，理解过拟合
3. 完成 Week 4 小测（5道题）
4. 回复「**完成了 Week 4**」打卡 ✅

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
    if (isCorrect && window.markDayDone) window.markDayDone(28);
  }
</script>
