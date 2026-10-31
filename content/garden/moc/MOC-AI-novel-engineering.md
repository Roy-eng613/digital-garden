---
created: 2026-10-28
updated: 2026-10-28
tags:
  - digital-garden
  - AI
  - 小説
  - 創作
type: moc
status: draft
title: AI小説エンジニアリング MOC
aliases:
  - AI小説エンジニアリング
  - AI小説エンジニアリング Map of Content
description: "AIと長編小説を書くための思考・設計・実験の索引。哲学、フィードバック、コンテキスト設計、マネタイズまでをまとめる。"
draft: false
---

AIと長編小説を書くための索引。作品『思考のプリフェッチ』の制作から出てきた問いを、再利用できる形で置いている。

## 総論

- [[harness-engineering-ai-novel|ハーネスエンジニアリング：AI小説の質はモデルの外側で決まる]] — 下限を上げる技術。読める小説は作れるが、面白さは別

## 1. 哲学・メタ視点

- [[boundary-of-interestingness-human-ai|小説の「面白さ」における人間とAIの境界線]] — 面白さを3層に分け、逸脱の保持を境界にする
- [[turing-test-for-writing|文章におけるテューリングテストの定義]] — 帰属ではなく継続と再読で測る
- [[signals-of-ai-ness|読者が「AIっぽさ」を察知するシグナルとメンタルモデル]] — 正体は「配慮の匂い」
- [[tales-human-vs-ai-comparison|TALESでの人間作 vs AI作の比較実験仮説]] — 交絡を消した比較設計
- [[can-ai-novel-stay-coherent|「完結まで破綻しないAI小説」はエンジニアリングで可能か]] — 破綻は防げるが、面白さは別

## 2. アジャイル物語運営・フィードバック

- [[agile-web-novel-development|WEB小説におけるアジャイル開発手法の適用]] — 読者はレビュアーであって共同作者ではない
- [[reader-comments-as-signal|読者コメントのシグナル検出とプロンプトへの還元]] — 還元するのは事実誤認だけ
- [[interactive-story-constraints|インタラクティブなストーリー展開における制約条件の設計]] — 分岐ではなく態度の選択
- [[tales-vs-webnovel-platforms|TALESとWEB小説プラットフォームの読者層と反応の違い]] — 導線と評価軸の差

## 3. 技術・ステート管理・コンテキスト設計

- [[context-window-exhaustion|AI小説執筆におけるコンテキストウィンドウの枯渇問題]] — 量ではなく注意の配分
- [[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]] — 何を揮発させ、何を残すか
- [[obsidian-as-llm-external-memory|ObsidianをLLMの外部記憶（L2-L3）として利用するプロトコル]] — ファイル名・frontmatter・MOC・渡す単位
- [[foreshadowing-json-markdown|長編小説における伏線とフラグのJSON-Markdown管理]] — 状態は台帳、意味はMarkdown。形式は規模で選ぶ
- [[negative-prompting-ai-syntax|「AI構文」を打ち消すネガティブプロンプトと出力制御]] — 判定可能な禁止と出力形式
- [[emotional-fluctuation-prompting|人間らしい「感情の揺らぎ」をプロンプトでエミュレートする手法]] — 感情語ではなく行動の矛盾

## 4. プロダクト・収益化・ナラティブ

- [[value-of-unfinished-notes|デジタルガーデンにおける未完成思考の公開価値]] — 未完成と雑を分ける4条件
- [[monetizing-the-build-process|「小説そのもの」と「小説のビルドプロセス」の二重マネタイズ]] — 売れるのは失敗と数字
- [[tales-tracking-metrics|TALES投稿作品のトラッキング指標（PV・読了率・反応）]] — 24時間・7日・30日だけ記録する

## 実践ノート

- [[ai-shousetsu-no-kimochiwarusa|AI小説の「気持ち悪さ」はどこから来るのか]] — 4つの型と文体ルール全文
- [[llm-external-memory-atomic-notes|LLMの外部記憶としての「一ノート一アイデア」]] — シーン単位の投入とプロンプト
- [[who-decides-the-title|小説のタイトルは誰が決めるのか]] — 候補を出させ、作者が捨てる

## 作品

- [TALES『思考のプリフェッチ』](https://tales.note.com/mon_hormone/wv1wfe9vfvyb1)
- [第一話「旧校舎、雨、帰らなかった人」](https://tales.note.com/mon_hormone/wv1wfe9vfvyb1/episodes/emzaieegrhcg0)

## 関連する外部記事

- [note: 小説家はAIに仕事を奪われるのか](https://note.com/mon_hormone/n/na6981a40be71)
- [note: なぜAIが書いた小説は面白くないのか](https://note.com/mon_hormone/n/n0f6fdd82661b)
- [note: AIが書く小説に魂は宿るのか](https://note.com/mon_hormone/n/n4acf21b1a58b)
- [はてな: AIは小説を書ける。だが、偏ることはできない。](https://dokusyocoffee.hatenablog.com/entry/ai-novel-bias-reading)
- [Zenn: AIが書いた文章は、技術的にどう見分けられるのか](https://zenn.dev/ogiri/articles/ai-text-detection)

## 関連MOC

- [[MOC-AI-creation|AIと創作 MOC]]
- [[MOC-AIと意識|AIと意識 MOC]]
