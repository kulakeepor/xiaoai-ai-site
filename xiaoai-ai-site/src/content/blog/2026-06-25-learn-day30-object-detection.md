---
title: "Day 30 · 目标检测"
description: "从 R-CNN 到 YOLO：两阶段 vs 单阶段检测器，Anchor Boxes，NMS，MMDetection 工具箱"
pubDate: 2026-06-25
section: learn
tags: ["目标检测", "YOLO", "Week5"]
difficulty: intermediate
---

## 🎯 今日目标

理解目标检测的两大范式（两阶段 vs 单阶段），掌握 Anchor Boxes 机制和 NMS 原理，体验 YOLOv8 快速上手。

---

## 1. 目标检测的核心问题

图像分类只需要给整个图像一个标签。但目标检测要解决更复杂的问题：

```
输入：一张图片
输出：多个物体框 + 每个框的类别
```

**难点**：
1. 物体位置和大小是任意的（不像分类，物体总在图片中心）
2. 图片中物体数量不固定（可能是 1 个，也可能是 100 个）
3. 需要同时做定位（Regression）和分类（Classification）

---

## 2. 两阶段检测器：R-CNN 系列

### 2.1 R-CNN（2014）—— 开创者

**两阶段流程**：
1. **阶段一**：用 Selective Search 生成 ~2000 个候选区域（Region Proposals）
2. **阶段二**：对每个候选区域裁剪、缩放到固定尺寸，用 CNN 提取特征，用 SVM 分类

```python
# R-CNN 的核心问题：每个候选区域都要过一遍 CNN，太慢了！
# 2000 个候选框 × 每个 0.5 秒 = 1000 秒（17 分钟处理一张图）
```

### 2.2 Fast R-CNN（2015）—— 共享卷积特征

改进：用整张图过一次 CNN，然后用 RoI Pooling 从特征图中提取每个候选区的特征。快 25 倍。

```python
# RoI Pooling 示意
roi_pooled = ops.roi_pool(feature_map,       # CNN 输出的特征图
                           rois,              # 候选区域坐标
                           output_size=7)    # 缩放到 7×7
```

### 2.3 Faster R-CNN（2016）—— 候选区域也用网络生成

用 **RPN（Region Proposal Network）** 替代 Selective Search，候选区域生成也变成可学习的。

```python
# Faster R-CNN = RPN（生成候选）+ Fast R-CNN（分类+回归）
# 真正实现端到端训练，FPS 从 0.03 提升到 7
```

### 2.4 两阶段检测器总结

```
R-CNN → Fast R-CNN → Faster R-CNN
  (~2000 proposals，笨重) → (共享特征，快 25×) → (RPN 生成 proposals，end-to-end)
```

**优点**：精度高，特别是小物体检测  
**缺点**：速度慢（~7-10 FPS），不适合实时场景

---

## 3. 单阶段检测器：YOLO 系列

### 3.1 YOLOv1（2016）—— 革命性的单阶段设计

核心洞察：**不用候选区域，直接在网格上预测**。

把图片划分为 7×7 网格，每个格子预测：
- 2 个边界框（x, y, w, h, confidence）
- 20 个类别概率

```python
# YOLOv1 输出张量：[batch, 7, 7, (2*5 + 20)] = [batch, 7, 7, 30]
# 每个格子：2个框 × (4个坐标 + 1个置信度) + 20个类别

# 问题：每个格子只能预测固定数量的物体（≤2个）
# 小物体密集场景效果差
```

### 3.2 YOLOv3（2018）—— 多尺度预测

改进：输出 3 个不同尺度的特征图（大/中/小物体分别检测）

```python
# YOLOv3 输出 3 个尺度：
# [batch, 13, 13, 255]   # 大物体（stride=32）
# [batch, 26, 26, 255]   # 中物体（stride=16）
# [batch, 52, 52, 255]   # 小物体（stride=8）
```

### 3.3 YOLOv5/v7/v8（2020-2023）—— 工程化巅峰

Ultralytics 团队的 YOLOv8 已成为工业界事实标准。

```python
# 使用 ultralytics 库（pip install ultralytics）
from ultralytics import YOLO

# 加载预训练模型
model = YOLO('yolov8n.pt')  # nano（小模型， fastest）
# 其他版本：yolov8s / yolov8m / yolov8l / yolov8x

# 预测
results = model.predict(source='photo.jpg', save=True)
# results[0].boxes 包含所有检测框

# 打印结果
for box in results[0].boxes:
    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
    conf = box.conf[0].item()
    cls = box.cls[0].item()
    label = model.names[int(cls)]
    print(f"{label}: {conf:.3f} @ [{x1:.0f}, {y1:.0f}, {x2:.0f}, {y2:.0f}]")
```

