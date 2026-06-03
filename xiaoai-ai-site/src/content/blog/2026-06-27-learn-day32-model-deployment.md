---
title: "Day 32 · 模型部署"
description: "TorchScript、ONNX、TensorRT、TFLite，Flask API 部署，本地推理实战"
pubDate: 2026-06-27
section: learn
tags: ["部署", "ONNX", "Week5"]
difficulty: advanced
---

## 🎯 今日目标

理解训练与部署的差异，掌握 TorchScript 和 ONNX 两种模型序列化方法，能够构建简单的模型推理 API。

---

## 1. 为什么需要模型部署？

训练和推理的场景完全不同：

| | 训练 | 推理 |
|---|---|---|
| 硬件 | 多卡 GPU，充足显存 | 可能是边缘设备（手机/摄像头） |
| 精度 | 追求最高精度 | 够用就行，速度优先 |
| 框架 | PyTorch（灵活debug） | TorchScript/C++/TensorRT/TFLite |
| batch | 大 batch | 通常 batch=1 |
| 动态性 | 动态图（易调试） | 静态图（更快） |

**模型部署 = 把训练好的模型变成能在生产环境高效运行的格式**。

---

## 2. TorchScript（PyTorch 原生方案）

### 2.1 两种 TorchScript 转换方式

**方式一：Trace（追踪）**—— 用真实输入"跑一遍"模型，记录执行路径。适合没有控制流的模型。

```python
import torch
from torchvision.models import resnet50, ResNet50_Weights

# 加载模型
model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.eval()  # 重要：推理模式

# Trace：用真实输入追踪执行路径
example_input = torch.randn(1, 3, 224, 224)
traced_model = torch.jit.trace(model, example_input)

# 保存
traced_model.save('resnet50_traced.pt')

# 加载
loaded = torch.jit.load('resnet50_traced.pt')
output = loaded(torch.randn(1, 3, 224, 224))
print(output.shape)  # torch.Size([1, 1000])
```

**方式二：Script（脚本）**—— 编译整个模型代码，适合有 if/for 控制流的模型。

```python
# Script：直接编译模型类
class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Conv2d(3, 16, 3, padding=1)
        self.fc = nn.Linear(16 * 224 * 224, 10)
    
    def forward(self, x):
        x = self.conv(x)
        # 有控制流，Trace 无法捕获，用 Script
        if x.sum() > 0:
            x = torch.relu(x)
        return self.fc(x.flatten(1))

model = MyModel()
scripted = torch.jit.script(model)
scripted.save('mymodel_scripted.pt')
```

### 2.2 TorchScript 性能优势

```python
# Benchmark：Eager Mode vs TorchScript
model = resnet50(weights=ResNet50_Weights.DEFAULT).eval()

# Eager Mode
import time
x = torch.randn(1, 3, 224, 224)
with torch.no_grad():
    for _ in range(100):
        start = time.time()
        _ = model(x)
        print(f"Eager: {(time.time()-start)*1000:.1f}ms")

# TorchScript
traced = torch.jit.trace(model, x)
with torch.no_grad():
    for _ in range(100):
        start = time.time()
        _ = traced(x)
        print(f"TorchScript: {(time.time()-start)*1000:.1f}ms")
# TorchScript 通常快 10-30%
```

---

## 3. ONNX（跨框架通用格式）

### 3.1 导出为 ONNX

ONNX（Open Neural Network Exchange）是跨框架、中立的模型格式。

```python
import torch
import torch.onnx

model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.eval()

# 导出为 ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    'resnet50.onnx',
    export_params=True,
    opset_version=11,           # ONNX 算子集版本
    do_constant_folding=True,   # 常量折叠优化
    input_names=['input'],      # 输入名
    output_names=['output'],    # 输出名
    dynamic_axes={              # 动态维度
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)
print("ONNX 导出成功！")
```

### 3.2 用 ONNX Runtime 推理（无需 PyTorch）

```python
# pip install onnxruntime
import onnxruntime as ort
import numpy as np

# 创建推理会话（可选：指定 providers=['CUDAExecutionProvider'] 用 GPU）
session = ort.InferenceSession('resnet50.onnx')

# 准备输入（ONNX Runtime 用 numpy，不是 tensor）
input_data = np.random.randn(1, 3, 224, 224).astype(np.float32)

# 推理
outputs = session.run(['output'], {'input': input_data})
print(f"输出形状: {outputs[0].shape}")  # (1, 1000)
```

