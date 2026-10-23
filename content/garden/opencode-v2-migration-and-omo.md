---
created: 2026-10-24
updated: 2026-10-24
tags:
  - OpenCode
  - AIエージェント
  - プラグイン
  - 移行
  - oh-my-opencode
  - OmO
type: article
confidence: medium
status: draft
title: OpenCode V2移行とOh My OpenCodeの現在地
aliases:
  - OpenCode V2に移行すべきか
  - OpenCode V1とV2の選び方
  - Oh My OpenCodeはV2で使えるのか
  - opencode-v2-migration-and-omo
description: OpenCode 2.0の破壊的変更と世間の反応を整理し、V1に残るかV2へ移行するかの判断基準と、Oh My OpenCode（OmO）がV2でどこまで使えるのかをまとめる。
---

## 結論

- **Oh My OpenCode（OmO）のフル機能が目的なら、いまは V1（1.19.4）＋ OmO Ultimate が確実**。V2 では OmO プラグインは「読み込まれるが、agents / tools / hooks は動かない」状態で、フル体験は別製品の OmO Native に移っている。
- **OmO にこだわらず、V2 の設計（サービス型・Web/モバイル・バックグラウンド実行）が欲しいなら V2（2.1.x）へ移行してよい**。ただし V1 プラグインは動かないので、自作プラグインと LSP 依存の見直しが必要。
- **迷うなら V1 で待つのが安全**。V1 はもう機能追加されず critical fix のみだが、そのぶん枯れている。V2 は 2026年10月に正式版になったばかりで、移行トラブルの報告がまだ多い。

## 何が変わったのか（V2）

OpenCode 2.0 は 2026年10月11〜14日ごろにメインラインへ昇格した。公式の移行ガイドが挙げる意図的な破壊的変更は3つ。

1. **プラグインAPIの変更**（`@opencode-ai/plugin` → `@opencode/plugin`、`Plugin.define({ id, setup })` 形式）
2. **サーバーAPI・クライアントの契約変更**（`@opencode/client` へ）
3. **ターミナル設定の集約**（複数の `tui.json(c)` → グローバル `cli.json`、初回起動で自動移行）

アーキテクチャ上の最大の変化は、**バックグラウンドサービス化**だ。TUI・Web・デスクトップが同じサービスに接続し、ツール実行もサービス側で行われる。サブエージェントやシェルコマンドのバックグラウンド実行、Code Mode（MCPツールをJSでまとめて呼ぶ）も入った。

見落としやすい変更:

- **LSP は V2 では動かない**。移行ガイドは lint / 型チェック / コンパイラをエージェントに実行させる形へ置き換えるよう案内している。ホームページには LSP 対応の記述が残っており、ここは公式内でも食い違っている。
- **プロジェクト外ディレクトリへのアクセスが既定で許可**される。V1 と同じ確認動作にするなら `permissions` に `{ "action": "external_directory", "resource": "*", "effect": "ask" }` を足す。
- 設定キーの一部が改名（`bash` → `shell`、`task` → `subagent`、`plugin` → `plugins` など）。V1 形式の設定は概ねそのまま読まれる。

## 世間の反応

**肯定的な声**（Hacker News の 2.0 スレッドは 887 points / 396 comments、2026-10-14）

- クライアント/サーバー構成、ホットリロード、バックグラウンドタスク、設定編集用の組み込みスキル、UI の改善を評価する声。
- 「V1 の不満がかなり消えた」「もう他のハーネスへ乗り換えなくて済む」という層がいる一方、同じスレッド内でも評価は真っ二つ。

**批判・慎重な声**

- 移行手順の失敗（`/update` や `opencode upgrade` が通らない、インストーラが遅い、サービスが起動しない）。
- **プラグインが警告なく動かなくなる**。V2 は V1 プラグインを発見はするが実行しない。`plugin list` には出るのに、フックが一度も呼ばれないという検証記事がある。
- **セキュリティ面の指摘**。設定の優先順位（システム設定よりユーザー設定が勝つ）やプラグインのホットリロードが攻撃面になるとして議論になり、初期の指摘は修正・巻き戻しされた。ただし「V2 はセキュリティ設計への理解が甘い」と離脱したユーザーもいる。
- **LSP 非対応**、UX の変更（Tab でエージェント切替ができない等）、Issue 数の多さ（3,000件超）を挙げる声。
- Reddit では「V1 のまま様子見」「移行して DB エラーや無料モデル不調に当たった」という報告が目立つ。肯定的な人でも「プラグインを自分で直せる人向け」というニュアンス。

総じて、**アーキテクチャの方向性は評価されているが、移行の粗さとプラグイン互換の断絶が不評**、というのが現時点の空気だ。

## Oh My OpenCode（OmO）はどうなったか

結論から言うと、**V2 用の OmO プラグインは「ロードはするが機能しない」**。

- `oh-my-opencode` 5.1.44（2026-10-23）は V2 でも読み込めるようになった。ただし起動時に「OpenCode 2 support is limited: the plugin loads, but its agents, tools and hooks are not active here.」と表示し、OmO Native へ誘導するだけ。
- 以前は V2 で `PluginModule.LoadError` になり、そもそもロードできなかった。ロード対応（#10439）が入ったのは 2026-10-18 で、それが 5.1.44 系に載った形。
- V1 と V2 の両対応（dual-host）の本格移植は**一時停止中**。作者は「OpenCode 2 対応はプラグインがロードするところまで。フル体験は OmO Native で提供する」と明言している。

現在の選択肢は3つ。

