---
title: "AIエージェントにスキルを入れる方法（npx skills / Hermes Agent）"
description: "AnthropicのSKILL.md仕様に準拠したAgent Skillsを、npx skills CLIや各エージェント（Claude Code、Hermes Agent等）に導入する手順。依存関係の落とし穴とセキュリティ注意点も整理"
tags:
  - AI
  - Hermes
  - Skills
  - Agent
  - Claude-Code
  - npx-skills
  - セキュリティ
type: article
confidence: observed
status: evergreen
created: 2026-08-30
updated: 2026-10-03
aliases:
  - AIエージェント スキル導入手順
  - npx skills 使い方
related:
  - "[[oss-agent-harness-comparison-2026]]"
source: "[[91_Processed/how-to-install-agent-skills]]"
---

## この記事について

Anthropic の SKILL.md 仕様に沿った「Agent Skills」を、`npx skills` CLI や各エージェント（Claude Code / Hermes Agent など）に導入する手順のメモ。
Matt Pocock 製の `grill-me` / `grill-with-docs` を例に、依存関係の落とし穴まで整理する。

> [!NOTE]
> スキルは YAML フロントマター付きの Markdown ファイル（`SKILL.md`）にすぎない。仕様は Anthropic が公開したオープンな SKILL.md 仕様に準拠しており、Codex・OpenClaw・Hermes Agent などが採用している。

---

## `npx skills add` はどこに入れるのか

skills.sh（Vercel Labs）の CLI は、スキルの実体を **中立の正規ストア（canonical store）** に一度だけ置き、各エージェントのディレクトリからそこを指す（シンボリックリンク）という2段構えになっている。

### スコープで場所が変わる

| スコープ | スキル本体（実体） | ロックファイル |
| --- | --- | --- |
| プロジェクト（既定・フラグなし） | `./.agents/skills/` | `./skills-lock.json` |
| グローバル（`-g` / `--global`） | `~/.agents/skills/` | `~/.local/share/skills/.skill-lock.json` |

- プロジェクトスコープがデフォルト。作業ディレクトリの `skills-lock.json` に記録され、スキルは `./.agents/skills/` に実体化される。
- グローバルスコープ（`-g`）はユーザーアカウント単位で全プロジェクトに適用され、実体は `~/.agents/skills/` に置かれる。

> [!TIP]
> 実行時に「どこに入れるか」を対話で質問してくれるので、迷ったらそこで選べばよい。

### 入った場所の確認

```bash
ls ~/.agents/skills/     # グローバルで入れた場合
ls ./.agents/skills/     # プロジェクトで入れた場合
```

---

## 落とし穴：エージェントのディレクトリと繋がらないことがある

CLI はまず `~/.agents/skills/` に置くが、**各エージェントが読むディレクトリは別**。

- Claude Code → `~/.claude/skills/`
- Hermes Agent → `~/.hermes/skills/`

これらはデフォルトでは互いに通信しない。CLI が自動でリンクを張るが、うまくいかないケースがある。

> [!WARNING]
> CLI のバージョンが **1.5.15 以前** だと Claude Code 用のリンクを作らず、インストールしたスキルがエージェントに現れない。
> （`.agents/skills/` を直接読む Codex などは影響を受けない）

### 対処法

1. 手動でシンボリックリンクを張る
2. SessionStart フックで自動同期する
3. 対象エージェントのディレクトリへ手動コピーする

---

## Hermes Agent に入れる手順

Hermes は `~/.hermes/skills/` を読む。CLI は Hermes のパスへ自動リンクしないので、手動で持っていくのが確実。

```bash
# 1. スキルを取得（例：grill 系一式）
npx skills add https://github.com/mattpocock/skills \
  --skill grill-with-docs --skill grilling --skill domain-modeling

# 2. 実体の場所を確認
ls ~/.agents/skills/

# 3. Hermes のディレクトリへコピー
cp -r ~/.agents/skills/grill-with-docs ~/.hermes/skills/
cp -r ~/.agents/skills/grilling        ~/.hermes/skills/
cp -r ~/.agents/skills/domain-modeling ~/.hermes/skills/
```

Hermes 向けにパッケージされたリポジトリなら、Hermes 標準のコマンドでも入る：

```bash
hermes skills install <registry>/<repo>/.../grill-with-docs
```

---

## 依存関係の落とし穴（重要）

`grill-me` や `grill-with-docs` は **オーケストレーター（束ねるだけ）のスキル**で、本体が薄い。ロジックは呼び出し先のスキルに入っている。

