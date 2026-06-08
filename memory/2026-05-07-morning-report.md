# AI 学习资源库 · 晨间汇报 · 2026-05-07

---

## ⚠️ 飞书多维表格

飞书多维表格 URL 仍未存储（连续第 14+ 天），请老大提供任意一个表格的 URL 格式：`https://xxx.feishu.cn/base/xxxxx?table=xxxxx`，即可解锁自动录入。

---

## 一、今日 AI/产品/技术/社区动态

### 大厂 & 模型

1. **LongSeeker** — 蚂蚁 × 浙大 长程搜索智能体，基于 Qwen3-30B-A3B，Context-ReAct 范式动态管理上下文（Skip/Compress/Rollback/Snippet/Delete 五原子操作），BrowseComp 62.5% vs 阿里通义 DeepResearch 46.7%。证明 Compress 操作符具有表达完全性。
   - arXiv:2605.05191 | 5月6日 | Rui Ye

2. **Uno-Orchestra** — 多智能体选择性委托统一框架，22 个 baseline、13 个 benchmark，宏 pass@1 达 77.0%（比最强 workflow baseline 高约 16%），推理成本降低一个数量级。
   - arXiv:2605.05007 | 5月6日 | Zhiqing Cui

3. **Grok 4.3** — xAI 新版模型（延续5月1日动态）

### 安全 & 红队

4. **DTap（DecodingTrust-Agent Platform）** — 首个可控交互式 AI Agent 红队平台，覆盖 14 个真实领域、50+ 模拟环境（Google Workspace / PayPal / Slack 等），附 Autonomous Red-Teaming Agent（DTap-Red）。发布 DTap-Bench 大规模红队数据集。
   - arXiv:2605.04808 | 5月6日 | Zhaorun Chen

5. **AgentTrust** — Runtime 安全拦截层，拦截 Agent 工具调用（文件操作/shell 命令/HTTP/数据库）后再执行， verdict 准确率 96.7%，延迟毫秒级。提供 MCP Server。
   - arXiv:2605.04785 | 5月6日 | Chenglin Yang

6. **AuditRepairBench** — NeurIPS 2026 论文，揭示 Agent 修复 leaderboard 不稳定根源：评估器通道暴露导致排名波动，建立 paired-execution trace corpus，筛选引导盲化减少 55-74% 排名位移。
   - arXiv:2605.04624 | 5月6日 | Yuelin Hu

### 法律 AI 行业

7. **Harvey 推出 Legal Agent Benchmark** — 评估法律 Agent 实际表现（500+ Agent 已上线生产），行业从概念验证转向可量化可靠性。
   - Artificial Lawyer | 5月6日

8. **Corgi 推出 AI 责任险** — Y Combinator 支持，为 AI 公司及用户提供双侧责任险，覆盖 AI 输出错误导致的他方损失。
   - Artificial Lawyer | 5月5日

### 科研方法 & 基础模型

9. **NRI（Neural Rule Inducer）** — IJCAI 2026，零样本逻辑规则归纳基础模型，用统计属性（类条件率/熵/共现）代替字面标识符，实现跨变量身份泛化。符号推理的基础模型可能。
   - arXiv:2605.04916 | 5月6日 | Yin Jun Phua

10. **SPINE（Secure Privacy Integration in Embodied AI）** — ICML 2026 接收，论述隐私是具身 AI 全生命周期架构约束而非局部特征，动态控制信号贯穿感知→规划→交互全链路。
    - arXiv:2605.05017 | 5月6日 | Zhuodong Liu

---

## 二、飞书多维表格录入内容（4表 × 10条）

### 📋 表1：每日简报（10条）

1. LongSeeker | 蚂蚁×浙大，长程搜索Agent，Context-ReAct范式，BrowseComp 62.5% | arXiv:2605.05191 | 2026-05-07
2. Uno-Orchestra | 多Agent选择性委托，宏pass@1 77%，成本降一个数量级 | arXiv:2605.05007 | 2026-05-07
3. DTap红队平台 | 首个可控Agent红队平台，14领域50+环境，DTap-Red自驱动攻击 | arXiv:2605.04808 | 2026-05-07
4. AgentTrust | Runtime安全拦截层，工具调用执行前裁决，延迟毫秒级，MCP兼容 | arXiv:2605.04785 | 2026-05-07
5. AuditRepairBench | Agent修复leaderboard不稳定论文，排名位移减少55-74% | arXiv:2605.04624 | 2026-05-07
6. NRI | IJCAI 2026，零样本逻辑规则基础模型，统计属性泛化 | arXiv:2605.04916 | 2026-05-07
7. SPINE | ICML 2026，具身AI隐私全周期架构约束 | arXiv:2605.05017 | 2026-05-07
8. Harvey Legal Agent Benchmark | 500+法律Agent已上线生产，定量评估时代开启 | Artificial Lawyer | 2026-05-06
9. Corgi AI责任险 | YC支持AI双侧责任险，覆盖输出错误损失 | Artificial Lawyer | 2026-05-05
10. EBM-RL视频角色扮演 | 眼-脑-嘴解耦GRPO框架，提升沉浸感与角色真实性 | arXiv:2605.04733 | 2026-05-06

