# 每日汇报 — 2026-05-29（晚间）

**执行时间**：2026-05-29 20:00 PM (Asia/Shanghai)
**数据来源**：aihot.virxact.com 精选（5/28-5/29）+ arXiv cs.AI 本周新增（5/25-5/29）

---

## 一、今日 AI/产品/技术/社区动态（5/28-5/29）

> 时间窗：2026-05-28 12:00 UTC ~ 2026-05-29 12:00 UTC（过去 24 小时）

---

### 🔥 本日最重磅

**① 哈萨比斯：AGI 最快三年内到来，研发速度远超预期**

来源：IT之家 / DeepMind
时间：5/29 15:18（北京时间）

DeepMind CEO 哈萨比斯接受访谈时表示，AGI 可能比多数人预期更早到来，研发速度远超外界预期。他强调安全和对齐研究必须与能力研究同步推进。

→ **对老大的价值**：如果 AGI 真的在 3-5 年内接近，我们正在构建的"学习 Agent"可能不只是辅助工具，而是某种形态的基础设施。老大现在的架构决策会影响那个时候的竞争力。

---

**② Anthropic 完成 650 亿美元 H 轮融资，估值达 9650 亿美元**

来源：Anthropic Newsroom
时间：5/28 18:35（北京时间）

Anthropic 宣布完成 650 亿美元 H 轮融资，估值 9650 亿美元，成为全球估值最高的 AI 公司之一。资金将主要用于扩大模型能力、提升安全研究和全球扩张。

→ **行业信号**：Anthropic 的估值增长说明顶级 AI 公司正在形成"赢家通吃"的格局。对老大来说，密切关注 Claude 的技术路线和 API 定价变化有战略意义。

---

**③ Claude Opus 4.8 发布：编码、智能体技能与推理全面升级**

来源：Anthropic Newsroom
时间：5/28 17:05（北京时间）

Claude Opus 4.8 正式发布，在编码、智能体技能和推理方面实现全面升级。具体改进包括更强的工具使用能力、更长的上下文窗口、更低的幻觉率。

→ **老大值得更新 SDK**：如果老大的学习 Agent 用 Claude 作为核心模型，Opus 4.8 的工具调用改进可能是重要升级点。建议对比测试 Opus 4.8 vs 4.7 在学习 Agent 任务上的表现。

---

**④ Apple 正努力将 Gemini 模型塞进 iPhone 以驱动新 Siri**

来源：Ars Technica
时间：5/28 18:30（北京时间）

报道称 Apple 正在与 Google 谈判，将 Gemini 的"数万亿参数"大模型压缩到可在 iPhone 本地运行。这将彻底改变移动端 AI 的能力边界。

→ **行业信号**：端侧 AI 模型蒸馏是下一个关键战场。如果 Gemini 能在 iPhone 上跑，多模态 Agent 的移动端落地会加速。老大的学习 Agent 未来也可能需要考虑端侧部署场景。

---

**⑤ 小米开源可控视频音效生成模型 ControlFoley**

来源：IT之家
时间：5/29 17:13（北京时间）

小米 AI 实验室开源 ControlFoley，这是一个可控视频音效生成模型，可以让声音"按你想要的来"——用户指定视频内容，模型生成匹配的音效。

→ **对老大价值**：视频 + 声音的多模态生成是内容创作 Agent 的核心能力之一。ControlFoley 的"可控生成"思路可以借鉴到其他模态的跨域生成任务。

---

**⑥ DeepSeek 计划科创板 IPO：500 亿美元融资后立即申请**

来源：X：@thexpin
时间：5/28 18:40（昨天已有，今天补充进展）

（昨日已报）DeepSeek 计划完成约 500 亿美元融资轮后立即申请科创板 IPO，这是中国 AI 公司有史以来最大规模融资轮之一。

→ **持续关注**：DeepSeek 的 IPO 进度是中国 AI 资本化的重要风向标。技术路线（低成本高性能）+ 资本动向需要持续跟踪。

---

### 🏭 模型发布/更新

- **Claude Opus 4.8**（Anthropic）：编码 + 智能体技能 + 推理全面升级
- **阶跃星辰 Step 3.7 Flash**（X@StepFun_ai）：聚焦智能体效率
- **Nano Banana Pro / Nano Banana 2**（Google）：新推理系列模型
- **Grok Build 0.2.7**（xAI）：新增多项功能
- **Grok Build 0.1 on API**（xAI）：API 接口开放
- **商汤 SenseTime 信息图生成模型**（X@SenseTime_AI）：多项核心能力增强
- **Qwen3.7-Max**（阿里云）：登顶 OpenRouter 热门大模型榜（77.3B tokens）

---

### 🛠️ 产品发布/更新

