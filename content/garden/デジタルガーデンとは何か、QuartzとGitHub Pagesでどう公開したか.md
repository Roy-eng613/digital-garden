---
created: 2026-09-30
updated: 2026-09-30
tags:
  - デジタルガーデン
  - Obsidian
  - Quartz
  - GitHub Pages
  - 個人サイト
source:
  - https://quartz.jzhao.xyz/
  - https://github.com/jackyzha0/quartz
  - https://docs.github.com/en/pages
confidence: primary_source
related:
  - "[[デジタルガーデン構想]]"
  - "[[QuartzでObsidianをデジタルガーデンとして公開する]]"
type: project
status: draft
title: デジタルガーデンとは何か、QuartzとGitHub Pagesでどう公開したか
aliases:
  - Quartzでデジタルガーデンを公開した記録
---

# デジタルガーデンとは何か、QuartzとGitHub Pagesでどう公開したか

Obsidianにメモが増えてきた。読書メモ、考えごと、記事の下書き、技術的な調査。どれも自分にとっては面白いのに、「人に見せる記事」にしようとすると急に完成度が必要になる。

そこで、完成品だけを公開するブログとは別に、考えている途中のものを置いておく場所を作ることにした。それがデジタルガーデンだ。

## デジタルガーデンとは何か

デジタルガーデンは、特定のサービスやソフトウェアの名前ではない。未完成の考えを公開し、リンクや追記によって少しずつ育てていく公開の姿勢だ。

ブログが「完成した記事を時系列に並べる場所」だとすれば、デジタルガーデンは「まだ育っている途中のページを、テーマとリンクで歩き回る場所」と言える。

| ブログ | デジタルガーデン |
| --- | --- |
| 完成してから公開する | 未完成でも公開する |
| 新しい順に並ぶ | テーマとリンクでつながる |
| 投稿後は更新が少ない | 追記・修正しながら育てる |
| 読者向けの完成品 | 自分の思考整理も兼ねる |

もちろん、未完成なら何を書いてもよいということではない。事実と感想を分けること、情報の確度を示すこと、あとから更新できる構造にしておくことは必要だと思う。

## なぜObsidianとQuartzなのか

Obsidianは、ローカルのMarkdownファイルを中心に使える。自分のノートを一つのサービスに預けるのではなく、ファイルとして持てるのがよい。

さらに、wikilinkでノート同士をつなげられる。デジタルガーデンに必要な「ページ同士の関係」を、普段のメモと同じ感覚で書ける。

Quartzは、MarkdownをWebサイトに変換する静的サイトジェネレーターだ。Obsidianのwikilink、タグ、バックリンク、グラフ、全文検索などを扱えるので、単なるMarkdown変換器よりもデジタルガーデン向きだと思った。

今回使ったのはQuartz v5。公式リポジトリのv5を取得し、Node.jsで動く構成をそのまま利用した。ローカル環境ではNode.js v26.8.1を使い、Quartzの設定に合わせてGitHub ActionsではNode.js 24を使うようにした。

## GitHub Pagesにした理由

公開場所にはGitHub Pagesを選んだ。

- 無料で始められる
- GitHubにpushすればActionsで自動公開できる
- 静的サイトなのでサーバーやデータベースがいらない
- 独自ドメインを後から設定できる

ただし、GitHub FreeでGitHub Pagesを使う場合、公開リポジトリにする必要がある。ここで重要なのは、Obsidian Vault全体をそのまま公開しないことだ。

日記や仕事のメモを含むVaultと、読者に見せてよいページだけを置く公開用リポジトリは分けることにした。

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

### 1. 空のGitHubリポジトリを作った

`Roy-eng613/digital-garden`という公開リポジトリを作り、次の場所へcloneした。

```text
/home/roy/Work/git/digital-garden
```

### 2. Quartz v5を初期配置した

Quartz公式リポジトリのv5を取得し、公開リポジトリへ配置した。

そのうえで、次の設定を行った。

- サイト名を「デジタルガーデン」に変更
- ロケールを`ja-JP`に変更
- GitHub PagesのURLを`baseUrl`に設定
- Obsidian Flavored Markdownを有効化
- 検索、バックリンク、グラフ、タグを有効化
- サイトマップとRSSを有効化
- 旧ホームページを参考に、暗色・金色・シアン系の色を設定

### 3. 最初のページを4つ作った

最初から大量のノートを公開するのではなく、次の4ページだけで仕組みを動かした。

- デジタルガーデンのトップページ
- この庭について
- 庭のノート
- 文学賞の入口

中身が少なくても、ローカルで表示でき、pushして公開できる状態を先に作ることにした。

### 4. GitHub Actionsを設定した

`main`にpushされたら、QuartzをビルドしてGitHub Pagesへデプロイするワークフローを作った。

主な処理は次のとおり。

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

このVaultの`22_Digital-garden/`に公開候補の原稿を置く。公開前に個人情報、仕事のメモ、未公開画像、リンク切れを確認し、問題なければ公開用リポジトリの`content/`へコピーする。

文学賞のページでは、主催者公式サイトのURLと確認日を記録する。締切や応募資格は変わるので、「書いた時点では正しい」だけでなく、「いつ確認した情報か」を残しておきたい。

デジタルガーデンは、立派なサイトを完成させてから始めるものではない。まず小さな庭を公開し、ページを一つずつ増やしながら、自分にとって書きやすく、読者にとって歩きやすい形を探していくものだと思う。

## 関連リンク

- [公開サイト](https://roy-eng613.github.io/digital-garden/)
- [GitHubリポジトリ](https://github.com/Roy-eng613/digital-garden)
- [Quartz公式サイト](https://quartz.jzhao.xyz/)
- [Quartz公式リポジトリ](https://github.com/jackyzha0/quartz)
- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)

## 他の発信場所

- [Zenn（ogiri）](https://zenn.dev/ogiri)：技術的な検証や実装
- [note（もつ煮グラタン）](https://note.com/mon_hormone)：思索やエッセイ
- [はてなブログ「本と珈琲。」](https://dokusyocoffee.hatenablog.com/)：読書感想や長めの考察
