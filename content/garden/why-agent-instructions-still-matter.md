---
title: "AIが賢くなった今、AGENTS.mdは本当に不要なのか"
description: "モデルが賢くなっても、プロジェクト固有の前提や過去の失敗を自動で共有できるとは限らない。指示・記憶・コンテキストを人間が設計する意味を考える。"
tags:
  - AI
  - AIエージェント
  - AGENTS-md
  - Skills
  - コンテキスト管理
type: reflection
confidence: medium
status: draft
created: 2026-11-08
updated: 2026-11-08
aliases:
  - AIが賢くなった今、AGENTS.mdは不要なのか
  - AIエージェントの指示ファイルと記憶ファイル
related:
  - "[[MOC-Agent-Context-and-Memory]]"
  - "[[agent-instruction-files-and-scope]]"
  - "[[agent-context-efficiency-and-cost]]"
  - "[[agent-memory-needs-human-curation]]"
  - "[[agent-instructions-in-team-development]]"
---

モデルの推論能力が上がっても、プロジェクト固有のルールやユーザーの好み、前回の失敗まで自動で知っているわけではない。ハーネスが記憶機能を提供する場合もあるが、保存・再利用の仕組みや人間が介入できる範囲はそれぞれ異なる。

一方で、人間が書く指示やプロンプトは、内容次第でAIの推論を狭め、アウトプットの質を下げることもある。だからといって、情報をすべて指示ファイルに詰めたり、プロジェクト全体を毎回読ませたりするのが正解ではない。何を共有し、どこに置き、いつ読み込むかを設計する必要がある。そこにはトークンコストを抑えるだけでなく、必要な情報にエージェントの注意を向ける狙いもある。

この記事では、AIが十分に賢くなったときに人間の指示は不要になるのか、むしろ質を下げてしまうのかを考える。現時点での自分なりの答えは、[[agent-instruction-files-and-scope|指示ファイルとSkillsの役割]]、[[agent-memory-needs-human-curation|自動記憶を人間が調整する理由]]、[[agent-context-efficiency-and-cost|コンテキストとコスト]]を分けて整理した上で述べる。全体の論点は[[MOC-Agent-Context-and-Memory|AIエージェントの指示・記憶・コンテキスト MOC]]にまとめた。

## 自分なりの暫定回答：指示は不要なのではなく、少なく・よく選ぶ

AGENTS.mdや人間のプロンプトは、置けばAIの質を上げる魔法ではない。誤った前提、古い決定、曖昧な要求、過剰に細かい手順を渡せば、AIはそれを手掛かりに誤った方向へ進みうる。特に、人間が解決方法まで早合点して指定すると、モデルが本来なら見つけられた別の解決策を検討しなくなることがある。指示はAIの能力を補うだけでなく、推論の探索範囲を狭める入力にもなる。

それでも、モデルが賢くなることと、プロジェクト固有の情報を知っていることは別だ。コードやテストから推測できることは増えても、書かれていない設計判断、チームの合意、避けたい副作用、過去に失敗した理由まで毎回正確に復元できるとは限らない。すべてを自力で探索・推論させる方法もあるが、毎回の読み込みや再発見には時間とトークンがかかる。

したがって、私の答えは「AGENTS.mdは常に必要」でも「AIが賢くなれば不要」でもない。**AIが自力で推論できることまで指示に書かず、推論だけでは分からない前提や、間違えると高くつく制約を、短く選んで共有するのがよい**。

具体的な判断基準としては、次の切り分けを意識する。
- **人間が伝えること**: 目的（Why/What）、変えてはいけない境界（Constraint）、検証方法（Verification）
- **AIに任せること**: 具体的な実装手段、設計の探索（How）

共通の指示には目的や守るべき境界を置き、作業固有の手順は必要なときだけSkillsなどから読み込む。具体的な実装方法は固定しすぎず、AIが調査・提案できる余地を残す。

人間の役割も、プロンプトで逐一やり方を教える「プロンプト職人」から、AIが安全に探索できる境界線を定義し、記憶を断捨離する「境界と記憶の編集者」へと移る。AIが出した答えを確認し、役立った失敗や判断だけを次に使える形で記録するのも人間の仕事だ。ただし、その記憶や指示を維持する手間はゼロではなく、ハーネスの仕様変更を追うコストもある。だから仕組み自体も、効果がある分だけ持つ。

この答えは暫定的なものだ。実際にどの情報を指示に残すべきか、指示がAIの探索を妨げた例は何か、使用するハーネスで記憶がどのように働くかを、今後の利用経験と検証で具体化したい。

個人での利用だけでなく、チームの共通ルールをどの範囲で設け、どう配布・更新するかも考えたい論点だ。現時点の問題意識は[[agent-instructions-in-team-development|チーム開発でAIエージェントのルールをどう共有するか]]に分けている。

## この記事で扱う論点

- [[agent-instruction-files-and-scope|指示ファイルとSkillsの役割・適用範囲]]
- [[agent-memory-needs-human-curation|自動記憶を人間が調整する理由]]
- [[agent-context-efficiency-and-cost|コンテキストの絞り込みとトークンコスト]]

ファイル名や読み込み仕様はエージェントやバージョンにより異なる。特定製品の機能を説明するときは、記事執筆時点の仕様を確認する。

## 参考資料

- [OpenAI Codex: AGENTS.md](https://developers.openai.com/codex/guides/agents-md/) — Codexが指示ファイルを探索し、指示チェーンを組み立てる仕様（確認日: 2026-11-08）
- [Anthropic: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — Skillsの段階的な読み込みと構成（確認日: 2026-11-08）
- [Hermes Agent: Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) — セッションを越えるメモリの保存・再注入（確認日: 2026-11-08）
- [Hermes Agent: Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) — AGENTS.mdなどのコンテキストファイルの読み込み仕様（確認日: 2026-11-08）
- [Nelson F. Liu et al., “Lost in the Middle: How Language Models Use Long Contexts”](https://arxiv.org/abs/2307.03172) — 長いコンテキスト内の情報位置と検索性能を検討した研究（確認日: 2026-11-08）
