---
created: 2026-10-16
updated: 2026-10-16
tags:
  - OpenCode
  - DeepSeek
  - DeepSeek-V4.1-Flash
  - 無料枠
  - LLM
  - AIエージェント
  - プライバシー
  - 学習利用
  - ビジネスモデル
  - メタ記事
type: article
confidence: medium
status: draft
title: なぜOpenCodeはDeepSeekを無料で使わせるのか
aliases:
  - なぜOpenCodeはDeepSeekを無料で使わせるのか
  - OpenCodeの無料DeepSeekのからくり
  - 無料DeepSeekは学習に使われるのか
  - why-opencode-makes-deepseek-free
description: OpenCodeがDeepSeek V4.1 Flashを無料で提供する理由を、有料プラン（Go/Zen）との違い、データ学習利用の噂、公式ソース、そして「この記事自体を無料DeepSeekに書かせた」メタな検証まで含めて整理する。
---

> [!note] この記事は、無料のDeepSeekが書いている
> この記事の下書きは、**OpenCode上で動く無料モデル `deepseek-v4.1-flash-free`（DeepSeek V4.1 Flash Free）** が生成した。
> 「OpenCodeがDeepSeekを無料で使わせる理由」を、まさにその無料の組み合わせで書かせている。この構造自体が、本記事のひとつの結論である。使用したプロンプトは記事内に全文を掲載している。

## 概要

