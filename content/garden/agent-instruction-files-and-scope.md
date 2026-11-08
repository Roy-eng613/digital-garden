---
title: "AIエージェントの指示ファイルとSkillsはどう使い分けるか"
description: "AGENTS.md、Skills、USER.md、MEMORY.md、SOUL.mdを適用範囲と役割で整理する。ファイル名や読み込み仕様がエージェントごとに異なる点にも触れる。"
tags:
  - AI
  - AIエージェント
  - AGENTS-md
  - Skills
  - コンテキスト管理
type: research
confidence: medium
status: draft
created: 2026-11-08
updated: 2026-11-08
aliases:
  - AGENTS.mdとSkillsの役割
related:
  - "[[MOC-Agent-Context-and-Memory]]"
  - "[[why-agent-instructions-still-matter]]"
  - "[[how-to-install-agent-skills]]"
  - "[[user-md-memory-md-agent-memory]]"
  - "[[what-is-soul-md]]"
---

## 役割はファイル名ではなく適用範囲で考える

AIエージェントの指示や記憶に使うファイル名は、製品やハーネスによって異なる。以下は普遍的な規格ではなく、情報の置き場所を考えるための役割分担である。

| 名前の例 | 主な役割 | 置く情報の例 |
|---|---|---|
| `AGENTS.md` | 作業場所・プロジェクトに適用する指示 | リポジトリ構成、守る規則、検証方法 |
| `SKILL.md` / Skills | 特定タスクで使う手順・専門知識 | レビューやデプロイなどの作業手順 |
| `USER.md` | ユーザーについての安定した前提 | 好み、環境、関心 |
| `MEMORY.md` | 過去の決定や運用上の学び | 失敗、環境の癖、次回の注意点 |
| `SOUL.md` | エージェントの役割や応答姿勢 | 口調、価値観、不確実な場合の振る舞い |

どのファイルを常時読み込むか、どれを必要時に呼び出すかは環境依存である。対応しているように見えるファイル名でも、読み込み場所や優先順位を使うエージェントの仕様で確認する。

## どの情報をどこへ置くか

- 複数の作業で守るプロジェクト規則は、プロジェクトの指示ファイルへ
- 特定のタスクだけで使う詳細な手順は、必要時に呼び出すSkillsへ
- 個人の好みはユーザー単位の設定・記憶へ
- 過去の失敗や環境固有の学びは、次の作業で参照できる記憶へ
- エージェントの一般的な応答姿勢は、対応環境ならSOUL.mdなどへ

同じ内容を複数のファイルに重複して書くと、更新時に食い違いが起きやすい。正本を決め、他のファイルには必要な参照だけを置く。

## Skillsは手順書だけとは限らない

Skillの形式によっては、Markdownの説明だけでなく、スクリプトや外部ツールへのアクセスを含むことがある。導入時は、出所や中身だけでなく実行されるコード・権限・依存関係も確認する。

## 関連ノート

- [[MOC-Agent-Context-and-Memory|AIエージェントの指示・記憶・コンテキスト MOC]]
- [[how-to-install-agent-skills|AIエージェントにスキルを入れる方法]]
- [[user-md-memory-md-agent-memory|USER.mdとMEMORY.mdで作る、どのエージェントでも使える記憶運用]]
- [[what-is-soul-md|SOUL.mdは何を定義するファイルか]]

## 参考資料

- [OpenAI Codex: AGENTS.md](https://developers.openai.com/codex/guides/agents-md/) — Codexでの指示ファイル名、探索範囲、優先順位（確認日: 2026-11-08）
- [Anthropic: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — Skillsの構成、必要時に内容を読み込む仕組み（確認日: 2026-11-08）
- [Hermes Agent: Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) — Hermesで対応するコンテキストファイルと優先順位（確認日: 2026-11-08）
- [Hermes Agent: Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) — HermesにおけるSOUL.mdの役割（確認日: 2026-11-08）
