# AI 学习资源库 · 晚间汇报 · 2026-05-04（周一）

⚠️ **飞书多维表格 URL 仍未存储，连续第 16+ 天无法自动录入。**
本次已整理 4 表 × 10 条 + arXiv 10 条，共 50 条可直接复制粘贴录入。
请老大提供任意一个表格的 URL（格式：https://xxx.feishu.cn/base/xxxxx?table=xxxxx）

---

【一、今日 AI/产品/技术/社区动态】

▌大厂/产品动态
1. **DeepClaude — Claude Code agent loop with DeepSeek V4 Pro** — 514 HN points，GitHub 开源项目，将 Claude Code 的 agent loop 思想迁移到 DeepSeek V4 Pro，引发 Agent 架构讨论 → github.com/aattaran/deepclaude
2. **GameStop 收购 eBay 价值 $55.5B** — 181 HN points，意外并购，零售业整合 → bbc.co.uk
3. **ASML 核心产品揭秘** — 40 HN points，半导体设备深度分析 → siliconimist.com
4. **Notepad++ Mac 假冒品** — 226 HN points，商标侵权，正版告警 → notepad-plus-plus.org

▌社区热点
5. **The Road to a Billion-Token Context** — ACM CACM，18 HN points，大上下文窗口技术分析 → acm.org
6. **神经网络与加密算法的相似性** — 2025年研究回顾，relevance → quantamagazine
7. **BYOMesh — LoRa mesh 新品** — 100x 带宽提升，397 HN points → partyon.xyz
8. **DeepClaude 开源意义** — 204 comments，Claude Code 架构的"平权"版本
9. **Texico 无电脑学编程** — 日本 NHK 教育节目，73 HN points
10. **RC A380 最大遥控飞机** — YouTube 视频，26 HN points

---

【二、飞书多维表格录入内容（4表×10条）】

📋 表1：每日简报（10条）
1. DeepClaude 开源 | Claude Code agent loop + DeepSeek V4 Pro，514 HN | github.com/aattaran | 2026-05-04
2. GameStop $55.5B 收购 eBay | 零售业大整合 | BBC | 2026-05-04
3. ASML 核心产品揭秘 | 半导体设备深度分析 | siliconimist.com | 2026-05-04
4. Notepad++ Mac 假冒品 | 商标侵权，正版告警 | notepad-plus-plus.org | 2026-05-04
5. 亿级上下文窗口之路 | ACM CACM，Token 内核技术分析 | acm.org | 2026-05-04
6. 神经网络≈加密算法 | 2025 研究，结构相似性 | quantamagazine | 2026-05-04
7. BYOMesh LoRa mesh | 100x 带宽，LoRa 新品 | partyon.xyz | 2026-05-04
8. DeepClaude vs Claude Code | 204 comments，Agent 架构讨论 | GitHub | 2026-05-04
9. Texico 无电脑编程 | 日本 NHK 教育方法 | nhk.or.jp | 2026-05-04
10. RC A380 最大遥控飞机 | YouTube 视频 | YouTube | 2026-05-04

📋 表2：工具雷达（10条）
1. DeepClaude | aattaran | Claude Code agent loop + DeepSeek V4 Pro 开源实现 | github.com/aattaran/deepclaude
2. AgentFloor Benchmark | 学术 | 30-task 6-tier Agent 能力阶梯评测 | arxiv.org/abs/2605.00334
3. TokenArena | Megan Wang 等 | 端点级 AI 推理连续基准（能耗+质量+价格）| arxiv.org/abs/2605.00300
4. IVLR | Jinkun Liu | 视觉-语言交替推理，长程机器人操作 | arxiv.org/abs/2605.00438
5. GUI-SD | Yan Zhang | GUI  grounding 自蒸馏框架（OPSD）| arxiv.org/abs/2605.00642
6. AEM | Haotian Zhao 等 | 多轮 Agent RL 自适应熵调制 | arxiv.org/abs/2605.00425
7. Tool Calling Framework | Qinyuan Wu 等 | LLM 工具调用三因素评估（必要性/效用/成本）| arxiv.org/abs/2605.00737
8. AgentReputation | FSE 2026 | 去中心化 Agent 声誉框架 | arxiv.org/abs/2605.00073
9. EASE | Zihao Ding 等 | 纠缠感知子空间切除（联邦多模遗忘）| arxiv.org/abs/2605.00733
10. AI-Human Symbiosis | 多人合作 | AI 功能角色追踪方法论 | arxiv.org/abs/2605.00440

