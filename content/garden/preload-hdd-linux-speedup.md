---
title: "preload: HDD環境Linuxのアプリ起動高速化デーモン"
description: "preloadの仕組み・systemd統合・学習ベースのプリフェッチ動作・効果発現までの期間を技術メモとして記録。vm.swappiness / vmtouch との併用戦略も整理"
tags:
  - Linux
  - preload
  - 高速化
  - HDD
  - systemd
  - デーモン
type: article
confidence: observed
status: evergreen
created: 2026-08-30
updated: 2026-10-03
aliases:
  - preload 技術メモ
  - Linux preload 仕組み
related: []
source: "[[91_Processed/preloadによってHDDのLinuxも早くなるか、preloadとは]]"
---

# preload: HDD環境Linuxのアプリ起動高速化デーモン

## 概要

`preload` は、ユーザーのアプリケーション起動パターンを学習し、予測されるアプリケーションのバイナリ・ライブラリを事前にページキャッシュへ読み込む常駐デーモン。HDD環境における「初回起動時のシーク・読み込み待ち」を軽減する目的で導入した。

- **パッケージ**: `preload` (Debian/Ubuntu/Mint標準リポジトリ)
- **動作モード**: systemd サービスとして常駐 (`preload.service`)
- **設定ファイル**: `/etc/preload.conf`
- **状態ファイル**: `/var/lib/preload/preload.state` (学習済みモデル)

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                        preload daemon                         │
├─────────────────────────────────────────────────────────────┤
│  1. 監視: execve() 等のプロセス生成を ftrace / netlink で観測 │
│  2. 学習: 起動頻度・時刻・共起パターンをマルコフ連鎖でモデル化 │
│  3. 予測: 「次に起動されそうなプロセス」のスコアリング       │
│  4. プリフェッチ: readahead() / madvise(WILLNEED) でページキャッシュへ読み込み │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Page Cache (RAM)                         │
│  予測対象の .so / 実行バイナリ / 設定ファイルが常駐            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Launch                       │
│  初回起動でも HDD I/O なしでメモリから即時マッピング完了      │
└─────────────────────────────────────────────────────────────┘
```

## インストールと有効化

```bash
# Debian/Ubuntu/Linux Mint
sudo apt update && sudo apt install preload

# 自動で systemd サービス登録・有効化される
systemctl status preload
# → active (running) であれば正常動作中
```

**注意**: インストール直後は学習データが空のため効果なし。数日〜1週間の通常利用でモデルが収束するまで待つ。

## 設定の要点 (`/etc/preload.conf`)

| パラメータ | デフォルト | 説明 |
|---|---|---|
| `cycle` | 20 | 監視・予測サイクル間隔 (秒) |
| `memfree` | 100 | 空きメモリ閾値 (MB)。これ未満ではプリフェッチ停止 |
| `memcached` | 0 | キャッシュ上限 (MB)。0 = 無制限 |
| `processes` | 30 | 同時監視プロセス数上限 |
| `sort` | 1 | 予測スコア降順でプリフェッチ順序決定 |

HDD + 16GB RAM 環境ではデフォルトで概ね問題ない。`memfree` を増やすと積極度が上がるが、メモリ圧迫時の OOM リスクとトレードオフ。

## 効果検証方法

```bash
# 1. 学習状態の確認
cat /var/lib/preload/preload.state | head -20
# → 学習済みプロセスとスコアが列挙される

# 2. 起動時間計測 (初回 vs 2回目)
time wezterm --version  # 初回
time wezterm --version  # 2回目 (ページキャッシュヒット)

# 3. ページキャッシュ確認
cat /proc/$(pidof wezterm)/maps | grep -E '\.so|\.bin' | wc -l
```

## 併用戦略: vm.swappiness / vmtouch

| 施策 | レイヤー | 狙い | 適用順序 |
|---|---|---|---|
| `preload` | デーモン/予測 | **初回起動**の HDD I/O を予測プリフェッチで隠蔽 | 1st |
| `vm.swappiness=10` | カーネル/VM | 匿名ページの早期スワップアウト抑制 → ファイルキャッシュ優先 | 2nd |
| `vmtouch -tl` | 明示的ロック | **特定バイナリ**をメモリ常駐化 (preload の予測外を補完) | 3rd |

```bash
# vm.swappiness 恒久化
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system

# vmtouch で明示固定 (起動時自動化推奨)
sudo apt install vmtouch
sudo vmtouch -tl /usr/bin/wezterm /opt/wezterm/
# → systemd ユーザーサービスや ~/.profile で自動実行化
```

## 既知の制約・トレードオフ

- **学習期間必須**: 即効性なし。導入後数日は体感変化なし
- **予測ミスヒット**: 稀に使わないアプリをプリフェッチし、キャッシュ汚染の可能性
- **メモリ圧迫時**: `memfree` 閾値到達で自動停止するが、OOM Killer 回避のため閾値は控えめに
- **SSD環境**: 効果薄 (シークコストが低いため)。SSDでは不要
- **Flatpak/AppImage**: ランタイム分離によりバイナリパスが動的。`/var/lib/flatpak/...` 等を明示指定必要

## 運用メモ (2026-08-30 導入)

- 環境: Linux Mint 22 (Cinnamon) / HDD (OS) / RAM 16GB
- 対象: Wezterm, ChatGPT Desktop (Electron), Firefox 等
- 導入後 3 日目で Wezterm 初回起動が体感 ~40% 短縮確認
- `vm.swappiness=10` 併用でスワップ発生頻度低下 (`swapon --show` で確認)
- vmtouch は ChatGPT AppImage (`~/Applications/ChatGPT-*.AppImage`) に適用予定

---

## 関連記事

- [[10_Notes/garden/linux-mint-speedup|linux-mint-speedup]] — 親記事：HDD環境Linux Mintの体感高速化全体ログ（未公開・準備中）
- `vm-swappiness` / `vmtouch` — 併用施策（未作成・予定）