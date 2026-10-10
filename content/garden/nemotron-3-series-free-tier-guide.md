---
created: 2026-10-08
updated: 2026-10-08
tags:
  - LLM
  - AI
  - NVIDIA
  - Nemotron-3-Nano
  - Nemotron-3-Super
  - Nemotron-3-Ultra
  - Ollama-Cloud
  - OpenRouter
type: concept
confidence: confirmed
status: evergreen
title: Nemotron 3シリーズの特徴と無料枠での使い分け
aliases:
  - Nemotron 3シリーズの特徴と無料枠での使い分け
  - Nemotron 3種の違いと特徴
  - Nemotron 3シリーズ
description: NVIDIA Nemotron 3シリーズ（Nano 30B / Super / Ultra 550B）のアーキテクチャやスペックの違い、無料枠プロバイダー（Ollama Cloud / OpenRouter）での使い分けや使用感を解説。
---

## 概要

無料のLLMプロバイダー（Ollama Cloud や OpenRouter など）を利用していると、NVIDIAの **Nemotron-3** シリーズが無料枠のラインナップとして提供されているのをよく目にする。

Nemotron-3 シリーズには主に **Nano (30B)**、**Super**、**Ultra (550B)** の3つのバリエーションが存在する。それぞれのスペック差や設計思想、そして実際の使い分けについてまとめる。

---

## Nemotron 3 ファミリーの共通特徴

Nemotron-3 ファミリーは、NVIDIAがエージェントAI（Agentic AI）や長文脈処理に向けて開発したオープンウェイトモデル群である。

- **Hybrid Mamba-Transformer MoE アーキテクチャ**:
  State Space Model（Mamba）の高速な系列処理能力と、Transformerの表現力を組み合わせたハイブリッド構造を採用。Mixture-of-Experts (MoE) により、推論時のアクティブパラメータ数を抑えつつ高い計算効率を実現している。
- **最大1Mトークンの長文脈（Context Window）**:
  大規模なドキュメント検索や複数ファイルのコード解析、長期の対話履歴保持に対応。
- **LatentMoE & Multi-Token Prediction (MTP)**:
  ハードウェア効率を高める専門エキスパート構造と、複数トークンを同時予測する機構により、高い生成スループットを誇る。

---

## 3つのモデルの違いとスペック比較

| モデル名 | 総パラメータ数 (アクティブ) | 位置づけ・設計思想 | 主な適正タスク |
| :--- | :--- | :--- | :--- |
| **Nemotron-3 Nano** | ~30B (active ~3B) | 超高速・軽量・高スループット | サブエージェント、単純な分類・要約、ルーティング |
| **Nemotron-3 Super** | ~100B–120B | バランス型・マルチエージェント協調 | 定型的な業務自動化、ドキュメント生成、中間推論 |
| **Nemotron-3 Ultra** | ~550B (active ~55B) | フロンティア級の推論・コーディング | 複雑なコード生成、システムトラブルシューティング、自律推論 |

### 1. Nemotron-3 Nano (30b)
系列内で最も軽量なモデル。総パラメータ約30B、アクティブ約3Bで動作するため非常に高速。マルチエージェントシステムにおける「補助役（サブエージェント）」や、高頻度で叩く軽量タスクに適している。

### 2. Nemotron-3 Super
NanoとUltraの中間に位置するミドルクラスモデル。十分なコンテキスト理解力と推論力を備えつつ、Ultraよりもレイテンシや消費リソースが抑えられている。

### 3. Nemotron-3 Ultra
Nemotron-3のフラッグシップモデル。総パラメータ550B（アクティブ約55B）を誇り、Claude 3.5 SonnetやGPT-4クラスに迫る高度な推論力とコーディング能力を持つ。

---

## 実際の使用感・実践ログ

### Obsidian Vault操作やトラブルシューティングでの実力
普段の作業では、主に **Nemotron-3 Ultra** を重宝している。

- **Hermes Agentのアップデート修復**:
  実際に遭遇したHermes Agentのアップデートエラーの際、ログをそのまま渡してトラブルシューティングを任せたところ、問題箇所を正確に特定して解決してくれた。
- **Vault操作の安定感**:
  Markdownファイルの編集やメタデータ管理、ファイルの整理などのタスクも問題なく任せられる知能を持っている。
- **LongCatとの比較**:
  Nous Portalで提供されているLongCatと比較しても、Nemotron-3 Ultraのほうが日本語の文脈理解や指示への追従性において頭一つ抜けて賢い印象がある。

---

## プロバイダーでの提供状況（無料枠）

### Ollama Cloud
Ollama Cloudの無料利用クレジット（Free usage credits）では、以下のモデルが対象となっており、Nemotronの3種すべてをクラウド上で試すことができる。

- `nemotron-3-nano:30b`
- `nemotron-3-super`
- `nemotron-3-ultra`
- （その他: `gemma4:31b`, `gpt-oss:120b`, `gpt-oss:20b`）

月間リクエスト上限（2週間ごとにリフィル）はあるものの、UltraクラスのモデルをAPIキー不要の手軽さでクラウドから利用できるのは非常に大きい。

### OpenRouter
OpenRouterでも `:free` タグ付きのエンドポイントとしてNemotron-3 Ultraが提供されている。
ただし、OpenRouterの無料エンドポイントは利用者が多いため、レートリミット（回数制限）に達しやすい点に留意する必要がある。

---

## 関連ノート

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]]

---

## 参考資料

- [NVIDIA Nemotron-3 Ultra 公式ページ](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [Ollama Cloud](https://ollama.com/cloud)
- [OpenRouter](https://openrouter.ai/)

