---
created: 2026-10-11
updated: 2026-10-12
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
description: "Quartzのエクスプローラーで起きたPCのリスト切れとスマホの長いノート名のはみ出しを、custom.scssで調整した記録。"
---

## 問題

デジタルガーデンのPC表示において、左上のエクスプローラー（ファイルツリー）で **フォルダを展開すると下のアイテムが見切れてしまう** 問題が発生した。

原因は `quartz/styles/custom.scss` に設定していた `max-height: 400px` の固定値。  
コンテンツが400pxを超えると、最下部のテキストの下半分が切れて表示されてしまっていた。

---

## PCのスクロール調整

当初はエクスプローラーの高さに固定上限を設けていたが、項目数が増えるとリスト末尾が見切れる原因になった。固定の高さで解決するのではなく、PCではエクスプローラー内の高さ制限と独立スクロールを解除し、ページ全体のスクロールに揃えている。設定の経緯は [[quartz-layout-scroll-and-footer|Quartzのスクロールとフッターを整えた]] を参照。

## スマホで長いノート名がはみ出す

スマホではExplorerプラグインが画面全体を使うナビゲーションを表示する。フォルダの階層が深いと左インデントが加算され、長いノート名を表示する幅が足りず、右端からはみ出すことがあった。また、項目の改行と区切りが分かりにくかった。

モバイル用のCSSを `quartz/styles/custom.scss` に追加し、階層インデントを抑え、リンクの幅を少し狭めて折り返すようにする。

```scss
@media all and ($mobile) {
  .explorer-content .folder-outer > ul {
    margin-left: 3px;
    padding-left: 0.4rem;
  }

  .explorer-content ul li > a {
    display: block;
    width: calc(100% - 2rem);
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid color-mix(in srgb, var(--lightgray) 55%, transparent);
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
```

`width: calc(100% - 2rem)` がリンクの折り返し位置を調整する値。差し引く幅を大きくすると早めに改行し、小さくすると一行に表示できる文字数が増える。フォルダ名にも折り返しを指定している。下線はノート項目を区別するための控えめな境界線で、これらは `$mobile` の範囲内だけに適用する。

---

## カスタムCSSの場所

Quartzでのカスタムスタイルは `quartz/styles/custom.scss` に書く。  
このファイルはQuartzのビルド時に自動的に読み込まれる。

> [!tip]
> `custom.scss` は Quartz 本体のアップデート時に上書きされないため、カスタマイズをここに集約しておくと安全。

---

## 関連ノート

- [[quartz-layout-scroll-and-footer|Quartzのスクロールとフッターを整えた]]
- [[Quartzとはなにか]]
- [[MOC-Quartz]]