### 📋 表2：工具雷达（10条）

1. LongSeeker | 蚂蚁/浙大/Qwen | 长程搜索Agent（上下文弹性管理） | github（LongSeeker）
2. DTap | 多机构 | AI Agent红队平台 | github（DecodingTrust）
3. AgentTrust | 研究团队 | Runtime工具调用安全拦截 | github
4. NRI | 研究团队 | 零样本逻辑规则归纳 | github（phuayj/neural-rule-inducer）
5. SPINE | 研究团队 | 具身AI隐私架构框架 | github（rminshen03/EAI_Privacy_Position）
6. Uno-Orchestra | 研究团队 | 多Agent选择性委托 | arXiv
7. BAOC | 研究团队 | 预算感知优化器配置器（内存优化） | anonymous.4open.science
8. Harvey Legal Agent Benchmark | Harvey AI | 法律Agent评估基准 | artificiallawyer.com
9. Corgi | Y Combinator | AI责任险 | corgi.ai
10. EBM-RL | 研究团队 | 视频角色扮演RL框架 | arXiv

### 📋 表3：深度拆解（10条）

1. LongSeeker 的弹性上下文编排 — 为什么"压缩"操作符具有表达完全性，以及这对 Agent 长期记忆的启示
2. Uno-Orchestra 的"选择性委托"哲学 — 不是让强 Agent 更强，而是找到最优的 (model, primitive) 对
3. DTap — Agent 安全评估的基础设施：从 14 领域 50+ 模拟环境看红队方法论演进
4. AgentTrust 的运行时防护 — 执行前拦截 vs 事后基准测试的区别，以及 MCP 集成的工程价值
5. AuditRepairBench 揭示的 leaderboard 欺骗 — 评估器通道暴露如何扭曲修复排名
6. NRI：符号推理的基础模型 — 从字面标识符到统计属性的范式转变
7. SPINE：隐私作为架构约束 — 为什么局部补丁无法解决具身 AI 隐私危机
8. EBM-RL 的感知-认知-应答解耦 — VR/交互叙事中视觉氛围与角色真实性的联合优化
9. BAOC 的块级优化器配置 — 不同网络块梯度行为差异的实践意义
10. 多智能体战略推理（Strat-Reasoner） — 递归推理如何解决非平稳性下的信用分配难题

### 📋 表4：知识学堂（10条）

1. 表达完全性（Expressive Completeness）— Compress 操作符的数学意义与工程权衡
2. 选择性委托 vs 全委托 — Uno-Orchestra 的 77% pass@1 背后的核心洞察
3. 评估器通道暴露（Evaluator-Channel Exposure）— AuditRepairBench 揭示的排名操控机制
4. 执行前裁决 vs 事后评估 — AgentTrust 的实时安全层设计原理
5. 统计属性编码 — NRI 如何用类条件率/熵/共现代替字面标识符实现零样本泛化
6. 隐私即架构约束 — SPINE 对具身 AI 部署的启示
7. 眼-脑-嘴解耦 — EBM-RL 的 [感知]→[思考]→[应答] 结构化框架
8. 块级梯度行为差异 — BAOC 内存优化的理论基础
9. 多智能体递归推理 — Strat-Reasoner 的中心化 CoT 对比模块设计
10. 具身 AI 的全周期隐私 — 为什么感知/规划/交互必须联合设计

---

## 三、arXiv 论文跟踪（本周 cs.AI 重点，标记"arXiv论文跟踪"）

### ★★★ 重点论文（选 1-2 篇向老大解读）

---

#### 📌 重点 1：LongSeeker — Context-ReAct 弹性上下文编排

