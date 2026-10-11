---
created: 2026-10-11
updated: 2026-10-11
tags:
  - digital-garden
  - Quartz
  - CSS
  - カスタマイズ
related:
  - "[[Quartzとはなにか]]"
  - "[[MOC-Quartz]]"
type: log
confidence: high
status: evergreen
title: Quartzのエクスプローラー（ファイルツリー）の表示をCSSでカスタマイズした
aliases:
  - Quartzエクスプローラーカスタマイズ
description: "Quartzの左サイドバーに表示されるエクスプローラー（ファイルツリー）の高さ制御と、リスト末尾の文字切れを custom.scss でCSSで修正した記録。"
---

## 問題

デジタルガーデンのPC表示において、左上のエクスプローラー（ファイルツリー）で **フォルダを展開すると下のアイテムが見切れてしまう** 問題が発生した。

原因は `quartz/styles/custom.scss` に設定していた `max-height: 400px` の固定値。  
コンテンツが400pxを超えると、最下部のテキストの下半分が切れて表示されてしまっていた。

---

## 修正方法

[`quartz/styles/custom.scss`](https://github.com/Roy-eng613/digital-garden/blob/main/quartz/styles/custom.scss) を以下のように変更する。

```scss
// custom.scss
.sidebar.left {
  overflow-y: auto;
  scrollbar-width: thin;
}

.explorer {
  flex: 1 1 auto;
  min-height: 220px;
}

.explorer-content {
  max-height: 380px;
  min-height: 180px;
  overflow-y: auto;
  padding-bottom: 1.5rem;
  box-sizing: border-box;
}

.recent-notes > ul.recent-ul > li {
  margin: 0.75rem 0;
}
```

### ポイント

- **親要素 `.explorer` の高さ確保**: 左サイドバーに「最近の更新」が同居している場合、親の `.explorer` が縮んで潰れてしまうのを `min-height: 220px` と `flex: 1 1 auto` で防ぐ。
- **`.sidebar.left` のスクロール**: 画面高さが小さい場合でも押しつぶされずスクロール可能にする。
- **最下部の余白 (`padding-bottom: 1.5rem`)**: スクロール最下部で一番下のテキストが境界線で見切れないようにする。

---

## カスタムCSSの場所

Quartzでのカスタムスタイルは `quartz/styles/custom.scss` に書く。  
このファイルはQuartzのビルド時に自動的に読み込まれる。

> [!tip]
> `custom.scss` は Quartz 本体のアップデート時に上書きされないため、カスタマイズをここに集約しておくと安全。

---

## 関連ノート

- [[Quartzとはなにか]]
- [[MOC-Quartz]]

