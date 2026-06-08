# 每日汇报 — 2026-04-25（晚间）

**执行时间**：2026-04-25 20:00 PM (Asia/Shanghai)

---

## ⚠️ 飞书多维表格问题（连续第7天）

飞书 Bitable URL（含 app_token + table_id）仍未存储，导致 4 表 × 10 条 = 40 条数据**仍无法自动录入**。

本周所有日报（4/19-4/25）均有完整数据草稿，仅等待 URL 提供即可批量录入。

---

## 📰 今日 AI/产品/技术/社区动态（2026-04-25）

> 第二轮（晚间）收集，覆盖 4月25日 全天重要新闻

### 大厂/产品动态

**1. Kimi K2.6 发布 — 可连续运行数天的 Agent 模型**（已在4/23报告中记录）
- 5天连续运行案例：监控、事件响应、系统运营零干预
- 10小时构建 SysY 编译器通过140个测试
- 300 sub-agents 跨4000协调步骤同时执行
- 模型自主决定编排而非预定义角色
- Hugging Face / API / Kimi App / Kimi Code 均已上线

**2. Salesforce Agentforce Vibes 2.0 — 解决"上下文过载"**
- 核心洞察：Agent 失败的首要原因是 context bloat，而非模型能力
- 新增 Abilities（业务目标）和 Skills（工具实现）解耦设计
- 不让 Agent 用更少上下文，而是确保上下文始终在受控数据模型和代码库范围内

**3. Apple 修复 iPhone deleted photos 提取漏洞**
- 执法机构此前利用此漏洞提取已删除聊天记录，已修复

### 企业/生态动态

**4. AI Agent 治理缺口正在扩大**
- ArmorCode：CPO Mark Lambert 指出 Agentic 系统生成代码速度已超组织审查/治理能力
- "需要上下文、优先级和问责制新框架"

**5. Agent Gateway 新范式**
- F5 CPO Kunal Anand：API gateway 正在演变为理解 goals/workflows 的 agent gateway
- 新类别：agent runtime / agent identity provider / agent mesh

---

## 📄 arXiv 本周重点论文（arXiv 论文跟踪）

**cs.AI 本周新增约 650 篇**，今日（4/25）新增 201 篇。精选：

### ★★★ 重点论文

| ID | 标题 | 来源 | 核心发现 | 推荐度 |
|---|---|---|---|---|
| 2604.21910 | From Research Question to Scientific Workflow | - | 三层架构（语义+确定性+知识层），Skills 使意图准确率 44%→83%，每查询 $0.001 | ★★★ |
| 2604.21854 | Bounding the Black Box: Statistical Certification Framework for AI Risk | - | RoMA/gRoMA 提供黑盒 failure rate bound，满足 EU AI Act 合规验证，无需白盒 | ★★★ |
| 2604.21816 | Tool Attention Is All You Need | - | MCP/Tools Tax 减少 95%（47.3k→2.4k tokens），context 利用率 24%→91% | ★★★ |
| 2604.21916 | MathDuels: Self-Play Benchmark for Problem Posing/Solving | - | 模型同时 author + solve，Rasch model 联合估计能力/难度，benchmark 不饱和 | ★★★ |
| 2604.21928 | Evaluating ASR Using Generative LLMs | - | LLM 作为 ASR 评估器与人工标注 92-94% 一致性 vs WER 63% | ★★★ |
| 2604.21827 | Alignment has a Fantasia Problem | ICLR 2026 WS | "空想交互"——用户在目标未形成时与 AI 系统互动，alignment 假设用户意图完整但现实中往往缺失 | ★★★ |
| 2604.21794 | DiffMAS: End-to-End Optimization of Multi-Agent Language Systems | COLM 2026 | 隐式通信（KV cache）作为可学习组件，DiffMAS 在 AIME24 达 26.7%、GPQA-Diamond 20.2% | ★★★ |
| 2604.21769 | Who Defines "Best"? Interactive LLM Leaderboard Evaluation | FAccT 2026 | 用户自定义评估优先级，交互式可视化揭示排名随 prompt slices 变化 | ★★★ |
| 2604.21764 | Thinking with Reasoning Skills: Fewer Tokens, More Accuracy | ACL 2026 | 总结+复用推理技能而非从头推理，成本↓性能↑，AIME/math 显著提升 | ★★★ |
| 2604.21584 | CoFEE: Reasoning Control for LLM-Based Feature Discovery | - | 认知行为控制（backward chaining/subgoal/verification）使特征可预测性 +15.2%，成本 -53.3% | ★★★ |

