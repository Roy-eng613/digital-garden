---
created: 2026-10-24
updated: 2026-10-24
tags:
  - Gitea
  - Redmine
  - セルフホスト
  - Git
  - タスク管理
  - WSL
  - Obsidian
type: article
confidence: medium
status: draft
title: 個人環境にGiteaとRedmineは必要か
aliases:
  - GiteaとRedmineの個人利用
  - セルフホストGitとタスク管理
  - gitea-and-redmine-for-personal-use
description: WindowsのObsidianとWSL側のクローン、ローカルのbareリポジトリで運用している個人環境を例に、GiteaとRedmineを導入するメリットと過剰さを整理する。
---

## 結論

- **Gitのリモートが欲しいだけなら、Giteaは個人PCにも十分導入する価値がある。** 軽く、WSLでもWindowsでもDockerでも動く。
- **Redmineは個人のタスク管理には過剰。** 複数プロジェクトの工数管理・ガントチャート・カスタムワークフローが本当に必要になったときでよい。
- リポジトリ管理はGitea、タスクはGitea IssuesかObsidian側で足りることが多い。

## 前提：いまの運用

WindowsのObsidianでVaultを開き、WSL側に別のクローンを持ち、ローカルのbareリポジトリをremoteにしている、という構成を例にする。

この構成はシンプルで速いが、remoteが同じPCのディスクなので、次の点が弱い。

- Webで差分・履歴・blameを見られない
- IssueやPRとコミットを紐づけられない
- 別端末やLANから見られない
- バックアップを別途考えないといけない

Giteaは、この「remoteまわりの不足」を埋める。

## Giteaとは

GiteaはGo製のセルフホストGitサービス。単一バイナリで動き、Gitホスティングに加えてIssues、Pull Requests、Wiki、Packages、Actionsを持つ。ライセンスはMIT。

- データベースはSQLite / MySQL / PostgreSQL / MSSQLに対応。個人規模ならSQLiteで十分。
- Linux / macOS / Windowsで動作。WSLはLinuxとして扱える。
- 公式ドキュメントの目安では2 CPU / 1GB RAMで足りる。個人のVaultならさらに軽い。
- 2026年10月時点の安定版は28.2.0。

Giteaから分岐したコミュニティ主導のフォークに**Forgejo**もある。個人用途ではどちらでも困らないが、運営体制を気にするなら比較対象になる。

## 個人PCへの入れ方

選択肢は3つ。

1. **WSLにバイナリを置く** — 公式のLinux手順がそのまま使える。WSL2でsystemdを有効にすればサービス化できる。
2. **WSL内のDocker / Podman** — 環境を汚さず、アップデートもイメージ差し替えで済む。
3. **Windowsバイナリ** — Windowsサービスとして常駐させる。WSLの起動状態に左右されない。

WindowsのObsidianからは、WSL2のlocalhostフォワーディングで `http://localhost:3000` にアクセスできるのが普通だ。GitのremoteはHTTP、またはGitea内蔵SSHサーバーの2222番ポートを使う。

ただし、WSLに置く場合は**WSLが止まればGiteaも止まる**。常時使いたいならWindowsサービスか、Dockerの再起動ポリシーを設定しておく。

## 導入すると何が嬉しいか

- ブラウザで差分・履歴・blame・ファイルツリーを見られる
- IssueやPRをVaultのノートやタスクと紐づけられる
- 別端末・LAN・Tailscale経由で同じリポジトリにアクセスできる
- ミラー機能でGitHubなど外部へバックアップできる
- ActionsでQuartzのビルドやMarkdown lintを回せる
- Git LFSで画像やPDFを扱える

特に「Obsidianで書き、WSLのCLIエージェントで編集し、Windowsからも同じ履歴を見たい」という使い方とは相性がよい。

## 導入時の注意点

