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
contentディレクトリにあるファイル内の文章については、著作権は筆者である私といたします。
Quartz本体のライセンスは`LICENSE.txt`を参照してください。サイト内の文章・画像の利用条件は、各ページまたは今後追加する利用案内に記載します。
