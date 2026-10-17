---
created: 2026-10-17
updated: 2026-10-17
tags:
  - WSL
  - WSL3
  - コンテナ
  - Windows
  - Microsoft
type: concept
confidence: medium
status: draft
title: WSLコンテナとはなにか
aliases:
  - WSLコンテナ
  - wslc
  - WSLC
  - WSL containers
description: WSL 3.0で一般提供された「WSLコンテナ」の仕組みを整理する。wslc.exe/container.exe、wslcsessionによるセッション分離、virtiofsとconsomme、SDK/API、GPUアクセス、Intune/MDE連携など。
---

## 概要

**WSLコンテナ（WSLC）** は、WSL 3.0で一般提供（GA）された、**Windows上でLinuxコンテナを直接ビルド・実行・管理する機能**である。Docker DesktopやPodman Desktopのようなサードパーティ製ツールを別途インストールしなくても、WSL自体がコンテナの実行基盤になる。

コンテナという概念そのものは [[what-is-a-container|コンテナとはなにか]]、必要性は [[why-containers-are-needed|コンテナはなぜ必要なのか]] を参照。

---

## 2つの入口：CLI と API

WSLコンテナには大きく2つの使い方がある。

1. **WSL containers CLI**: `wslc.exe`。エイリアスの `container.exe` でも同じコマンドが使える。`docker`に近い感覚でコンテナのライフサイクルを扱える。
2. **WSL containers API**: ネイティブのWindowsアプリから、アプリのロジックの一部としてLinuxコンテナをプログラム的に起動できる。C / C++ / C#（WinRT）に対応し、NuGetパッケージとして提供。MSBuildやCMakeと統合でき、ビルド工程にコンテナのビルド・デプロイを組み込める。「ローカルAIワークロードを動かす」「クラウドのコンテナ化されたアプリをローカルで試す」といった用途が想定されている。

```powershell
# GA版で使えるようになった主なコマンド例
wslc container restart      # 実行中コンテナの再起動
wslc container cp           # tar経由でファイルを出し入れ
wslc system info            # 環境の状態を一覧
wslc network connect / disconnect
wslc events                 # コンテナ活動のリアルタイムストリーム
```

---

## アーキテクチャのポイント

### セッションモデル（分離と権限）

WSLと同様、クライアントは特権Windowsサービス `wslservice.exe` を呼び出す。ここが重要な違いで、`wslservice.exe` は**仮想マシンの所有権を保持しない**。代わりに子プロセス **`wslcsession.exe`** を生成し、そちらが**呼び出したユーザーの権限で**セッション操作（コンテナ作成、ディレクトリのマウント、ポートのバインドなど）を行う。

これにより、**セッション間の強い分離**（別プロセス）と、**権限の境界強化**（特権サービスより低い権限でセッション操作を実行）を両立している。つまり「コンテナ=軽い」だけでなく、WSL本体よりむしろセキュリティ境界を意識した設計になっている。

### ストレージ

- **セッションVHD**: セッションごとに専用のVHDを持ち、利用可能なイメージ・コンテナ・ネットワーク・ボリュームなどの状態を保存。既定の保存先は `%AppData%\Local\wslc\sessions`。
- **コンテナボリューム**: コンテナの削除で消えるスクラッチ領域の外にデータを置く仕組み。Windowsのパスをボリュームとして共有できる。内部ではLinux VM内にvirtiofs共有としてマウントされ、コンテナへbindマウントされる。
- **VHDボリューム**: ネイティブのLinuxファイルシステムが必要な場合やサイズ上限を設けたい場合に、VHDで裏打ちされたボリュームを作れる。

### ネットワーク：consomme

Linux VMの通信はイーサネットフレームとしてvirtioキューに送られ、ユーザー権限で動くWindowsプロセスが受け取ってDNS応答・UDP/TCPルーティング・ポートマッピングを提供する。**通信が「そのユーザーのWindowsプロセス」として出ていく**ため、VPNやファイアウォールとの互換性が高い。

### ファイルシステム：virtiofs

Windowsパスへのアクセスはvirtiofs経由。従来のplan9に比べ約2倍高速。WSL3全体の改善でもある。

---

## GPUアクセス

WSLコンテナでは、**非特権ユーザーでもコンテナ内からGPUへアクセスできる**。これにより、AIモデルの推論やグラフィックスツールをコンテナ内でアクセラレートできる。AIワークロードをクリーンな隔離環境で動かしたい場合に効いてくる。詳細は [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]。

---

## 企業向けの管理・監視

- **Microsoft Defender for Endpoint (MDE)**: 既存のWSL向けプラグインがコンテナにも対応。コンテナ内のプロセス・ファイル・ネットワーク活動をWindowsホストと紐づけて可視化し、別のセキュリティワークフローを作らずに調査できる。
- **Microsoft Intune**: 「WSLコンテナ機能の許可/禁止」「プル可能なレジストリの許可リスト」を制御。組織が承認したレジストリのイメージだけを使わせる、といったガバナンスが可能。

---

## エコシステムと現状の制約

GA時点で周辺ツールの対応が進んでいる。

- **VS Code dev containers**: `wslc` を既定ドライバとして使える
- **VS Code containers拡張**: `wslc` 対応
- **Aspire**: WSL Containersをコンテナランタイムとして利用可能
- **Lazywslc**: TUIダッシュボード
- **WSL Container Desktop**: WinUI 3製のデスクトップアプリ（k3sやレジストリ管理も）
- **wslc-remote**: WSLディストロ内から`wslc`を叩くラッパー

**制約**: `wslc compose`（Compose対応）は**まだ未対応**で、次期の重点項目とされている。既存の`compose.yaml`をそのまま使えるようにするのが目標。

---

## まとめ

- WSLコンテナは「Windowsに内蔵されたLinuxコンテナ実行基盤」。`wslc.exe` と API の2つの入口がある。
- セッション分離と低権限実行で、軽さとセキュリティ境界を両立。
- virtiofs・consomme・GPUアクセスといった低レイヤの改善を、まずコンテナ向けに投入している。
- 企業管理（Intune/MDE）まで最初から想定しているのがWSLの独自色。

---

## 関連ノート

- [[what-is-wsl3|WSL3とはなにか]]
- [[what-is-a-container|コンテナとはなにか]]
- [[why-containers-are-needed|コンテナはなぜ必要なのか]]
- [[who-uses-wsl-and-containers|WSLとコンテナは開発者以外も使うのか]]
- [[local-llm-gpu-in-wsl|WSLでローカルLLMにGPUを使うメリット・デメリット]]

---

## 参考資料

- [Microsoft Windows Developer Blog: WSL containers is now generally available](https://blogs.windows.com/windowsdeveloper/2026/09/29/wsl-containers-now-generally-available/)（確認日: 2026-10-17）
- [Microsoft DevBlogs: WSLC Architecture deep dive](https://devblogs.microsoft.com/commandline/wslc-architecture-deep-dive/)（確認日: 2026-10-17）
- [Microsoft DevBlogs: WSL container is now available for public preview（Build 2026）](https://devblogs.microsoft.com/commandline/wsl-container-is-now-available-for-public-preview/)（確認日: 2026-10-17）
- [GitHub: microsoft/WSL Releases](https://github.com/microsoft/wsl/releases)（確認日: 2026-10-17）
