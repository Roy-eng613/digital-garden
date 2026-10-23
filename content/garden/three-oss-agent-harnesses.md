---
created: 2026-10-24
updated: 2026-10-24
tags:
  - AIエージェント
  - ハーネス
  - OpenCode
  - Hermes
  - DeepSeek
  - DSH
  - 比較
type: article
confidence: medium
status: draft
title: 三大OSSハーネス比較：Hermes・DeepSeek Harness・OpenCode
aliases:
  - HermesとDSHとOpenCodeの比較
  - OSSエージェントハーネス比較
  - 三大ハーネスの選び方
  - three-oss-agent-harnesses
description: Hermes Agent・DeepSeek Harness・OpenCodeを「機能一覧」ではなく「エージェントをどこに住まわせるか」という軸で比較し、用途別の選び方と併用の考え方をまとめる。
---

## 結論：3つは競合ではなく「住処」が違う

Hermes Agent、DeepSeek Harness（dsh）、OpenCode は、どれも「モデルの外側」を担う OSS ハーネスだ。ただし、同じ土俵で殴り合っているわけではない。

- **Hermes** は、生活空間に住み続ける常駐エージェント。記憶・通知・スケジュールが主役。
- **DSH** は、ハーネスそのものを組み立てるための工場。モデルもループも UI もプラグイン。
- **OpenCode** は、開発作業に住むエージェント。TUI / Web / デスクトップとプラグイン生態系が主役。

だから「どれが一番強いか」ではなく、**エージェントをどこに住まわせたいか**で選ぶのが正しい。このノートのアイデアはそこに尽きる。

## 前提：ハーネスとは何か

2026年ごろから、エージェントの議論は「モデル + ハーネス」で整理されるようになった。ハーネスは大まかに **Tools + Context + Loop** でできている。

- どのツールを、どんな権限で見せるか
- 何をコンテキストに入れ、どこまで記憶するか
- モデルとツールの往復をどう回し、どこで人間に止めるか

3つとも MIT ライセンスの OSS だが、この3要素をどこまで固定し、どこを外に出しているかが大きく違う。

## 立ち位置の比較

| 項目 | Hermes Agent | DeepSeek Harness（dsh） | OpenCode |
| --- | --- | --- | --- |
| 開発元 | Nous Research | DeepSeek AI | Anomaly |
| 実装 | Python | TypeScript | TypeScript |
| ライセンス | MIT | MIT | MIT |
| 現在の版（2026-10-24） | v0.22.5 | v0.2.1-rc 系（developer preview） | v2.1.4 / v1.19.4 |
| 主な界面 | CLI / TUI / デスクトップ / メッセージング / ACP / API | Web UI / デスクトップ / SDK / ACP | TUI / Web / デスクトップ / ACP / SDK |
| 実行場所 | ローカル、VPS、Docker、SSH、Modal、Daytona など | ローカル、SSH、サンドボックス（bwrap / Landlock / Seatbelt） | ローカル（サービスを常駐させ、各クライアントが接続） |
| 拡張の思想 | ツール・スキル・プラグイン・記憶プロバイダ | すべてプラグイン（モデル・ループ・UI も） | プラグイン API + エージェント / コマンド / スキル / MCP |
| 記憶 | `USER.md` / `MEMORY.md`、SQLite FTS5、外部記憶プロバイダ | セッションログ（event-sourced）とプラグイン | セッションDB + ファイルベースの指示・スキル |
| マルチエージェント | サブエージェント、Bot Mode、cron | サブエージェント、Agent Team、バックグラウンドジョブ | サブエージェント、バックグラウンド実行 |
| モデル | プロバイダ非依存（Nous Portal / OpenRouter / ローカル等） | DeepSeek 中心だがモデルはプラグイン | プロバイダ非依存（OpenCode Zen / 各種 API / ローカル） |
| 成熟度 | 活発だが更新頻繁 | developer preview（破壊的変更あり） | V2 は移行期、V1 は critical fix のみ |

## Hermes：生活に住むエージェント

Hermes の中心は、コーディングではなく**常駐と記憶**だ。

- `USER.md` / `MEMORY.md` を中心にした永続記憶と、経験からスキルを作る学習ループ。
- Telegram / Discord / Slack / WhatsApp / Signal / Email など 20 以上の入口を持つゲートウェイ。
- cron による定期実行、サブエージェント、`execute_code` によるプログラム的ツール呼び出し。
- ローカルから VPS、サーバーレスまで置き場所を選べる。

向いているのは「自分の代わりに日常タスクを回してほしい」用途だ。日次レポート、Vault の巡回、通知、調査の下ごしらえなど、**セッションを跨いで育つこと**に価値がある。

弱みは、表面積の広さゆえの重さと複雑さ。Python 実装で、更新も頻繁なので、環境によっては更新トラブルを踏む。コーディング専用ではないため、コードベースの編集体験は OpenCode に譲る。

## DSH：ハーネスを組み立てる工場

DSH の思想は「Everything is a Plugin」。Cordis を土台に、モデルアダプタ、ツール、セッション、サンドボックス、エージェントループ、UI までを差し替え可能なプラグインとして扱う。

