---
created: 2026-10-08
updated: 2026-10-08
tags:
  - Herdr
  - AIエージェント
  - Omarchy
  - 開発環境
  - Linux
type: log
confidence: observed
status: draft
title: Herdrによるマルチエージェント並行作業環境
aliases:
  - Herdrによるマルチエージェント並行作業環境
  - Herdr
  - Herdr workflow
description: AIエージェント特化型ターミナルマネージャー「Herdr」の特徴、Omarchy環境での統合、複数エージェント並行立ち上げ運用のメモ。
---

## 概要

**Herdr** は、AIコーディングエージェントの監視・操作に特化した次世代のターミナルマルチプレクサ（Terminal Workspace Manager）である。

Omarchy（Arch Linuxベースの環境）上に統合されており、複数のAIエージェントを同時に立ち上げて並行作業を進める基盤として活用している。

本ノートは、現在構築しているHerdr運用の整理と、今後さらに掘り下げていくためのメモ・検証用ページである。

---

## Herdrの特徴と従来のtmuxとの違い

tmuxやzellijなどの従来のターミナルマルチプレクサと異なり、Herdrは「**AIエージェントの稼働状態**」を認識する**ネイティブ設計**（Agent-Native Multiplexing）が最大の特徴である。

- **エージェント状態の自動検知**:
  ペイン内で動いているCLIエージェントの出力を監視し、現在のステータスを自動判定する。
  - `working`（思考・処理中）
  - `blocked`（ユーザーの入力や承認待ち）
  - `done`（作業完了）
  - `idle`（待機中）
- **アテンションキュー（Attention Queue）**:
  サイドバーを見れば「どのアカウントがユーザー入力待ちなのか」が一目でわかるため、複数のペインをいちいち切り替えて確認する手間がなくなる。
- **セッション永続性**:
  バックグラウンドサーバーで動作するため、ターミナルを閉じたりSSHが切断されたりしてもエージェントの作業が中断されない。

---

## Omarchy環境での統合

Omarchy環境にはHerdrが標準的に組み込まれており、デスクトップバーやショートカットを通じてスムーズにエージェントの稼働状況を把握・操作できる。

---

## 現在の並行立ち上げセットアップ（無料枠フル活用）

現在、Herdr上で常時立ち上げているエージェント群は以下の通り。

| ツール / エージェント | 呼び出しコマンド / 形態 | 特徴・役割 |
| :--- | :--- | :--- |
| **OpenCode** | `opencode` | コントリビューター枠（Muse Spark 1.3）など |
| **Kiro CLI** | `kiro` | Autoモデル選択で軽量タスクを高速処理 |
| **Copilot** | `gh copilot` / 連携 | 定常的なコード補完・チャット |
| **Codex** | `codex` | コード生成・特定修正 |
| **Antigravity** | `agy` | Google開発の自律エージェント。Gemini 3.8 Flash連携 |
| **Hermes Agent** | `hermes` | トラブルシューティングやVault管理 |
| **Cursor CLI** | `agent` | Autoモデル選択で手軽な指示出し |

ひとつのエージェントに時間のかかる探索やビルドを任せている間、別ペインのエージェントでスクリプトの草案を書かせるなど、待ち時間を極限まで減らした並行開発が可能になっている。

---

## 今後掘り下げたい検証テーマ（TODO）

- [ ] 各ペインの最適な画面分割・レイアウト構成（タブ管理 vs 画面分割）
- [ ] エージェント間のタスク引き継ぎフロー（共通仕様書 `TODO.md` を使ったバトンタッチ運用）
- [ ] HerdrのCLI / ソケットAPIを利用した自動化（エージェントが別エージェントを召喚する連携）
- [ ] リソース消費（メモリ・CPU）のモニタリングと最適化

---

## 関連ノート

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]]

---

## 参考資料

- [GitHub: Herdr](https://github.com/herdr/herdr)
- [Herdr 公式ドキュメント](https://herdr.dev)
- [Omarchy](https://omarchy.org/)

