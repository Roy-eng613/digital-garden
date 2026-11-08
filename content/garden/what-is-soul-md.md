---
title: "SOUL.mdは何を定義するファイルか"
description: "SOUL.mdをエージェントの人格・応答スタイルなどを記述する設定ファイルとして捉え、ユーザー情報やプロジェクト規則を置くファイルとの違いを整理する。"
tags:
  - AI
  - AIエージェント
  - SOUL-md
  - エージェント設計
type: research
confidence: medium
status: draft
created: 2026-11-08
updated: 2026-11-08
aliases:
  - SOUL.mdの役割
related:
  - "[[MOC-Agent-Context-and-Memory]]"
  - "[[why-agent-instructions-still-matter]]"
  - "[[user-md-memory-md-agent-memory]]"
---

## SOUL.mdとは

`SOUL.md`は、一部のAIエージェント環境で、エージェントの役割や応答の姿勢を記述するために使われるファイル名である。何を「エージェントらしさ」として扱うかは環境や運用により異なり、すべてのエージェントが認識する標準ファイルではない。

名前から人格全体を制御できるように見えるが、実際には読み込まれる指示の一つとして考えるのがよい。モデルやハーネスの挙動を完全に保証したり、強制的なセキュリティ境界になったりするものではない。

## 他のファイルとの違い

- **SOUL.md**: エージェントの役割、口調、応答の姿勢など
- **USER.md**: ユーザーの好み、環境、関心など
- **MEMORY.md**: 過去の決定、失敗、運用上の学びなど
- **AGENTS.md**: 作業場所やプロジェクトに適用するルールや手順
- **Skills**: 特定の作業で使う、呼び出し可能な手順や知識

この区分は設計上の整理であり、特定のファイル名に固定された普遍的な仕様ではない。実際に使うエージェントのドキュメントで、ファイルの対応状況と読み込み順序を確認する。

## 何を書くか

SOUL.mdを使う場合は、ユーザーの個人情報やプロジェクト固有の細則を重複させず、エージェントの振る舞いとして安定して適用したい内容に絞る。

- どのような役割で支援するか
- どのような口調・説明姿勢をとるか
- 不確かなときにどう振る舞うか
- どのような価値観や境界を重視するか

具体的なツール権限や安全策をSOUL.mdの文章だけに任せない。実行権限や承認フローはハーネス側の設定で制御し、文章の指示とは分けて考える。

## 使うときの注意

1. 利用するエージェントがSOUL.mdを読み込むか確認する
2. 読み込み場所・優先順位・更新方法を確認する
3. USER.mdやAGENTS.mdと内容が重複・矛盾しないようにする
4. 人格設定を安全機構と取り違えず、権限は別の仕組みで管理する

SOUL.mdという名前自体より、何の情報を誰に適用し、いつ読ませるかを明確にすることが重要である。

## 関連ノート

- [[MOC-Agent-Context-and-Memory|AIエージェントの指示・記憶・コンテキスト MOC]]
- [[why-agent-instructions-still-matter|AIが賢くなった今、AGENTS.mdは不要なのか]]
- [[user-md-memory-md-agent-memory|USER.mdとMEMORY.mdで作る、どのエージェントでも使える記憶運用]]

## 参考資料

- [Hermes Agent: Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) — HermesでのSOUL.mdの保存場所、読み込み方、AGENTS.mdとの役割の違い（確認日: 2026-11-08）
