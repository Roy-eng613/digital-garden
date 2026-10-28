---
title: "ObsidianをLLMの外部記憶（L2-L3）として利用するプロトコル"
description: "ファイル名、frontmatter、MOC、検索、渡す単位。ObsidianのVaultをLLMが読める記憶にするための具体的な手順と、破綻しやすい点"
tags:
  - Obsidian
  - LLM
  - PKM
  - AI
type: article
confidence: medium
status: draft
created: 2026-10-28
updated: 2026-10-28
aliases:
  - "ObsidianをLLMの外部記憶（L2-L3）として利用するプロトコル"
related:
  - "[[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]]"
  - "[[llm-external-memory-atomic-notes|LLMの外部記憶としての「一ノート一アイデア」]]"
  - "[[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]"
draft: false
---

# ObsidianをLLMの外部記憶（L2-L3）として利用するプロトコル

ObsidianのVaultは、そのままLLMの外部記憶になる。ただし、置き方に規則がないと、AIは毎回違うファイルを読み、違う結論を出す。ここでは実際に使っている規約を書く。

## 1. ファイル名を内容の住所にする

- 1ファイル1テーマ。名詞で終わる。
- 日本語名でよい。ただし英数字のslugを併記すると、リンクと検索が安定する。
- 作品ごとにフォルダを切る。設定は `03_設定/`、公開情報は `05_公開準備/`。

## 2. frontmatterに機械可読な情報を置く

```yaml
---
title: "世界観_NCI社会"
type: concept
status: draft
updated: 2026-10-28
---
```

`type` と `status` があると、AIは「これは設定か、日記か」を判断できる。`updated` は、古い情報を渡さないための判断材料になる。

## 3. MOCを索引にする

作品フォルダ直下に `00_作品ページ.md` を置き、設定とエピソードへのリンクを列挙する。AIはまずMOCを読み、必要ならリンク先を読む。全部を一度に読ませない。

## 4. 渡す単位を決める

- シーン執筆：人物ノート＋舞台ノート＋直前話の要約
- 整合性チェック：設定ノート全部＋今回の本文
- タイトル生成：作品コンセプト＋第一話の本文

同じVaultでも、目的ごとに渡すセットを変える。

## 5. 更新の責任を決める

AIに書かせた設定は、必ず人間が確認してから `status: confirmed` に相当する状態にする。AIの出力をそのまま正本にすると、誤りが記憶として固定される。

## 破綻しやすい点

- **リンク切れ**：MOCにだけ書いて、ファイルを作り忘れる。今回のガーデンでも起きていた。
- **古い要約**：話が進んだのに要約を更新しない。AIは古い要約を信じる。
- **巨大なMOC**：索引に説明を足しすぎて、MOC自体が長文になる。

## 関連

- [[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]]
- [[llm-external-memory-atomic-notes|LLMの外部記憶としての「一ノート一アイデア」]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]
