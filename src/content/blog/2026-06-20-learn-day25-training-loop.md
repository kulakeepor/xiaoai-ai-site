---
title: "Day 25 · 模型定义与训练循环"
description: "nn.Module搭建模型、完整训练循环（前向/损失/反向/更新）、验证集评估、过拟合识别与应对"
pubDate: 2026-06-20
section: learn
tags: ["PyTorch", "框架", "Week4"]
difficulty: beginner
---

## 🎯 今日目标

掌握 PyTorch 完整训练流程：
- `nn.Module` 搭建模型
- 损失函数 + 优化器配置
- 完整的训练循环（forward → loss → backward → step）
- 验证集评估
- 过拟合的识别与基本应对

---

## 1. nn.Module：搭建模型

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()   # 必须调用！
        # 定义层
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x):
        # 定义数据流动
        x = self.pool(F.relu(self.conv1(x)))   # Conv → ReLU → Pool
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 64 * 7 * 7)             # Flatten
        x = self.dropout(F.relu(self.fc1(x)))  # Dropout
        x = self.fc2(x)                         # 无激活（logits 给 CrossEntropyLoss）
        return x

model = SimpleNet()
print(model)

# 查看参数
for name, param in model.named_parameters():
    print(f"{name}: {param.shape}")
```

> 🔑 **nn.Module 核心规则**：
> 1. `super().__init__()` 必须调用
> 2. 所有层在 `__init__` 里定义
> 3. `forward()` 定义计算图
> 4. `model(x)` 自动调用 `forward(x)`

---

## 2. 损失函数与优化器

```python
# 损失函数
criterion = nn.CrossEntropyLoss()    # 分类（自动做 Softmax）
criterion = nn.MSELoss()           # 回归
criterion = nn.BCEWithLogitsLoss() # 二分类

# 优化器
optimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
optimizer = torch.optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)

# 学习率调度（可选）
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=50)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5)
```

---

## 3. 完整训练循环

```python
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# 数据
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))])
train_ds = datasets.MNIST('./data', train=True, download=True, transform=transform)
test_ds = datasets.MNIST('./data', train=False, transform=transform)
train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
test_loader = DataLoader(test_ds, batch_size=1000, shuffle=False)

# 模型
model = SimpleNet().to('cuda' if torch.cuda.is_available() else 'cpu')
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# 训练
epochs = 5
for epoch in range(epochs):
    model.train()                          # 训练模式
    running_loss = 0.0
    correct = 0
    total = 0
    
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        
        optimizer.zero_grad()             # ① 清零梯度
        output = model(data)              # ② 前向传播
        loss = criterion(output, target)  # ③ 计算损失
        loss.backward()                   # ④ 反向传播
        optimizer.step()                  # ⑤ 更新参数
        
        running_loss += loss.item()
        pred = output.argmax(dim=1)
        correct += pred.eq(target).sum().item()
        total += target.size(0)
    
    # 每个 epoch 结束后评估
    train_loss = running_loss / len(train_loader)
    train_acc = 100 * correct / total
    
    model.eval()
    test_loss = 0.0
    correct = 0
    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            test_loss += criterion(output, target).item()
            pred = output.argmax(dim=1)
            correct += pred.eq(target).sum().item()
    
    test_loss /= len(test_loader)
    test_acc = 100 * correct / len(test_ds)
    
    print(f"Epoch {epoch+1}/{epochs} | "
          f"Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | "
          f"Test Loss: {test_loss:.4f} Acc: {test_acc:.2f}%")
    
    scheduler.step()  # 更新学习率（如果用了 scheduler）
```

---

## 4. 过拟合的识别与应对

```python
# 过拟合的典型信号：
# 训练准确率 >> 测试准确率（如训练 99%，测试 85%）
# 测试损失在某个 epoch 后反而上升

# 应对方法：
# ① Dropout（在模型里加 nn.Dropout）
# ② 权重衰减（weight_decay，AdamW 自带）
# ③ 数据增强（见 Day 24）
# ④ 早停（Early Stopping）：测试损失连续 N 个 epoch 不下降就停止
# ⑤ 减小模型复杂度

# 早停示例
best_test_loss = float('inf')
patience = 3
counter = 0

for epoch in range(100):
    # ... 训练 ...
    if test_loss < best_test_loss:
        best_test_loss = test_loss
        counter = 0
        torch.save(model.state_dict(), 'best_model.pt')  # 保存最佳模型
    else:
        counter += 1
        if counter >= patience:
            print(f"早停！连续 {patience} 个 epoch 测试损失未下降")
            break
