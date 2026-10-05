---
created: 2026-10-01
updated: 2026-10-01
tags:
  - digital-garden
  - Quartz
  - GitHub-Pages
  - deploy
type: concept
status: seedling
title: Quartzのビルドとデプロイの仕組み
aliases:
  - Quartzビルドデプロイ
description: "Quartzのビルドとデプロイの仕組み。Vaultから公開用リポジトリへの同期、GitHub Actionsでのビルド、GitHub Pagesへのデプロイフローを解説。"
---

## 全体の流れ

```text
Vault (22_Digital-garden/content/)  ← 正本・編集はここ
       ↓ cp -r / rsync --delete
公開用リポジトリ (digital-garden/content/)
       ↓ git push
GitHub Actions (deploy.yml)
       ↓ npx quartz build
public/ 生成
       ↓ actions/upload-pages-artifact + deploy-pages
GitHub Pages (https://ogiri-siyou.com/)
```

## ポイント

### 1. ビルドは2回走る
- **ローカル**: `npx quartz build` → 確認用（`public/` は .gitignore で無視される）
- **GitHub Actions**: push 時に自動で `npx quartz build` 実行 → `public/` を artifact としてアップロード → Pages にデプロイ

### 2. 普段の運用
```bash
# Vault側で編集
# 同期
cp -r "E:/Documents/git_work/vault_omarchy_git/22_Digital-garden/content/"* "E:/Documents/git_work/digital-garden/content/"

# 確認したいときだけ
cd "E:/Documents/git_work/digital-garden"
npx quartz build --serve  # http://localhost:8080

# push（ビルド不要）
git add -A
git commit -m "content: ..."
git push
```

### 3. 同期時の注意
`cp -r` は上書きのみ。**Vault側で削除したファイルは公開側に残る**。
完全同期したいときは：

```bash
# 方法A: rsync（推奨・要インストール）
rsync -av --delete "Vaultパス/content/" "公開リポジトリパス/content/"

# 方法B: 削除してからコピー
rm -rf "公開リポジトリパス/content/"*
cp -r "Vaultパス/content/"* "公開リポジトリパス/content/"
```

### 4. GitHub Actions の中身（`.github/workflows/deploy.yml`）
- `actions/configure-pages@v5`
- `npx quartz build`
- `actions/upload-pages-artifact@v4`
- `actions/deploy-pages@v4`

ローカルでビルドせず `content/` だけ push しても、Actions 側でビルドしてデプロイされる。

## 関連
- [[MOC-Quartz]]
- [[QuartzのURL・タイトル・SEOの仕組み]]
- [[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]
- [[デジタルガーデンの公開手順]]（30_Projects/digital-garden/公開手順.md）