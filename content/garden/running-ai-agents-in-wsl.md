---
created: 2026-10-17
updated: 2026-10-17
tags:
  - WSL
  - AIエージェント
  - OpenCode
  - Codex
  - Windows
  - 開発環境
type: idea
confidence: medium
status: draft
title: WSLでAIエージェント（OpenCode・Codex）を使うときの違い
aliases:
  - WSLでCodexを使う
  - WSLでOpenCodeを使う
  - WSLとAIエージェント
description: OpenCodeやCodex CLIをWindowsで使うとき、WSLで動かす場合とネイティブで動かす場合に何が違うのか。サンドボックス方式、ファイルシステム性能、パス・権限、設定の保存先、WSL3コンテナの可能性まで整理する。
---

## 概要

Windowsでコーディングエージェントを使うとき、**「WSLで動かす」か「ネイティブWindowsで動かす」か**で挙動が変わる。ここでは [[what-is-wsl3|WSL3]] を前提に、OpenCodeとCodex CLIを例に違いを整理する。

結論を先に言うと、**「エージェントはLinux/POSIX前提で作られていることが多く、WSLはその前提に合わせやすい。ただしリポジトリの置き場所を間違えると極端に遅くなる」** というのが要点である。

---

## エージェントがLinuxを好む理由

一般的なコーディングエージェントは、`bash`、`grep`、`find`、`git` といったUnixコマンドを前提に訓練・設計されていることが多い。そのため:

- **シェル操作**: Linuxネイティブのシェル環境のほうがエラーが起きにくい
- **パス**: Windowsの `\` と `/` の混在、大文字小文字の扱いの差を回避できる
- **権限**: パーミッション（実行ビットなど）の整合性が取れる
- **ビルド**: `make`、`docker`、各種Linuxツールチェーンがそのまま使える

ObsidianのClaudianのようなWindowsネイティブアプリからは、**WSL内部のバイナリは自動検出されない**（Windowsホスト側の実行パスを探すため）。この点は [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]] で扱った。

---

## OpenCodeの場合

OpenCodeの公式ドキュメントは、Windowsでは**WSLの利用を推奨**している。理由として、ファイルシステム性能・フルターミナル機能・依存ツールとの互換性を挙げている。ネイティブでも動くが、WSLのほうが快適という位置づけである。

- 設定・セッションはWSL内の `~/.local/share/opencode/` に保存される
- `opencode web` はPowerShellではなくWSLから起動したほうがファイルアクセスとターミナル統合が良い
- Windows側ドライブのプロジェクトでも動く（`/mnt/c/` 経由）が、**リポジトリをWSLのファイルシステム（例: `~/code/`）に置くのが最も快適**

---

## Codexの場合（サンドボックスの違い）

Codexは2026年8月時点で、**ネイティブWindowsのサンドボックスを既定**とし、必要に応じてWSL2を選ぶ、という方針になっている。ここは変化が早い領域なので注意。

| | ネイティブWindows | WSL2 |
| :--- | :--- | :--- |
| サンドボックス方式 | Windowsサンドボックス（`elevated` / `unelevated`、MXC） | Linuxサンドボックス（bubblewrap） |
| ファイル隔離 | ACL・サンドボックスユーザー境界 | 名前空間の分離 |
| ネットワーク既定 | オフ | オフ |
| セットアップ | 管理者プロンプトが1回必要（`elevated`） | WSL導入＋`bubblewrap` |
| リポジトリの速度 | ネイティブ | Linux FS上ならネイティブ |
| Linuxツールチェーン | Windowsにある分だけ | ネイティブ |

**WSL1は非対応**。Codex `0.115` でLinuxサンドボックスが `bubblewrap` に移行したため、WSL1では動かない。`wsl --set-version` でWSL2へ変換するか、ネイティブ経路を使う。

---

## 最大の落とし穴：`/mnt/c` 問題

最も多い失敗がこれ。**WSLからWindowsドライブ（`/mnt/c/...`）のファイルを読むと、翻訳レイヤ（9Pプロトコル）を毎回通るため3〜5倍遅い**。エージェントはファイルを頻繁に読むので、体感は「壊れている」レベルになる。

対策:

- リポジトリをWSLのファイルシステム内（`~/code/` など）にcloneする
- Windows側のツールから参照したい場合は `\\wsl$` 共有経由で見る

WSL3ではvirtiofsが既定になり、この辺りのクロスOSアクセスが最大2倍改善されている。→ [[what-is-wsl3|WSL3とはなにか]]

---

## WSL3コンテナでエージェントを隔離する

[[what-are-wsl-containers|WSLコンテナ]] を使うと、**エージェントの実行環境をコンテナとして隔離**できる。ツールや依存関係を固定でき、危険な操作を閉じ込められるため、サンドボックスとしての相性が良い。GPUアクセスも非特権ユーザーから可能で、ローカルLLMと組み合わせたエージェント実行にも向く。

---

## まとめ

- エージェントはLinux前提のものが多く、WSLはその前提に合わせやすい。
- OpenCodeはWSL推奨。Codexはネイティブ既定だが、Linuxツールチェーンが要るならWSL2。
- 何より**リポジトリを `/mnt/c` に置かない**。これが速度問題の大半を占める。
- WSL3コンテナはエージェントの隔離実行基盤として有望。

---

## 関連ノート

- [[what-is-wsl3|WSL3とはなにか]]
- [[what-are-wsl-containers|WSLコンテナとはなにか]]
- [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[herdr-tmux-wezterm-terminal-layers|Herdr・tmux・WezTermのすみ分けと位置づけ]]
- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]

---

## 参考資料

- [OpenCode Docs: Windows (WSL)](https://opencode.ai/docs/windows-wsl/)（確認日: 2026-10-17）
- [Codex Docs: WSL](https://learn.chatgpt.com/docs/windows/wsl)（確認日: 2026-10-17）
- [Codex Docs: Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)（確認日: 2026-10-17）
- [Continuum Code: Codex CLI Windows: native sandbox vs WSL2 setup](https://continuumcode.ai/guides/codex-cli-windows/)（確認日: 2026-10-17）