- 標準 / Code / Minimal / Creator などのモードを切り替えて使う。
- セッションは event-sourced なログとして残り、実行の再生・比較・デバッグに向く。
- Web UI からプラグインを会話で作れる。npm と GitHub topic で配布する前提。
- SDK / ACP / SSH / サンドボックスなど、ランタイムとしての部品が揃っている。

向いているのは「既製のエージェントを使う」より「自分用のランタイムを組む」人。研究、評価、プラグイン開発、モデルやループの差し替え実験など、**観測と組み替え**が目的なら第一候補になる。

弱みは、まだ developer preview で破壊的変更が明言されていること。TUI を持たず Web UI 中心であること。モデルプロバイダの実装が DeepSeek 中心で、コミュニティのプラグイン生態系もこれから。Cordis 自体が新しいため、学習コストもかかる。

## OpenCode：開発作業に住むエージェント

OpenCode の中心は、コードベースとの対話だ。

- V2 ではバックグラウンドサービスに TUI / Web / デスクトップが接続する構成になった。
- ファイル編集、シェル、検索、サブエージェント、バックグラウンド実行、Code Mode を備える。
- エージェント、コマンド、スキル、MCP、プラグインの生態系が大きい。
- V1 は安定版として残り、V2 は 2026年10月にメインラインへ移った。

向いているのは、日常的にコードを書く人。複数クライアントから同じセッションに触れたい人。プラグインやエージェント定義を共有したい人。

弱みは移行期ならではの断絶だ。V1 プラグインは V2 で動かず、移植が必要。V2 では LSP が動かない。V1 は critical fix のみの保守モードなので、長期的には V2 へ寄せることになる。

## 選び方：5つの問い

1. **常駐させて、通知や定期実行をしたいか** → Hermes
2. **記憶を育てて、ユーザー像や作業履歴を跨ぎたいか** → Hermes
3. **ハーネスの内部を差し替え、観測・評価したいか** → DSH
4. **コードを書かせ、複数画面から同じ作業に触れたいか** → OpenCode
5. **既製の体験より、自分で組み立てる自由が欲しいか** → DSH

逆に、次の場合は向かない。

- Hermes は「コードベースの大規模編集を高速に回す」用途には向かない。
- DSH は「今すぐ安定して仕事を回す」用途には向かない。
- OpenCode は「常駐して生活タスクを回す」用途には向かない。

## 併用してもよい

3つは排他ではない。実際、役割を分けると収まりがよい。

- **Hermes**：日常の常駐、記憶、通知、定期タスク
- **OpenCode**：コーディング、Vault の編集、Herdr 経由の並行作業
- **DSH**：プラグイン開発、ランタイムの実験、実行ログの観測

同じ Vault を複数エージェントに触らせる場合は、書き込み権限と作業ディレクトリを分ける。記憶の正本をどこに置くか（`USER.md` / `MEMORY.md` か、各ハーネスのセッションDBか）も先に決めておくと衝突しにくい。

## 注意

- この比較は 2026-10-24 時点の公開情報にもとづく。DSH は developer preview、OpenCode V2 は移行期、Hermes は更新が頻繁なので、版本と評価はすぐ変わる。
- GitHub の star 数は規模感の参考にはなるが、成熟度や自分の用途への適合度は測れない。
- 実機で3つを同じ条件でベンチマークしたわけではない。機能の有無は各公式ドキュメントで確認してほしい。

## 出典

- [Hermes Agent 公式ドキュメント](https://hermes-agent.nousresearch.com/docs/)（確認日 2026-10-24）
- [Hermes Agent Architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)（確認日 2026-10-24）
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)（確認日 2026-10-24）
- [DeepSeek Harness 公式](https://www.deepseek.com/en/harness/)（確認日 2026-10-24）
- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（確認日 2026-10-24）
- [DeepSeek Harness packages/README](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/README.md)（確認日 2026-10-24）
- [VentureBeat: DeepSeek Harness launches as open source rival to Claude Code](https://venturebeat.com/technology/deepseek-harness-launches-as-open-source-rival-to-claude-code-alongside-v4-pro-on-api-with-higher-prices)（2026-08-13）
- [InfoQ: The Open-Sourcing of DeepSeek Harness](https://www.infoq.com/news/2026/08/deep-seek-harness/)（2026-08-20）
- [OpenCode 公式ドキュメント](https://opencode.ai/docs/)（確認日 2026-10-24）
- [OpenCode CLI](https://opencode.ai/docs/cli/)（確認日 2026-10-24）
- [OpenCode Changelog](https://opencode.ai/changelog)（確認日 2026-10-24）
- [Migrate from V1](https://opencode.ai/v2/docs/migrate-v1/)（確認日 2026-10-24）

## 関連ノート

- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]
- [[opencode-v2-migration-and-omo|OpenCode V2移行とOh My OpenCodeの現在地]]
- [[why-opencode-makes-deepseek-free|なぜOpenCodeはDeepSeekを無料で使わせるのか]]
- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[Hermes agentが最近アップデートに失敗する|Hermes agentが最近アップデートに失敗する]]
