---
created: 2026-11-08
updated: 2026-11-08
tags:
  - digital-garden
  - AIエージェント
  - コンテキスト管理
  - 記憶
type: moc
confidence: medium
status: draft
title: AIエージェントの指示・記憶・コンテキスト MOC
aliases:
  - AIエージェントの指示と記憶
description: AIエージェントに何を指示し、何を記憶させ、どの情報をコンテキストに渡すかを考えるノートの一覧。
---

AIエージェントの指示ファイル、Skills、記憶、コンテキスト設計に関するノートをまとめる。

## 全体像

- [[why-agent-instructions-still-matter|AIが賢くなった今、AGENTS.mdは本当に不要なのか]] — 記事の中心ノート。指示・記憶・コンテキストを人間が設計する意味

## 指示ファイルと手順

- [[agent-instruction-files-and-scope|指示ファイルとSkillsの役割・適用範囲]] — AGENTS.md、Skills、USER.md、MEMORY.md、SOUL.mdの役割整理
- [[agent-instructions-in-team-development|チーム開発でAIエージェントのルールをどう共有するか]] — 共通ルールの置き場所・配布・更新とセキュリティの論点
- [[how-to-install-agent-skills|AIエージェントにスキルを入れる方法]] — Skillsの導入先、エージェントごとの読み込み場所
- [[what-is-soul-md|SOUL.mdは何を定義するファイルか]] — SOUL.mdの役割と他の指示・記憶ファイルとの違い

## 記憶と人間の調整

- [[agent-memory-needs-human-curation|AIエージェントの記憶を人間が調整する理由]] — 自動記憶の限界、選別・確認・更新の必要性
- [[user-md-memory-md-agent-memory|USER.mdとMEMORY.mdで作る、どのエージェントでも使える記憶運用]] — ユーザー情報と運用知を外部ファイルで共有する実践
- [[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]] — 作業記憶・プロジェクト記憶・長期記憶の階層化

## コンテキストとコスト

- [[agent-context-efficiency-and-cost|コンテキストの絞り込みとトークンコスト]] — 必要な情報に絞ることと費用・注意配分
- [[context-window-exhaustion|AI小説執筆におけるコンテキストウィンドウの枯渇問題]] — 情報を詰め込みすぎたときの焦点のぼけ
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]] — 自律エージェントのトークン消費とファイル範囲の絞り込み
