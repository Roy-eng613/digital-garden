---
title: "長編小説における伏線とフラグのJSON-Markdown管理"
description: "植えた伏線を忘れないために、JSONで状態を持ち、Markdownで意味を書く。LLMに渡すのは未回収だけにする運用"
tags:
  - 小説
  - AI
  - JSON
  - 設計
type: idea
confidence: medium
status: draft
created: 2026-10-28
updated: 2026-10-28
aliases:
  - "長編小説における伏線とフラグのJSON-Markdown管理"
related:
  - "[[can-ai-novel-stay-coherent|「完結まで破綻しないAI小説」はエンジニアリングで可能か]]"
  - "[[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]]"
  - "[[context-window-exhaustion|AI小説執筆におけるコンテキストウィンドウの枯渇問題]]"
draft: false
---

# 長編小説における伏線とフラグのJSON-Markdown管理

伏線は、植えた瞬間に忘れられる。人間でも忘れるのだから、AIはもっと忘れる。忘れないようにするには、**植えたことを記録する場所**を決めるしかない。

## なぜJSONとMarkdownの併用か

- **JSON**：状態を機械的に判定できる。LLMに「未回収だけ渡す」ができる。
- **Markdown**：意味とニュアンスを人間が読める。なぜその伏線を植えたかは、JSONに書くと窮屈。

だから、状態はJSON、意味はMarkdownの本文に置く。

## スキーマの例

```json
{
  "foreshadowing": [
    {
      "id": "F001",
      "planted": "ep01",
      "payoff": "ep04",
      "status": "open",
      "summary": "旧校舎の雨音。透の記憶とNCIのログが食い違う",
      "note": "回収時は、答えを説明せず、別の違和感に置き換える"
    }
  ]
}
```

`status` は `open` / `paid` / `abandoned` の3つで足りる。`abandoned` を許すのが大事で、全部回収しようとすると話が窮屈になる。

## 運用

1. シーンを書いたら、植えた伏線をJSONに追記する。
2. 回収したら `status` を `paid` にする。**消さない**。消すと、後から経緯を追えなくなる。
3. 次のシーンを書くとき、LLMには `open` のものだけ渡す。`paid` を渡すと、AIが「これはもう回収済みです」と親切に説明し始める。

## フラグとの違い

伏線は読者に対する約束、フラグは物語内部の状態（誰が何を知っているか）。混ぜると管理できないので、別のキーに分ける。

```json
{
  "flags": {
    "iori_knows_about_nci": true,
    "mizuno_trust": 2
  }
}
```

## 関連

- [[can-ai-novel-stay-coherent|「完結まで破綻しないAI小説」はエンジニアリングで可能か]]
- [[hierarchical-memory-l1-l2-l3|階層化メモリ構造：L1・L2・L3ステート管理の定義]]
- [[context-window-exhaustion|AI小説執筆におけるコンテキストウィンドウの枯渇問題]]