📋 表3：深度拆解（10条）
1. DeepClaude 架构 — Claude Code agent loop 的开源复现，DeepSeek V4 Pro 的 Agent 化改造
2. AgentFloor 评测体系 — 30任务6层级能力阶梯，16个模型×16542次运行的 Agent sizing 结论
3. TokenArena 端点基准 — 78端点×12模型族，端点性能差异高达12.5点准确率，6.2x能效差距
4. IVLR 视觉-语言交替推理 — trace 格式在机器人操作中的语义-几何双层推理，LIBERO 95.5%
5. GUI-SD 自蒸馏 — GRPO 的稀疏信号问题，单 rollout 密集 token 级监督，6个基准最优
6. AEM 自适应熵调制 — 响应级熵分析替代 token 级，优势×相对惊奇乘积驱动探索-利用转换
7. 工具调用三因素框架 — 必要性/效用/成本决策理论，隐藏状态轻量估计器超越自感知配置
8. AgentReputation 三层声誉 — 去中心化执行/声誉/持久化，context-conditional 声誉卡防止领域混淆
9. EASE 三锚点遗忘 — 双侧位移消除跨模态重建通道，余弦-正弦分解隔离遗忘专属方向
10. 亿级上下文技术路径 — 注意力机制的工程极限，检索 vs 生成的质量-速度权衡

📋 表4：知识学堂（10条）
1. Agent Loop 架构 — 观察→推理→行动的闭环，Claude Code 的实现 vs 开源复现的差异
2. Agent Sizing 原则 — 短 horizon 结构化任务用小模型，long-horizon 规划用 frontier 模型
3. 端点级基准测试 — (provider, model, SKU) 三元组才是真实部署单元，而非模型本身
4. Interleaved Vision-Language Reasoning — trace 作为显式中间表示，交替文本子目标与视觉关键帧
5. On-Policy Self-Distillation — 单 rollout 密集监督，Gaussian soft mask 保护精确坐标不泄露
6. 熵调制信用分配 — token 级到响应级的方差降低，自然梯度驱动探索-利用平衡
7. Decision Theory 工具调用 — 规范性视角（真实需求）vs 描述性视角（自感知需求）的对齐问题
8. 去中心化声誉系统 — 执行层/声誉服务/防篡改三层分离，verification regime 动态调整
9. 联邦多模态遗忘 — 锚点原理：双线性耦合/子空间纠缠/持续联邦更新三通道同时切断
10. AI 功能角色追踪 — 人类辅助编辑 vs AI 自主生成的角色推断方法

---

【三、arXiv 论文跟踪（本周重点）】

📋 arXiv 论文录入（10条，标记"arXiv 论文跟踪"）
1. AgentFloor: Small Open-Weight Models Tool Use Ladder | arXiv:2605.00334 | cs.AI | 16模型×16542次运行，Agent sizing 边界清晰 ★★★
2. To Call or Not to Call: LLM Tool Calling Framework | arXiv:2605.00737 | cs.AI | 三因素（必要性/效用/成本）决策理论，隐藏状态估计器 ★★★
3. IVLR: Interleaved Vision-Language Reasoning | arXiv:2605.00438 | cs.AI/RO | trace 格式，LIBERO 95.5%，长程机器人操作 ★★★
4. GUI-SD: On-Policy Self-Distillation for GUI Grounding | arXiv:2605.00642 | cs.AI/CV | OPSD 密集监督，GRPO 替代方案 ★★
5. AEM: Adaptive Entropy Modulation for Agentic RL | arXiv:2605.00425 | cs.AI | 响应级熵，优势×惊奇乘积驱动探索-利用 ★★
6. AgentReputation: Decentralized Agent AI Reputation | arXiv:2605.00073 | cs.AI/FSE 2026 | 三层声誉框架，context-conditional 声誉卡 ★★
7. TokenArena: Continuous Inference Benchmark | arXiv:2605.00300 | cs.AI | 78端点×12模型族，端点差异高达12.5点 ★★
8. EASE: Entanglement-Aware Subspace Excision | arXiv:2605.00733 | cs.NI | 三锚点联邦遗忘，0.2 R@1差距匹配重训练 ★★
9. AI-Human Symbiosis: Tracing AI Functional Roles | arXiv:2605.00440 | cs.AI/CL/HC | AI 参与角色推断，辅助编辑 vs 自主生成 ★★
10. Trip Planning Agentic AI | arXiv:2605.00276 | cs.AI/IV 2026 | 编排 Agent 协调交通/充电/POI，77.4% TOP 准确率 ★★

