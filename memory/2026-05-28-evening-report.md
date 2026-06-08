# 每日汇报 — 2026-05-28（晚间）

**执行时间**：2026-05-28 20:00 PM (Asia/Shanghai)
**数据来源**：aihot.virxact.com 精选（5/27-5/28）+ arXiv cs.AI 本周新增（5/25-5/28）

---

## ⚠️ 飞书多维表格状态（连续第 31+ 天）

飞书 Bitable URL 仍未存储在任一可访问位置，导致 4 表 × 10 条 = 40 条数据仍无法自动录入。

**根本原因**：`xiaoai-ai-site/src/lib/feishu.ts` 从未创建，前端数据层断接。

**需要的操作**：老大只需发来任意一个飞书多维表格的 URL（格式 `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`），即可解锁自动录入。

---

## 一、今日 AI/产品/技术/社区动态（5/27-5/28）

> 时间窗：2026-05-27 12:00 UTC ~ 2026-05-28 12:00 UTC（过去 24 小时）

---

### 🔥 本日最重磅

**① NVIDIA Polar：让 Code Agent 跑分暴涨 594.74% 的框架**

来源：IT之家 / NVIDIA Research
时间：5/28 10:14

NVIDIA 开源强化学习框架 Polar，核心思路是在模型 API 边界放置 Agent 并接入 GRPO 训练，无需重写现有 Agent 框架（如 Codex CLI、Claude Code、Qwen Code）。基于 Qwen3.5-4B 模型，Polar 将 SWE-Bench Verified pass@1 从 3.8% 提升至 26.4%（+594.74%）。效率上 prefix_merging 技术将训练步骤从 1185 次降至 218 次，GPU 利用率从 20.4% 升至 87.7%。

→ **对老大学习 Agent 的直接价值**：Polar 证明了一个关键点——**4B 小模型 + 好的训练框架可以在编码任务上大幅超越基线**。老大如果做学习 Agent，不必追求最大模型，核心是如何让小模型在特定任务上达到可用水平。Polar 的 prefix_merging 和 API 边界插入思路适合迁移到学习 Agent 的训练流程。

---

**② DeepSeek 计划科创板 IPO：500 亿美元融资后立即申请**

来源：X：X.PIN（@thexpin）
时间：5/28 18:40

独家消息：DeepSeek 计划完成当前约 3500 亿人民币（约 500 亿美元）融资轮后，立即申请科创板（A股）IPO。这是中国 AI 公司有史以来最大规模融资轮之一。

→ **行业信号**：DeepSeek 的 IPO 意味着中国 AI 公司在资本市场的话语权将进一步提升。对老大来说，DeepSeek 的技术路线（低成本、高性能）和资本动向都值得关注——如果上市，其技术积累和商业模式会更加透明。

---

**③ OpenRouter B轮融资 1.13 亿美元，Qwen3.7-Max 登顶热门榜**

来源：OpenRouter 公告 / X：阿里云
时间：5/28 22:00

OpenRouter 宣布完成 1.13 亿美元 B 轮融资，CapitalG 领投，NVIDIA、ServiceNow 等跟投。同日 Qwen3.7-Max 以 77.3B tokens 使用量登顶 OpenRouter 热门大模型榜单。

→ **对老大的价值**：OpenRouter 是模型聚合平台老大关注多的产品，其最新一轮融资说明**模型分发和聚合赛道**已经被顶级 VC 认可。Qwen3.7-Max 的登顶进一步验证国产模型在开源生态中的竞争力。

---

**④ Cognition 成为全球最大独立 Agent 实验室，年化收入 4.92 亿美元**

来源：X：swyx
时间：5/27 19:23

Devin 背后的 Cognition 宣布完成超 10 亿美元融资，估值 260 亿美元，年化收入 4.92 亿美元，企业使用量自年初增长超 10 倍。公司强调其拥有多项领先优势：首个编码 Agent、顶级代码审查能力，并获得 Peter Thiel 投资。