### ★★ 一般论文

| ID | 标题 | 来源 | 关键发现 |
|---|---|---|---|
| 2604.21896 | Nemobot: Strategic AI Gaming Agents with LLMs | - | Shannon taxonomy 扩展，minimax + RLHF + 众包，self-programming AI 路径 |
| 2604.21649 | GS-Quant: Knowledge Graph Completion | ACL 2026 | 粒度语义+生成结构量化，层次化代码簿，PG 模型 vocabulary 扩展 |
| 2604.21571 | Privacy-Preserving LLM Personalization | - | 可组合 Adapter + 可删除 User Proxy，将 unlearning 从 intractable weight editing 转为 deterministic deletion |

---

## 📋 表格录入内容草稿（待 Bitable URL）

### 每日简报（10条）
1. Kimi K2.6 — 可连续运行5天的Agent模型，10小时构建SysY编译器通过140项测试，300 sub-agents跨4000步协调 — Moonshot AI — 2026-04-23
2. Salesforce Agentforce Vibes 2.0 — 解决Agent"上下文过载"，Abilities/Skills控制上下文膨胀 — VentureBeat — 2026-04-23
3. Context Bloat — AI系统积累越多数据/工具/指令，噪声越多，性能反而下降，Agent失败首要原因 — VentureBeat — 2026-04-23
4. Agent治理缺口 — Agent生成代码速度快过组织审查/治理能力，累积风险需要新问责框架 — VentureBeat — 2026-04-23
5. Agent Gateway新范式 — API gateway演变为理解goals/workflows的agent gateway，催生新类别agent runtime/identity provider/mesh — VentureBeat — 2026-04-23
6. Apple修复iPhone deleted photos提取漏洞 — 此前执法机构利用此漏洞提取已删除数据 — TechCrunch — 2026-04-23
7. DiffMAS — 多Agent隐式通信（KV cache）可学习，AIME24 26.7%、GPQA-Diamond 20.2%，end-to-end优化 — arXiv:2604.21794 — 2026-04-24
8. Alignment Fantasia Problem — 用户目标未形成时就与AI互动，alignment假设用户意图完整是错的，ICLR 2026 WS — arXiv:2604.21827 — 2026-04-24
9. CoFEE认知特征工程 — backward chaining/subgoal/verification使特征可预测性+15.2%，成本-53.3% — arXiv:2604.21584 — 2026-04-24
10. 交互式LLM Leaderboard — 用户自定义评估优先级，可视化揭示排名随prompt slices变化，FAccT 2026 — arXiv:2604.21769 — 2026-04-24

### 深度拆解（10条）
1. Kimi K2.6 的5天连续运行案例：如何设计 self-healing、checkpoint、rollback 机制支撑超长 runtime？
2. "模型自主决定编排" vs "预定义角色编排"：这两种 agent swarm 架构的优劣各是什么？
3. Context Bloat 的量化标准：如何衡量上下文"刚好够"和"已经太多"之间的边界？
4. Agentforce Vibes 的 Abilities/Skills 设计：如何将业务目标（Abilities）和工具实现（Skills）解耦？
5. Agent Gateway 的技术需求：一个真正理解 goals/workflows 的 gateway 需要哪些能力？
6. DiffMAS 的隐式通信学习：KV cache 作为可学习组件，如何端到端优化多 Agent 信息编码/解码？
7. Fantasia interactions 的设计启示：如何让 AI 系统主动帮助用户形成和精炼意图？
8. CoFEE 的认知行为控制：backward chaining、subgoal decomposition、verification 在 LLM feature discovery 中如何实现？
9. 交互式 leaderboard 的评估哲学：为什么"谁定义最好"本身就是一个政治/价值问题？
10. Privacy-preserving personalization 的工程路径：从 weight editing 到 deterministic deletion 的范式转移