| 選択肢 | 中身 | V2 | 向いている人 |
| --- | --- | --- | --- |
| **OmO Ultimate（V1プラグイン）** | V1 OpenCode に入れる従来版。エージェント群・フック・MCP・スラッシュコマンド一式 | 実質不可 | 今すぐフル機能が欲しい |
| **OmO Native** | `omo` 単体コマンド。senpi エンジンに OmO を内蔵。OpenCode とは別プロセス | OpenCode 非依存 | OpenCode を離れてもよい |
| **oh-my-opencode-slim** | 別作者の軽量版。V2.0.7+ に対応 | 可 | V2 で OmO 風の体験が欲しい |

注意点:

- OmO Native は OpenCode のプラグインではない。`omo setup` でプロバイダキーや MCP を移せるが、OpenCode の設定ファイルとは別管理になる。
- V1 の OmO Ultimate は「最もテストされている」経路ではあるが、V1 自体が critical fix のみの保守モードなので、長期的には行き止まり。
- `oh-my-opencode-slim` は V2 対応をうたうが、OmO 本体とは別実装・別作者。機能差とサポート範囲は自分で確認する必要がある。

## どう選ぶか

**V1 に残る（＋OmO を入れる）べき人**

- OmO のエージェント編成・フック・チームモードを今すぐ使いたい。
- 自作プラグインや LSP 診断に依存していて、移植コストを払いたくない。
- 仕事や執筆で使っていて、移行トラブルを避けたい。

**V2 へ移行してよい人**

- OmO への依存が薄い（または OmO Native を別コマンドとして使う）。
- Web / デスクトップ / モバイルから同じセッションに触れたい。
- バックグラウンド実行や Code Mode を積極的に使いたい。
- プラグインを自分で V2 API に移植できる、またはプラグインを使っていない。

**自分の場合（この Vault の環境）**

- 現在の `opencode` は 1.18.35。OmO は未導入で、グローバルプラグインは Herdr 連携のみ。
- Herdr のプラグインは `{ id, server, setup }` の両対応形式なので、V2 でもロード自体は通る。ただし `setup()` が空なので、V2 で Herdr 連携がどこまで動くかは別途確認が必要。
- したがって「OmO を試したい」なら **V1 を 1.19.4 にして OmO Ultimate を入れる**のが最短。「OmO はいいから V2 の機能が欲しい」なら **V2 2.1.x に上げて、Herdr 連携と権限設定を確認する**のがよさそう。

## 移行する場合の手順（V1 → V2）

1. `~/.config/opencode` と `~/.local/share/opencode` をバックアップする。V1 と V2 は設定場所を共有するが、セッションDBは別物。V2 で起動した同じ HOME では V1 が `Database is not empty and has no session table` で起動しないことがあるので、検証は別 HOME かコンテナで行う。
2. V1 のプラグイン一覧と、LSP 診断に依存している処理を洗い出す。
3. `opencode upgrade --major`（または V2 インストーラ）で移行。V1 は削除される。
4. 起動して、モデル・認証・エージェント・権限・MCP を確認する。
5. プラグインを V2 API へ移植する。`plugin list` の ID が空ならロード失敗。
6. 外部ディレクトリ権限と LSP 代替（lint / typecheck コマンド）を設定する。
7. 問題があれば V1 用の HOME を分けて戻す。

更新コマンド自体は V1 でも V2 でも `opencode upgrade`。V1 は 1.19.2 以降、通常更新で 2.x を掴まないようになっている。V2 へ上げるのは `--major` を明示したときだけ。

## 出典

- [Migrate from V1（公式）](https://opencode.ai/v2/docs/migrate-v1/)（確認日 2026-10-24）
- [OpenCode CLI（公式）](https://opencode.ai/docs/cli/)（確認日 2026-10-24）
- [OpenCode 2.0（Hacker News）](https://news.ycombinator.com/item?id=50094994)（2026-10-14、887 points / 396 comments）
- [Migrating to OpenCode 2.0（Hacker News）](https://news.ycombinator.com/item?id=50057747)
- [Major security regression merged into OpenCode V2（Hacker News）](https://news.ycombinator.com/item?id=50075319)
- [opencode v2 issues（r/opencode）](https://www.reddit.com/r/opencode/comments/1wnzrre/opencode_v2_issues/)
- [Is OpenCode V2 officially in a stable release?（r/opencode）](https://www.reddit.com/r/opencode/comments/1wppj69/is_opencode_v2_officially_in_a_stable_release/)
- [OpenCode 2.0に上げたら、1.0のプラグインが警告もなく動かなくなっていた（AimanaVo）](https://aimanavo.com/c/morphox_ai/a/fdNUs_X4hBAQog)（2026-10-19）
- [oh-my-openagent #8485: OpenCode V2 plugin API support](https://github.com/code-yeongyu/oh-my-openagent/issues/8485)
- [oh-my-openagent #9389: OpenCode V2 port discussion](https://github.com/code-yeongyu/oh-my-openagent/issues/9389)
- [oh-my-openagent Releases（5.1.44 / OpenCode 2 ロード対応）](https://github.com/code-yeongyu/oh-my-openagent/releases)
- [oh-my-opencode-slim: OpenCode v2 compatibility](https://github.com/alvinunreal/oh-my-opencode-slim/blob/master/docs/opencode-v2-compatibility.md)
- [OpenCode Changelog（v1.19.4 / v2.1.4）](https://opencode.ai/changelog)（確認日 2026-10-24）

## 関連ノート

- [[three-oss-agent-harnesses|三大OSSハーネス比較：Hermes・DeepSeek Harness・OpenCode]]
- [[why-opencode-makes-deepseek-free|なぜOpenCodeはDeepSeekを無料で使わせるのか]]
- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
