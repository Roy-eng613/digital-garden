---
title: "AIエージェントのコンテキストを絞り、トークンコストを抑える"
description: "プロジェクト全体やGit履歴を毎回読み込ませることによるトークンコストと注意配分の問題を整理し、必要な情報に絞る考え方を示す。"
tags:
  - AI
  - AIエージェント
  - トークン
  - コンテキスト管理
  - 開発コスト
type: research
confidence: medium
status: draft
created: 2026-11-08
updated: 2026-11-08
aliases:
  - エージェントのコンテキスト効率
related:
  - "[[MOC-Agent-Context-and-Memory]]"
  - "[[why-agent-instructions-still-matter]]"
  - "[[context-window-exhaustion]]"
  - "[[autonomous-ai-agents-token-consumption-free-tier]]"
  - "[[agent-instruction-files-and-scope]]"
---

## 毎回すべてを読むコスト

エージェントにプロジェクト全体やGitの履歴を毎回読み直させると、入力トークンが積み上がる。個人利用では利用料や無料枠の消費に、会社では開発コストに直結しうる。自律的に探索・編集・検証を繰り返すエージェントでは、複数のファイルやツール結果が履歴に蓄積するため、依頼文の長さだけを見ても実コストはわからない。

## 情報量は多ければよいとは限らない

大きなコンテキストが必ず精度を下げるとは限らないが、無関係な情報まで一度に渡すと、作業に必要な前提が埋もれて注意の焦点が散る可能性がある。必要な情報が窓の中に存在することと、モデルがその情報を適切に使えることは同じではない。

## 必要な範囲に絞る

- タスクに関係するファイルから読み始める
- 広く探索する前に、検索や索引で候補を絞る
- Git履歴は全件ではなく、関連する変更や決定を確認する
- 失敗のログは生ログを繰り返し渡すのでなく、原因と回避策を短く記録する
- 共通ルールは短く保ち、作業固有の詳細は必要時に参照する

絞り込みすぎて重要な背景を落とせば、誤った判断や手戻りが増える。コストだけを最小化するのではなく、タスクに必要な情報と検証に足る根拠を残す。

## トークン効率は読み込み設計の問題

指示ファイルや外部記憶を導入すれば自動的に安くなるわけではない。毎回大量に読み込む設計なら逆にコストが増える。共通の短い前提から必要な情報を選んで参照できるかを確認し、無駄な再探索や同じ失敗の反復が減ったかを運用で確かめる。

## 関連ノート

- [[MOC-Agent-Context-and-Memory|AIエージェントの指示・記憶・コンテキスト MOC]]
- [[context-window-exhaustion|AI小説執筆におけるコンテキストウィンドウの枯渇問題]]
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]]
- [[agent-instruction-files-and-scope|AIエージェントの指示ファイルとSkillsはどう使い分けるか]]

## 参考資料

- [Nelson F. Liu et al., “Lost in the Middle: How Language Models Use Long Contexts”](https://arxiv.org/abs/2307.03172) — 長い入力の中で関連情報の位置がモデル性能に与える影響を評価した研究。個々のモデル・タスクへの一般化には注意が必要（確認日: 2026-11-08）
- [Anthropic: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — Skillsのメタデータ、本文、追加資料を段階的に読み込む設計例（確認日: 2026-11-08）
- [OpenAI Codex: AGENTS.md](https://developers.openai.com/codex/guides/agents-md/) — Codexの指示ファイル連結と既定サイズ上限（確認日: 2026-11-08）