- **阿里云百炼 CLI**（阿里云）：Agent 可调用全套模型和应用能力
- **Replit Canvas**（Replit）：智能体设计工具全新发布
- **Mistral Search Toolkit**（Mistral）：搜索工具包发布
- **Perplexity Computer 集成微软 Office**（Perplexity）：AI 搜索进入办公套件
- **Krea 2 API**（Krea）：支持 fal/ComfyUI/NousResearch Hermes，兼容 Claude/Codex/OpenClaw
- **OpenClaw 2026.5.27**（X@openclaw）：Gateway/模型启动路径精简，/models 响应降至约 5ms
- **Runway MCP 服务器**：兼容 MCP 的 Agent 可直接在对话中生成图像和视频
- **Perplexity 开源 Unigram 分词器**：将 CPU 占用降低 5-6 倍
- **Claude Code 动态工作流**（Claude Blog）：Claude Code 引入动态工作流支持
- **Sesame iOS 应用**（TechCrunch）：Oculus 创始人创办的对话式 AI 初创公司发布 iOS app
- **Google Pay MCP 服务器**（Google Developers）：面向智能体商务的 MCP 协议

---

### 📰 行业动态

- **Anthropic 完成 650 亿美元 H 轮融资**，估值 9650 亿美元
- **OpenRouter B 轮 1.13 亿美元**（CapitalG 领投，NVIDIA/ServiceNow 跟投）
- **Cognition 成为全球最大独立 Agent 实验室**，年化收入 4.92 亿美元
- **英伟达展示台湾新园区**，计划每年在台投资 1500 亿美元
- **高通与字节跳动达成 AI ASIC 芯片合作**，采购量数百万颗级别
- **苹果与 Google 谈判将 Gemini 压缩至 iPhone 本地运行**
- **华为何庭波"韬定律"论文发布**，逻辑折叠提升芯片性能
- **阿里云成为 PyTorch 白金会员**
- **Mistral 押注"物理 AI"**，收购 Emmi AI + 10MW 新数据中心专注推理

---

### 💡 技巧与观点

- **Adam's Law**：用高频词写 Prompt 效果更好（X@Berry Xia）
- **用好 Coding Agent，关键是两头**：开头走偏后面怎么改都改不好（X@宝玉）
- **别只看基准测试，要看全面表现**（OpenRouter）
- **Claude Code 源码解读**：文档中未提及的所有可配置选项（Hacker News 热文）
- **选择保持人性**（Ethan Mollick）
- **人类与 AI 分工：教育咨询及文学奖争议**（Ethan Mollick）
- **PyTorch torch.profiler 初学者指南**（HuggingFace Blog）

---

## 二、飞书多维表格状态

⚠️ **仍无法访问** — 飞书 Bitable URL（含 app_token + table_id）仍未存储，**连续第 32+ 天**无法自动录入。

**根本原因**：`xiaoai-ai-site/src/lib/feishu.ts` 从未创建，前端数据层断接。

**需要的操作**：老大只需发来任意一个飞书多维表格的 URL（格式 `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`），即可解锁自动录入。

---

## 三、老大晚间论文解读（2篇）

本周 arXiv cs.AI 新增约 200+ 篇（5/25-5/29），精选 2 篇重点解读：

---

### Paper 1（★★★★★）：WorldMemArena — 多模态 Agent 记忆的全生命周期评估

**arXiv:2605.29341 | Chengzhi Liu et al. | cs.AI / cs.MM | 2026-05-28**

**为什么选这篇给老大细读：**

这是多模态 Agent 记忆评估领域最重要的 benchmark 论文，对老大学习 Agent 的记忆系统设计有**直接且关键**的参考价值。目前没有好的 Agent 记忆评估方法——WorldMemArena 填补了这个空白，并提出了"Action-World Interaction Loop"这个可操作的记忆生命周期框架。

**背景问题：**

现有 Agent 记忆 benchmark 的致命缺陷：
- 记忆 = 静态对话的召回（忽略了"记忆是动态更新的"）
- 只测最终准确率（无法定位失败是在写入/维护/检索/使用哪个环节）
- 把视觉观察降级为 caption（丢失大量视觉信息）
- 无法区分"自我管理记忆"和"手工设计记忆 pipeline"的优劣

**核心贡献：**

① **WorldMemArena**：400 个多步骤任务，覆盖 4 个可观测的记忆阶段：
- **Writing**：将观察写入记忆
- **Maintenance**：修订过时记忆
- **Retrieval**：在决策时召回正确证据
- **Use**：将记忆用于推理和行动

② **Action-World Interaction Loop**：多模态 Agent 记忆的真正生命周期是 Agent 与环境交互的循环——记忆不只是存储，更是动态更新和主动检索的循环。

③ **可定位失败**：现有方法随 recurrence distance（任务长度）记忆一致性急剧下降，但无法定位是哪一环出了问题。WorldMemArena 可以精确定位。

**关键发现：**

- 现有方法在跨镜头/跨时间跨度场景中，实体一致性随距离急剧下降
- EntityMem（持久记忆银行）cohen's d = +2.33，在人物保真度上表现最佳
- 多模态信息（视频、音频）比文本 caption 保留更多决策关键证据

**→ 对老大学习 Agent 的直接价值：**

