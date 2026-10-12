---
created: 2026-10-11
updated: 2026-10-11
tags:
  - digital-garden
  - Quartz
  - ライセンス
  - 著作権
related:
  - "[[Quartzとはなにか]]"
  - "[[MOC-Quartz]]"
type: log
confidence: high
status: evergreen
title: QuartzサイトのコンテンツにMITライセンスと別の著作権表示を設定した
aliases:
  - Quartzライセンス設定
  - デジタルガーデン著作権
description: "Quartzのプログラム本体はMITライセンスのまま、content/以下の記事については自身の著作権（All Rights Reserved）を明示する方法。LICENSE.txtとREADME.mdへの記載方法。"
---

## 課題

Quartzはオープンソース（MITライセンス）のソフトウェアだが、`content/` 以下に書いた記事は自分のオリジナルコンテンツであり、MITライセンスで自由利用を許可したいわけではない。

プログラム本体と記事コンテンツのライセンスを**分けて明示する**必要がある。

---

## 対応方法

### ① `LICENSE.txt` を2部構成にする

ルートの `LICENSE.txt` の冒頭にコンテンツの著作権セクションを追記し、その後に既存のMITライセンス条文を続ける形にする。

```text
======================================================================
Content & Articles (content/ directory and related assets)
======================================================================
Copyright (c) 2026 Roy-eng613
All rights reserved.

The articles, notes, and other written content in the content/ directory
are the intellectual property of Roy-eng613.
Unauthorized reproduction or redistribution is prohibited.

======================================================================
Software (Quartz source code)
======================================================================
MIT License

Copyright (c) 2021 jackyzha0
...（MIT条文）
```

### ② `README.md` にライセンス欄を明記する

```markdown
## ライセンス

- **記事・コンテンツ** (`content/` 以下): Copyright (c) 2026 Roy-eng613. All rights reserved. 無断転載・複製を禁じます。
- **Quartzソースコード**: MIT License (c) jackyzha0

詳細は `LICENSE.txt` を参照してください。
```

---

## 考え方のメモ

- Quartzのコードを使うこと自体は問題ない。MITライセンスはコードを使うこと・改変すること・配布することを自由に許可しており、**著作権表示を保持する**ことが条件。
- 記事テキストはプログラムとは別の著作物なので、それぞれ独立した著作権の主体になれる。
- もし将来「一定条件で記事の引用・転載を許可したい」となった場合は、[Creative Commons (CC BY-NC-ND 4.0 など)](https://creativecommons.org/licenses/by-nc-nd/4.0/) を選択することもできる。

---

## 関連ノート

- [[Quartzとはなにか]]
- [[MOC-Quartz]]