→ **老大值得关注的信号**：Cognition 的高速增长说明 **编码 Agent 已经进入企业采购阶段**，而非实验阶段。这对老大学习 Agent 的商业化方向有直接参考——ToB 编码 Agent 是当前最成熟的 Agent 产品形态。

---

**⑤ Mistral 押注"物理 AI"，收购 Emmi AI 加速工业 AI**

来源：Mistral AI 官网
时间：5/28 18:47

Mistral AI 宣布通过收购 Emmi AI 强化物理 AI 研究，目标是航空航天、汽车、半导体、能源等核心产业的基础模型。已发表成果包括：3D 机翼超音速湍流 CFD 数据集、GyroSwin 聚变等离子体湍流模拟模型等。同时宣布将在 2026 年 Q3 启用 10MW 新数据中心专注推理。

→ **行业信号**：Mistral 的物理 AI 路线代表了 AI 从"数字世界"向"物理世界"渗透的趋势。对老大来说，如果学习 Agent 需要理解工程、物理类内容，Mistral 的多模态方向值得参考。

---

**⑥ ITBench-AA 发布：所有前沿模型在企业 IT 任务上得分均低于 50%**

来源：HuggingFace Blog（Artificial Analysis + IBM）
时间：5/27 17:20

首个企业 IT 任务基准测试 ITBench-AA SRE 显示：Claude Opus 4.7（自适应推理）47%、GPT-5.5（xhigh）46%、Qwen3.7 Max 42%——所有前沿模型均低于 50%。关键发现：推理轮次差异近 3 倍，但更长轨迹不等于更高准确率；开源模型 Gemma 4 31B（$0.14/任务）以低成本优于部分高价闭源模型。

→ **对老大的价值**：**成本 vs 准确率的平衡**是 Agent 落地核心问题。Gemma 4 31B 以极低 cost 达到 37% 说明：小模型 + 合适任务定位可以成为企业高性价比选择。这对老大学习 Agent 的选型有直接参考意义。

---

**⑦ 华为"韬定律"：首个完整的"韬芯片"今年秋季发布**

来源：IT之家
时间：5/28 01:24

华为何庭波提出半导体新演进路径"韬（τ）定律"，以"时间缩微"（逻辑折叠）替代传统"几何缩微"。今年秋季将发布首个完整韬芯片，性能和集成度相比去年是"跳跃性"提升。过去 6 年华为已基于此路径自主研发 381 款芯片。

→ **老大可以关注**：韬定律代表了一种新的芯片设计哲学——通过架构创新而非制程缩微提升性能。这对 AI 芯片格局和模型部署效率有长期影响。

---

**⑧ Anthropic 发布零信任 AI Agent 安全框架**

来源：Claude Blog
时间：5/27 18:06

Anthropic 发布企业部署自主 AI Agent 的零信任安全框架，指出前沿 LLM 将漏洞利用周期从数月压缩至数小时。三层零信任架构覆盖提示注入、工具投毒、记忆投毒等特有威胁，并提出八阶段实施流程。

→ **老大落地学习 Agent 的必读**：如果老大要做产品化的学习 Agent，安全性是必须提前考虑的问题。Anthropic 的零信任框架提供了系统性的威胁建模思路，提示注入和记忆投毒是学习 Agent 的特殊攻击面。

---

### 产品发布

- **可灵 AI 在 AI 电影节展示 20 部 4K 原创短片**（5/29 加州卡尔弗）— AI 视频生成进入内容生产阶段
- **Runway MCP 服务器**：兼容 MCP 的 Agent 可直接在对话中生成图像和视频
- **Perplexity 开源 Unigram 分词器**：将 CPU 占用降低 5-6 倍
- **Midjourney 对话模式升级**：支持语音输入 + 图像提示 + 侧边栏设置
- **Claude Marketplace 新增 5 家合作伙伴**（Augment code、Coderabbit 等）
- **Krea 2 API**：支持 fal/ComfyUI/NousResearch Hermes，兼容 Claude/Codex/OpenClaw
- **Google Pay 向"智能体商务"演进**：推出通用商务协议和 MCP 服务器
- **OpenAI 支持私有 MCP 服务器安全连接**：内部网络 MCP + 仅出站 HTTPS