1. **记忆的四阶段框架**：学习 Agent 的记忆系统应该显式建模 Writing → Maintenance → Retrieval → Use 四个阶段，而不是把记忆当成一个黑箱检索库
2. **动态更新优先**：WorldMemArena 的核心洞察是"记忆必须 track  evolving world"——学习 Agent 面对用户不断变化的学习状态，不能只做相似度检索，还要主动修订过时记忆
3. **失败定位能力**：如果老大学习 Agent 的记忆出了问题，你需要知道是"记不进去"还是"检索不出来"还是"记的东西过时了"——WorldMemArena 的诊断框架可以帮你定位
4. **benchmark 设计思路**：如果你要评估学习 Agent 的记忆能力，可以参考 WorldMemArena 的"分层难度 + 多维度追踪"设计

**一句话总结**：WorldMemArena 提出了多模态 Agent 记忆的完整生命周期框架，让 Agent 记忆从"静态存储"变成"动态交互循环"，并提供了可定位失败的评估方法——这对学习 Agent 的记忆系统设计有直接指导意义。

---

### Paper 2（★★★★）：Colored Noise Sampling — 扩散模型的无训练加速采样

**arXiv:2605.30332 | Hadar Davidson | cs.CV | 2026-05-28**

**为什么选这篇：**

这是一篇工程价值极高的扩散模型优化论文——**CNS 是纯推理时优化，不需要重新训练模型**，且在多个架构（SiT/JiT/FLUX）上都取得显著 FID 提升。对老大来说，理解扩散模型的采样效率优化，对以后涉及图像/视频生成的 Agent 任务有直接帮助。

**核心贡献：**

① **问题发现**：传统 SDE 采样器在整个采样过程中均匀注入白噪声，没有利用扩散模型自身的 spectral bias（低频结构先学，高频细节后学）。

② **CNS（Colored Noise Sampling）**：训练无关的随机采样器，按时间和频率动态分配噪声能量，把能量导向"结构尚未解析"的频率带，而不是均匀浪费在所有频率上。

③ **关键数学框架**：建立了 SDE 推理的数学框架，将采样重新定义为"targeted, frequency-decoupled energy transfer"。

**关键数字：**

| 模型 | 原始 FID | CNS FID | 提升 |
|---|---|---|---|
| SiT-XL/2 | 8.26 | **6.27** | -24% |
| JiT-B/16 | 32.39 | **26.69** | -18% |
| JiT-H/16 | 11.88 | **8.31** | -30% |

**→ 对老大价值：**

如果老大的学习 Agent 涉及图像/视频生成任务，或需要调用图像生成模型，CNS 的"无训练加速"思路可以降低推理成本。如果未来在 Agent pipeline 中集成 Stable Diffusion/FLUX 等模型，用 CNS 替换默认采样器可能带来显著提速。

**一句话总结**：CNS 证明了扩散模型采样还有大量优化空间——通过利用模型自身的 spectral bias 而非均匀噪声注入，可以在不重新训练的情况下显著提升采样质量和速度。

---

## 四、本周 arXiv 论文速览（5/25-5/29 精选，标记"arXiv 论文跟踪"）

| ID | 标题 | 推荐度 |
|---|---|
| 2605.29341 | **WorldMemArena**：多模态 Agent 记忆四阶段评估（Action-World Interaction Loop） | ★★★★★ |
| 2605.30332 | **Colored Noise Sampling（CNS）**：扩散模型无训练加速采样（FID -24%） | ★★★★ |
| 2605.28591 | **Models Know Evaluation Design**：了解评估设计的模型更安全（安全 benchmark 新威胁） | ★★★★ |
| 2605.28807 | **Calibrated Collective Oversight（CCO）**：弱监督者约束强 Agent（Conformal Decision Theory） | ★★★★ |
| 2605.28742 | **CONTRAST**：5 样本对比反思快速自我改进 | ★★★★ |
| 2605.28792 | **CaMBRAIN**：Mamba SSM 实时 EEG 推断（线性复杂度，10x 吞吐量） | ★★★★ |
| 2605.28764 | **SwarmHarness**：去中心化 Agent 计算网络（Shapley-value 激励） | ★★★ |
| 2605.28421 | **DenoiseRL**：通过恢复嘈杂前缀引导推理模型 | ★★★ |
| 2605.27882 | **VibeSearchBench**：中长期主动搜索评测基准 | ★★★ |
| 2605.27295 | **Gemini Embedding 2**：原生多模态嵌入模型 | ★★★ |

---

## 五、明日待办

- [ ] **请老大提供飞书 Bitable URL**：格式 `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`，解锁 4 表自动录入
- [ ] WorldMemArena（2605.29341）和 Colored Noise Sampling（2605.30332）可录入"深度拆解"表，标记"arXiv 论文跟踪"
- [ ] 本周其他 8 篇论文同步录入"arXiv 论文跟踪"表

---

*报告时间：2026-05-29 20:00 PM (Asia/Shanghai) | 数据来源：aihot.virxact.com 精选（5/28-5/29）+ arXiv cs.AI（5/25-5/29）+ 各官网/HuggingFace/Twitter*