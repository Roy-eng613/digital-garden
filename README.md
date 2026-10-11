# デジタルガーデン

Obsidianで考えていることを整理し、公開できるページをQuartzで育てていく個人のデジタルガーデンです。

## 構成

- `content/`: 公開するMarkdown
- `quartz.config.yaml`: サイト設定
- `.github/workflows/deploy.yml`: GitHub Pagesへの自動デプロイ

## ローカルで確認する

```bash
npm ci
npx quartz plugin install
npx quartz build --serve
```

`http://localhost:8080`でサイトを確認できます。

## 公開

`main`ブランチへpushすると、GitHub ActionsがQuartzをビルドし、GitHub Pagesへデプロイします。

GitHubリポジトリのSettings → Pagesで、公開元を「GitHub Actions」に設定してください。

## 公開方針

このリポジトリには、非公開Vault全体をコピーしません。公開してよいページだけを`content/`へ追加します。

文学賞などの更新される情報は、主催者公式サイトを確認し、出典と確認日を記録します。

## ライセンス

- **記事・コンテンツ** (`content/` 以下): Copyright (c) 2026 Roy-eng613. All rights reserved. 無断転載・複製を禁じます。
- **Quartzソースコード**: MIT License (c) jackyzha0

詳細は [`LICENSE.txt`](./LICENSE.txt) を参照してください。
