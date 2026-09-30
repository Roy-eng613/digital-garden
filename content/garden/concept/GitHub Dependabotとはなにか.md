---
created: 2026-09-30
updated: 2026-09-30
tags:
  - digital-garden
  - GitHub
  - Dependabot
source:
  - https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates
related:
  - "[[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]"
  - "[[GitHubのmainブランチを保護するとはなにか]]"
type: concept
status: draft
title: GitHub Dependabotとはなにか
aliases:
  - Dependabotとはなにか
---

# GitHub Dependabotとはなにか

Dependabotは、GitHubリポジトリが利用している外部パッケージやGitHub Actionsの更新を確認し、更新用のPull Requestを自動で作成するGitHubの機能だ。

今回のデジタルガーデンでは、次のようなPull Requestが作成された。

- CIで使うGitHub Actionsの更新
- Quartzのビルドや実行に使う本番用JavaScript依存パッケージの更新
- TypeScriptのバージョン更新

## DependabotのPull Requestは何を意味するか

DependabotがPull Requestを作成しただけでは、サイトの内容や公開環境は変わらない。Pull Requestを確認してマージし、GitHub Actionsのデプロイが成功した時点で、更新内容が公開環境へ反映される。

更新には、バグ修正や脆弱性対応だけでなく、新機能や互換性の変更も含まれる。そのため、表示された更新をすべて自動的にマージするのではなく、変更内容とビルド結果を確認する必要がある。

## バージョン更新の見方

`5.9.3`から`5.9.4`のように末尾の数字が変わる更新は、一般に小さな修正であることが多い。一方、`5.9.3`から`7.0.2`のように先頭の数字が変わるメジャーアップデートは、設定やAPIの互換性が壊れる可能性がある。

今回のTypeScript 7への更新は、他の依存パッケージ更新より慎重に確認する対象だ。Quartzのビルド、型チェック、GitHub Actionsのデプロイが成功するかを確認してからマージする。

## 今回の運用方針

1. Pull Requestの変更一覧とリリースノートを確認する
2. GitHub Actionsのチェックが成功していることを確認する
3. まず小さな更新を個別にマージする
4. メジャーアップデートは、問題が起きたときに戻せる状態で試す

依存パッケージの更新は、公開サイトを維持するための定期的なメンテナンスとして扱う。更新を放置するのも危険だが、内容を確認せず一括で取り込むのも危険である。

## 関連キーワード

- [[GitHubのmainブランチを保護するとはなにか]]
- GitHub Actions
- 依存パッケージ

## 関連ページ

- [[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]

## 参考資料

- [About Dependabot version updates](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates)
