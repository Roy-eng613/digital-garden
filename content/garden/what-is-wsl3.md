---
created: 2026-10-17
updated: 2026-10-17
tags:
  - WSL
  - WSL3
  - Windows
  - Microsoft
  - コンテナ
  - AIエージェント
type: concept
confidence: medium
status: draft
title: WSL3とはなにか
aliases:
  - WSL3
  - WSL 3.0
  - Windows Subsystem for Linux 3
description: 2026年9月29日に一般提供（GA）されたWSL 3.0の位置づけと、WSL1/2からの変化、Linuxカーネル6.18・WSLコンテナ・virtiofs・GPU/NPUパススルーなど最近のアップデートで何が変わったのかを整理する。
---

## 概要

**WSL（Windows Subsystem for Linux）** は、Windows上でLinux環境を動かすための仕組みである。WindowsでLinux向けのAIツールやエージェントを動かすときの事実上の土台になっている。

**WSL 3.0** は2026年9月29日に一般提供（GA）された新しい系統で、最大の変更点は **LinuxコンテナをWindows上で直接動かせる「WSLコンテナ」** が正式機能になったこと、そしてLinuxカーネルが **6.18** に更新されたことである。あわせて、GPU/NPUへほぼネイティブに近い速度でアクセスするための再設計（Build 2026でプレビュー）も進んでいる。

WSLとコンテナの関係、エージェント実行への影響は別ノートに分けて整理する。

- [[what-are-wsl-containers|WSLコンテナとはなにか]]
- [[what-is-a-container|コンテナとはなにか]]
- [[running-ai-agents-in-wsl|WSLでAIエージェント（OpenCode・Codex）を使うときの違い]]
- [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]

---

## WSL1 → WSL2 → WSL3 の変遷

| 世代 | 仕組み | 特徴 |
| :--- | :--- | :--- |
| **WSL1** | WindowsカーネルがLinuxのシステムコールを翻訳 | 軽いが互換性に難。Codex 0.115でサポート終了（[[running-ai-agents-in-wsl]]参照） |
| **WSL2** | 軽量なHyper-V仮想マシン上で本物のLinuxカーネルを動かす | 互換性が高い。GPUアクセスは仮想化の境界を経由するため制約があった |
| **WSL3** | WSL2を土台に、コンテナをネイティブ機能化＋ハードウェアアクセスを準仮想化（paravirtualized）で再設計 | Linuxカーネル6.18、WSLコンテナGA、GPU/NPUパススルー（プレビュー） |

ポイントは、**WSL2が「仮想化の境界」を抱えていたこと**。特にGPU/NPUを使うAIワークロードでは、この境界がボトルネックになり、結果的に「Windowsを避けてLinuxを直接使う」動機になっていた。WSL3はそこを正面から作り直そうとしている。

---

## 最近のアップデート（WSL 3.0系）で何が変わったか

### 1. WSLコンテナが正式機能に（GA）

`wslc.exe`（エイリアス `container.exe`）で、Windows上でLinuxコンテナを直接ビルド・実行・管理できるようになった。Docker Desktopなどを別途入れなくても、WSLがそのままコンテナの土台になる。詳細は [[what-are-wsl-containers|WSLコンテナとはなにか]]。

### 2. Linuxカーネル 6.18 へ

起動時間とメモリ使用量の改善、不要なドライバ／サブシステムの削減が含まれる。ディストリビューションはext4の仮想ディスク（VHD）と仮想ネットワークアダプタ上で動く。

### 3. virtiofs の既定化（Windowsファイルアクセスが最大2倍）

従来の`plan9`プロトコルに代わり`virtiofs`が既定になり、Linux側からWindows側ファイルへの読み書きが**最大2倍**高速化。ファイルシステムアクセスはWSLの長年の弱点だったので、これは実用上のインパクトが大きい。

### 4. consomme ネットワークモード

