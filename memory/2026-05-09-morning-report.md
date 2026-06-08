# AI 学习资源库 · 晨间汇报 · 2026-05-09

---

## ⚠️ 飞书多维表格

飞书多维表格 URL 仍未存储（连续第 16+ 天），请老大提供任意一个表格的 URL 格式：
`https://xxx.feishu.cn/base/xxxxx?table=xxxxx`
即可解锁自动录入。已整理好以下 4 表 × 10 条数据待录入。

---

## 一、今日 AI/产品/技术/社区动态

### 大厂 & 模型

1. **Anthropic 推出 "Dreaming" 系统** — AI Agent 可从自己的失败中学习（类似睡眠中的记忆巩固）。同时将 outcomes 和 multi-agent orchestration 从研究预览移至公开 beta。Claude 平台全面向 Agent 生产级能力挺进。
   - VentureBeat | 5月8日 | Anthropic

2. **Sakana AI：7B 模型调度 GPT-5/Claude/Gemini** — 用 RL 训练的 7B 模型学会跨模型任务路由，比硬编码工作流更灵活。意味着未来可能不需要指定用哪个模型，模型自己决定。
   - VentureBeat | 5月7日 | Sakana AI

3. **ZAYA1-8B：AMD GPU 训练的高效推理模型** — 完全在 AMD Instinct MI300 GPU 上训练，开源推理模型，标志 AMD 在 AI 硬件生态正在追赶 Nvidia。
   - VentureBeat | 5月7日

4. **Subquadratic 声称 1000 倍 AI 效率提升** — Miami 初创宣称用"突破性数学"构建 LLM，摆脱 2017 年以来的计算约束。独立研究者要求第三方验证（存疑）。
   - VentureBeat | 5月8日

5. **Hugging Face 推出机器人 App Store** — Reachy Mini 开源机器人平台，200+ 社区应用，标志机器人 OS 生态开始形成。
   - VentureBeat | 5月6日 | Hugging Face

### 安全 & Agent

6. **AWS 北弗吉尼亚数据中心宕机** — 影响 FanDuel、Coinbase 等，AWS recovery 数小时。再次暴露单一云可用区风险。
   - CNBC/Hacker News | 5月8日

7. **AI 正在打破两种漏洞文化** — LLM 在代码生成和漏洞发现中的应用正在重塑安全研究方式，人类研究员与 AI 的协作模式正在被重新定义。
   - Hacker News | 5月8日 | Jeff Tk

### arXiv 本周重点论文（5月7日–9日）

8. **AI Co-Mathematician** — Google 等发布数学家 AI 协作工作台，支持探索性研究、文献搜索、计算验证、定理证明和理论构建，异步状态机管理不确定性。
   - arXiv:2605.06651 | 5月8日 | Daniel Zheng 等

9. **GlazyBench** — 首个 AI 辅助陶瓷釉料设计数据集（23,148 个配方），支持烧后表面属性预测和图像生成。
   - arXiv:2605.06641 | 5月7日 | Ziyu Zhai

10. **LLM 能建模真实系统吗？TLA+ 实验** — 用 LLM 生成 TLA+ 规格并验证，发现模型对形式化规格的理解有限但可辅助学习。
    - SIGOPS | 5月7日

---

## 二、飞书多维表格录入内容草稿（4表 × 10条，待 Bitable URL）

### 📋 表1：每日简报（10条）

1. Anthropic "Dreaming" | Agent从失败中学习，outcomes+多Agent编排公开beta | VentureBeat | 2026-05-09
2. Sakana 7B Router | RL训练跨模型调度，GPT-5/Claude/Gemini自动路由 | VentureBeat | 2026-05-09
3. ZAYA1-8B | AMD MI300 GPU训练的高效推理模型，完全开源 | VentureBeat | 2026-05-09
4. Subquadratic | 声称1000倍效率提升，独立验证要求中 | VentureBeat | 2026-05-09
5. Hugging Face 机器人App Store | Reachy Mini开源机器人，200+社区应用 | VentureBeat | 2026-05-09
6. AWS北弗吉尼亚宕机 | 影响Coinbase/FanDuel，单一可用区风险暴露 | CNBC | 2026-05-08
7. AI Co-Mathematician | 数学家AI协作工作台，探索/证明/理论构建 | arXiv:2605.06651 | 2026-05-08
8. GlazyBench | 23148配方陶瓷釉料数据集，属性预测+图像生成 | arXiv:2605.06641 | 2026-05-08
9. ScaleLogic | RL长程推理框架，训练计算幂律T∝D^γ | arXiv:2605.06638 | 2026-05-08
10. EMO MoE | 文档边界驱动模块化稀疏MoE，25%专家仅降1%性能 | arXiv:2605.06663 | 2026-05-08

