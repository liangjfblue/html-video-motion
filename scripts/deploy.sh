#!/usr/bin/env bash
# 用法: npm run deploy -- user@host [目标目录]
# 例:   npm run deploy -- root@47.100.100.100
#       npm run deploy -- root@47.100.100.100 /var/www/html-video-motion
set -euo pipefail

TARGET="${1:-}"
DEST="${2:-/var/www/html-video-motion}"
if [ -z "$TARGET" ]; then
  echo "用法: npm run deploy -- user@host [目标目录，默认 /var/www/html-video-motion]"
  exit 1
fi

echo "▶ 构建..."
npm run build

echo "▶ 同步到 $TARGET:$DEST ..."
rsync -avz --delete dist/ "$TARGET:$DEST/"

echo "✓ 已部署 https://（你的域名）"
