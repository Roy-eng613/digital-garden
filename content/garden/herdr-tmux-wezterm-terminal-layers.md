---
created: 2026-10-16
updated: 2026-10-17
tags:
  - Herdr
  - tmux
  - WezTerm
  - WSL
  - Windows
  - 開発環境
  - ターミナル
type: idea
confidence: medium
status: draft
title: Herdr・tmux・WezTermのすみ分けと位置づけ
aliases:
  - Herdr・tmux・WezTermのすみ分け
  - Herdrとtmuxの関係
  - ターミナル環境のレイヤー整理
description: WezTerm・tmux・Herdrという3つのツールをレイヤーで捉え、それぞれの位置づけと、Windows/WSL環境での自分のすみ分け方針を整理する。Herdrとtmuxを同時に使う必要があるのか、prefixの衝突はいつ問題になるのかも扱う。
---

## 概要

Windowsで作業するときのターミナル環境は、いくつかのツールが層になって重なっている。

**WezTerm（ターミナルエミュレータ）→ WSL → 必要に応じて Herdr / tmux** という多層構造で、Herdrとtmuxはどちらも「マルチプレクサ」であり、用途が重なるようでいて、実は役割が異なる。

ただし重要な前提として、**tmuxとHerdrは役割が大きく重なっており、基本はどちらか一方で足りる**。Herdrはtmuxの永続化機能をそのまま受け継いでいるため、同じ用途で2つ重ねる意味は薄い。詳しくは後半の「Herdrとtmuxを同時に使う必要はあるか」で扱う。

本ノートでは各ツールの位置づけを整理し、長年tmuxを使ってきた自分のすみ分け方針をまとめる。Herdrそのものの機能は [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]] を参照。

---

## レイヤーで捉える

| レイヤー | ツール | 役割 | エージェント認識 |
| :--- | :--- | :--- | :--- |
| ターミナルエミュレータ | **WezTerm** | ウィンドウ・描画・フォント・ネイティブのタブ/ペイン分割 | — |
| セッション/マルチプレクサ | **tmux** | PTYの永続化、detach/attach | なし |
| エージェント対応マルチプレクサ | **Herdr** | 永続化に加え、ペインがエージェントか・状態を認識 | あり |

一番大事なのは、**HerdrはWezTermの「代わり」ではなく「中で動く」** という点。Herdr公式も「ターミナルエミュレータではない。Ghostty / Kitty / iTerm / Alacrittyなど、既存のターミナルはそのまま使える」と明言している。逆に、WezTermはターミナルエミュレータでありながら、ネイティブの多重化（タブ・ペイン・ドメイン）も内蔵している。つまりWezTermは「土台＋簡易マルチプレクサ」、tmux/Herdrは「その上に載る本格的なセッション管理」と捉えると整理しやすい。

---

## 各ツールの位置づけ

### WezTerm — 土台（ターミナルエミュレータ）

- Windows / macOS / Linux で動くクロスプラットフォームのターミナルエミュレータ。Rust実装。
- 設定はLua（`~/.wezterm.lua`）。キーバインド、配色、ペイン分割などを柔軟に書ける。**leader key**（モーダルなプレフィックス）も設定でき、ドキュメントの例では `ctrl+a` が使われている。
- ネイティブ多重化として、タブ・ウィンドウ・ペインを持ち、「マルチプレクシングドメイン」でSSH先やWSLにも接続できる。
- **自分の現状**: WindowsからWSLを開くための入口。画面分割もWezTermで担当している。Luaで設定できるのは良いと思っているが、今はまだ最小限で、WSLを開く以外の設定はほぼしていない。

### tmux — 枯れたセッション管理

- 伝統的なターミナルマルチプレクサ。バックグラウンドのサーバがPTYを所有し、クライアントがattach/detachする。SSHが切れても作業が残る。
- prefix（既定は `ctrl+b`）でコマンドモードに入り、その次のキーで操作するモデル。
- ただしtmuxは **「ペイン」までしか見えない**。どのペインがエージェントなのか、入力待ち（blocked）なのかは分からない。
- 長年使ってきたツールで、操作の慣れと安定性がある。

### Herdr — エージェント対応マルチプレクサ

