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
title: Quartzのスクロールとフッターを整えた
aliases:
  - Quartzのサイドバーをページスクロールにした
description: "Quartzの左右サイドバーとエクスプローラーに分かれていたスクロールをページ全体に揃え、フッターにコンテンツの著作権表示を加えた方法。"
---

## 背景

デスクトップ表示で記事本文、左右のサイドバー、エクスプローラーがそれぞれ別々にスクロールする状態になっていた。スクロール位置が複数あると、ポインターを置いた場所によって動く領域が変わり、長い記事やファイルツリーを読むときに操作が分かりにくい。

そこで、長い記事を読むときはページ全体をスクロールする構成を参考にし、デスクトップでは本文とサイドバーを通常のページフローに揃えた。サイドバーを常に画面内へ固定する利点より、スクロールの一貫性を優先した。

## サイドバーをページスクロールに揃える

Quartzの共通スタイルではサイドバーに画面高とsticky配置が指定されている。`quartz/styles/base.scss` で高さを内容に合わせ、通常の配置に変更する。

```scss
& .sidebar {
  height: auto;
  position: static;
}
```

これにより、本文や左右のサイドバーが同じページスクロールで移動する。モバイル用のレイアウト指定は既存のメディアクエリに任せ、画面幅ごとの表示を維持する。

## エクスプローラー内の二重スクロールをなくす

Explorerプラグインは、項目が多いとエクスプローラー自身にも高さ制限と縦スクロールを設ける。デスクトップでは高さ制限を解除し、親サイドバーの内容としてページと一緒にスクロールさせる。Quartz本体やプラグインのファイルは直接編集せず、`quartz/styles/custom.scss` で上書きする。

```scss
@media all and not ($mobile) {
  .explorer {
    overflow: visible;
  }
}

.explorer-content {
  max-height: none;
  min-height: 0;
  overflow-y: visible;
}
```

Explorerのモバイル表示は画面全体に広がるメニューとして動作するため、この上書きはデスクトップに限定する。モバイルではプラグイン既定のオーバーフロー設定を維持する。

## フッターに著作権表示を加える

Quartzのフッタープラグインは、Quartzのバージョンと年、設定したリンクを表示する。コンテンツの権利がソフトウェアのライセンスと混同されないよう、サイト運営者名とコンテンツのライセンス説明へのリンクを追加した。

```yaml
- source: "@quartz-community/footer"
  enabled: true
  options:
    links:
      GitHub: https://example.com/project
      "© 2026 サイト運営者名": https://example.com/project/blob/main/README.md#ライセンス
  layout:
    position: footer
    priority: 50
```

`links` はラベルとURLの組み合わせなので、著作権表示をライセンス説明のリンクとして配置できる。実際に公開する際は、例のURLとサイト運営者名を自分の公開情報に置き換える。

## 確認

- Quartzのビルドが成功し、生成HTMLのフッターに著作権リンクが出ることを確認する。
- デスクトップでページをスクロールし、左右のサイドバーが独立してスクロールしないことを確認する。
- Explorerの項目が多い状態でも末尾までページスクロールで読めることを確認する。
- モバイル幅ではExplorerメニューを開閉できることを確認する。

## 関連ノート

- [[quartz-explorer-css-customization|エクスプローラーの表示をCSSでカスタマイズした]]
- [[quartz-content-license-setup|QuartzサイトのコンテンツにMITライセンスと別の著作権表示を設定した]]
- [[Quartzとはなにか]]
- [[MOC-Quartz]]
