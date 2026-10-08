---
created: 2026-10-01
updated: 2026-10-08
tags:
  - LLM
  - AI
  - Nemotron-3-Ultra
  - LongCat
  - GPT-5.6-Luna
  - Gemini-3.8-Flash
  - Antigravity
  - Hermes-Agent
  - Herdr
  - OpenCode
  - Kiro-CLI
  - Copilot
  - Codex
  - Claudian
  - Pi
type: article
confidence: confirmed
status: evergreen
title: 最近よく使っているLLMプロバイダー（無料）
aliases:
  - 無料のLLMプロバイダー
description: OpenRouter、Nous Portal、Ollama Cloudなどの無料LLMプロバイダーの比較や、VS Code拡張機能（Antigravity、Copilot、Codex）の回復型無料枠、HerdrやClaudianを活用した最強の無料開発環境について。
---

## 概要

日々のコーディングやObsidianでのノート管理、トラブルシューティングにおいて、無料で利用できるLLMプロバイダーや開発ツールを組み合わせて作業環境を構築している。

現在主軸として利用している無料プロバイダーは以下の3つである。

- [OpenRouter](https://openrouter.ai/)（多彩なオープンウェイトモデルの `:free` 枠）
- [Nous Portal](https://portal.nousresearch.com/)（LongCatなどの独自・先行モデル）
- [Ollama Cloud](https://ollama.com/cloud)（Nemotronシリーズ等のクラウド無料クレジット）

本ページでは、これらのプロバイダーや各モデルの使い分け、そしてVS Code拡張機能やHerdr、Obsidian（Claudian）を組み合わせた「**最強の無料作業環境**」の全体像をまとめている。

詳細なトピックや検証ログについては、以下の各ノートで1アイデアごとに深掘りしている。

> [!TIP] テーマ別の詳細ノート
> - [[nemotron-3-series-free-tier-guide|Nemotron 3シリーズの特徴と無料枠での使い分け]] - Nano 30B / Super / Ultra 550Bのスペック比較と活用法
> - [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]] - Copilot / Antigravity / Codex の回復型無料枠運用
> - [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]] - Omarchy+Herdrで複数エージェントを同時稼働させる並行開発基盤
> - [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]] - VaultをワークスペースにするClaudian、Pi、WSL事情
> - [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]] - Cline×無料モデルでトークンが急消費する理由と対策

---

## 使っているモデルと使い分け

現在主戦力として使っているのは、NVIDIAの **Nemotron-3-Ultra** だ。OpenRouterとOllama CloudではNemotron-3-Ultraを使い、Nous Portalでは **LongCat** を使っている。

| モデル名 | 主な利用プロバイダー | 得意分野・使用感 |
| :--- | :--- | :--- |
| **Nemotron-3-Ultra** | Ollama Cloud / OpenRouter | Vault操作、トラブルシューティング、自律推論。非常に頼りになる |
| **LongCat** | Nous Portal | 長文脈処理。Nemotronと比べるとやや推論力は劣る印象 |
| **Gemini 3.8 Flash** | VS Code (Antigravity) | 日本語対話が自然で高速。日常的なコード相談・実装のメイン |
| **GPT-5.6-Luna** | Obsidian (Claudian経由) | Codex CLIを自動検出させてノート操作・執筆に利用 |
| **Muse Spark 1.3** | OpenCode | 無料枠で利用可能（コントリビューター枠）。まあまあ賢い |
| **Space bunny** | 各種 | 名前は可愛いが、実用面では正直あまり使えない印象 |

### 各モデルのリアルな使用感
- **Nemotron-3-Ultra**:
  基本的にVault操作くらいであれば全く問題なく任せられる。実際にHermes Agentのアップデートに失敗した際も、エラーログを渡してトラブルシューティングを任せたところ見事に原因を突き止めて解決してくれた。
- **Muse Spark 1.3**:
  OpenCodeで作業する際は、現在は無料枠として提供されており重宝している（コントリビューター向けのためデータ学習に使われる可能性はある点に留意）。
  過去にZennで実践記事を書いた：
  👉 [Hermes Agent × OpenCode × Muse Spark 1.3でポッドキャスト作りに挑んだ記録](https://zenn.dev/ogiri/articles/hermes-agent-opencode-musespark-podcast)

👉 *Nemotronシリーズ3種（Nano 30B / Super / Ultra 550B）のアーキテクチャやスペックの違いは、[[nemotron-3-series-free-tier-guide|Nemotron 3シリーズの特徴と無料枠での使い分け]] を参照。*

---

## 開発環境（VS Code / Omarchy）での無料枠運用

### ちょくちょく回復する無料枠の魅力（VS Code）
VS Codeで作業する際、拡張機能として **Copilot**、**Antigravity**、**Codex** などを併用している。

これらのツールは「**時間経過や日次・月次でちょくちょく無料枠が回復する**」という大きなメリットがある。1つのサービスだけに頼ると上限に達して作業が止まってしまうが、複数の枠をローテーションさせながら使うことで、コストをかけずに作業を継続できる。

- **Antigravity**:
  VS Code上で **Gemini 3.8 Flash（Medium）** を選択して相談やコーディングを進めている。日本語の対話が非常に自然でやりやすく、手放せない存在になっている。ターミナルコマンドは `agy`。
- **Copilot & Codex**:
  インライン補完や特定タスクの編集として活用。

### Omarchyでの並行作業環境（Herdr）
Omarchy（Arch Linuxベースの環境）上では、ターミナルマネージャー **Herdr** を使って以下のエージェントやツールを同時に開き、並行作業を進めている。

- **OpenCode**
- **Kiro CLI**
- **Copilot**
- **Codex**
- **Antigravity** (コマンド: `agy`)
- **Hermes Agent**
- **Cursor CLI** (コマンド: `agent`)

KiroやCursor CLI、Copilotは **モデルを「Auto」で選んでくれる** ため、簡単な作業をさせる前提であればモデル選定に思考リソースを奪われず非常に楽である。

👉 *詳しいローテーション運用術は [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]]、Herdr環境の詳細は [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]] を参照。*

