---
created: 2026-10-11
updated: 2026-10-11
tags:
  - digital-garden
  - Quartz
  - giscus
  - GitHub
  - コメント
source:
  - https://giscus.app/ja
  - https://github.com/apps/giscus
  - https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository
related:
  - "[[Quartzとはなにか]]"
  - "[[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]"
  - "[[MOC-Quartz]]"
type: log
confidence: high
status: evergreen
title: QuartzにGitHubアカウントでコメントできるgiscusを設定した
aliases:
  - giscus設定
  - Quartzコメント設定
description: "QuartzにGitHub Discussionsを使ったコメントシステム「giscus」を導入した記録。Discussionsの有効化から、giscusアプリのインストール、quartz.config.yamlへの設定追加までの手順。"
---

## giscusとは

[giscus](https://giscus.app/ja) は、GitHubの **Discussions** 機能をバックエンドとして使うコメントシステム。  
訪問者はGitHubアカウントでログインし、各ページの下部にコメントやリアクション（👍、❤️など）を残すことができる。

Quartzでは公式プラグインとして `@quartz-community/comments` 経由で利用できる。

---

## 導入手順

### 1. GitHubリポジトリをPublicにする

giscusが動作するには、リポジトリが**公開（Public）**である必要がある。

### 2. GitHub Discussionsを有効化する

リポジトリページ → **Settings** → **General** → **Features** セクションの **Discussions** にチェックを入れる。

> [!note]
> この設定をしないと、giscus.app でリポジトリ名を入力したとき「giscusはこのリポジトリを利用できません」と表示されてしまう（下記参照）。
>
> - Discussionsが有効化されていること
> - リポジトリがPublicであること
> - giscusアプリがインストールされていること
>
> この3つがすべて満たされて初めて機能する。

### 3. Discussionsを有効化した後の初期ディスカッションについて

Discussionsを有効化すると、GitHubが「Start a new discussion」画面を表示することがある（Announcementsカテゴリで "Welcome to Discussions!" という初期投稿のテンプレートが出る）。

**この初期ディスカッションはポストしなくてよい。**  
giscusが動作するために初期投稿は不要で、カテゴリ（Announcements、Generalなど）が存在していれば十分。

### 4. giscusアプリをGitHubにインストールする

[https://github.com/apps/giscus](https://github.com/apps/giscus) にアクセスし、**Install** → 対象リポジトリを選択してインストール。

### 5. repoId・categoryIdを取得する

[https://giscus.app/ja](https://giscus.app/ja) を開き、リポジトリ名（例: `Roy-eng613/digital-garden`）を入力。  
使用するDiscussionカテゴリ（例: `General`）を選択すると、専用の **repoId** と **categoryId** が生成される。

> [!tip]
> コメントをどのDiscussionカテゴリに蓄積するかを決めておく。`Announcements` は管理者のみ投稿できるため、訪問者のコメントには `General` が適している。

### 6. quartz.config.yaml に設定を追加する

```yaml
- source: "@quartz-community/comments"
  enabled: true
  options:
    provider: giscus
    options:
      repo: Roy-eng613/digital-garden
      repoId: R_kgDOU1Azgg
      category: Announcements
      categoryId: DIC_kwDOU1Azgs4DHjL_
      mapping: pathname
      strict: false
      reactionsEnabled: true
      inputPosition: top
      lang: ja
      loading: lazy
  layout:
    position: afterBody
    priority: 50
```

---

## トラブルシューティング

### 「giscusはこのリポジトリを利用できません」と表示される場合

以下の3点を確認する。

1. **リポジトリがPublicになっているか**
2. **Discussionsが有効化されているか**（Settings → General → Features → Discussions）
3. **giscusアプリがリポジトリにインストールされているか**（[https://github.com/apps/giscus](https://github.com/apps/giscus)）

---

## 関連ノート

- [[Quartzとはなにか]]
- [[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]
- [[MOC-Quartz]]

