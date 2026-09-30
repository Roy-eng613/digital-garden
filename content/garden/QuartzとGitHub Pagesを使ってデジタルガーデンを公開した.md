---
created: 2026-09-30
updated: 2026-09-30
tags:
  - digital-garden
  - Obsidian
  - Quartz
  - GitHub-Pages
source:
  - https://quartz.jzhao.xyz/
  - https://github.com/jackyzha0/quartz
  - https://docs.github.com/en/pages
related:
  - "[[デジタルガーデン]]"
  - "[[デジタルガーデンとはなにか]]"
type: log
status: draft
title: QuartzとGitHub Pagesを使ってデジタルガーデンを公開した
aliases:
  - Quartzでデジタルガーデンを公開した記録
---

# QuartzとGitHub Pagesを使ってデジタルガーデンを公開した

デジタルガーデンを公開するために、ObsidianとQuartz、GitHub Pagesを組み合わせた。考え方そのものは[[デジタルガーデンとはなにか]]に分け、ここでは実際にやったことを記録する。

## Quartzを選んだ理由

Quartzは、MarkdownをWebサイトに変換する静的サイトジェネレーターだ。Obsidianのwikilink、タグ、バックリンク、グラフ、全文検索などを扱えるので、単なるMarkdown変換器よりもデジタルガーデン向きだと思った。

今回使ったのはQuartz v5。公式リポジトリのv5を取得し、Node.jsで動く構成をそのまま利用した。ローカル環境ではNode.js v26.8.1を使い、GitHub ActionsではNode.js 24を使うようにした。

## GitHub Pagesにした理由

- 無料で始められる
- GitHubにpushすればActionsで自動公開できる
- 静的サイトなのでサーバーやデータベースがいらない
- 独自ドメインを後から設定できる

GitHub FreeでGitHub Pagesを使う場合、公開リポジトリにする必要がある。Obsidian Vault全体をそのまま公開すると、日記や仕事のメモまで公開されてしまう。そのため、Vaultと公開用リポジトリは分けた。

## 今回の構成

```text
非公開のObsidian Vault
  └─ 22_Digital-garden/
       └─ 公開候補のMarkdown

公開用GitHubリポジトリ
  └─ digital-garden/
       ├─ content/
       ├─ quartz.config.yaml
       └─ .github/workflows/deploy.yml

Obsidianで原稿を書く
  → 公開前チェック
  → content/へコピー
  → git push
  → GitHub Actions
  → GitHub Pages
```

## 実際にやったこと

### 1. 空のリポジトリを作った

`Roy-eng613/digital-garden`という公開リポジトリを作り、次の場所へcloneした。

```text
/home/roy/Work/git/digital-garden
```

### 2. Quartz v5を初期配置した

Quartz公式リポジトリのv5を取得し、公開リポジトリへ配置した。

設定したものは次のとおり。

- サイト名を「デジタルガーデン」に変更
- ロケールを`ja-JP`に変更
- GitHub PagesのURLを`baseUrl`に設定
- Obsidian Flavored Markdownを有効化
- 検索、バックリンク、グラフ、タグを有効化
- サイトマップとRSSを有効化
- 旧ホームページを参考に、暗色・金色・シアン系の色を設定

### 3. 最初のページを作った

最初から大量のノートを公開せず、トップページ、About、文学賞の入口、庭のノートの4ページで仕組みを確認した。その後、デジタルガーデンの考え方と構築記録をトピックごとに分けて追加している。

### 4. GitHub Actionsを設定した

`main`にpushされたら、QuartzをビルドしてGitHub Pagesへデプロイするワークフローを作った。

1. リポジトリをcheckout
2. Node.jsをセットアップ
3. `npm ci`
4. Quartzプラグインをインストール
5. `npx quartz build`
6. `public/`をPages artifactとしてアップロード
7. `actions/deploy-pages`で公開

## 一度目のデプロイで404になった

最初のActionsでは、Quartzのビルドもartifactの作成も成功した。しかし最後の`actions/deploy-pages@v4`で、次のエラーになった。

```text
Failed to create deployment (status: 404)
Ensure GitHub Pages has been enabled
```

原因は、リポジトリ側でGitHub Pagesの公開元をまだ有効にしていなかったことだった。

GitHubのSettings → Pagesで、Build and deploymentのSourceを「GitHub Actions」に設定した。また、ワークフローに次の処理を追加した。

```yaml
- name: Setup Pages
  uses: actions/configure-pages@v5
```

artifactのアクションも`actions/upload-pages-artifact@v4`へ更新した。

修正版をpushすると、ビルド・artifact作成・デプロイのすべてが成功した。公開URLに対して`HTTP 200`が返ることも確認できた。

## 旧ホームページから何を流用したか

以前作っていたNext.js製のホームページには、サイバーパンク風のポータル画面があった。

今回はコードをそのまま移植しなかった。QuartzとNext.jsでは構造が違い、旧サイトにはSupabase、Xログイン、AI、大喜利投稿、RSS取得など、今回の庭には不要な機能も含まれていたからだ。

一方で、デザインの方向性は参考にした。

- 暗い背景
- シアンや黄色のアクセント
- 境界線と控えめな発光
- グリッド状のレイアウト
- 端末やログを思わせる情報表示

これらは今後、QuartzのCSSやレイアウトに合わせて少しずつ取り入れる予定だ。ただし、デジタルガーデンでは文章が主役なので、最初からアニメーションや効果音を全面に出すことはしない。

## これからの運用

`22_Digital-garden/`に公開候補の原稿を置く。公開前に個人情報、仕事のメモ、未公開画像、リンク切れを確認し、問題なければ公開用リポジトリの`content/`へコピーする。

文学賞のページでは、主催者公式サイトのURLと確認日を記録する。締切や応募資格は変わるので、「書いた時点では正しい」だけでなく、「いつ確認した情報か」を残しておきたい。

## 関連リンク

- [公開サイト](https://roy-eng613.github.io/digital-garden/)
- [GitHubリポジトリ](https://github.com/Roy-eng613/digital-garden)
- [Quartz公式サイト](https://quartz.jzhao.xyz/)
- [Quartz公式リポジトリ](https://github.com/jackyzha0/quartz)
- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