**论文：** [arXiv:2605.05191](https://arxiv.org/abs/2605.05191) | Rui Ye et al. | 5月6日
**标题：** Elastic Context Orchestration for Long-Horizon Search Agents

**一句话：** 长程搜索 Agent 必须管理不断膨胀的工作上下文（推理轨迹+工具调用+观察），传统方式全部累积导致成本爆炸和幻觉风险。本文提出 Context-ReAct 范式：5个原子操作（Skip/Compress/Rollback/Snippet/Delete）让 Agent 自适应管理上下文，证明 Compress 操作符具有表达完全性。基于 Qwen3-30B-A3B 微调的 LongSeeker 在 BrowseComp 62.5% vs 通义 DeepResearch 43.2%。

**为什么值得关注：** 这解决了 Agent 在长任务中"上下文无限膨胀"的实际问题。如果 Compress 的表达完全性证明成立，这意味着 Agent 可以通过统一的压缩原语处理任意上下文管理需求，是 Agent 记忆系统设计的重要理论进展。

**工程启示：** 上下文管理从"多少放进去"变成"放什么、放多久、什么时候压缩"，这个范式比简单的截断或 RAG 检索更细粒度。

---

#### 📌 重点 2：DTap — 首个可控 Agent 红队平台

**论文：** [arXiv:2605.04808](https://arxiv.org/abs/2605.04808) | Zhaorun Chen et al. | 5月6日
**标题：** DecodingTrust-Agent Platform (DTap): A Controllable and Interactive Red-Teaming Platform for AI Agents

**一句话：** AI Agent 在长程高风险场景中面临严峻安全挑战，现有评估方法缺乏可控、可复现的大规模环境。本文提出 DTap：首个可控交互式 Agent 红队平台，覆盖 14 个真实领域（Google Workspace/PayPal/Slack 等）50+ 模拟环境。配套的 DTap-Red 是首个自驱动红队 Agent，自动探索攻击向量（prompt/tool/skill/environment 等组合）并生成可验证的攻击轨迹数据集 DTap-Bench。揭示了跨模型骨干的系统性漏洞模式。

**为什么值得关注：** 安全评估终于有基础设施了。之前红队是手动的、不可复现的；DTap 建立了可规模化的红队方法论，且 DTap-Bench 的每个案例都有可验证的裁决（verifiable judge），这意味着漏洞发现是可量化的。

**工程启示：** DTap 发现的是系统性模式而非个案——这意味着当前主流 Agent 架构存在共同的安全缺陷。Agent 开发者需要关注自己架构是否在 DTap 揭示的漏洞模式范围内。

---

### 本周其他重要论文（标记"arXiv论文跟踪"）

**★ AgentTrust** — Runtime 安全拦截，Agent 工具调用执行前裁决，覆盖 shell 混淆和多步攻击链，verdict 准确率 96.7%，AGPL-3.0 开源，MCP 兼容
- arXiv:2605.04785 | Chenglin Yang

**★ NRI** — IJCAI 2026，零样本逻辑规则归纳基础模型，统计属性编码，符号推理泛化到未见 predicate
- arXiv:2605.04916 | Yin Jun Phua

**★ SPINE** — ICML 2026，具身 AI 隐私全生命周期架构约束，动态控制信号贯穿感知-规划-交互
- arXiv:2605.05017 | Zhuodong Liu

**★ Uno-Orchestra** — 多 Agent 选择性委托统一策略，77% pass@1，推理成本数量级降低
- arXiv:2605.05007 | Zhiqing Cui

**★ Curated AI beats Frontier LLMs** — 在制药资产发现中，curated 索引（靶点/模态/适应症标注）以 3.2x 精度超越通用 web 搜索 frontier 模型，精度 100%
- arXiv:2605.04908 | Łukasz Kidziński

**★ Strat-Reasoner** — 多智能体博弈中 LLM 战略推理提升 22.1%，递归推理+中心化 CoT 对比模块
- arXiv:2605.04906 | Yidong He

**★ EBM-RL** — 视频沉浸式角色扮演，眼-脑-嘴解耦 GRPO，视觉氛围+角色真实性联合优化
- arXiv:2605.04733 | Miao Wang

**★ AuditRepairBench** — NeurIPS 2026，评估器通道暴露导致 Agent 修复 leaderboard 不稳定，减少 55-74% 排名位移
- arXiv:2605.04624 | Yuelin Hu

---

## 四、今日要情摘要

| 领域 | 重点 |
|------|------|
| 模型 | LongSeeker（上下文弹性管理）、Uno-Orchestra（选择性委托） |
| 安全 | **DTap（首个可控红队平台）**、AgentTrust（运行时拦截） |
| 科研 | NRI（符号推理基础模型）、SPINE（具身AI隐私架构） |
| 行业 | Harvey Legal Agent Benchmark、Corgi AI责任险 |
| 方法 | AuditRepairBench（leaderboard不稳定性）、EBM-RL（视频角色扮演） |