### 3.4 YOLO 训练自己的数据集

```python
from ultralytics import YOLO

# 加载预训练 yolov8n（nano，最快）
model = YOLO('yolov8n.pt')

# 训练（需要 data.yaml 配置数据集路径和类别）
results = model.train(
    data='./datasets/coco8.yaml',  # 示例用 coco8
    epochs=100,
    imgsz=640,
    batch=16,
    device=0  # GPU
)

# 验证
metrics = model.val()
print(f"mAP50: {metrics.box.map50:.3f}")
print(f"mAP50-95: {metrics.box.map:.3f}")

# 导出为 ONNX（部署用）
model.export(format='onnx', imgsz=640)
```

---

## 4. Anchor Boxes 机制

Anchor Boxes 是预先定义的一系列"锚框"（不同尺寸和长宽比），检测器在这些锚框基础上预测微调量。

```python
# 示例：3种尺度 × 3种长宽比 = 9 个 anchors
anchors = [
    # [w, h]
    [1.0, 1.0],   # 1:1 方框
    [1.4, 0.7],   # 横向长方形
    [0.7, 1.4],   # 纵向长方形
    # ... × 3 scales
]

# 实际预测的是相对于 anchor 的偏移量
# tx, ty = 中心点偏移
# tw, th = 宽高缩放
# 最终坐标 = anchor + sigmoid(tx,ty) + exp(tw,th)
```

**Anchor-free 检测器**（FCOS、CenterNet）后来出现，不再依赖预定义锚框，直接预测中心点和尺寸。

---

## 5. NMS（非极大值抑制）

当多个检测框重叠时，NMS 只保留置信度最高的框，去除重叠的冗余框。

```python
import torchvision.ops as ops

boxes = torch.tensor([
    [100, 100, 200, 200],   # 框1
    [105, 105, 205, 205],   # 框2（与框1高度重叠）
    [400, 400, 500, 500],   # 框3
], dtype=torch.float32)

scores = torch.tensor([0.95, 0.90, 0.85])  # 置信度

# NMS：IoU>阈值就去掉
keep = ops.nms(boxes, scores, iou_threshold=0.5)
print(keep)  # tensor([0, 2]) → 保留框1和框3，去掉框2
```

---

## 6. MMDetection / Detectron2 简介

对于研究场景，推荐使用 MMDetection（商汤开源）或 Detectron2（Facebook 开源）。

```python
# MMDetection：基于 PyTorch 的检测工具箱
# 支持 100+ 预训练模型，统一训练和测试接口
# 
# from mmdet.apis import init_detector, inference_detector
# 
# config_file = 'configs/yolo/yolov3_mobilenetv2_320_300e_coco.py'
# checkpoint_file = 'checkpoints/yolo_mobilenetv2_320.pth'
# model = init_detector(config_file, checkpoint_file)
# result = inference_detector(model, 'demo.jpg')
```

---

## 🧪 练习题

**Q1.** YOLO 和 Faster R-CNN 的核心区别是？

A.YOLO 精度更高  
B.YOLO 是单阶段（无候选区），Faster R-CNN 是两阶段  
C.YOLO 需要 RoI Pooling  
D.Faster R-CNN 更适合实时场景  

---

**Q2.** Anchor Boxes 的作用是什么？

A.增加训练数据  
B.提供候选检测框的先验尺寸，减少从头学习检测框的难度  
C.加快推理速度  
D.提高分类精度  

---

**Q3.** NMS（Non-Maximum Suppression）的作用是？

A.生成候选区域  
B.在预测结果中去掉重叠的冗余检测框  
C.增强特征图  
D.数据增强  

---

## 📝 今日小结

| 检测器类型 | 代表模型 | FPS | 特点 |
|-----------|---------|-----|------|
| 两阶段 | Faster R-CNN | ~7-10 | 精度高，速度慢 |
| 单阶段 | YOLOv8 | ~100+ | 速度快，精度接近两阶段 |
| Anchor-free | FCOS, CenterNet | ~30-50 | 无需调锚框 |

---

## 🎯 今日任务

1. 安装 `ultralytics`：`pip install ultralytics`
2. 用 YOLOv8 预测一张图片，观察输出格式
3. 了解 NMS 的 `iou_threshold` 参数如何影响结果
4. 回复「**Day 30 完成**」打卡 ✅