OpenCode（オープンソースのコーディングエージェント）は、2026年10月15日から **DeepSeek V4.1 Flash** を「Free」枠で使えるようにした。入力・出力・キャッシュ読み取りがすべて `$0`（[OpenCode Console Models](https://opencode.ai/v2/docs/console/models/)）。DeepSeek本体のAPIは無料枠を持たず、従量課金のみである（[DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing/)）。つまり、誰もタダで配っていないはずのモデルを、OpenCodeがタダで配っている。

素朴な疑問が3つ出てくる。

1. **なぜ無料にできるのか**（原資はどこから出ているのか）
2. **有料プランと何が違うのか**
3. **「結局、学習データに使われるのでは？」という噂は本当か**

そして、この記事にはもうひとつ仕掛けがある。冒頭に書いたとおり、**この記事自体を、その無料のDeepSeekに書かせている**。無料で使えることの意味を、無料で書かれた文章で説明する、という少しねじれた構成にした。

> [!warning] 結論をひとことで
> 無料提供は「太っ腹」でも「慈善事業」でもなく、**OpenCode・DeepSeek・ユーザーの利害が一時的に一致した、期限付きのプロモーション**である。原資の内訳は公式には明かされておらず、コストは「値引き」と「評価データ」と「ハーネスへの囲い込み」で回収される。だから無料枠は**計画ではなくボーナス**として扱うのが正しい。

---

## 前提: 何が無料で、何が有料なのか（公式の数字）

まず事実を押さえる。OpenCodeのモデル一覧には、同じDeepSeekでも無料版と有料版が並んでいる。

| 項目 | DeepSeek V4.1 Flash **Free** | DeepSeek V4.1 Flash（有料） |
| :--- | :--- | :--- |
| モデルID | `deepseek-v4.1-flash-free` | `deepseek-v4.1-flash` |
| 入力 / 出力 / キャッシュ読取（1Mトークン） | **Free / Free / Free** | $0.30 / $1.20 / $0.006 |
| コンテキスト窓 | 約200K（報道値。公式は明記せず） | 最大1M（報道値） |
| 提供チャネル | OpenCode Console（Console/Zen） | Console / Go |
| データの扱い | zero-retention・学習に使わない（公式記載） | zero-retention・学習に使わない |
| 期限 | 「limited time」表記。終了日は非公表 | 継続提供 |

出典: [OpenCode Console Models（料金・無料モデル表）](https://opencode.ai/v2/docs/console/models/) / [OpenCode Go（Goとその料金表）](https://opencode.ai/go)（確認日: 2026-10-16）

無料版には**終了日もリクエスト数の上限も書かれていない**。これが後述の「ボーナス扱い」という結論につながる。コンテキストが200Kと1Mで分かれるという話は報道ベースで、[Magicaの記事（2026-10-15）](https://magica.com/news/opencode-deepseek-v4-1-flash-free-context-limit)が「無料200K / 有料1M」として報じているが、OpenCode公式は明記していない。

---

## なぜ無料にできるのか

公式は「原資」を説明していない。そこで、公開情報から読み取れる**3つの仮説**を並べる。どれか1つが正解というより、重なっていると考えるのが自然だ。

### 1. DeepSeek側の狙い — 「配る」ことが戦略になっている

DeepSeek V4.1 Flashは、そもそも**配りたくなる設計**になっている。

- 552BパラメータのMoEで、実際に動くのは入力8B・出力16Bのみ（[DeepSeek公式発表](https://www.deepseek.com/en/news/deepseek-v4-1-flash/)）。
- KVキャッシュが前世代比で **HBM 1/4・SSD 1/8**。キャッシュヒット課金がエージェントコストの大部分を占めるため、キャッシュを圧縮できることは serving コストの直接削減になる。
- オフピーク料金はピークの50%。需要を時間で平準化できる。

さらにDeepSeekは発表の中で、**OpenCodeを「公式パートナー」として名指ししている**（WorkBuddyと並ぶ）。つまり無料枠は、DeepSeekにとって「自社モデルを開発者のワークフローに食い込ませる配布経路」であり、Serving コストが下がった分を配布に振り向けられる、という構図が成立する。

### 2. OpenCode側の狙い — 無料枠は「ハーネス」への入り口

OpenCodeの収益は**モデルではなくハーネス（エージェント本体）の周辺**にある。方針は公式のGoalsに明快に書かれている。

- Console/Zen は「sell at cost（原価で販売）」し、マークアップは決済手数料分のみ（[Console Models](https://opencode.ai/v2/docs/console/models/)）。
- 有料プラン Go / Go Plus は**完全にオプション**で、OpenCode本体（MITライセンス）は無料。
- ゴールは「**no lock-in**（囲い込まない）」と明言されている。

ここで無料モデルの役割が見えてくる。**無料モデルは、ユーザーを「OpenCodeというハーネス」に定着させる撒き餌**であり、同時に有料プラン（Go/Zen）への導線でもある。実際、DeepSeekのGo枠での月次上限は、10月12日時点で **$80** まで引き上げられている（[OpenCode Go](https://opencode.ai/go)、[Magica](https://magica.com/news/opencode-deepseek-v4-1-flash-free-context-limit)）。この一連のキャンペーンは **"Operation Cheepseek"** と呼ばれており、無料枠はその一環とみられる。

> [!tip] 「フリーモデルは回転する」ことを忘れない
> OpenCodeの無料モデルは固定ではなく、常にローテーションしている。2026年1月の無料枠（Grok Code Fast 1、GLM 4.7、MiniMax M2.1等）は数か月でほぼ総入れ替えになり、DeepSeek V4 Flash Freeも8月に一度消えている/戻っている（[bartlomiejkrupa.dev の定点観測](https://bartlomiejkrupa.dev/articles/opencode-free-coding-agent/)、[GitHub Issue #44110](https://github.com/anomalyco/opencode/issues/44110)）。無料枠は「常に何かは無料」に見えるが、**特定のモデルはいつ消えてもおかしくない**。

### 3. 構造的な理由 — 推論コストは落ち続け、評価データには価値がある

第三の見方は、もっと冷めたものだ。**推論の限界費用は急速に下がっている**。オープンウェイトモデルはプロプライエタリに迫る性能に達し、複数プロバイダが競争的にservingするため価格が崩れる（[OpenCode Go のBackground](https://opencode.ai/v2/docs/console/go/)）。

一方で、無料枠の見返りとしてOpenCode/DeepSeekが得るのは **「本物のコーディング作業の評価データとフィードバック」** である。無料モデル各エントリの説明文には、ほぼ例外なく次の定型が付く。

> "available on OpenCode for a limited time. The team is using this time to collect feedback and improve the model."

（[Console Models 無料モデル節](https://opencode.ai/v2/docs/console/models/)）

つまり建前上の取引は、**「最先端級の推論を無料で渡す代わりに、実タスクの評価データをもらう」**。ただし後述するように、DeepSeek Freeについては「学習には使わない」と公式が明記しており、ここはモデルごとに条件が異なる。

---

## 有料プランとの違い

OpenCodeでモデルを使う方法は大きく4つある。**「無料枠」はこの中のひとつにすぎない。**

| プラン | 価格 | 課金方式 | 特徴 |
| :--- | :--- | :--- | :--- |
| **無料モデル** | $0 | なし | OpenCodeアプリ内限定。枠は回転。モデル次第で学習利用あり |
| **OpenCode Go** | $10/月 | 月額サブスク | オープン系中心の29モデル。モデル別の月次上限（DeepSeek V4.1 Flashは$80） |
| **OpenCode Go Plus** | $40/月 | 月額サブスク | Goの上位。上限が約2倍 |
| **OpenCode Zen (Console)** | 従量課金 | 前払い$20・トークン課金 | 84モデル。Claude/GPT/Gemini等。原価販売 |
| **自前のAPIキー (BYO)** | 各社料金 | 各社 | OpenCodeは関与しない。NDA案件の唯一の安全策 |

出典: [Console Models](https://opencode.ai/v2/docs/console/models/) / [Go](https://opencode.ai/go) / [Go Docs](https://opencode.ai/v2/docs/console/go/)（確認日: 2026-10-16）

### 違いを一言でいうと

- **無料枠** = 期限付きの試供品。アプリ内限定で、いつ消えても文句は言えない。
- **Go** = 決まった月額で、DeepSeek V4.1 Flashを月$80ぶんまで使える「安定枠」。上限に達したら、Zen残高に逃がす設定もできる。
- **Zen** = 使った分だけ払う従量制。ClaudeやGPTなど高価なモデルもここに集約される。
- **BYO** = 自分の契約。OpenCodeを一切通らないので、機密データの懸念が最も小さい。

### 無料枠の「もう一つの制約」: アプリ内限定

2026年9月以降、Zenの無料枠は **OpenCodeアプリ内からのリクエストにしか応答しない** ようになった。外部のAPIキーで無料モデルを叩こうとすると `FreeTierError` / HTTP 403 が返る（[Wallabyの解説記事](https://wallabytoken.com/blog/p/opencode-free-tier-locked)）。「無料」の代わりに、**利用経路がハーネスに固定されている**わけで、これも前述の「ハーネスへの囲い込み」仮説と整合する。

---

## ネットの噂を検証する

ここが多くの人が知りたいところだろう。X/Redditで流れている代表的な噂を、公式情報で1つずつ確認する。

### 噂1: 「無料モデルは学習データに使われる」

**→ 半分ホント。モデルごとに条件が違う。ただしDeepSeek Freeは「学習に使わない」と明記されている。**

OpenCodeのConsoleプライバシー欄は、無料モデルでも条件が異なると明記している（[Console Models / Privacy](https://opencode.ai/v2/docs/console/models/)）。整理すると以下のとおり。

| モデル | 学習利用 | 保持 |
| :--- | :--- | :--- |
| **DeepSeek V4.1 Flash Free** | **使わない** | zero-retention |
| GLM-5.3-Flash Free / Space Bunny / LongCat 2.5 / Step 5 | 使わない | zero-retention |
| Big Pickle / LL Alpha / Exo / MiMo-V2.6, V2.5 | **使う可能性あり**（無料期間中） | 30日等 |
| Nemotron 3系 Free (NVIDIA) | 試用限定・ログ取得あり | 識別子には紐づけない |
| Muse Spark 1.3 / Gemini 4 Argon Contributor | **学習利用に同意する代わりに割引** | 非ZDR |
| Cat Jam Free | 学習には使わない | 安全目的で30日 |

つまり「**無料＝学習に使われる**」は、無料枠全体について語るなら**不正確**で、「**無料の一部モデルは学習に使われる**」が正確。そして今あなたが使おうとしているDeepSeek Freeは、公式記載上は**学習に使わない**側に分類されている。

### 噂2: 「DeepSeek Freeは結局、中国のサーバに送られてるのでは？」

**→ 一部は事実。ZDR（Zero Data Retention）契約の存在と、法域リスクは分けて考える必要がある。**

Goのプライバシー表には、DeepSeekについて「モデル学習: 使わない / 保持: 0日」と記され、脚注に **「DeepSeekとのZDR契約は毎月更新。現在の契約は2026年10月31日まで有効」** とある（[Go Docs / Privacy](https://opencode.ai/v2/docs/console/go/)）。

ただしRedditには、DeepSeek系で **中国国内ホストへのルーティングやリージョン同意を求める挙動** を報告する声がある（例: `RegionError ... only available hosted in China and requires explicit opt in`）。これは「契約で学習しないと言っていること」と「データがどの法域を通るか」という**別問題**で、両者を混同すると判断を誤る。中国製モデルの経路別リスクは [[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]] で詳しく整理している。

### 噂3: 「OpenCodeはGoのデータをデフォルトで学習に使おうとしている」

**→ 未確認。少なくとも現行の公式ドキュメントは「使わない / 0日」と記載している。**

Redditには、OpenCodeチームがGoの学習利用を「検討した」というX投稿を根拠にした指摘がある（[r/opencode の議論](https://www.reddit.com/r/opencode/comments/1vbq3y3/opencode_go_data_retention/)）。だが「チームが選択肢として言及した」ことと「実際にそうなった」ことは別だ。**最終的な判断基準は、常に最新の公式プライバシー表**を見ること。ここは更新が頻繁なので、記事や噂ではなく一次情報を読むべき領域である。

### 噂4: 「無料枠でAPIを叩ける」

**→ もう叩けない（2026年9月以降）。**

前述のとおり、無料枠はOpenCodeアプリ内限定になった。外部スクリプトやプロキシ経由では `403 FreeTierError` になる。有料のZenモデルは今もAPIから使える。

### 検証まとめ

| 噂 | 判定 | 一言 |
| :--- | :--- | :--- |
| 無料は学習に使われる | △ | モデル次第。DeepSeek Freeは「使わない」 |
| 中国サーバに送られる | △ | ZDR契約はあるが法域リスクは別問題 |
| Goは学習に使おうとしている | ×（未確認） | 現行公式は「使わない」 |
| 無料枠で外部APIを叩ける | × | 2026年9月以降アプリ限定 |

> [!caution] この節の限界
> ここに書いた「公式の記載」は、あくまで**OpenCodeがそう説明している**という意味である。第三者による監査ではない。「契約上使わないと言っている」以上の保証はない。機密・NDA案件なら、記載を信じるかどうかではなく **BYOキー**で経路を完全に分離するのが唯一確実な選択肢になる。

---

## この記事自体が証拠になっている件（メタ検証）

冒頭の仕掛けに戻る。**この記事は、無料の `deepseek-v4.1-flash-free` がOpenCode上で書いた。**ユーザーが支払った推論コストは `$0` である。

これは単なるネタではない。3つのことを同時に示している。

1. **無料枠は実用十分** — 出典を調べ、表を組み、噂を検証する、というある程度複雑なタスクを無料枠で完遂できた。
2. **公開情報だけでここまで書ける** — 原資は非公開でも、料金表・プライバシー表・モデル発表という一次情報を突き合わせれば、だいたいの構造は復元できる。
3. **「無料の代わりに何を渡しているか」が見える** — あなたが今読んでいるこの文章は、学習には使わないとされるDeepSeek Freeの出力だが、同時に「無料モデルが実タスクでどう振る舞うか」という**フィードバックそのもの**を提供している。建前の取引を、この記事が体現している。

要するに、**OpenCodeがDeepSeekを無料で使わせる理由のひとつは、こうして「無料の実例」が生まれ、回っていくこと自体**にある。この記事はその一つのサンプルだ。

---

## 実際に使ったプロンプト

この記事を書かせるために、実際にOpenCode（無料DeepSeek）へ渡したプロンプトは次のとおり。自己言及的な構成はプロンプト側で指示している。

```text
今から記事を書いてほしい。内容は「なぜOpenCodeはDeepSeekを無料でユーザーに使わせるのか」。
条件:
- 有料プランとの違いに触れる
- ネット上の噂（例: 学習に使われる）にも回答する
- 公式情報を参照し、記事の中にソースと確認日を書く
- この記事を書いているのが、まさにOpenCodeとDeepSeekであることを記事のポイントとして組み込む
- どんなプロンプトでこの記事を書いているかも、記事の中に含める
- Xで投稿するので、Xで記事を開いてもらえるフックの文章も作る
- その他、面白くなる工夫をする
出力先: xxxxx/content/garden
```

この「プロンプトそのものを記事に埋め込む」指示が、メタ検証の節を生んでいる。**AIに自分の説明を書かせ、その指示まで公開する**という構図は、無料枠の実態を最も正直に反映する方法のひとつだろう。

---

## X投稿用フック（案）

記事をXで拡散するときの投稿文。好みで使い分けてほしい。

**案A（構造を突く・本命）**
> OpenCodeがDeepSeekを無料で使わせるのは、太っ腹でも慈善でもない。
> 原資・有料プランとの差・「学習に使われる」噂の真偽を、公式ソース付きで全部調べた。
> しかもこの記事、それ自体を無料のDeepSeekに書かせてます。使ったプロンプトも載せた。
> 👇

**案B（疑問形で惹く）**
> なぜOpenCodeは、他社APIが有料のDeepSeekをタダで配れるのか？
> 答えは「期限付きプロモ × 評価データ × ハーネス囲い込み」。
> 学習利用の噂も公式プライバシー表で検証。
> 追記: この記事自体、無料DeepSeekが執筆しています。

**案C（メタを前面に）**
> 「OpenCodeがDeepSeekを無料にする理由」を、OpenCode＋無料DeepSeek自身に書かせてみた。
> 有料プランとの違い、学習利用の噂、出典付きの検証、そして書かせたプロンプト全文まで。
> 無料って何の代わりなのか、が分かります。

**締めの定型（どの案にも足すと貼りやすい）**
> 出典付き・確認日つきでまとめました → [記事URL]

---

## まとめ

- OpenCodeの無料DeepSeekは、**期限付きプロモーション**。原資は非公開。
- 実態は「**値引き（DeepSeek）× 評価データ（モデル提供元）× ハーネス囲い込み（OpenCode）**」が重なった構図。
- 無料だが、**アプリ内限定**で、**いつ終わってもおかしくない**。計画の土台にはできない。
- 「学習に使われる」は**モデル次第**。DeepSeek Freeは公式上は**使わない（ZDR、契約は2026-10-31まで）**。ただしZDR契約と法域ルートは別問題。
- 機密・NDAなら、記載を信じるより **BYOキー**で経路を分離するのが確実。
- そしてこの記事は、**その無料枠で実際に書かれた**。無料であることの意味を、無料の出力が説明している。

---

## 関連ノート

- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]
- [[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]]
- [[autonomous-ai-agents-token-consumption-free-tier|自律型AIエージェントと無料枠モデルの相性・トークン消費の課題]]
- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]

---

## 参考資料

- [OpenCode Console Models（無料モデル表・料金・Privacy）](https://opencode.ai/v2/docs/console/models/)（確認日: 2026-10-16）
- [OpenCode Zen（料金・無料モデル一覧）](https://opencode.ai/docs/zen/)（確認日: 2026-10-16）
- [OpenCode Go（$10/$40プランと料金表）](https://opencode.ai/go)（確認日: 2026-10-16）
- [OpenCode Go Docs（Privacy表・DeepSeek ZDR）](https://opencode.ai/v2/docs/console/go/)（確認日: 2026-10-16）
- [DeepSeek: Introducing DeepSeek-V4.1-Flash（公式発表, 2026-09-10）](https://www.deepseek.com/en/news/deepseek-v4-1-flash/)（確認日: 2026-10-16）
- [DeepSeek API Pricing（公式料金）](https://api-docs.deepseek.com/quick_start/pricing/)（確認日: 2026-10-16）
- [Magica: OpenCode adds free DeepSeek V4.1 Flash tier with reported 200K context（2026-10-15）](https://magica.com/news/opencode-deepseek-v4-1-flash-free-context-limit)（確認日: 2026-10-16）
- [OpenCode公式Xのアナウンス](https://twitter.com/opencode/status/2110635747648909472)（確認日: 2026-10-16）
- [IT之家（無料枠とGo枠の報道）](https://www.ithome.com/1/013/475.htm)（確認日: 2026-10-16）
- [ChainCatcher（無料枠と有料枠の比較報道）](https://www.chaincatcher.com/article/2296509)（確認日: 2026-10-16）
- [Wallaby: "Free tier can only be used from within OpenCode"（2026-10-09）](https://wallabytoken.com/blog/p/opencode-free-tier-locked)（確認日: 2026-10-16）
- [bartlomiejkrupa.dev: opencode is free until the model rotates out（2026-07-25）](https://bartlomiejkrupa.dev/articles/opencode-free-coding-agent/)（確認日: 2026-10-16）
- [GitHub Issue #44110: Request to restore the free DeepSeek model](https://github.com/anomalyco/opencode/issues/44110)（確認日: 2026-10-16）
- [r/opencode: OpenCode Go - data retention（噂の出所）](https://www.reddit.com/r/opencode/comments/1vbq3y3/opencode_go_data_retention/)（確認日: 2026-10-16）
- [Caprock: OpenCode pricing: Go, Zen and your own key](https://caprock.dev/guides/opencode-pricing/)（確認日: 2026-10-16）
