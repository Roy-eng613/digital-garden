---
created: 2026-10-17
updated: 2026-10-17
tags:
  - コンテナ
  - Docker
  - 仮想化
  - VM
  - インフラ
type: concept
confidence: high
status: draft
title: コンテナとはなにか
aliases:
  - コンテナ
  - container
  - コンテナ技術
description: コンテナとは何かを、仮想マシン（VM）との違いを軸に整理する。イメージとコンテナの関係、ホストのカーネルを共有する軽量さ、隔離とポータビリティ、Dockerとの関係まで。
---

## 概要

**コンテナ**とは、**アプリケーション本体と、それを動かすために必要なライブラリ・設定・依存関係をひとまとめにした、隔離されたプロセス**である。アプリを「動かす環境ごと」梱包したパッケージ、と考えると近い。

- **自己完結**している（ホストに事前インストールされた依存に頼らない）
- **隔離**されている（他のコンテナやホストへの影響が小さい）
- **ポータブル**（開発機で動いたものが、データセンターやクラウドでも同じように動く）

Dockerのドキュメントは「コンテナとはアプリの各コンポーネントごとの隔離されたプロセス」と説明している。

---

## 仮想マシン（VM）との違い

ここが一番混乱しやすいポイント。両者はどちらも「隔離された環境」を提供するが、**隔離する対象が違う**。

| | 仮想マシン（VM） | コンテナ |
| :--- | :--- | :--- |
| 隔離するもの | 物理マシン（ハードウェア） | OS（オペレーティングシステム） |
| ゲストOS | それぞれが完全なOSを持つ | 持たない（ホストのカーネルを共有） |
| サイズ | 大きい（GB単位） | 小さい（MB単位） |
| 起動 | 遅い（OSを起動する） | 速い（カーネルは既にある） |
| 仕組み | ハイパーバイザ | コンテナランタイム（Docker等） |
| 隔離の強さ | 強い | 十分だがVMより弱い面もある |

比喩で言えば、**VMは一軒家、コンテナはアパート**である。一軒家は配管・暖房・電気をすべて自前で持つ（＝ゲストOS丸ごと）。アパートは建物（＝ホストのカーネル）の設備を共有し、部屋の広さを必要な分だけ借りる。だから軽く、素早く、たくさん並べられる。

**両者は排他的ではない**。実際にはクラウドで「VMの上でコンテナを動かす」構成が一般的である。

---

## イメージ・コンテナ・ボリューム

- **イメージ (image)**: アプリと依存関係を固めた**読み取り専用のテンプレート**。
- **コンテナ (container)**: イメージから起動した実行中の**インスタンス**。同じイメージから何個でも立ち上げられる。
- **ボリューム (volume)**: コンテナの外に置くデータ。コンテナは使い捨て（イミュータブル）なので、**データはボリュームに置き、コンテナ本体は消して作り直してよい**。だから「コンテナのバックアップ」はせず、ボリュームをバックアップする。

「コンテナはアプリの配送技術であって、仮想化技術ではない」という指摘はこの点を突いている。抽象化の単位が「サーバー（VM）」ではなく「アプリ／サービス（コンテナ）」になっている。

---

## Dockerとの関係

コンテナ自体はLinuxのカーネル機能（名前空間やcgroupsによる隔離）を利用している。それを扱いやすくした**コンテナエンジンの代表がDocker**である。ほかにPodman、containerd、そしてWSL3の `wslc` などがある。

WSL3では、このコンテナ実行基盤がWindowsに内蔵された。詳細は [[what-are-wsl-containers|WSLコンテナとはなにか]]。

---

## なぜ必要なのか

コンテナが「軽い」こと自体よりも、**「環境差をなくす」**ことに価値がある。そこは別ノートで掘り下げる。

→ [[why-containers-are-needed|コンテナはなぜ必要なのか]]

---

## 関連ノート

- [[why-containers-are-needed|コンテナはなぜ必要なのか]]
- [[what-are-wsl-containers|WSLコンテナとはなにか]]
- [[what-is-wsl3|WSL3とはなにか]]
- [[who-uses-wsl-and-containers|WSLとコンテナは開発者以外も使うのか]]

---

## 参考資料

- [Docker Docs: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)（確認日: 2026-10-17）
- [AWS: Containers vs VM - Difference Between Deployment Technologies](https://aws.amazon.com/compare/the-difference-between-containers-and-virtual-machines/)（確認日: 2026-10-17）
- [Google Cloud: Containers vs. virtual machines (VMs)](https://cloud.google.com/discover/containers-vs-vms)（確認日: 2026-10-17）
- [Red Hat: Containers vs. VMs: Why not both?](https://www.redhat.com/en/topics/containers/containers-vs-vms)（確認日: 2026-10-17）
- [IBM: What Are Containers?](https://www.ibm.com/think/topics/containers)（確認日: 2026-10-17）
- [Docker Blog: Containers are not VMs](https://www.docker.com/blog/containers-are-not-vms/)（確認日: 2026-10-17）
