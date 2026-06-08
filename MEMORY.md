
## 老大当前学习目标

**目标**：6个月内（2026-10-19前）能读懂主流AI框架代码
**起始**：2026-04-19
**现状**：入门一点点，Python基础 + Coze Code插件经验
**每天学习时间**：约1小时
**学习方式**：B站视频 + ChatGPT + 和我（Muse）聊 + Claude Code

### 🎓 学习推进方式

每天10点推送后，我会就当天最值得关注的话题发起和你的对话——重点论文、重要新闻、或者一个值得深挖的概念。用聊天的形式推进学习，边聊边学。

## Muse学习伙伴配置

**追踪目录**：`/root/.openclaw/workspace/learning-tracker/`
- goal.md — 学习目标
- progress.md — 进度追踪

**我的职责**：
1. 每次对话后更新 progress.md
2. 主动推送学习内容（基于最近发展区）
3. 追踪卡点，适时提供支持

## ⚠️ GitHub Push 风险提示

**教训**：2026-06-08 发现，Week 2/3/4 内容在记忆中显示"已推送"，但实际 GitHub 上只有5个初始 commit，内容从未成功推送。

**对策**：
- 大批量内容创作后，务必执行 `git log` + `git push` 双重验证
- 或者用子任务做内容生成，最后主任务验证 git 状态
- 不确定时就先本地 build 测试通过再 push

**⚠️ 飞书多维表格 URL 连续第 15+ 天未提供，无法自动录入。已整理数据在 memory/2026-05-08-report.md 待录入。老大需要提供 URL 格式：`https://xxx.feishu.cn/base/xxxxx?table=xxxxx`**

## 飞书多维表格配置（2026-05-23 发现）

app_token: `Ym5fbIa5uaNXfHs0rldcZDqznbb`

5个子表：
- `tblh6ZzNAbhnWekF` → 每日简报
- `tblv2wGtYtTJJIik` → 工具雷达
- `tblnSfKUrBkwyF5P` → 深度拆解
- `tblhfX43IJ3ZoZmx` → 知识学堂
- `tblnTc0mdDoscPaC` → 认知框架

**重大发现**：之前连续30+天无法录入是因为我只有 `app_token`（`Ym5fbIa5uaNXfHs0rldcZDqznbb`）但没有 `table_id`！今天凭经验猜测 `tbl001` 入手，然后用 `feishu_bitable_get_meta` 解析 URL 拿到了完整 5 个 table_id，终于解除了封印。

以后录入格式：
- 每日简报/工具雷达/深度拆解/知识学堂：各 10 条/次
- 标签含 "arXiv 论文跟踪" 标记论文来源