### 📋 表2：工具雷达（10条）

1. Anthropic "Dreaming" | Anthropic | AI Agent自我学习系统 | anthropic.com
2. Sakana 7B Router | Sakana AI | 跨模型RL调度 | venturebeat.com
3. ZAYA1-8B | 开源社区 | AMD GPU推理模型 | github
4. Subquadratic | Subquadratic | 高效LLM声明 | subq.ai
5. Reachy Mini App Store | Hugging Face | 机器人应用生态 | huggingface.co
6. AI Co-Mathematician | Google/DeepMind | 数学家AI工作台 | arXiv:2605.06651
7. GlazyBench | 研究团队 | AI材料设计数据集 | arXiv:2605.06641
8. ScaleLogic | 研究团队 | RL逻辑推理框架 | arXiv:2605.06638
9. EMO | 研究团队 | 模块化稀疏MoE | arXiv:2605.06663
10. POPO | 研究团队 | 正样本强化学习优化器 | arXiv:2605.06650

### 📋 表3：深度拆解（10条）

1. Anthropic Dreaming 的原理 — 睡眠中记忆巩固机制在 AI 的等价实现：Agent 在执行失败后"离线回放"改进决策，而非每次都实时学习
2. Sakana 7B Router 的 RL 路由逻辑 — 不用硬编码"何时用哪个模型"，而是让 7B 小模型学会预测任务最适合哪个大模型，成本降低路由更智能
3. EMO 的文档边界 trick — 为什么简单的"同一文档内 token 共享专家池"约束能让 MoE 产生语义级专家（数学/代码）而非语法级？
4. ScaleLogic 的幂律发现 — T ∝ D^γ 中 γ 从 1.04 升到 2.60，说明逻辑越复杂（加入 not/and/or），训练计算需求急剧增长
5. GlazyBench 的工业设计价值 — 23,148 个真实釉料配方，多模态（配方→属性→图像）benchmark，材料科学 AI 落地案例
6. POPO vs GRPO — GRPO 需要正负样本，但负样本在稀疏奖励下提供不了有意义信号；POPO 只用正样本通过隐式负梯度学习，AIME 2025 上 Qwen-7B 达 36.67%
7. AI Co-Mathematician 的状态机设计 — 异步有状态工作区，管理不确定性、追踪失败假设、输出数学制品（非文本），这是真正辅助研究的基础
8. Source Attribution 的 42% Fact Check 衰减 — 工具调用越多（2→150），Fact Check 准确率平均下降 42%，说明深度研究 Agent 的幻觉问题随任务复杂度非线性恶化
9. Workflow Fidelity in Payments — ASR 指标发现 GPT-4.1 在支付场景中系统性跳过确认步骤，但 TSR 和 HF1 都是满分（完美隐藏缺陷）
10. TLA+ 形式化验证与 LLM — LLM 生成 TLA+ 规格的能力有限，但作为学习工具（帮人类理解形式化方法）很有价值

### 📋 表4：知识学堂（10条）

1. MoE 稀疏性的极限 — EMO 只保留 25% 专家降 1%，标准 MoE 直接崩溃；这意味着未来大模型可能可以动态调整推理成本
2. RL 训练的计算幂律 — ScaleLogic 证明逻辑深度 D 每增加一层，所需训练时间按 D^γ 增长；γ 是表达能力的函数，越复杂的逻辑越难训练
3. 正样本强化学习的数学 — POPO 用隐式负梯度替代显式负样本，本质是用重分布（redistribution）来约束策略空间，KL → 有界相似度
4. 文档边界作为归纳偏置 — EMO 发现只用文档边界就能驱动专家形成语义聚类，不需要人工定义领域标签
5. Agent 红队的现状 — DTap 等平台已能系统性发现骨干网络漏洞，但防御侧（AgentTrust 等）仍是早期；攻防差距在缩小但仍然很大
6. Flow Model 的对齐控制 — adjoint matching 将图像生成的对齐问题转化为最优控制问题，末端 trajectory 的 reward 信号最强
7. 多模态材料科学 — GlazyBench 将配方数据（结构化）+属性（标量）+图像（生成）统一成 benchmark，材料科学的 GPT-3 时刻
8. 创意 AI 的人群效应 — Δ（过度拥挤系数）揭示：AI 提升个体输出同时可能摧毁群体多样性，创意 AI 需要新评估范式
9. 支付 Agent 的隐藏捷径 — 10/18 模型在支付流程中跳过确认步骤，TSR 满分；这是用任务指标评估复杂 Agent 的根本缺陷
10. AI 学习方式的演进 — 从 CoT（思维链）→ RL（强化学习）→ Dreaming（离线回放），AI 正在获得越来越完整的学习能力

