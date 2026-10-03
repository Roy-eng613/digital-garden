---
title: "Zenn CLI導入とGitHub連携のハマりポイント・運用覚書"
description: "Zenn CLIでローカル執筆からGitHub経由の自動公開まで。フロントマター制限・Git認証（PAT/SSH）・publishedフラグ運用・ブランチ戦略まで実践的なトラブルシューティングを網羅"
tags:
  - Zenn
  - CLI
  - Git
  - GitHub
  - トラブルシューティング
  - Personal-Access-Token
  - SSH
type: article
confidence: observed
status: evergreen
created: 2026-08-30
updated: 2026-10-03
aliases:
  - Zenn CLIとGitHub連携ハマりポイント
  - Zenn CLI 導入手順
related: []
source: "[[91_Processed/Zenn_CLI導入とGitHub連携のハマりポイント覚書]]"
---

# Zenn CLI導入とGitHub連携のハマりポイント・運用覚書

Zenn CLIを用いてローカルで記事を執筆し、GitHub経由で自動投稿・公開する際に遭遇したトラブルと解決策のまとめ。

---

## 1. Zenn CLIの初期セットアップ

Zennコンテンツ管理用のディレクトリで以下を実行して環境を構築する。

```bash
npm init --yes
npm install zenn-cli
npx zenn init
```

- **`articles/`**: 記事用マークダウンファイルを配置。
- **`books/`**: 本用マークダウンファイルを配置。
- **`npx zenn preview`**: ローカルサーバーが起動し `http://localhost:8000` でプレビュー可能。

---

## 2. 記事フロントマター（ヘッダー）のハマりポイント

### ① タイトルの文字数制限
- **制限**: タイトルは **70文字以内** で指定する必要がある。
- **エラー事例**: 70文字を超えると `npx zenn preview` や検証時に警告が表示されるため、簡潔かつ分かりやすいタイトルに要約する。

### ② トピック（topics）の個数制限
- **制限**: `topics` に指定できるタグは **最大5個まで**（配列形式）。
- **エラー事例**: 6個以上指定するとフォーマット違反となるため、検索性・注目度の高い代表的な5つを厳選する。
  ```yaml
  topics: ["linux", "hermesagent", "neovim", "tmux", "linuxmint"]
  ```

---

## 3. GitHub連携と `git push` 時の認証エラー

### ① HTTPSでの認証エラーと Personal Access Token (PAT)
- **現象**: `git push` 時に GitHub のログインパスワードを入力しても拒否される。
- **原因**: 2021年以降、GitHubでは通常のパスワードによる Git 認証が廃止されたため。
- **対策**:
  1. GitHubの [Settings -> Developer settings -> Personal Access Tokens (classic)](https://github.com/settings/tokens) を開く。
  2. `repo` 権限を付与したトークン（`ghp_...`）を発行する。
  3. `Password:` にログインパスワードではなく、発行した **トークン文字列** を入力する。

### ② 次回以降のトークン入力省略設定
毎回トークンを入力するのを防ぐため、以下のコマンドを実行してPCに認証情報を保存させる。

```bash
git config --global credential.helper store
```

### ③ `Permission denied (publickey)` エラー
- **現象**: リモートURLを SSH (`git@github.com:...`) に設定した際アクセスが拒否される。
- **原因**: PCのSSH鍵がGitHubアカウントに未登録のため。
- **対策**: SSH鍵をGitHubに登録するか、`git remote set-url origin https://github.com/ユーザー名/リポジトリ名.git` で HTTPS に戻して PAT 認証を行う。

---

## 4. 公開フラグ（`published`）とブランチ運用

### ① 公開コントロール
- **`published: false`**: 下書き状態。`main` ブランチに push しても Zenn 上では非公開・無視される。
- **`published: true`**: 公開状態。Zennと連携したリポジトリに push されると自動的に Zenn に公開される。

### ② おすすめの運用ワークフロー
- **普段の執筆**: `published: false` のまま `main` ブランチで作業し、定期的に `git push` してバックアップを取る（Zennには公開されない）。
- **投稿時**: 記事が完成したら `published: true` に変更して `git push` する。

---

## 関連記事

- **Zenn公式**: [Zenn CLI ドキュメント](https://zenn.dev/zenn/articles/zenn-cli-guide)
- **GitHub公式**: [GitHub CLI 認証](https://docs.github.com/ja/authentication)
- `Git-認証-PAT-SSH` / `Zenn記事執筆ワークフロー` / `GitHub-Actions-自動デプロイ` — 個別技術メモ（未作成・予定）