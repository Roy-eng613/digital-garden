---
created: 2026-10-16
updated: 2026-10-16
tags:
  - digital-garden
  - AIエージェント
  - セキュリティ
  - プロンプトインジェクション
type: moc
status: draft
title: AIエージェントセキュリティ MOC
aliases:
  - AIエージェントセキュリティ
  - AIエージェントセキュリティ Map of Content
description: "AIエージェントをOSSハーネス・中国製モデル・オンプレ・Web検索の観点から扱うセキュリティ関連ノートのMap of Content。"
---

AIエージェントを安全に使うためのセキュリティ関連ノートを集約するMap of Content。

## 実行基盤（ハーネス）

- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]] — ハーネスの攻撃面、間接プロンプトインジェクション、スキル供給網、YOLOモードの危険
- [[opencode-v2-migration-and-omo|OpenCode V2移行とOh My OpenCodeの現在地]] — V1/V2の選択基準、プラグイン互換の断絶、OmOの現在地
- [[three-oss-agent-harnesses|三大OSSハーネス比較：Hermes・DeepSeek Harness・OpenCode]] — 「住処」で見る3つの設計思想と用途別の選び方

## モデル・データ主権

- [[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]] — 4層のリスク、経路ごとの差、オンプレで消えるもの・残るもの

## 外部入力・持ち出し

- [[websearch-prompt-injection-risk|Web検索・Web取得を介したプロンプトインジェクションと情報漏洩]] — 隠し命令、検索クエリ/URL経由の持ち出し、対策

## 関連

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
