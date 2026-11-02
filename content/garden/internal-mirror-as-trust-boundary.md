---
created: 2026-11-02
updated: 2026-11-02
tags:
  - サプライチェーン
  - ミラー
  - npm
  - PyPI
  - GitHub
  - AIエージェント
type: guide
confidence: medium
status: published
title: 社内ミラーは「便利」より先に「供給網の境界」として設計する
aliases:
  - 社内ミラーとサプライチェーン
  - AIエージェントのパッケージ供給網
  - 内部レジストリ
description: npm/PyPI/Git/コンテナ/モデル/MCPを社内ミラーに集約するとき、ただのキャッシュで終わらせず、許可・検閲・固定・監査の境界にするための設計を整理する。
---

## 概要

AIエージェントに `npm install` や `pip install` を許すと、開発は速くなる。だが同時に、**エージェントは任意のコードを実行する経路** を手に入れる。悪性パッケージ、typosquatting、依存関係の乗っ取り、インストール時スクリプト。どれも昔からある攻撃だが、エージェントは人間より速く、より無頓着にインストールする。

社内ミラーは、この問題に対する有効な対策になる。ただし、**上流を自動プロキシするだけのミラーは、供給網の境界にならない**。悪性パッケージはそのまま通り、READMEのプロンプトインジェクションもそのまま入る。

ミラーを「便利なキャッシュ」ではなく「信頼の境界」として設計する必要がある。

---

## 何をミラーするか

| 対象 | 例 | ミラーの役割 |
| :--- | :--- | :--- |
| npm | Verdaccio | プライベートレジストリ、上流プロキシ、キャッシュ |
| Python | devpi | PyPIミラー、プライベートインデックス、ステージング |
| Git | Gitea / Forgejo / GitHub Enterprise | リポジトリミラー、権限分離、監査 |
| コンテナ | Harbor / registry mirror | イメージの固定、スキャン、署名検証 |
| モデル | 社内モデルレジストリ | 重みのハッシュ、`safetensors`、ライセンス管理 |
| MCP | 社内MCPカタログ | サーバーの許可リスト、バージョン固定、設定レビュー |

個人なら、Verdaccioとdevpiをローカルに立てるだけでも効果がある。チームなら、ArtifactoryやNexusのような統合リポジトリマネージャを使う選択肢もある。

---

## 境界としての設計原則

### 1. エージェントから上流に直接出さない

エージェントのコンテナやWSLから、`registry.npmjs.org` や `pypi.org` に直接出せないようにする。egress制御で、社内ミラーだけを許可する。ミラーが落ちたら開発が止まるが、それは **意図した単一障害点** である。統制のない経路を残すほうが危険だ。

### 2. 上流の取得は別ジョブにする

ミラーが上流を自動プロキシする設定は便利だが、悪性パッケージも自動で入る。理想的には、上流からの取得を別のジョブに分け、**新規パッケージは隔離（quarantine）** してから公開する。既知のパッケージでも、バージョン更新はレビュー対象にする。

### 3. バージョンとハッシュを固定する

- `package-lock.json` / `pnpm-lock.yaml` / `poetry.lock` / `uv.lock` を使う
- バージョン範囲ではなく、完全なバージョンとハッシュで固定する
- コンテナは `latest` ではなくダイジェストで固定する
- GitHub Actionsはタグではなく完全なコミットSHAに固定する。GitHubも、lockfileまたはSHA固定を推奨している

### 4. 署名とprovenanceを確認する

- npmはTrusted PublishingでOIDCを使い、long-lived tokenをなくせる。GitHub Actions / GitLab / CircleCIのクラウドランナーが対象で、provenance attestationも自動生成される
- PyPIもTrusted Publishingで、OIDCから15分有効の短命トークンを発行する
- コンテナはSigstore/cosignなどで署名を検証する
- モデルは配布元、ハッシュ、ライセンス、`safetensors` かを確認する

provenanceは「誰が作ったか」を保証するが、「安全か」を保証しない。悪性コードでも、正しいprovenanceを持つことはある。**出所の確認と、内容のレビューは別** だ。

### 5. SBOMと脆弱性スキャン

依存関係のSBOMを生成し、既知の脆弱性を継続的にスキャンする。エージェントに「脆弱性を直して」と頼む前に、どの依存が危険かを可視化する。

### 6. 新規パッケージの例外プロセス

開発が止まらないように、新規パッケージの追加申請にはSLAを決める。自動で全部拒否すると、現場はミラーを迂回する。**速い例外経路** が、境界を守るためには必要だ（[[shadow-ai-usable-policy|守れないルールは守られない]]）。

---

## ミラーで解決しないこと

- **READMEやドキュメント経由のプロンプトインジェクション**: パッケージの中身が安全でも、説明文に命令を埋め込める
- **インストール後の挙動**: インストール時に安全でも、実行時に外部へ送信するかもしれない
- **サプライチェーン全体**: ミラーは自社に取り込む経路を守るが、上流の開発者アカウント乗っ取りまでは防げない
- **モデルの挙動**: 重みが改ざんされていないことは、出力が安全であることを意味しない

ミラーは4層目の対策であり、2層目（外部入力）や3層目（実行権限）は別に設計する。

---

## 個人向けの最小構成

1. Verdaccioをローカルに立て、`.npmrc` の registry をそこに向ける
2. devpiを立て、`pip.conf` の index-url をそこに向ける
3. Giteaのミラー機能で、外部リポジトリを定期的に取り込む
4. コンテナは公式イメージをダイジェスト固定で使う
5. モデルは `safetensors` とハッシュを確認してから使う
6. MCPサーバーは、自分で設定を読んだものだけ入れる

個人の場合、全部を自動化するより、**「直接上流を叩かない」「バージョンを固定する」「新規は一回止まる」** の3つを守るだけでも違う。

---

## まとめ

社内ミラーは、AIエージェント時代の供給網対策として有効だ。だが、それは **「上流をキャッシュする装置」ではなく「何を信頼するかを決める境界」** である。自動プロキシのままでは、悪性パッケージは素通りする。取得の分離、隔離、固定、署名、SBOM、例外プロセスまで含めて、初めて境界になる。

---

## 関連ノート

- [[gitea-and-redmine-for-personal-use|GiteaとRedmineを個人で使う]]
- [[oss-agent-harness-security|OSSエージェントハーネスのセキュリティ]]
- [[mcp-tool-trust|MCPは「接続」ではなく「ツールの信頼」を管理する仕組みである]]
- [[agent-permission-matrix|データ分類×操作リスクで「禁止」を「段階的許可」に分解する]]
- [[agent-risk-four-layers|エージェントのリスクは4層に分かれる]]

---

## 参考資料

- [Verdaccio: What is Verdaccio?](https://verdaccio.org/docs/what-is-verdaccio)（確認日: 2026-11-02）
- [PyPI: Publishing to PyPI with a Trusted Publisher](https://docs.pypi.org/trusted-publishers/)（確認日: 2026-11-02）
- [npm: Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)（確認日: 2026-11-02）
- [GitHub: Secure use reference for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)（確認日: 2026-11-02）
- [OWASP: NPM Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)（確認日: 2026-11-02）
