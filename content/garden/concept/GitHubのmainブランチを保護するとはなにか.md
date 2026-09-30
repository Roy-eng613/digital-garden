---
created: 2026-09-30
updated: 2026-09-30
tags:
  - digital-garden
  - GitHub
  - GitHub-Pages
source:
  - https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
related:
  - "[[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]"
  - "[[GitHub Dependabotとはなにか]]"
type: concept
status: draft
title: GitHubのmainブランチを保護するとはなにか
aliases:
  - GitHubのブランチ保護
---

# GitHubのmainブランチを保護するとはなにか

GitHubのブランチ保護は、重要なブランチへ変更を取り込む方法にルールを設定する機能だ。

今回GitHubから表示された「Your main branch isn't protected」は、公開リポジトリの`main`ブランチに、まだ保護ルールが設定されていないという通知だった。サイトが壊れているという意味ではない。

## 保護すると何が変わるか

`main`ブランチに次のような制限をかけられる。

- ブランチの削除を禁止する
- 強制pushを禁止する
- Pull Requestを経由しない直接変更を禁止する
- GitHub Actionsなどのチェックが成功してからマージする
- 必要に応じてレビューを必須にする

これにより、誤操作や未検証の変更で公開サイトを壊す可能性を下げられる。

## デジタルガーデンでの設定方針

このリポジトリでは、まず次の設定から始めるのがよさそうだ。

- 対象ブランチは`main`
- `main`の削除を禁止する
- 強制pushを禁止する
- Pull Request経由での変更を基本にする
- GitHub Actionsのビルドとデプロイが成功したことを確認する

レビュー必須や複数人の承認は、個人で運用する場合には手間が増える。まずはブランチの削除・強制pushを防ぎ、変更を確認してからマージする運用から始める。

## Dependabotとの関係

Dependabotが作成した更新もPull Requestとして確認できる。`main`を保護しておけば、依存パッケージの更新がいきなり本番ブランチへ入ることを防げる。

ただし、保護ルールを厳しくしすぎると、自分一人のリポジトリでは更新作業が止まりやすい。必要なチェックだけを必須にし、運用しながら調整するのがよい。

## 関連キーワード

- [[GitHub Dependabotとはなにか]]
- Pull Request
- GitHub Actions

## 関連ページ

- [[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]

## 参考資料

- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