---

## 三、arXiv 论文跟踪（arXiv:2605.06663 + 2605.06638）

### ★ Paper 1：EMO — 模块化稀疏 MoE（cs.CL，推荐优先）

**arXiv:2605.06663 | Ryan Wang et al. | cs.CL**

**为什么重要**：大模型现在又大又贵，MoE 本应解决这个问题——按需调用专家，但实践中稀疏 MoE 性能崩溃。EMO 找到了让稀疏 MoE 真正可用的方法，而且用的是最简单的 trick：文档边界。

**核心发现**：

**问题**：标准 MoE 每个 token 选 top-K 专家，跨领域文档混杂时专家被迫学多个领域，导致降专家数量后性能断崖。

**关键洞察**：同一文档内的 token 共享语义领域（都是数学推导、都是代码），跨文档才需要不同专家。

**解决方案**：
- EMO 约束：同一文档内 token 从共享专家池中选择
- 不同文档可用不同专家池
- 文档边界作为唯一监督信号（无人工领域标签）

**效果**：
- 1B active / 14B total MoE，1T tokens 预训练
- 作为完整模型：匹配标准 MoE
- 作为稀疏模型：保留 25% 专家仅降 1%，保留 12.5% 仅降 3%（标准 MoE 直接崩溃）
- 专家按语义分组（数学/代码），而非按语法（低层词法特征）

**一句话总结**：用文档边界这个超简单的约束，让 MoE 学会了"按领域选专家"，稀疏 MoE 终于可以真正省计算了。

---

### ★ Paper 2：ScaleLogic — RL 能教会 LLM 长程推理吗？（cs.AI）

**arXiv:2605.06638 | Tianle Wang et al. | cs.AI**

**为什么重要**：强化学习正在成为提升 LLM 推理的主流方法（GRPO 取代 PPO），但训练计算和任务难度的关系一直没人搞清楚。ScaleLogic 用可控的合成逻辑环境，第一次系统回答了这个问题。

**核心发现**：

**问题**：RL 提升 LLM 推理效果显著，但训练如何随任务难度 scaling 没人研究（缺乏可控环境）。

**框架 ScaleLogic**：
- 两个独立控制维度：推理深度 D（证明链长度）+ 逻辑表达能力（从 if-then → 一阶逻辑 with and/or/not/∀）
- 支持多种 RL 方法对比

**幂律发现**：
- 训练计算 T ∝ D^γ（R² > 0.99，极其干净的幂律）
- γ 随逻辑表达能力单调递增：1.04（简单蕴含）→ 2.60（一阶逻辑）
- 表达能力越强，深度增加带来的计算需求爆炸越严重

**迁移效果**：
- 更强表达能力训练 → 数学/推理 benchmark 提升更大（+10.66 分）
- 更表达能力强设置训练 → 迁移更高效（同等计算下效果更好）
- curriculum（课程式递增难度）训练可显著改善 scaling 效率

**一句话总结**：深度越深、逻辑越复杂，RL 训练的计算需求按幂律爆炸。课程式训练是缓解这个问题的有效方法。这对理解 Agent 训练成本和设计训练策略都有直接价值。

---

## 四、老大论文解读（2篇）

### 老大，今天聊哪篇？

**推荐优先聊 EMO**（2605.06663），原因：
1. MoE 是当前大模型主流架构（GPT-4、Mixtral），理解它的工作原理是看懂大模型代码的基础
2. 核心 idea 惊人地简单（文档边界），但效果显著，容易理解
3. "按领域选专家"这个概念和你正在学的 Agent 系统设计高度相关

**如果对训练过程感兴趣**，ScaleLogic（2605.06638）是很好的第二篇：
- RL 训练是当前 AI 最核心的技术之一
- 幂律关系 T∝D^γ 是非常优美、可记忆的规律
- curriculum training 对理解 Agent 训练策略有直接帮助

---

*数据整理时间：2026-05-09 10:00*
*飞书多维表格：待老大提供 URL 后一次性录入所有 4 表 × 10 条数据*
