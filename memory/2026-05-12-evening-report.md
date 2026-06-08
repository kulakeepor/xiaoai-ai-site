# AI 学习资源库 · 晚间汇报 · 2026-05-12

---

## ⚠️ 飞书多维表格

飞书多维表格 URL **连续第 21+ 天仍未提供**，无法自动录入。今日 4 表 × 10 条数据已整理待录入，老大只需提供任意一个表格的 URL：

> `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`

---

## 一、今日 AI/产品/技术/社区动态（5月12日·晚间补充）

### 🏢 大厂 & 产品（下午-晚间新增）

1. **OpenAI 发布 Daybreak：GPT-5.5-Cyber + Codex Security 组合**
   - OpenAI 首个一体化安全+编码 agent 系统
   - GPT-5.5-Cyber 提供威胁建模 + 安全审查，Codex Security 提供红队自动化
   - 来源：The Verge 2026-05-11 | [链接](https://www.theverge.com)

2. **Google Gemini 强化智能家居控制**
   - 优化了后端处理延迟，设备控制、闹钟、计时器响应更快
   - 新增年龄限制和内容控制，可提供酒类饮品配方
   - 来源：The Verge 2026-05-11

3. **Thinking Machines 展示"交互模型"（AI Interaction Models）**
   - 能实时响应用户输入的 AI 交互模型
   - 重新定义 AI 和用户的交互范式
   - 来源：The Verge 2026-05-11

4. **OpenAI 首次盈利谈判：否认 profit-positive，Bret Taylor 透露"decidedly not cash-flow-positive"**
   - OpenAI 与 Reddit 达成内容授权协议（避免诉讼目的）
   - Ilya Sutskever 证词：不喜欢 Musk 对董事会的"攻击性"控制要求；认为 Tesla 接管 OpenAI"会杀死一个梦想"
   - 来源：The Verge / TechCrunch 2026-05-11

5. **OpenAI 遭诉讼：FSU 枪击案受害者家属起诉 ChatGPT"设计缺陷"**
   - 佛罗里达州总检察长也在调查
   - 来源：The Verge 2026-05-11

6. **BuzzFeed CEO 转任"AI 总裁"**
   - Byron Allen 家族收购 BuzzFeed 多数股权，Jonah Peretti 转任新设"President of BuzzFeed AI"
   - 来源：The Verge 2026-05-11

7. **Take It Down Act 生效倒计时（5月18日）**
   - 各大平台须 48 小时内删除未同意的亲密图像
   - 来源：The Verge 2026-05-11

8. **Perplexity 广告黑公关事件持续发酵**
   - The Verge 揭露：Perplexity 通过 Vyro 做隐性营销，Vyro 不承认，Perplexity 撇清
   - 来源：The Verge 2026-05-08

9. **Meta 员工因 AI 化而"痛苦"**
   - NYT 深度：Meta 追踪员工电脑活动训练 AI、计划裁员 10%，员工称看不到长期价值
   - 来源：The Verge 2026-05-08

10. **Musk vs OpenAI 庭审第二周 recap**
    - Musk 承认 xAI"可能不是第一个到达 AGI 的公司"
    - OpenAI 揭露 Musk 实际捐赠仅 $3800 万（非承诺的 $10 亿）
    - xAI + SpaceX 合并准备 IPO
    - 来源：The Verge 2026-05-09

---

## 二、今日新增 arXiv 论文（5月12日，cs.AI 当日新发表）

> 今日 cs.AI 新增约 50 篇，重点筛选：

| ID | 标题 | 领域 | 推荐度 |
|---|---|---|---|
| **2605.10913** | **Shepherd：Meta-Agent 运行时副驾，Git式执行追踪，Lean 机械化证明** | Agent 系统架构 | ★★★ |
| **2605.10870** | **DeMem：决策-率失真框架下的 Agent 记忆管理** | Agent 记忆 | ★★★ |
| **2605.10851** | **GTT：广义的图灵测试——智能比较的形式化框架** | AI 评测 | ★★ |
| **2605.10828** | **First Drop of Ink：误导信息在长上下文推理中的非线性影响** | RAG/长上下文 | ★★ |
| **2605.10834** | **Pentesting Agents：真实世界渗透测试 Agent 评估** | 安全 Agent | ★★ |
| **2605.10865** | **BenchCAD：工业 CAD 生成的多模态 LLM 基准（17,900 题）** | 多模态/代码 | ★★ |
| 2605.10817 | Reasoning Tokens vs Training Tokens：推理 scaling 的新证据 | Scaling Laws | ★★ |
| 2605.10820 | Self-Healing Multi-Agent Systems：自主修复的多智能体系统 | Multi-Agent | ★★ |
| 2605.10813 | Multi-Modal Agent Safety：多模态 Agent 安全边界 | 安全 | ★★ |
| 2605.10796 | Chain-of-Draft：极简推理 token 压缩（97% 压缩率） | 推理效率 | ★★ |

---

## 三、老大论文解读（2篇）

### 📖 解读 1：Shepherd — Meta-Agent 的运行时副驾（arXiv:2605.10913）

**为什么重要：** 这是今天最重量级的新论文（56 页），解决了一个核心问题——如何让 meta-agent（控制其他 agent 的 agent）可靠地干预、重放和优化子 agent 的行为，而不需要昂贵的从头重跑。

**核心机制：**
- 把 meta-agent 操作子 agent 的行为**形式化为函数**（functional programming 模型）
- 核心操作（fork/replay/branch）用 **Lean 4 机械化证明**，数学上保证了正确性
- 每一次 agent-环境交互记录为**带类型的 Git-like 事件流**，任意历史状态可 fork 回放
- **fork 速度比 Docker 快 5 倍**，prompt 缓存复用率 > 95%

**三个杀手级应用：**
1. **运行时干预**：实时 supervisor 让 pair coding pass rate 从 28.8% → 54.7%（CooperBench）
2. **反事实元优化**：branching 探索在 4 个 benchmark 上最高领先 11 分，wall-clock 时间减少 58%
3. **Tree-RL 训练**：在选定的 turn fork rollout，TerminalBench-2 从 34.2% → 39.4%

**对你学习的价值：**
这和"让 AI 自主管理多个 Agent"直接相关——Shepherd 提供了"如何安全地干预正在运行的 Agent"的形式化框架，是 Multi-Agent 系统设计的重大进展。如果你正在学 Agent 系统，这篇论文的 Git-like 执行追踪概念特别值得注意。

---

### 📖 解读 2：DeMem — 决策视角重新定义 Agent 记忆（arXiv:2605.10870）

**为什么重要：** 长期困扰 Agent 的一个问题——**记忆该记住什么**？现有方法按"相关性/重要性/摘要质量"来组织记忆，但这忽略了核心问题：**记忆的价值不在于忠实地描述过去，而在于保留对好决策有影响的区分**。

**核心洞察：**
- 把记忆问题建模为**率失真（rate-distortion）问题**——在固定预算下，什么可以安全遗忘？
- 关键指标：**由压缩诱导的决策质量损失**
- 这给出了一个精确的遗忘边界 + 一个 memory-distortion 前沿（最优权衡曲线）
- **DeMem 算法**：只在数据证明"共享状态会导致决策冲突"时才更新记忆分区
- 提供了 near-minimax regret 的理论保证

**实验结果：**
- 控制性合成诊断和长时对话 benchmark 均有一致性收益
- 证明了决策导向的记忆管理比描述性方法更有效

**对你学习的价值：**
这解决了一个实际且普遍的问题：Agent 上下文窗口有限，记忆必须压缩。DeMem 告诉我们**不应该按"重要性"压缩，而应该按"对决策的影响"压缩**。这个框架对设计任何长时间运行的 AI 系统都有直接价值。

---

## 四、本周 arXiv 论文汇总（5月8日–12日）

| ID | 标题 | 日期 | 推荐度 |
|---|---|---|---|
| 2605.10913 | Shepherd：Meta-Agent 运行时副驾 | 5/12 | ★★★ |
| 2605.10870 | DeMem：决策-率失真 Agent 记忆 | 5/12 | ★★★ |
| 2605.10851 | GTT：广义图灵测试 | 5/12 | ★★ |
| 2605.10828 | First Drop of Ink：长上下文误导信息 | 5/12 | ★★ |
| 2605.10834 | Pentesting Agents 真实世界评估 | 5/12 | ★★ |
| 2605.08070 | VecCISC：自洽投票语义去重（ACL 2026 Findings） | 5/8 | ★★★ |
| 2605.08061 | Rubric-Grounded RL：结构化多标准奖励 | 5/8 | ★★★ |

---

## 五、飞书多维表格状态

⚠️ **无法录入** — 连续第 21+ 天缺少 Bitable URL。

老大只需提供任意一个表格的 URL，格式：
```
https://xxx.feishu.cn/base/xxxxx?table=xxxxx
```
提供后我可以立即录入今日 4 表 × 10 条 + 本周所有 arXiv 论文数据。

---

*汇报生成时间：2026-05-12 20:00（UTC+8）*
*下次任务：2026-05-13 10:00 自动执行*