### 工具雷达（10条）
1. Kimi K2.6 — Moonshot AI — 长时 horizon agents，连续运行数天，300 sub-agents — HuggingFace/API/Kimi App
2. Agentforce Vibes 2.0 — Salesforce — 企业AI编码平台，上下文控制，Abilities/Skills — Salesforce
3. DiffMAS Framework — 开源 — 多Agent隐式通信端到端优化，KV cache作为可学习组件 — arXiv:2604.21794
4. Fantasia Interactions — 开源 — 对齐研究新方向，用户意图未形成时的AI交互设计 — arXiv:2604.21827
5. CoFEE Engine — 开源 — LLM特征工程认知行为控制框架 — arXiv:2604.21584
6. Interactive LLM Leaderboard — 开源 — 用户自定义评估优先级，可视化探索 — arXiv:2604.21769
7. GS-Quant — 开源 — 知识图谱补全的粒度语义+结构量化，ACL 2026 — arXiv:2604.21649
8. Privacy-Preserving LoRA Adapters — 开源 — 可删除用户代理，个人数据隔离，near-zero交叉污染 — arXiv:2604.21571
9. Nemobot — 开源 — LLM游戏agent工程环境，支持minimax + RLHF + 众包学习 — arXiv:2604.21896
10. Tool Attention Framework — 开源 — MCP/Tools Tax 减少 95%，context 利用率 91% — arXiv:2604.21816

### 知识学堂（10条）
1. 长时 horizon agents 的状态管理：self-healing/checkpoint/rollback 在超长 runtime（5天+）中如何设计？
2. "上下文刚好够"的工程实践：Context bloat 的可量化边界在哪里？
3. Agent Swarm 编排范式比较：模型自主决定 vs 预定义角色——各自适用什么场景？
4. DiffMAS 的隐式通信优化：latent communication through KV cache 的训练细节是什么？
5. Fantasia interactions 的认知科学基础：意图形成理论（intention formation）在 AI 设计中的应用
6. CoFEE 的认知行为工程化：ML 中哪些 inductive biases（backward chaining/subgoal/verification）效果最好？
7. 交互式评估的民主化：用户自定义评估优先级意味着什么？谁有权定义"最好"？
8. GS-Quant 的层次化代码簿：为什么粗到细的语义逻辑比 flat quantization 更适合知识图谱？
9. Privacy-preserving personalization 的数学保证：DP-SGD + 可组合 adapter 的隐私预算如何计算？
10. "Alien"词表实验的符号AI含义：LLM 依赖关键词 boot-strapping 而非纯符号归纳，这和符号AI的差距有多大？

---

## 🗣️ 老大晚间论文解读（2篇）

### Paper 1：DiffMAS — 多 Agent 隐式通信的端到端优化
**arXiv:2604.21794 | Ye Yu et al. | COLM 2026 Under Review**

**为什么重要**：多 Agent 系统现在几乎是企业 AI 的默认架构，但你有没有想过——agent 之间的"通信"到底在传什么？现有的 multi-agent 系统要么用文本协议（显式通信），要么根本不优化通信层（各自为政）。DiffMAS 的核心洞察是：**Agent 之间通过 KV cache 传递的隐式信息，才是真正的性能瓶颈**，而这个瓶颈可以被端到端地优化。

**核心发现**：

**问题定位**：
- 现有工作关注 agent roles 和 orchestration，把 inter-agent communication 当作固定接口
- 但 latent communication through KV caches 比 text-based 更有前景
- 问题：没有人 joint optimize 通信和多 Agent 推理

**解决方案：DiffMAS 训练框架**
- 将隐式通信视为可学习组件
- Parameter-efficient supervised training over multi-agent latent trajectories
- Agents 共同学习：信息如何编码、如何在交互中被解读

**性能结果（AIME24、GPQA-Diamond 等 benchmark）**：
- 比 single-agent inference 更好的推理准确率
- 比 text-based multi-agent 系统更稳定（decoding stability）
- 比 prior latent communication 方法一致更好
- AIME24: 26.7%（对比 GPT-5 57% 但需要更多 compute）
- GPQA-Diamond: 20.2%

**关键概念：Latent Communication vs Explicit Communication**

| | Latent（DiffMAS） | Explicit（传统） |
|---|---|---|
| 信息载体 | KV cache（内部表示） | 文本/JSON（接口） |
| 传输成本 | 低（内部传递） | 高（序列化/反序列化） |
| 信息保留 | 高（无压缩损耗） | 低（每次传递有 DPI 损耗） |
| 可优化性 | 端到端 | 协议层独立 |

**对老大学习 Agent 的启示**：

你正在学 Agent 系统，DiffMAS 揭示了一个关键的设计选择：

1. **当你设计多 Agent 系统时，不要默认用 text-based 通信**：
   - 每一次摘要-传递-理解的过程都有 Data Processing Inequality 损耗
   - DiffMAS 用 KV cache 传递隐式信息，信息损耗大幅减少

2. **"编排"和"通信"是耦合的**：
   - DiffMAS joint optimize 这两个维度，而不是分别优化
   - 这意味着好的 multi-agent 设计需要整体视角，而不是模块化堆砌