- **専用ユーザーで動かす。** GiteaはSSH鍵管理のために `~/.ssh/authorized_keys` を書き換える。日常ユーザーで動かすとSSHログインを壊す可能性がある。
- **127.0.0.1にbindする。** インターネットへ直接晒さない。LAN公開はTailscaleやVPN経由にする。
- 公開登録を無効化し、管理者パスワードと2FAを設定する。
- バックアップは `gitea dump` だけでなく、リポジトリ本体とDBも含めて別ディスクへ取る。同じPC内のGiteaはバックアップではない。
- WindowsとWSLで改行コードが混ざる。`.gitattributes` で正規化しておく。
- Giteaを止めるとremoteが使えなくなる。ローカルのbareリポジトリを残すか、外部ミラーを持つ。

## Redmineとは

RedmineはRuby on Rails製のプロジェクト管理ツール。Issues、ガントチャート、工数管理、Wiki、フォーラム、カスタムフィールド、プラグインを持つ。ライセンスはGPLv2。

2026年9月時点の最新は7.0.2。動作にはRuby 3.2〜4.0とRails 8.1、PostgreSQL 14またはMySQL 8.0〜8.4が必要で、SQLiteは多人数の本番利用には推奨されていない。

重要なのは、**RedmineはGitホスティングではない**こと。SCMバイナリ経由で既存リポジトリを閲覧する機能はあるが、pushを受け付けるGitサーバーではない。Gitのリモートが欲しいならGiteaの役割になる。

## Redmineが個人用途では過剰な理由

- Ruby、DB、アセット、プロセス管理を維持するコストが高い
- 情報密度重視のUIで、個人の軽いタスクには重い
- Obsidianのタスク管理やGitea Issuesと役割が重なる
- Git連携は別途bareリポジトリの設定が必要で、Giteaほど自然ではない

実際、GiteaのIssuesにもラベル、マイルストーン、複数担当者、時間記録がある。個人用途ならRedmineの主要機能の多くはGitea側で足りる。

## Redmineが向くケース

- 複数プロジェクトを横断して工数を管理したい
- ガントチャート、カスタムフィールド、ワークフロー、Wiki、フォーラムが必要
- 客先やチームで、権限を分けて使う
- すでにRedmineの資産や運用ノウハウがある

これらが当てはまらないなら、個人環境でRedmineを選ぶ理由は薄い。

## 代替

- **Gitea Issues** — リポジトリとタスクを同じ場所で管理できる（Projectsは機能が限定的）
- **Vikunja** — Go製で軽い、個人向けタスク管理
- **Obsidian Tasks + Bases** — Vault内で完結する
- **Planka** — 個人・小規模向けのKanban

## 判断表

| 目的 | 向くもの |
| --- | --- |
| VaultのGit remote・差分閲覧・Issue | Gitea |
| 個人の軽いタスク管理 | Obsidian Tasks / Gitea Issues |
| 複数PJの工数・ガント・カスタムワークフロー | Redmine |
| チームのGitホスティングとレビュー | Gitea / Forgejo / GitHub |
| 外部へのバックアップ | Giteaのミラー + 別ディスク |

## まとめ

個人環境では「**Giteaはあり、Redmineは条件付き**」。

まずGiteaをlocalhostで動かし、Webでの差分閲覧とIssue管理を試す。タスク管理が足りなくなったら、いきなりRedmineではなくGitea ProjectsやVikunjaを検討する。Redmineは、工数・ガント・カスタムワークフローが本当に必要になったときの選択肢として残しておけばよい。

## 出典

- Gitea Documentation「Installation from binary」 https://docs.gitea.com/installation/install-from-binary （確認日: 2026-10-24）
- Gitea Documentation「Compared to other Git hosting」 https://docs.gitea.com/installation/comparison （確認日: 2026-10-24）
- Redmine「RedmineInstall」 https://www.redmine.org/projects/redmine/wiki/RedmineInstall （確認日: 2026-10-24）

## 関連

- [[MOC-GitHub]]
- [[MOC-WSL3-AI-Development]]
- [[running-ai-agents-in-wsl]]
- [[what-is-wsl3]]