Linuxの通信をWindowsのネットワークスタック経由で流す新しいモード。VPN・プロキシ・企業ネットワークとの互換性が上がる。現在はWSLコンテナ向けに有効で、将来WSL既定へ広げる方向。

### 5. GPU / NPU の準仮想化アクセス（Build 2026でプレビュー）

WSL2ではGPU/NPUが「仮想化の向こう側」にあり扱いづらかった。WSL3は準仮想化インターフェースでGPU/NPUへほぼネイティブに近い速度でアクセスさせる。対象はまずCopilot+ PC（Qualcomm Snapdragon X Elite、Intel Meteor Lake / Lunar Lake）。**AMD対応は今後**。Ollama・llama.cpp・PyTorch・JAX・vLLMなどが恩恵を受ける想定。詳細と注意点は [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]。

### 6. 企業向け管理（Intune / Microsoft Defender for Endpoint）

コンテナのプロセス・ファイル・ネットワーク活動をMDEがWindowsホストと紐づけて可視化。Intuneで「WSLコンテナ機能の許可/禁止」「プル可能なレジストリの許可リスト」を制御できる。

### 7. その他の細かい改善

- 3.0.2で **仮想NUMA対応**（256スレッド超のマルチソケットサーバで起動できるよう修正）と **sparse VHD（実験的）**。書き込んだ分だけディスクを消費する。
- `wslc compose`（既存の`compose.yaml`をそのまま使えるようにする）が次期の重点項目。

---

## なぜWSL3が重要なのか

Microsoftは「Linux on Windowsを、開発環境からAI／クラウドネイティブの**実行基盤**へ進化させる」と説明している。これまでは「Windows上でLinuxの開発はできるが、AIの実行には向かない」という構図があり、MacやLinuxデュアルブートに流れる理由になっていた。WSL3はその前提を崩そうとしている。

とはいえ現時点では、WSLコンテナは新しい機能で、GPU/NPUパススルーもハードウェアが限定される。**「GAした部分」と「プレビューの部分」を分けて理解する**のが大事である。

---

## 関連ノート

- [[what-are-wsl-containers|WSLコンテナとはなにか]]
- [[what-is-a-container|コンテナとはなにか]]
- [[why-containers-are-needed|コンテナはなぜ必要なのか]]
- [[running-ai-agents-in-wsl|WSLでAIエージェント（OpenCode・Codex）を使うときの違い]]
- [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]
- [[who-uses-wsl-and-containers|WSLとコンテナは開発者以外も使うのか]]
- [[herdr-tmux-wezterm-terminal-layers|Herdr・tmux・WezTermのすみ分けと位置づけ]]

---

## 参考資料

- [Microsoft Windows Developer Blog: WSL containers is now generally available](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)（確認日: 2026-10-17）
- [Microsoft DevBlogs: WSLC Architecture deep dive](https://devblogs.microsoft.com/commandline/wslc-architecture-deep-dive/)（確認日: 2026-10-17）
- [GitHub: microsoft/WSL Releases（3.0.1 / 3.0.2 / 3.0.3）](https://github.com/microsoft/wsl/releases)（確認日: 2026-10-17）
- [Phoronix: Windows Subsystem For Linux Can Now Run On Very Large Servers, Experimental Sparse VHD（WSL 3.0.2）](https://www.phoronix.com/news/Microsoft-WSL-3.0.2)（確認日: 2026-10-17）
- [IT-Connect: WSL 3 and WSL Containers: Microsoft's Next Windows Update](https://www.it-connect.tech/microsoft-unveils-wsl-3-and-wsl-containers-for-windows/)（確認日: 2026-10-17）
- [TechTimes: WSL 3 at Build 2026: Near-Native GPU and NPU Passthrough](https://www.techtimes.com/articles/317598/20260602/wsl-3-build-2026-near-native-gpu-npu-passthrough-brings-local-ai-windows.htm)（確認日: 2026-10-17）
