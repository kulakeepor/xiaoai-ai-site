#!/bin/bash
# 自动检测改动并 commit + push
# 用法: ./git-auto-push.sh ["提交信息"]

REPO="/root/.openclaw/workspace/xiaoi-ai"
cd "$REPO" || exit 1

# 检查是否有未提交的改动
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ 没有改动，无需推送"
    exit 0
fi

# 自动 staging
git add -A

# 获取改动文件列表
CHANGES=$(git diff --cached --stat --summary | grep -E "insertions|deletions|Create|rename" | wc -l)

# 提交信息：优先用参数，否则自动生成
if [ -n "$1" ]; then
    MSG="$1"
else
    # 自动生成提交信息
    FILES=$(git diff --cached --name-only | head -5 | tr '\n' ' ')
    MSG="chore: 自动同步更新 - $FILES"
fi

echo "📦 提交: $MSG"
git commit -m "$MSG"

# push
git push origin master 2>&1

echo "✅ 推送完成"
