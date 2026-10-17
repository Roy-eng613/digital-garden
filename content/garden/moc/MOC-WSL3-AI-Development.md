---
created: 2026-10-17
updated: 2026-10-17
tags:
  - digital-garden
  - WSL
  - WSL3
  - コンテナ
  - AIエージェント
  - ローカルLLM
type: moc
status: draft
title: WSL3とAI開発 MOC
aliases:
  - WSL3とAI開発
  - WSL3とAI開発 Map of Content
  - WSLとコンテナ
description: WSL3のアップデート、WSLコンテナ、コンテナの基礎、AIエージェント（OpenCode・Codex）の実行環境、ローカルLLMとGPUの関係をたどるためのMap of Content。
---

WSL3のアップデートを起点に、「コンテナとは何か」「なぜ必要か」「AIエージェントやローカルLLMとどう関わるか」をたどるための目次。

## WSL3のアップデート

- [[what-is-wsl3|WSL3とはなにか]] — 2026-09-29 GA。Linuxカーネル6.18、WSLコンテナ、virtiofs、GPU/NPU準仮想化
- [[what-are-wsl-containers|WSLコンテナとはなにか]] — `wslc.exe`、セッション分離、consomme、SDK/API、Intune/MDE

## コンテナの基礎

- [[what-is-a-container|コンテナとはなにか]] — イメージとコンテナ、VMとの違い（アパートと一軒家）
- [[why-containers-are-needed|コンテナはなぜ必要なのか]] — 環境差問題、再現性、ポータビリティ、イミュータブル

## AIエージェント・ローカルLLM

- [[running-ai-agents-in-wsl|WSLでAIエージェント（OpenCode・Codex）を使うときの違い]] — サンドボックス方式、`/mnt/c`問題、設定の保存先
- [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]] — CUDAパススルー、メモリ返却問題、ネイティブWindowsとの使い分け

## 誰が使うか

- [[who-uses-wsl-and-containers|WSLとコンテナは開発者以外も使うのか]] — データサイエンティスト、インフラ、間接的な全員利用

## 関連する既存ノート

- [[herdr-tmux-wezterm-terminal-layers|Herdr・tmux・WezTermのすみ分けと位置づけ]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]
- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