```

---

## 🧪 互动练习

### 练习 1：nn.Module

<div class="quiz-container" data-quiz="q1">
  <div class="quiz-question">
    <p><strong>📋 概念题：</strong>`nn.Module` 的 `forward()` 方法的作用是什么？直接调用 `forward(x)` 和 `model(x)` 有什么区别？</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">A. forward 定义层的初始化；model(x) 调用初始化，两者没有区别</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q1')">B. forward 定义前向传播的计算图；model(x) 等价于 forward(x)，但 model(x) 会触发钩子（hooks）等 PyTorch 特有机制</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q1')">C. forward 用于反向传播；model(x) 用于前向传播</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q1-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> forward 定义计算图，model(x) 调用 forward(x)。但应使用 model(x)，因为它会触发 PyTorch 的 hooks、GPU 迁移、梯度追踪等机制，直接调 forward() 可能绕过这些。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q1-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B。forward 定义计算图；model(x) 等价但更完整（触发 hooks、梯度追踪等），应始终使用 model(x) 而非 model.forward(x)。
  </div>
</div>

---

### 练习 2：训练循环顺序

<div class="quiz-container" data-quiz="q2">
  <div class="quiz-question">
    <p><strong>📋 排序题：</strong>以下训练循环中各步骤的正确顺序是？（填序号，如 A→B→C→D→E）</p>
    <p>① loss.backward() ② optimizer.step() ③ optimizer.zero_grad() ④ output = model(data) ⑤ loss = criterion(output, target)</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">A. ③→④→⑤→①→②</button>
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q2')">B. ③→④→⑤→①→②</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q2')">C. ④→③→⑤→①→②</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q2-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 顺序：清梯度(③) → 前向(④) → 损失(⑤) → 反向(①) → 更新(②)。记忆口诀：「清前损反更」（清钱损失更新）。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q2-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是 B（③→④→⑤→①→②）。口诀「清前损反更」：清零→前向→损失→反向→更新。
  </div>
</div>

---

### 练习 3：过拟合

<div class="quiz-container" data-quiz="q3">
  <div class="quiz-question">
    <p><strong>📋 判断题：</strong>训练准确率 99.5%、测试准确率 99.2%，说明模型效果很好，没有过拟合。</p>
  </div>
  <div class="quiz-options">
    <button class="quiz-option" data-answer="true" onclick="checkAnswer(this, 'q3')">✗ 不对</button>
    <button class="quiz-option" data-answer="false" onclick="checkAnswer(this, 'q3')">✓ 正确</button>
  </div>
  <div class="quiz-feedback quiz-correct" id="q3-feedback-correct" style="display:none">
    ✅ <strong>正确！</strong> 判断过拟合看的是差距，而非绝对值。训练和测试准确率差距很小（0.3%），说明泛化很好。若训练 99.5% 但测试 85%，差距巨大，说明严重过拟合。
  </div>
  <div class="quiz-feedback quiz-wrong" id="q3-feedback-wrong" style="display:none">
    ❌ <strong>错误！</strong> 答案是"不对"。过拟合的判断标准是训练和测试的差距，而非绝对值。99.5% vs 99.2%（差 0.3%）泛化很好；99.5% vs 85%（差 14.5%）才是严重过拟合。
  </div>
</div>

---

## 📝 今日小结

| 步骤 | 代码 | 说明 |
|------|------|------|
| 搭建模型 | `class MyModel(nn.Module)` | __init__ 定义层，forward 定义流动 |
| 损失函数 | `nn.CrossEntropyLoss()` | 分类；MSELoss 用于回归 |
| 优化器 | `optim.Adam(model.params(), lr=)` | 常用 Adam 或 SGD |
| 训练循环 | zero_grad → forward → loss → backward → step | 口诀：清前损反更 |
| 评估 | model.eval() + torch.no_grad() | 关闭 dropout，计算准确率 |
| 早停 | 监控 test_loss，连续不降 N 次就停 | 防止过拟合 |

---

## 🎯 今日任务

1. 运行 MNIST 完整训练循环代码，观察准确率变化
2. 去掉 Dropout，对比训练/测试准确率差距（观察过拟合）
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
    if (isCorrect && window.markDayDone) window.markDayDone(25);
  }
</script>
