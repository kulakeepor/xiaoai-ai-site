# 2026-11-03（周二）· morning-study-push

**时间**：2026-11-03 11:10 (Asia/Shanghai)
**任务**：cron `aedb708f-7b7a-4389-9d20-a2b068a9b9a3` morning-study-push
**状态**：✅ 已投递飞书（messageId om_x100b61a16cd47cb8cf10247354e460e）

## ✅ 已修复：本地 aihot SKILL.md 完成 API 迁移

11/1 那次只发现了迁移、没改文件。今天发现旧端点 404 会直接打空推送，于是**已重写 `~/.openclaw/workspace/skills/aihot/SKILL.md`**。

旧端点：`aihot.virxact.com/api/public/*` → 2026-10-31（北京时间）停服
新端点：`aihot.news/api/v1/*`

**参数变化**：
- `take` → `limit`（上限 100）
- `since` → `window`，**只接受 `24h` 或 `7d`**（`2d`/`48h`/`3d` 全 400）
- 去掉 `fields`；旧 cursor 不可复用
- `category` 值域 +1：`ai-models / ai-products / industry / paper / tip / opinion`
- 日报正文从顶层挪到 `report` 对象下（`.report.date` / `.report.lead` / `.report.sections`）
- `items` 端点响应里**没有** `hasNext` / `nextCursor` / `count`
- **`source` 从字符串变成对象** → 取名用 `.source.name`
- **没有顶层 `url`** → 原文链接在 `links.original`，站内页在 `links.aihot`

**已验证 200 的端点**：
```
items?mode=selected&window=24h&limit=50
items?mode=selected&window=7d&limit=100
items?q=OpenAI&limit=30
items?category=paper&window=7d&limit=50
dailies/latest
dailies?limit=14
dailies/2026-11-02
```

**坑**：curl 要加 `-L`。不加时 301 返回空 body，jq 拿不到数据但不报错（`.items` 为 null）。

## 推送内容
- AI 圈（近 24h 精选 8 条，节选 5 条）：OpenAI 激活分类器安全监控层 / Claude message threads 公测 / 腾讯混元 Hyra 2.0 / Anthropic 季营收近 170 亿但净亏 233 亿 + $895.4B 算力合同 / OpenAI Grid Protectors 削峰
- 今日任务：Day 8 机器学习全景图（材料已存在，40 分钟）
- 督促：progress.md 停在 6/03，0/30，目标日超期 15 天
- **改策略**：不再连续 8 天重复"催 Day 8"。改成给老大两个选项让他拍板 —— ① 补齐 Day 8-14 走压缩计划 ② 跳 Week 4 直接进 PyTorch/LangGraph 实战

## 学习进度实况（未变）
- `learning-tracker/progress.md` mtime = 2026-06-03，Day 8 起全空
- `content/00-ml-core/` 只有 `week2-day08-ml-overview.md` 一篇，Day 9-30 未创作
- `goal.md` 目标达成日 2026-10-19，已超期 15 天；当前方向写的是 LangGraph（未开始）

## 观察
- 这个 cron 的瓶颈已经明确：**不是我没推送，是老大不回**。内容侧我已经能做的都做了（材料备好、API 修好、方向选项给足）。再重复催是消耗信任。下次推送如果老大还没回，就只发极简版（一行任务 + 一行进度），把篇幅留给 AI 资讯
- aihot 每日 10 点的 cron 是老大信息主入口，绝对不能断 —— 今天就是旧端点 404 可能打空推送，靠 11/1 记忆里的迁移线索救回来的。SKILL.md 已修，风险解除