- 「tmuxのエージェント版」と説明されるマルチプレクサ。バックグラウンドのサーバがターミナルを所有し、TUI / CLI / SSHがクライアントとしてattachする。
- サイドバーで各エージェントの状態（`blocked` / `working` / `done` / `idle`）を一目で把握できる。**マウス操作前提**（クリック・ドラッグ・右クリック）で、キーボードは任意のレイヤー。
- キーボードも使え、prefixは既定で `ctrl+b` とtmux互換。`prefix+?` で全バインディングを確認できる。
- `workspace` / `tab` / `pane` の階層を持ち、**既存のターミナルの中で動く**。外側がtmuxでも動く（tmuxを外側の環境として許容する）。
- CLIとソケットAPIがあり、エージェント自身がHerdrを操作できる（エージェントが別エージェントを召喚する、といった連携が可能）。
- **見た目が好み**で、これからのAI時代はHerdrに寄せていくのが良さそうだと考えている。

---

## Herdrとtmuxを同時に使う必要はあるか

先に結論を言うと、**両者は役割が重なっており、基本的にはどちらか一方で足りる**。tmuxは「ターミナルを永続化する」ツール、Herdrは「エージェントを永続化し、状態まで見る」ツールで、Herdrはtmuxの永続化機能をそのまま受け継いでいる。片方の機能がもう片方を内包しているため、同じ用途で2つ重ねる意味は薄い。

### 「ウィンドウを閉じても動く」はどちらも同じ

- **tmux**: `ctrl+b d` でdetach。バックグラウンドのサーバがPTYを保持し、プロセスは動き続ける。
- **Herdr**: `ctrl+b q` でdetach。バックグラウンドのサーバがペインとエージェントを保持し、動き続ける。

つまり「閉じても動く」という点では**両者に差はない**。差が出るのは**サーバ再起動・マシン再起動の後**で、そこでは**どちらも元のプロセスは生き残らない**（tmuxはそもそもライブプロセスのチェックポイントではない）。Herdrはセッションの形（workspace / tab / pane、cwd、レイアウト）を復元し、対応エージェントなら会話の再開もできる。

### 両方を同時に開くのはどんな場合か

重ねる意味が薄いとはいえ、**同時に使う構成が無意味というわけではない**。現実的なのは次のような場合。

- **移行期間**: 日常のシェル作業は慣れたtmux、エージェントを並行させるプロジェクトだけHerdr、という併用。実際「両方を1ホストで同時に使うのは supported で合理的」とする解説もある。
- **リモート側が tmux 前提**: サーバ側に既存のtmux環境があり、手元はHerdrで見たいケース。**どの層が永続化を担当し、どの層がUIを担当するか**を決める。
- **外側 tmux / 内側 Herdr**: Herdrは「既存ターミナルの中で動く」ので、tmuxを外側の環境として許容する。ただし下記の注意あり。

### ただし、入れ子にするとHerdrの検出が壊れる

Herdrの目玉はエージェント検出だが、**Herdrのペインとエージェントの間に別のマルチプレクサを挟むと、Herdrからは `tmux` などの前面プロセスしか見えず、エージェントを認識できない**。シェルが「`TMUX` 未設定なら自動でtmuxに入る」設定だと、Herdrのペイン内で意図せず入れ子になり、表示のちらつきや縮小も起きる。公式は、その場合は起動条件に `HERDR_ENV` のチェックを足し、Herdrのペインではtmuxに入らないようにする、と案内している。

→ **「常に併用」ではなく「必要なときだけ、外側の環境として」が基本**。

---

## prefixがかぶる問題（同時に入れ子で使う場合だけ）

**どちらか一方しか使わないなら、prefixを変える必要はない。** tmuxとHerdrは既定prefixが同じ `ctrl+b` だが、これは**両方を同時に（特に入れ子で）使うときだけ**衝突する。片方ずつ使う分には、覚えるキーも1セットで済む。

- **tmuxとHerdrを同時に使う場合**、既定prefixが同じ `ctrl+b` で衝突するため、どちらかを変更しないと操作が破綻する。
- 自分は**一度prefixを被らないように分けていた**が、**同時に開くタイミングが今のところない**と気づいたため、今は**tmux・Herdrとも `ctrl+b` に戻して**いる。
- WezTerm側にもleader key（例: `ctrl+a`）を設定できるため、3層を**同時に**重ねるなら**「WezTerm → tmux → Herdr」すべてでキーが衝突しうる**。トータルでキーマップを設計する必要がある。
- Herdrはprefixを使わない **prefix-free**（`ctrl+alt+…` 系の直接コード）も選べるが、OSや外側のターミナルが先に取ってしまうキーもあるため、公式は「思いつきで決めず、検証済みの構成を使う」ことを勧めている。