### 3.3 ONNX 模型验证

```python
import onnx

# 检查模型格式是否正确
model = onnx.load('resnet50.onnx')
onnx.checker.check_model(model)
print("ONNX 模型检查通过！")

# 用 Netron 可视化：https://netron.app/
```

---

## 4. TensorRT（NVIDIA GPU 高性能部署）

TensorRT 是 NVIDIA 的推理优化引擎，可以把 ONNX 或 TorchScript 模型优化到极致性能（有时 5-10x 加速）。

```python
# pip install tensorrt（需要 NVIDIA GPU 环境）

import tensorrt as trt
import torch

# 方式一：PyTorch → ONNX → TensorRT
import torch_tensorrt

# 编译（自动做 INT8 量化/FP16 优化）
compiled_model = torch_tensorrt.compile(
    model,
    inputs=[torch.randn(1, 3, 224, 224)],
    enabled_precisions={trt.float32, trt.float16}  # FP16 加速
)

# 方式二：用 trtexec 命令行工具（不需要 Python）
# trtexec --onnx=resnet50.onnx --saveEngine=resnet50.trt --fp16
```

**TensorRT 优化手段**：
- 算子融合（多个卷积+BN 合成一个）
- FP16/INT8 量化
- Kernel auto-tuning（选择最优 CUDA kernel）
- Memory reuse（显存复用）

---

## 5. 轻量化部署：TFLite（移动端）

```python
# pip install tensorflow（用于导出）
import tensorflow as tf

# PyTorch → ONNX → TensorFlow Lite
# 或者直接用 TensorFlow 训练后导出
converter = tf.lite.TFLiteConverter.from_saved_model('saved_model_dir')
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]  # FP16 量化
tflite_model = converter.convert()

with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

---

## 6. Flask API 部署（最简单的 HTTP 服务）

```python
# server.py
from flask import Flask, request, jsonify
import torch
from torchvision.models import resnet50, ResNet50_Weights
import torchvision.transforms as transforms
from PIL import Image
import io

app = Flask(__name__)

# 加载模型（全局，加载一次）
model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    img = Image.open(io.BytesIO(image_file.read())).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)
    
    with torch.no_grad():
        output = model(img_tensor)
        probs = torch.softmax(output, dim=1)
        top_prob, top_idx = probs.topk(1, dim=1)
    
    return jsonify({
        'class_id': int(top_idx.item()),
        'confidence': float(top_prob.item())
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

```bash
# 启动服务
python server.py

# 测试
curl -X POST -F "image=@photo.jpg" http://localhost:5000/predict
# 返回: {"class_id": 281, "confidence": 0.9234}
```

---

## 🧪 练习题

**Q1.** `torch.jit.trace` 和 `torch.jit.script` 的区别是？

A.Trace 比 Script 快  
B.Trace 用真实输入追踪执行路径，适合无控制流模型；Script 编译代码，支持 if/for  
C.两者完全等价  

---

**Q2.** ONNX 的核心价值是？

A.训练更快  
B.跨框架、跨平台的模型交换格式（PyTorch/TensorFlow/ONNX Runtime）  
C.减少模型大小  
D.自动做数据增强  

---

**Q3.** Flask API 部署中，模型应该放在哪里？

A.每次请求时重新加载  
B.全局加载一次（app 启动时），请求时复用  
C.放在数据库里  
D.不需要模型  

---

## 📝 今日小结

| 部署格式 | 适用场景 | 备注 |
|---------|---------|------|
| TorchScript | PyTorch 原生，服务器推理 | `torch.jit.trace/script` |
| ONNX | 跨框架，通用格式 | `torch.onnx.export` |
| TensorRT | NVIDIA GPU 高性能 | 5-10x 加速 |
| TFLite | 移动端/边缘 | FP16/INT8 量化 |
| Flask API | 快速原型 HTTP 服务 | 不是生产级 |

---

## 🎯 今日任务

1. 把 ResNet50 trace 成 TorchScript 并保存 `.pt` 文件
2. 导出 ResNet50 为 ONNX 格式
3. 如果有 NVIDIA GPU，尝试 TensorRT；没有则用 ONNX Runtime 跑通推理
4. 回复「**Day 32 完成**」打卡 ✅