### 行业动态

- **Cognition 估值 260 亿美元**，年化收入 4.92 亿美元，10 倍增长
- **英伟达展示台湾新园区**，计划每年在台投资 1500 亿美元
- **Replit 入选 Redpoint InfraRed 100 榜单**
- **阿里云 DataWorks 推出 AI 数据智能体**
- **MuleRun 登陆阿里云市场**：全天候 AI 劳动力，$20/月起

---

## 二、飞书多维表格状态

⚠️ **仍无法访问** — 飞书 Bitable URL 连续 31+ 天无法录入。

**需要的操作**：老大只需发来任意一个飞书多维表格的 URL（格式 `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`），即可解锁自动录入。

---

## 三、老大晚间论文解读（2篇）

---

### Paper 1（★★★★★）：Calibrated Collective Oversight — 弱监督者如何管住强 Agent

**arXiv:2605.28807 | William Overman et al. | 2026-05-27**

**为什么选这篇给老大细读：**

这是本周最具安全性+实操价值的论文，直指 Agent 控制的核心难题：**当 Agent 比监督者更强时，如何确保它不越界？** 这不是理论问题——老大学习 Agent 一旦部署在真实环境中，就会面临同样的挑战：Agent 的能力可能超过预期的边界，而人类如何保持有效控制？

**核心贡献：**

① **CCO（Calibrated Collective Oversight）**：通过聚集多个辅助评分函数，测量偏离保守基线的程度，作为惩罚项加入 Agent 决策。当监督者对行为无异议时，高utility行动正常执行；当监督者积累担忧时，行动被覆盖。

② **Conformal Decision Theory 校准**：在线校准保守程度，无需分布假设，确保不良结果在有限时间内保持在用户指定的目标阈值以下。

③ **实证验证**：
- SWE-bench 上：较弱的监督者成功约束了对抗性对齐的强 Agent
- MACHIAVELLI：大幅减少伦理违规，同时保留 reward

**关键数字**：
- 不良结果率 = 用户指定阈值（理论上严格保证）
- 弱监督者成功约束强 Agent（实验验证）
- 伦理违规率大幅下降（具体数字待论文全文）

**→ 对老大学习 Agent 的直接价值：**

学习 Agent 会遇到的核心问题之一是：**当 Agent 自主做决定时，人类如何知道它不会做越界的事？** CCO 给出了一个可操作的答案：

1. **多评分函数聚合**：不是靠单一评价标准，而是让多个不同维度的评分函数共同评估
2. **渐进式惩罚积累**：不是一刀切禁止，而是在担忧积累到一定程度时才干预
3. **在线校准**：保守程度可以根据实际情况调整，不需要提前确定所有边界

这对学习 Agent 的"边界控制"设计有直接参考——如果 Agent 在用户学习过程中产生不当建议，CCO 的思路可以帮助建立一套"渐进式安全阀"机制。

**与其他方法的区别**：

| 方法 | 问题 |
|---|---|
| 纯 RLHF | 需要大量标签，弱监督者无法标注强 Agent |
| Constitutional AI | 规则固定，无法在线调整 |
| CCO | 在线校准 + 多函数聚合 + 渐进惩罚 |

**一句话总结**：CCO 解决的是"强 Agent + 弱监督者"场景下的可扩展控制问题，用 Conformal Decision Theory 做在线校准，让担忧积累到阈值才干预——这套机制对学习 Agent 的安全设计有直接价值。

---

### Paper 2（★★★★★）：Contrastive Reflection（CONTRAST）— 5个样本让模型快速自我改进

**arXiv:2605.28742 | Linas Nasvytis et al. | 2026-05-27**

**为什么选这篇给老大细读：**

这篇论文解决了一个极其实际的问题：**如何让模型在极少数据下快速学会改进？** 当前主流方法（RLVR、prompt optimization）需要数百个训练样本和数千次模型 rollouts，成本极高。CONTRAST 用 5 个样本 + 对比反思做到了更快、更好的改进。这对学习 Agent 的持续改进机制有直接价值。

**核心贡献：**