---

## 自分の現在のすみ分け（Windows作業時）

1. **WezTermを開く**（WSLを起動する入口）
2. **画面分割はWezTermで行う**
3. **エージェントを並行で動かす作業はHerdrに寄せる**
4. **必要なときだけtmuxを開く**（既存のtmux環境、慣れた操作、外側での永続化など）

WezTermが「見た目の器」、Herdrが「エージェントの作業台」、tmuxが「枯れた保険」というイメージ。

---

## なぜHerdrに寄せたいか

- **見た目が好み**。マウスでペイン・タブ・状態を直感的に扱える。
- **エージェント状態が見える**＝複数のエージェントを並行で走らせるAI時代のワークフローに合う。
- tmuxの資産（prefix操作、PTYの永続化、detach/attach、SSH越しの利用）を引き継ぎつつ、その上に「エージェント認識」を上乗せしている。

---

## tmuxとのこれから

完全移行というより **併用** が現実的だと考えている。tmuxは枯れた安定性と蓄積した知見があり、Herdrはtmuxの内側でも動くため、共存は自然である。新しいエージェント作業はHerdr、既存の環境や保険的な用途はtmux、というすみ分けを当面続ける。

---

## 未整理・TODO

- [ ] WezTermのLua設定をどこまで書くか（leader key、分割キー、WSLドメイン起動）
- [ ] WezTerm / tmux / Herdr のキーマップを一枚にまとめる（**併用する場合のみ**、衝突の可視化）
- [ ] 画面分割をWezTermのネイティブとHerdrのペインのどちらに寄せるか決める
- [ ] HerdrをWSLで常駐させる運用（server起動、`herdr --remote` でのattach）

---

## 関連ノート

- [[herdr-multi-agent-workflow|Herdrによるマルチエージェント並行作業環境]]
- [[ide-agent-free-tier-rotation|IDEとエージェントの無料枠ローテーション運用術]]
- [[obsidian-claudian-local-ai-agents|Obsidianプラグイン「Claudian」とローカルAIエージェント]]

---

## 参考資料

- [Herdr: Compare Herdr vs tmux, Zellij, cmux, Warp & agent managers](https://herdr.dev/compare/)（確認日: 2026-10-16、追記: 2026-10-17）
- [Herdr Docs: Persistence and remote access（detachでペインが動き続ける）](https://herdr.dev/docs/persistence-remote/)（確認日: 2026-10-17）
- [Herdr Docs: Session state and restore（detach / サーバ再起動の違い）](https://herdr.dev/docs/session-state/)（確認日: 2026-10-17）
- [Herdr Documentation: llms-full（Herdrがtmuxの外側環境で動く場合と `HERDR_ENV` の注意）](https://herdr.dev/llms-full.txt)（確認日: 2026-10-17）
- [Herdr Documentation: Keyboard（prefixの考え方）](https://herdr.dev/docs/preview/keyboard/)（確認日: 2026-10-16）
- [Flavio Copes: Herdr vs tmux vs Zellij（同時併用の位置づけ）](https://flaviocopes.com/herdr-vs-tmux-zellij/)（確認日: 2026-10-17）
- [Moshi: Herdr vs tmux: Which Multiplexer for Coding Agents?（両方同時利用の妥当性）](https://getmoshi.app/guides/tmux-or-herdr)（確認日: 2026-10-17）
- [GitHub: herdrdev/herdr（agent-guide.md）](https://github.com/herdrdev/herdr/blob/master/distribution/agent-guide.md)（確認日: 2026-10-16）
- [WezTerm: Multiplexing](https://wezterm.org/multiplexing.html)（確認日: 2026-10-16）
- [WezTerm: Key Binding（Leader Key）](https://wezterm.org/config/keys.html)（確認日: 2026-10-16）
- [WezTerm: Default Key Assignments](https://wezterm.org/config/default-keys.html)（確認日: 2026-10-16）
