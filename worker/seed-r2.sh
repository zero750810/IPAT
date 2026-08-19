#!/bin/bash
# 將 Firebase Storage 下載的圖片上傳到本地 R2

BUCKET="ipat-images"
SRC="/tmp/ipat-r2"

echo "上傳 member 圖片..."
for f in "$SRC"/member/*.webp; do
  [ -f "$f" ] || continue
  fname=$(basename "$f")
  npx wrangler r2 object put "$BUCKET/member/$fname" --file="$f" --content-type="image/webp" --local 2>/dev/null
  echo "  ✓ member/$fname"
done

echo "上傳 course 圖片..."
for f in "$SRC"/course/*.webp; do
  [ -f "$f" ] || continue
  fname=$(basename "$f")
  npx wrangler r2 object put "$BUCKET/course/$fname" --file="$f" --content-type="image/webp" --local 2>/dev/null
  echo "  ✓ course/$fname"
done

echo "上傳 news 圖片..."
for f in "$SRC"/news/*.webp; do
  [ -f "$f" ] || continue
  fname=$(basename "$f")
  npx wrangler r2 object put "$BUCKET/news/$fname" --file="$f" --content-type="image/webp" --local 2>/dev/null
  echo "  ✓ news/$fname"
done

echo "完成！"
