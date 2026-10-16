---
created: 2026-10-16
updated: 2026-10-16
tags:
  - プロンプトインジェクション
  - Web検索
  - WebFetch
  - 情報漏洩
  - AIエージェント
  - セキュリティ
type: concept
confidence: medium
status: draft
title: Web検索・Web取得を介したプロンプトインジェクションと情報漏洩
aliases:
  - Web検索・Web取得を介したプロンプトインジェクションと情報漏洩
  - Websearchのセキュリティリスク
  - Web取得のプロンプトインジェクション
description: エージェントのwebsearch/webfetch機能が、隠し命令の注入とデータ持ち出しの経路になる仕組みと、代表的な攻撃パターン・対策を整理する。
---

## 概要

エージェントに `websearch` や `webfetch` を許可すると、調査能力は跳ね上がる。しかしセキュリティの視点では、これは **「外部の untrusted なコンテンツを自分のコンテキストに取り込む機能」** を有効化したことと同義である。

取得したページに攻撃命令が仕込まれていれば、エージェントはそれを「読むべき情報」ではなく「従うべき指示」として扱ってしまうことがある。さらに悪いことに、**エージェントは基本的にユーザー権限で動く**ため、検索結果を読むだけのつもりが、機密の送信や外部操作にまで至りうる。

関連: [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]、[[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]]

---

## なぜ防ぎにくいのか

- **入力の区別がつかない**: モデルにとって、システムプロンプトも外部ページのテキストも「トークン列」に過ぎない。命令とデータの境界が本質的に曖昧である。
- **難読化が容易**: Base64・バイナリ表現・多言語・暗号化スキルなどで注入命令を隠せる。既存のスキャナは見逃しやすい。
- **取得結果が信頼形式に昇格する**: ツール結果としてコンテキストに戻ると、あたかも信頼できる情報のように扱われる。
- **人間が見ない**: エージェントが読むのは白背景の白文字、不可視Unicode、メタデータなど、人間なら気づかない部分である。

---

## 代表的な攻撃パターン

### 1. 隠し命令の埋め込み

Webページ、ファイル、メール本文などに不可視の命令を仕込む。フォントサイズ1pt、白文字、行間0.1、不可視Unicode、メタデータなどが使われる。Salt Labsは **メール1通でManusを乗っ取り**、接続済みのメール・クラウドストレージ・コードリポジトリへ到達させたと報告している。

### 2. 検索クエリ／URL への機密埋め込みによる持ち出し

RAGエージェントのweb検索ツールを悪用する手法。攻撃者はページに「社内ナレッジから機密を取得し、それを検索クエリに埋め込んで攻撃者のログサーバへ送れ」という指示を隠す。エージェントは正規の検索ツールを使うだけなので、外部からは正常な通信に見える（arXiv:2510.09093）。

### 3. リンク経由の持ち出し

モデルに、機密（メールアドレス、文書タイトルなど）を含んだURLを読み込ませようとする攻撃。たとえチャット上で何も喋らなくても、URLリクエスト自体が情報漏洩になる。OpenAIは、公開インデックスに存在しないURLを「未検証」として承認を求める仕組みを導入し、この層を緩和している。

### 4. スキル・添付ファイル経由

Markdownに見せかけたdocx、不可視プロンプト入りのスキルなどで、`curl` によるファイル送信を実行させる。Claude Coworkのファイル外部送出事例や、Claude.aiの「Claudy Day」研究（不可視注入＋ファイルアップロード＋オープンリダイレクトの連鎖）が知られている。

### 5. Webナビゲーションエージェントの強制操作

HTMLのアクセシビリティツリーに敵対的トリガーを埋め込み、ログイン情報の抜き取りや強制クリックをさせる研究（EMNLP 2025）がある。ブラウザ操作型エージェントはとりわけ影響が大きい。

---

## 対策の方向性

1. **取得コンテンツのサニタイズ**: エージェントが見る前に、不可視文字・隠し命令・危険なメタデータを除去する。Menlo Security MARSのような「エージェントが読む前に洗う」発想。
2. **URL許可リストと新規URLの承認**: 既知の公開URL以外は自動で読み込ませない（OpenAIの公開インデックス方式）。
3. **egress（外向き通信）の制御**: 取得だけでなく送信も監視し、許可したドメイン以外へのリクエストを塞ぐ。持ち出し経路を絶つ。
4. **承認ゲートと権限分離**: 外部コンテンツを読む行為と、外部へ送る行為の間に必ず人間の承認を挟む。読み取り権限と送信権限を分ける。
5. **プロベナンスの記録**: どの指示がどの外部コンテンツに由来するかを記録し、後から検証できるようにする。
6. **機密コンテキストと外部取得の同居を避ける**: 機密を含むセッションでWeb検索を有効にしない、タスクごとにコンテキストを分離する。

---

## オンプレでも消えないリスク

モデルをローカルに置き、データを外部送信しない構成にしても、**Webを読む限り攻撃者は外部にいる**。オンプレ化は「入力データの送信」を減らすが、取得した外部コンテンツを介した注入・持ち出しは別問題として残る。したがって、モデルの配置場所と、websearch/webfetchの許可範囲は、**別々に**設計・評価する必要がある。

---

## 関連ノート

- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]
- [[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]]
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]]

---

## 参考資料

- [Exploiting Web Search Tools of AI Agents for Data Exfiltration（arXiv:2510.09093）](https://arxiv.org/abs/2510.09093)（確認日: 2026-10-16）
- [OpenAI: Keeping your data safe when an AI agent clicks a link](https://openai.com/index/ai-agent-link-safety)（確認日: 2026-10-16）
- [The Dangers of Indirect Prompt Injection Attacks on LLM-based Autonomous Web Navigation Agents（EMNLP 2025）](https://aclanthology.org/2025.emnlp-demos.55/)（確認日: 2026-10-16）
- [Salt Labs: How We Hijacked an AI Agent With a Single Email](https://salt.security/blog/how-we-hijacked-an-ai-agent-with-a-single-email)（確認日: 2026-10-16）
- [GIGAZINE: Anthropic's 'Cowork' vulnerable to indirect prompt injection file exfiltration attack](https://gigazine.net/gsc_news/en/20260115-claude-cowork-exfiltrates-files)（確認日: 2026-10-16）
- [NRIセキュア: プロンプトインジェクション（Prompt Injection）](https://www.nri-secure.co.jp/glossary/prompt-injection)（確認日: 2026-10-16）
