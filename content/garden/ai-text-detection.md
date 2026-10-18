---
title: AIが書いた文章は、技術的にどう見分けられるのか
description: AI生成テキストの検出技術を、電子透かしと統計的な自動検出の二系統に分けて整理したZenn記事の紹介。精度・脆弱性・偽陽性の限界と、検出スコアを単独で根拠にできない理由を扱う。
tags:
  - AI
  - LLM
  - 検出
type: article
status: draft
created: 2026-10-18
aliases:
  - AIテキスト検出
  - AIが書いた文章は、技術的にどう見分けられるのか
source:
  - "[AIが書いた文章は、技術的にどう見分けられるのか](https://zenn.dev/ogiri/articles/ai-text-detection)"
draft: false
---

## この記事について

Zennに書いた技術記事の紹介。

AIが書いた文章をどう見分けるのかを、生成時に信号を埋め込む電子透かし（ウォーターマーク）と、perplexityやburstinessといった統計的特徴から推定する自動検出の二系統に分けて整理した。長文では高精度でも短文では崩れること、言い換えで信号が弱まること、人間の文章をAIと誤判定する偽陽性が実害を持つことなど、現状の限界をまとめている。

## 元記事

[AIが書いた文章は、技術的にどう見分けられるのか](https://zenn.dev/ogiri/articles/ai-text-detection)

## 関連ノート

- [[novelist-ai-replace|小説家はAIに仕事を奪われるのか]]
- [[AIの言葉と意識について]]
- [[AI時代には人間が書いた文書に価値がある]]