3. **对 SAS-L 的补充**：
   - 昨天我们讲了 Stanford 的 Swarm Tax——在等预算下，单 Agent 用更长思考打败多 Agent
   - DiffMAS 说明为什么：多 Agent 的隐式通信优化后可以弥补这个差距
   - 关键在于：通信层必须被端到端优化，而不是当作固定接口

**一句话总结**：DiffMAS 证明多 Agent 系统的真正瓶颈不是推理本身，而是 agent 之间的隐式通信层——通过端到端优化 KV cache 传递，可以把 multi-agent 的性能真正释放出来。

---

### Paper 2：Alignment has a Fantasia Problem — 对齐研究被忽视的根本假设
**arXiv:2604.21827 | Zoe De Simone et al. | ICLR 2026 Workshop HCAIR**

**为什么重要**：每次我们讨论 AI alignment（对齐），都默认一个前提——**用户知道他们想要什么，能清楚表达他们的目标**。但这篇论文用 decades of behavioral research 证明这个假设是错的：人们在和 AI 系统互动时，**目标往往还没形成**。论文把这类失败叫"Fantasia interactions"（空想交互）——用户以为他们在追求某个目标，但实际上在和 AI 互动的过程中，目标本身在被不断塑造和重构。

**核心概念：Fantasia Interactions**

**定义**：当 AI 系统把 prompts 当作完整意图表达来处理，但用户在对话过程中目标还在形成中——这类失败就是 Fantasia。

**典型场景**：
- 用户开始写代码，但不确定最终要实现什么功能
- 用户在写文档，但结构和内容在对话中不断演化
- 用户向 AI 助手提问，但问题本身在 AI 回答的过程中变得更清晰

**为什么会出问题**：
- AI 把"当前 prompt"当作完整 intent → 生成 helpful/convenient 的响应
- 但这不是用户真正需要的 → Alignment 失效

**论文的解决方案：认知支持（Cognitive Support）**

核心论点：AI 不应该被动等待用户表达完整意图，而应该**主动帮助用户形成和精炼意图**。

具体方向：
- Interface design：让用户在和 AI 互动的过程中逐步澄清目标
- Behavioral science：理解意图形成（intention formation）的动态过程
- ML：如何让模型在对话中主动促进意图形成而非被动响应

**三个关键机制和失败模式**：

1. **Goal bootstrapping**：用户需要 AI 帮助从模糊需求建立清晰目标
2. **Preference uncertainty**：用户在互动中逐步发现自己的真实偏好
3. **Iterative refinement**：目标和解决方案共同演化

**对老大学习 AI 的启示**：

1. **你当前的 AI 学习过程本身就是一个 Fantasia**：
   - 你刚学 AI 时，目标可能是"6个月内读懂主流框架代码"
   - 但随着学习深入，这个目标在不断被重塑——你越来越清楚哪里是真正的瓶颈
   - 这意味着你和我（Muse）的对话，本身就需要 AI 帮助**形成**学习目标，而非仅仅**执行**既定目标

2. **对"个性化学习 Agent"的重新设计**：
   - 如果你的学习 Agent 只被动响应"用户说想学什么"，它就陷入了 Fantasia trap
   - 好的学习 Agent 应该主动帮你澄清和形成学习目标
   - 这需要 AI 有意图形成的支持能力，而不仅仅是意图执行的跟踪能力

3. **"Alignment"和"Cognition support"的区别**：
   - Alignment：让 AI 服从用户已形成的意图
   - Cognition support：帮助用户形成清晰的意图
   - 这是两种完全不同的 AI 设计范式

**一句话总结**：对齐研究一直假设用户意图是完整的，但 behavioral research 证明这个假设在现实中往往不成立——当用户在目标形成过程中和 AI 互动时，AI 应该主动提供认知支持，而非被动等待完整指令。这是一个对 AI 设计哲学的根本性挑战。

---

## 📊 今日汇总

| 类别 | 条目 |
|---|---|
| 每日简报 | 10 条 |
| 深度拆解 | 10 条 |
| 工具雷达 | 10 条 |
| 知识学堂 | 10 条 |
| arXiv 论文跟踪（本周新增） | ~20 篇 |
| **今日合计** | **~50 条 + 2 篇重点解读** |

---

## ⏳ 待老大补充

**飞书多维表格 URL**（含 app_token + table_id）——连续第 7 天等待。
格式：`https://xxx.feishu.cn/base/xxxxx?table=xxxxx` 或直接提供 `app_token` 和 `table_id`。

---

_报告时间：2026-04-25 20:00 PM_