---

【四、向老大解读重点论文】★★★

━━━━━━━━━━━━━━━━━━━━━━━━
论文一：AgentFloor（2605.00334）★★★ 首选
━━━━━━━━━━━━━━━━━━━━━━━━

【核心贡献】
来自 16 个开源模型（0.27B~32B）+ GPT-5 的 16,542 次评测，构建了一个 30 任务 / 6 层级的 Agent 能力阶梯评测基准。评测维度包括：指令遵循、工具使用、多步协调、长程规划。

关键结论：**小模型已经足够处理大部分短 horizon、结构化的工具调用工作**，而 frontier 模型的真正优势只在"需要持续协调和长程约束追踪的规划任务"上。

【为什么重要】

① 首次用大规模实验数据回答了"Agent 该用多大的模型"这个问题：
  - 常规工具调用 → 小模型即可（成本低、速度快）
  - 长程规划 + 约束追踪 → 必须 frontier 模型
  - 这两个能力之间有清晰的"分界线"

② 模型失败不是单纯的规模问题，而是任务特性问题：
  - 有些失败可以通过 target intervention 修复，但效果是模型特定的，不是通用的
  - 意味着 Agent 架构设计不能只靠 scaling

③ 对老大学习 Agent 的直接价值：
  - 你的学习 Agent 在不同任务上应该用不同规模的模型
  - 简单查询/知识检索 → 小模型（节省成本）
  - 复杂推理/学习路径规划 → 大模型
  - 这是构建 cost-efficient 学习 Agent 的核心原则

【难度】中等。评测设计直观，结论实用。可以作为"Agent 资源分配"的设计手册。

━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━
论文二：To Call or Not to Call（2605.00737）★★★ 备选
━━━━━━━━━━━━━━━━━━━━━━━━

【核心贡献】
来自 Qinyuan Wu 等的研究，引入决策理论框架评估 LLM 工具调用决策，沿三个维度分析：必要性（是否真的需要工具）、效用（工具返回的信息是否有用）、成本（调用工具的代价）。

核心发现：**模型自我感知的需要和效用往往与真实需要和效用不对齐**。基于隐藏状态的轻量估计器可以超越模型的自我判断，显著提升任务表现。

【为什么值得关注】

① 这是第一个系统研究"何时调用工具"的框架
  - 之前的研究都是"如何更好地调用工具"，忽略了一个更根本的问题：该不该调用
  - 特别是 web search 场景，内部知识充足时调用反而引入噪声

② 三因素（必要性/效用/成本）的决策框架非常实用：
  - 可以直接用于学习 Agent 的"工具选择策略"
  - 学习任务简单→不需要搜索；学习任务超出当前知识边界→需要搜索
  - 这和 AgentFloor 的 sizing 分层是同一个思路的不同层面

③ 隐藏状态估计器 > 模型自判断：
  - 说明 LLM 对自己"是否需要工具"的判断是不可靠的
  - 需要外部的"元认知"模块来监督工具调用决策

【对老大学习 Agent 的双重价值】
① 作为系统设计原则：给 Agent 加一个工具调用路由器，而不是让模型自己决定
② 作为学习方法：什么时候该搜索、什么时候该推理——这个边界比模型自己知道的更清晰

【难度】中等。决策理论框架直观，实验验证充分。

---

【两篇论文的关联】
AgentFloor 告诉我们：不同任务该用不同规模的模型。
To Call or Not to Call 告诉我们：同一任务内，模型自己对"是否需要工具"的判断也不可靠。
一篇解决"用多大的模型"，一篇解决"该不该用工具"——两者共同构成了 Agent 资源分配的完整图景，是构建高效学习 Agent 不可或缺的工程原则。

---

【附：明日待办提醒】

⚠️ **飞书多维表格 URL（含 app_token + table_id）仍未存储，连续第 16+ 天。**

请老大提供任意一个表格的 URL：
`https://xxx.feishu.cn/base/xxxxx?table=xxxxx`
或直接提供 `app_token` 和 `table_id`

收到后我可立即执行 4 表 × 10 条 + arXiv 10 条的批量录入。