① **CORE（Contrastive Reflection）算法**：对比过去的成功和失败推理轨迹，生成自然语言描述的"推理策略和约束"——即"什么导致了成功，什么导致了失败"。这些 insight 以紧凑、可解释的自然语言形式存储。

② **只需 5 个训练样本**：在固定 rollout 预算下，5 个样本就能实现显著性能提升，远少于 RLVR（数百个样本）。

③ **比 GRPO 和其他基线更快**：在 4 个推理任务上，CORE 比 GRPO、GEPA、episodic RAG、MemRL 等方法用更少 rollouts 达到同等或更高性能。

④ **更少 prompt tokens**：比非参数基线更节省上下文 token，学到的知识以紧凑自然语言 insight 存储，而非存储完整推理轨迹。

**关键数字**：
- 训练样本：最少 5 个
- 相比 GRPO：更快收敛
- 相比 episodic RAG/MemRL：更少 token 消耗

**→ 对老大学习 Agent 的直接价值：**

学习 Agent 的核心挑战之一是：**如何让 Agent 从用户的反馈中快速学习，而不需要大量人工标注数据？** CORE 给出了答案：

1. **对比反思 = 最少数据的最强信号**：成功和失败各一个样本就能生成有意义的改进 insight——不需要几百个样本
2. **自然语言存储 = 可解释 + 可迁移**：学到的不是权重更新，而是"什么情况下这个策略有效"的语言描述，可以迁移到其他任务
3. **比 RAG 更高效**：传统的 episodic RAG 存储完整推理轨迹，占用大量 context；CORE 只存储 distilled insight，极致压缩

**对老大学习 Agent 的具体启示**：

- 用户每次反馈成功/失败案例 → CORE 对比生成改进 insight → 存入知识库
- 下次遇到类似任务 → Agent 检索相关 insight 作为约束
- 不需要每次重新训练，insight 可以跨任务迁移

**一句话总结**：CORE 用"对比反思"重新定义了 Agent 的自我改进效率——5 个样本 + 自然语言 insight 就能让模型快速学习，比存储完整推理轨迹的 RAG 方式高效得多。如果老大想让学习 Agent 从少量反馈中持续进化，CORE 是目前最简洁可行的方案。

---

## 四、本周 arXiv 论文速览（5/25-5/28 精选，标记"arXiv 论文跟踪"）

| ID | 标题 | 推荐度 |
|---|---|
| 2605.28807 | **Calibrated Collective Oversight（CCO）**：弱监督者约束强 Agent（Conformal Decision Theory 在线校准） | ★★★★★ |
| 2605.28742 | **Contrastive Reflection（CONTRAST）**：5 样本快速自我改进（对比成功/失败推理轨迹生成可解释 insight） | ★★★★★ |
| 2605.28792 | **CaMBRAIN**：Mamba SSM 实时 EEG 推断（线性复杂度 + 10x 吞吐量，超越 attention 类模型） | ★★★★ |
| 2605.28764 | **SwarmHarness**：去中心化 Agent 计算网络（Shapley-value 激励 + DHT 节点发现） | ★★★★ |
| 2605.23204 | **AutoResearch AI Survey**：AI 科研自动化全景综述（Vibe Research → AI-led 系统） | ★★★★ |
| 2605.28647 | **Skill-Based Task Routing**：去中心化激励对齐的 AI Agent 技能路由网络 | ★★★ |

---

## 五、明日待办

- [ ] **请老大提供飞书 Bitable URL**：格式 `https://xxx.feishu.cn/base/xxxxx?table=xxxxx`，解锁 4 表自动录入
- [ ] CCO（2605.28807）和 CONTRAST（2605.28742）可录入"深度拆解"表，标记"arXiv 论文跟踪"
- [ ] CaMBRAIN（2605.28792）和 SwarmHarness（2605.28764）可选录

---

*报告时间：2026-05-28 20:00 PM (Asia/Shanghai) | 数据来源：aihot.virxact.com 精选（5/27-5/28）+ arXiv cs.AI（5/25-5/28）+ 各官网/HuggingFace/Twitter*