---
created: 2026-10-16
updated: 2026-11-02
tags:
  - digital-garden
  - AIエージェント
  - セキュリティ
  - プロンプトインジェクション
type: moc
status: published
title: AIエージェントセキュリティ MOC
aliases:
  - AIエージェントセキュリティ
  - AIエージェントセキュリティ Map of Content
description: "AIエージェントをOSSハーネス・中国製モデル・オンプレ・Web検索・権限設計の観点から扱うセキュリティ関連ノートのMap of Content。"
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
- [[secure-retrieval-proxy|セキュア検索は「生のWebを渡さない」設計]] — 検索プロキシ、許可ドメイン、サニタイズ、egress制御

## 統制設計

- [[security-ban-paradox|「全部禁止」は安全ではない]] — 禁止の総和が能力・現場・可視性を同時に失わせる構造
- [[agent-risk-four-layers|エージェントのリスクは4層に分かれる]] — データ送信・外部入力・実行権限・供給網の分解
- [[agent-permission-matrix|データ分類×操作リスクで「禁止」を「段階的許可」に分解する]] — 分類と操作のマトリクス、承認ゲート
- [[harness-enforced-security|ハーネスで強制できる統制と、できない統制]] — 実行層で縛れるもの、意味の安全性は縛れないもの
- [[zdr-is-not-local|ZDRは「データを送らない」ではない]] — 送信・保持・学習利用・アクセスの分離
- [[internal-mirror-as-trust-boundary|社内ミラーは「便利」より先に「供給網の境界」として設計する]] — 取得分離、固定、署名、SBOM
- [[mcp-tool-trust|MCPは「接続」ではなく「ツールの信頼」を管理する仕組みである]] — ツール定義、権限、rug pull、第三者サーバー
- [[shadow-ai-usable-policy|守れないルールは守られない]] — シャドーAIを生む統制と、使える統制の条件

## 関連

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
