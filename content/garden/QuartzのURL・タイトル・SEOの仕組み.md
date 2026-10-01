---
created: 2026-10-01
updated: 2026-10-01
tags:
  - digital-garden
  - Quartz
  - SEO
type: concept
status: seedling
title: QuartzのURL・タイトル・SEOの仕組み
aliases:
  - Quartz SEO
  - Quartz URLタイトル
description: "Quartzでは **ファイル名（slug）がそのままURL** になる。"
---

## URLはファイル名から生成される

Quartzでは **ファイル名（slug）がそのままURL** になる。

```text
content/garden/Quartzとはなにか.md
→ https://ogiri-siyou.com/garden/Quartzとはなにか

content/literature/文学賞.md
→ https://ogiri-siyou.com/literature/文学賞
```

- ディレクトリ構造もURLに反映される
- ファイル名を変えるとURLも変わる（旧URLはリダイレクトされない）
- `aliases` frontmatterを付けると別名URLからリダイレクト可能

## title と description の生成ロジック

Quartz の `quartz/components/Head.tsx` で次の優先順位で決定される。

### title

```text
frontmatter.title → 設定のデフォルト（pageTitle）
```

- `<title>` タグ
- `og:title`（Facebook/LinkedIn等）
- `twitter:title`（X）

### description

```text
frontmatter.socialDescription → frontmatter.description → 本文の最初のテキスト（自動抽出）
```

- `<meta name="description">`（Google検索結果のスニペット）
- `og:description`
- `twitter:description`

## 本文の `# タイトル` はタイトルと別

Quartzでは `article-title` プラグインがデフォルトで有効だが、このプロジェクトでは **`enabled: false`** になっている。

つまり本文の `# 見出し` は **単なる見出し（h1）として表示されるだけ** で、`<title>` タグやOGPには影響しない。

```markdown
# これは本文の見出し（h1）
```

→ ブラウザタブのタイトルは frontmatter の `title` が使われる

## SEO 観点での推奨設定

### frontmatter に title と description を入れる

```yaml
---
title: ページのタイトル
description: 検索結果に表示される120文字程度の要約
---
```

**メリット:**
- Google検索結果のタイトル・スニペットが意図した通りになる
- SNSシェア時のOGPカード表示が制御できる
- 本文の最初の文がdescriptionとして自動抽出されるのを防げる

**デメリット:**
- 管理するfrontmatterが増える
- titleをファイル名と別名にすると、URLとタイトルがズレる

### ファイル名と title の関係

| パターン | 例 | 特徴 |
|---------|-----|------|
| 一致 | ファイル名 `Quartzとはなにか.md` / title `Quartzとはなにか` | シンプル、URLとタイトルが一致 |
| 別名 | ファイル名 `Quartzとはなにか.md` / title `Quartzとはなにか` | タイトルを自由に設定可能 |

このプロジェクトでは **ファイル名と title を一致させる** のがシンプルでおすすめ。

## このプロジェクトの現状

- `article-title` プラグイン: **無効**（本文の `#` はタイトルにならない）
- `description` プラグイン: **有効**（frontmatterのdescriptionをmetaタグに出力）
- `og-image` プラグイン: **有効**（デフォルト画像 `static/og-image.png` を全ページで使用）
- 各ノートのfrontmatterに `title` は設定されているものと、されていないものが混在

## 関連

- [[Quartz MOC]]
- [[Quartzのビルドとデプロイの仕組み]]
- [[QuartzとGitHub Pagesを使ってデジタルガーデンを公開した]]