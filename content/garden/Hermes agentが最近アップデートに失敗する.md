---
created: 2026-10-01
updated: 2026-10-01
tags:
  - digital-garden
  - hermes-agent
  - troubleshooting
  - git
  - partial-clone
type: log
confidence: high
status: evergreen
title: Hermes agentが最近アップデートに失敗する
aliases:
  - Hermes Agentアップデート失敗ループの解決
description: "Windows環境でHermes Agentのデスクトップアプリが自動アップデート時にgit fetchで失敗し、ループしていた問題の原因と解決手順。partial clone使用時のgit 2.53.0バグとcp932ロケール問題が重なった。"
---

Windows環境でHermes Agentのデスクトップアプリ起動時に毎回自動アップデートが走り、以下のエラーで失敗してループしていた。

```
BUG: builtin/pack-objects.c:4842: should_include_obj should only be called on existing objects
UnicodeDecodeError: 'cp932' codec can't decode byte 0x94 in position 98: illegal multibyte sequence
```

ログ（`C:\Users\user\AppData\Local\hermes\logs\desktop-update-handoff.log`）を見ると 2026-09-27〜2026-10-01 にかけて毎日複数回同じエラーで失敗していた。

## 原因

1. **Partial clone（`tree:0` フィルタ）を使用している** — `git config remote.origin.promisor=true`、`partialclonefilter=tree:0` 設定済み
2. **git 2.53.0.windows.3 の既知バグ** — partial clone + fetch で pack-objects がクラッシュする
3. **Windows日本語環境のロケール問題** — git出力の cp932 デコード失敗

## 解決手順

### 1. 手動で `git fetch` を実行して状況確認

```bash
cd "C:/Users/user/AppData/Local/hermes/hermes-agent"
git fetch origin main
```

→ このときは成功した（`2f14d5e6e4..e8c97320ac` が取得済み）

### 2. Hermes update を再実行

```bash
cd "C:/Users/user/AppData/Local/hermes/hermes-agent"
python -m hermes_cli.main update --yes --gateway --branch main --keep-stash
```

→ バックグラウンド実行で完了（所要時間数分）

## 根本対策（今後ループしないために）

### Option A: git バージョンアップ待ち
git 2.53.1以降で修正される見込み。Windows版のリリースを待つ。

### Option B: partial clone を無効化（推奨）
ローカルディスク容量に余裕があるなら full clone に戻す：

```bash
cd "C:/Users/user/AppData/Local/hermes/hermes-agent"
git config --unset remote.origin.partialclonefilter
git config --unset remote.origin.promisor
git fetch --unshallow
```

### Option C: 環境変数でロケール固定
`.bashrc` または Windows 環境変数に追加：
```
GIT_TERMINAL_PROMPT=0
LC_ALL=C.UTF-8
```

## 確認済み事項

- ✅ 更新完了（v0.21.5+ → 最新 main `e8c97320ac`）
- ✅ Gateway 再起動成功
- ✅ Desktop 再起動成功
- ✅ スキル同期完了
- ✅ 設定フォーマット更新（v45→v46）

## 教訓

- **自動アップデートのログは `desktop-update-handoff.log` にある**
- **partial clone は git バージョン依存のバグを踏みやすい**
- **手動 fetch で一度成功させると、以降の Hermes update が通ることがある**
- **Windows 日本語環境では git 出力のエンコーディング問題が頻発する**