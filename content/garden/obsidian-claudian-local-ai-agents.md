---
created: 2026-10-08
updated: 2026-10-08
tags:
  - Obsidian
  - Claudian
  - AIエージェント
  - Codex-CLI
  - OpenCode
  - Pi
  - WSL
type: concept
confidence: confirmed
status: evergreen
title: Obsidianプラグイン「Claudian」とローカルAIエージェント
aliases:
  - Obsidianプラグイン「Claudian」とローカルAIエージェント
  - Claudian
  - Obsidian Claudian
description: Obsidian Vault上でローカルAIエージェントを直接動作させるプラグイン「Claudian」の特徴、対応プロバイダー（Codex CLI, Pi, OpenCode等）、WSL環境での注意点を解説。
---

## 概要

Obsidian内でAIエージェントを動かしてMarkdownファイルを直接編集・生成させたいとき、非常に強力なのが **Claudian** プラグインである。

ObsidianのVault全体をワークスペース（作業ディレクトリ）としてエージェントに渡し、差分プレビューを見ながらノートの執筆やファイル操作を行わせることができる。

---

## 現在のバージョンと対応環境

![[Pasted image 20261008231202.png]]

- **プラグイン名**: Claudian
- **バージョン**: 2.3.16
- **開発者**: Yishen Tu ([GitHub: yishentu/claudian](https://github.com/yishentu/claudian))
- **概要**: Claude Code / Codex などのローカルエージェントをObsidian Vaultの協調作業者として埋め込む

---

## 対応プロバイダーと自動検出の快適さ

![[Pasted image 20261008231255.png]]

Claudianの設定画面では、ローカルPCにインストールされている各種CLIツールを **自動検出（Auto Detect）** してくれる機能が備わっている。

現在タブに並んでいるプロバイダー：
1. **Claude Code** (Anthropicの公式CLIエージェント)
2. **Codex CLI** (OpenAIのCLIエージェント、v0.142.2で自動検出確認)
3. **Grok Build** (xAIのCLIツール)
4. **OpenCode** (オープンソースのAIコーディングエージェント)
5. **Pi** (ミニマル設計のターミナルエージェント)

PCにCLIがインストールされていれば自動で認識してトグルをONにするだけで連携できるため、APIキーや複雑なパス設定を手動で入力する手間が省けて非常に快適である。

普段はCodex CLIを検出させ、**GPT-5.6-Luna** などのモデルを用いてVault内のファイル操作を行わせている。

---

## 注目のミニマルエージェント「Pi」について

対応タブの中に **Pi** というエージェントがあり、気になって仕様を調べてみた。

- **正式名称**: Pi Coding Agent（`@earendil-works/pi-coding-agent`）
- **開発元**: Earendil Works / Mario Zechner 氏
- **公式サイト**: [pi.dev](https://pi.dev) / [GitHub](https://github.com/earendil-works/pi)

### Piの特徴
- **究極のミニマリズム**:
  一般的なオールインワン型エージェントとは異なり、コア機能を「`read`, `write`, `edit`, `bash`」の4つの基本ツールのみに絞り込んでいる。
- **プロバイダー非依存**:
  OpenAI、Anthropic、Googleだけでなく、OllamaやLM Studio経由のローカルモデル、OpenRouter等にも柔軟に対応可能。
- **拡張性**:
  TypeScriptによる拡張機能、プロンプトテンプレート、スキル追加などを自分好みに組み替えられる設計。

ClaudianがPiをサポートしているのも、この「シンプルで余計なオーバーヘッドがない」設計思想がノート操作や軽量エージェントタスクに非常にマッチするためだと考えられる。手軽に試す価値が高いツールである。

```bash
# インストール（Node.js 22.19+）
npm install -g @earendil-works/pi-coding-agent
```

---

## OpenCodeとWSL環境の注意点

### WSLインストール時の自動検出の壁
OpenCodeをWindows Subsystem for Linux（WSL）上にインストールしている場合、WindowsネイティブのObsidianから起動しているClaudianからは自動検出されない。

ClaudianはWindowsホスト側の実行可能パスを探すため、WSL内部のバイナリを直接見つけることができないのが理由である。

### OpenCode公式がWSLを推奨する背景
OpenCode公式ドキュメントでは、Windows環境で利用する場合、ネイティブWindows（PowerShell等）よりも **WSLでの導入（Linux環境）** を推奨している。

これには明確な理由がある：
1. **Bash・Unixコマンドのネイティブ実行**:
   エージェントがファイル検索（`find`, `grep`）やビルド、Git操作を実行する際、Linuxネイティブのシェル環境のほうがエラーが格段に起きにくい。
2. **ファイルパス・権限の整合性**:
   Windows固有のパス区切り文字（`\` vs `/`）やパーミッション問題、大文字小文字の差異に起因するバグを回避できる。
3. **AIエージェントとLinuxの親和性**:
   現代のコーディングエージェントは基本的にLinux/POSIX環境を前提に訓練・設計されているケースが多く、Linux上で動かす方が安定性と成功率が高い。

Obsidianと連携させる場合は、Windowsネイティブ側にOpenCodeをインストールするか、今後のClaudianのWSLブリッジ対応を待つのが現状の運用ポイントとなる。

---

## 関連ノート

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]]

---

## 参考資料

- [GitHub: YishenTu/claudian](https://github.com/YishenTu/claudian)
- [Pi Coding Agent 公式サイト (pi.dev)](https://pi.dev)
- [GitHub: earendil-works/pi](https://github.com/earendil-works/pi)
- [OpenCode 公式サイト](https://opencode.ai/)