---

## Obsidianでの使い方（Claudianプラグイン）

Obsidian上でファイルをAIに操作・執筆させるときは、**Claudian** プラグインを使用している。

![[Pasted image 20261008231202.png]]
*Claudian v2.3.16（開発者: Yishen Tu）*

### 自動検出の快適さ
ClaudianはローカルにインストールされているCLIツールを自動検出してくれるのが非常に嬉しいポイントである。

![[Pasted image 20261008231255.png]]
*対応プロバイダー一覧（Claude Code, Codex CLI, Grok Build, OpenCode, Pi）*

普段はCodex CLIを自動検出させ、**GPT-5.6-Luna** を指定してVault内のファイル整理や文章作成を行わせている。

### 検討中のポイント：ミニマルエージェント「Pi」
対応プロバイダーの中に **Pi**（Pi Coding Agent）があり気になっている。
機能を4つの基本ツール（`read`, `write`, `edit`, `bash`）に絞り込んだ極めてシンプルな設計思想を持っており、余計なオーバーヘッドがないためVault操作にも相性が良さそうである。

### OpenCodeとWSLの仕様
OpenCodeをWSL環境にインストールしている場合、Windows上のObsidian/Claudianからは自動検出されない。OpenCode公式はLinux/WSLでの利用を推奨しているが、AIエージェント全般がLinux環境と親和性が高い（シェル実行やパス解決の安定性など）ことが背景にある。

👉 *Claudianの設定やPiの詳細、WSL環境での挙動については、[[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]] を参照。*

---

## プロバイダーごとの無料枠の仕様と注意点

### OpenRouter
- 多彩なモデルを試せるのが魅力だが、無料キー（`:free` エンドポイント）はリクエスト制限が厳しい。
- 普通に使っていても「**乗りに乗ってきたところで上限に達して止まる**」ことがあり、作業のテンポが崩れやすい点に注意が必要。

### Ollama Cloud
Ollama Cloudの無料クレジット枠（Free usage credits）では、執筆時点で以下のモデルが提供されている。

- `nemotron-3-nano:30b`
- `nemotron-3-super`
- `nemotron-3-ultra`
- `gemma4:31b`
- `gpt-oss:120b` / `gpt-oss:20b`

![[Pasted image 20261008231739.png]]
*Ollama Cloudの使用状況（2週間ごとにリフィルされ、Nemotron-3-Ultraをメインで消費中）*

クラウドから手軽にNemotron-3-Ultraなどの超大型モデルを叩けるため、非常に実用的である。

### Clineなどの自律エージェントでの注意点
VS Codeの **Cline** などの自律型エージェントにOpenRouterの無料枠（Nemotron-3-Ultra等）を紐づけて作業させると、巨大なシステムプロンプトやファイル探索ループによって **一瞬でトークンが枯渇する** 現象が起きる。

賢さやコンテキスト把握力が微妙なモデルだと、指示の意図を汲み取れずに不要なファイルを何重にも読み込んで迷走し、あっという間にトークン上限を消費してしまう。

👉 *自律エージェントと無料枠モデルの相性やトークン消費の仕組みは、[[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]] を参照。*

---

## 関連ノート一覧

- [[nemotron-3-series-free-tier-guide|Nemotron 3シリーズの特徴と無料枠での使い分け]]
- [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]]

---

## 参考資料

- [OpenRouter](https://openrouter.ai/)
- [Nous Portal](https://portal.nousresearch.com/)
- [Ollama Cloud](https://ollama.com/cloud)
- [NVIDIA Nemotron-3 Ultra](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [GitHub: YishenTu/claudian](https://github.com/YishenTu/claudian)
- [Pi Coding Agent (pi.dev)](https://pi.dev)
- [GitHub: earendil-works/pi](https://github.com/earendil-works/pi)
- [OpenCode 公式サイト](https://opencode.ai/)
- [GitHub: Herdr](https://github.com/herdr/herdr)