```
grill-with-docs   ← 実質「grilling と domain-modeling を呼ぶだけ」
├── grilling          ← 実際のインタビュー処理（1問ずつ・決定木・推奨回答）
└── domain-modeling   ← CONTEXT.md / ADR をディスクに書き込む処理
```

> [!CAUTION]
> 依存を1つでも欠くと、呼び出し指示が空振りし、モデルが中身を想像で埋めてしまう（推奨回答が付かず、質問を一度に全部聞いてくる等）。

### 対策：一式まとめて入れる

```bash
# 依存も含めてまとめて
npx skills add https://github.com/mattpocock/skills \
  --skill grill-with-docs --skill grilling --skill domain-modeling

# あるいは全部入れる（最も確実）
npx skills@latest add mattpocock/skills
```

---

## インストール後の使い方

- 入れたスキルは自動的にスラッシュコマンド化され、`/grill-with-docs` のように呼び出せる。
- Hermes では、インストールしたスキルは **新しいセッション**で有効になる。今すぐ使うなら `/reset` で仕切り直すか、`--now` で即時反映する。
- 起動は自分でコマンドを打つ（エージェントが勝手に使うわけではない）。

---

## 公式ソース

- Matt Pocock 公式リポジトリ：`github.com/mattpocock/skills`
  - `grill-me` … `productivity` カテゴリ
  - `grill-with-docs` … `engineering` カテゴリ
- 解説：`aihero.dev/grill-with-docs`
- CLI ドキュメント：`skills.sh/docs/cli`

---

## まとめ

- `npx skills add` の実体は `~/.agents/skills/`（グローバル）or `./.agents/skills/`（プロジェクト）。
- 各エージェント（Claude Code / Hermes）は別ディレクトリを読むので、リンク or コピーが必要な場合がある。
- grill 系は依存スキルとセットで初めて動く。迷ったら一式インストール。

---

## セキュリティ：中身を確認せずに入れない

スキルは「YAML フロントマター付きの Markdown」にすぎず、エージェントの挙動を指示するテキストそのもの。つまり **信頼できないスキルを中身を見ずに入れると、悪意ある指示を実行させられるリスク**がある。

> [!CAUTION]
> スキルはコードやツール呼び出しの指示を含みうる。CLI で一括インストールすると、意図しない・悪意あるスキルが紛れ込むことがある。**導入前に必ず SKILL.md（と依存スキル）の中身を読む**こと。

### 具体的なリスク

- **プロンプトインジェクション**：SKILL.md 本文に「秘密ファイルを読め」「外部に送信せよ」等の隠し指示が仕込まれている。
- **依存の芋づる**：オーケストレーター型スキル（例：`grill-with-docs`）は他スキルを呼ぶ。呼ばれる側に悪意があっても気づきにくい。
- **一括インストールの盲点**：`npx skills add ... `（リポジトリ丸ごと）だと、目的外のスキルまで `~/.agents/skills/` に入る。実際に `find-skills` のような依存外のものも一緒に入っていた。

### 確認のしかた

コピー／リンクする前に、各スキルの中身に目を通す。

```bash
# インストール済みスキルの一覧
ls ~/.agents/skills/

# 各スキルの本体を確認（YAMLフロントマター＋本文）
cat ~/.agents/skills/grill-with-docs/SKILL.md
cat ~/.agents/skills/grilling/SKILL.md
cat ~/.agents/skills/domain-modeling/SKILL.md

# フロントマターの description / トリガーだけざっと見る
head -n 15 ~/.agents/skills/*/SKILL.md
```

チェックの観点：

- `description` と実際の本文の指示が一致しているか
- ファイル読み書き・ネットワーク送信・外部コマンド実行を促す文言がないか
- 想定外のスキルを呼び出していないか（依存の連鎖）

### 運用のコツ

- **必要なスキルだけを手動で** `~/.hermes/skills/` に置く（今回のように、確認したものだけコピー）。
- 一括インストールした `~/.agents/skills/` は「ステージング置き場」と割り切り、**中身を確認したものだけ**エージェントの本番ディレクトリへ渡す。
- 出所（公式リポジトリか、フォークか）とスターやメンテ状況も確認する。

---

## 関連記事

- [[oss-agent-harness-comparison-2026]] — OSSエージェントハーネス比較（Hermes/OpenCode/Kiro Crew等）（未公開・準備中）
- **公式リポジトリ**: [mattpocock/skills](https://github.com/mattpocock/skills)
- **CLI ドキュメント**: [skills.sh/docs/cli](https://skills.sh/docs/cli)
- **解説**: [aihero.dev/grill-with-docs](https://aihero.dev/grill-with-docs)