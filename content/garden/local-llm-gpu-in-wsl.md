---
created: 2026-10-17
updated: 2026-10-17
tags:
  - WSL
  - WSL3
  - ローカルLLM
  - GPU
  - CUDA
  - Ollama
  - パフォーマンス
type: idea
confidence: medium
status: draft
title: WSLでローカルLLMにGPUを使うメリット・デメリット
aliases:
  - WSLでローカルLLM
  - WSLのGPUパススルー
  - WSL3のGPUアクセス
description: WSLでローカルLLMを動かすときにGPUを使う利点と落とし穴を整理する。CUDAパススルーの仕組み、WSL3のGPU/NPU準仮想化、メモリ返却問題、/mnt/cの遅さ、ネイティブWindowsとの使い分けまで。
---

## 概要

Windows上でローカルLLM（Ollama、llama.cpp、vLLMなど）をGPUで動かすとき、**WSLを使うべきか、ネイティブWindowsを使うべきか**は一概に決まらない。ここでは [[what-is-wsl3|WSL3]] の変化も踏まえて、メリットとデメリットを整理する。

---

## メリット

### 1. GPUパススルーはWindowsドライバ任せで自動

WSL2のGPUパススルーはシンプルである。**Windows側にNVIDIAドライバを1つ入れれば、それがWSL内に `libcuda.so` として「スタブ」され、Linux側からGPUが見える**。Linux用のGPUドライバをWSL内に入れる必要はない。

注意点として、CUDA Toolkitを入れるときは `cuda-toolkit-13-x` を選び、**`cuda` や `cuda-drivers` のメタパッケージは入れない**。これらはLinux用ドライバを入れてWSLのGPUスタブを壊す。

### 2. 推論はネイティブとほぼ同等

LLM推論は長時間のGPUカーネルで、WSLの仮想化オーバーヘッド（カーネル起動レイテンシ）が効きにくい。GPUがボトルネックになるため、**GPU推論はネイティブの90〜100%** 程度に収まるという報告が多い。

### 3. Linuxツールがそのまま使える（これが本質的な価値）

Windowsでは動かない／対応が弱いツールが使えるのが最大の利点。

- **vLLM**: 公式にはWindows非対応（Linux前提）。Linux環境が必要
- **Docker Compose**（Ollama + Open WebUI など）
- Python・CUDA・Linuxツールチェーン
- 本番Linuxサーバーと近い環境で検証できる

### 4. WSL3のGPU/NPU準仮想化

WSL3は準仮想化インターフェースで **GPU/NPUへほぼネイティブに近い速度**でアクセスさせる設計。WSL2で問題だった「仮想化の境界」を減らす狙い。対象はまずCopilot+ PC（Snapdragon X Elite、Intel Meteor Lake / Lunar Lake）で、**AMDは今後**。

これにより、これまでWSL内ではCPUに落ちていたNPU活用（Ollamaなどから）の道が開く。[[what-are-wsl-containers|WSLコンテナ]] では**非特権ユーザーでもコンテナ内からGPUへアクセス**できる。

---

## デメリット・落とし穴

### 1. メモリが返らない（WSL2の持病）

WSL2はLinux VMの分だけRAMを確保し、**使い終わってもWindowsへ返しにくい**。`.wslconfig` の `memory=` で上限を決められるが、既定は物理RAMの約50%。変更後は `wsl --shutdown` が必要。LLMはコンテキストを抱え続けるので、この問題が効きやすい。

### 2. 大きなモデルはWSL VMの上限に縛られる

VRAMそのものは `.wslconfig` の影響を受けないが、**CUDAの大きな割り当てはWSL VMのリソースに縛られる**ことがある。特にBlackwell（RTX 50系）では、WSL2内に**約16GiBの隠れCUDAコンテキスト・オーバーヘッド**があり、しかも `torch.cuda.mem_get_info()` から見えないため、`nvidia-smi` 上は空きがあるのに `cudaMalloc` がOOMになる事例が報告されている（microsoft/WSL #40401）。Ampere/Ada（RTX 30/40系）では小さい。

→ 大きいモデルのサーブは**ネイティブWindows**で行い、WSLからHTTPで叩くのが実用的。

### 3. `/mnt/c` からの読み込みが遅い

Windowsドライブ上のモデルをWSLから読むと **3〜5倍遅い**。モデル・データセット・コードはWSL内のext4に置く。

### 4. WDDM TDR によるドライバリセット

Windowsは1回のGPU操作が既定2秒を超えると「ドライバがハングした」とみなしてリセットする（TDR）。大きなモデルのロードはこれを超えることがあり、**デスクトップがクラッシュする**。`TdrDelay` をレジストリで延ばす対処がある（表示用GPUを兼ねている場合に起きやすい）。

### 5. その他の細かい罠

- **FP8がdxgkrnlで未対応**（Blackwell）。FP8量子化は逆に遅くなることがある
- **OllamaのGPU検出はブート時1回だけ**。ドライバ変更・BIOS変更・更新後に再起動しないと、**無言でCPUにフォールバック**する（`ollama ps` の `PROCESSOR` を必ず確認）
- vLLMのROCmは公式にWindows非対応。AMDで本格的に組むならLinux前提

### 6. モデルサイズでOS差が変わる

小さいモデル（3B級）ではOS差は1〜3%でほぼ無視できる。一方 **70B級ではネイティブLinuxが15〜25%有利** という測定がある。オーバーヘッドが絶対量として効いてくるため。

---

## 結論：開発はWSL、大きいモデルのサーブはネイティブWindows

- **Linuxツールチェーン・エージェント・Docker Compose** → WSL
- **大きなモデルの推論サーバ** → ネイティブWindowsにして、WSLやLANからHTTPで叩く
- 迷ったら「モデルがWSL VMに快適に収まるか」を基準にする。小〜中モデルはWSLで十分

WSL3の準仮想化がこの構図をどこまで変えるかは、実機での検証待ちである。

---

## 関連ノート

- [[what-is-wsl3|WSL3とはなにか]]
- [[what-are-wsl-containers|WSLコンテナとはなにか]]
- [[running-ai-agents-in-wsl|WSLでAIエージェント（OpenCode・Codex）を使うときの違い]]
- [[chinese-llm-security-and-onprem|中国製LLMのセキュリティとオンプレ運用]]
- [[free-llm-providers-i-use-often|最近よく使っているLLMプロバイダー（無料）]]

---

## 参考資料

- [NVIDIA Developer: CUDA on Windows Subsystem for Linux (WSL)](https://developer.nvidia.com/cuda/wsl)（確認日: 2026-10-17）
- [Microsoft Learn: Get started with GPU acceleration for ML in WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gpu-compute)（確認日: 2026-10-17）
- [InsiderLLM: WSL2 Local AI on Windows: GPU Passthrough, Fixed (2026)](https://insiderllm.com/guides/wsl2-local-ai-windows-guide/)（確認日: 2026-10-17）
- [GitHub: OnlyTerp/windows-is-fine-for-llms（WSLのメモリ境界・Blackwellオーバーヘッド、#40401参照）](https://github.com/OnlyTerp/windows-is-fine-for-llms)（確認日: 2026-10-17）
- [Reddit r/LocalLLM: Same dual-GPU box, WSL2 vs native Windows（llama.cpp計測）](https://www.reddit.com/r/LocalLLM/comments/1vvlkmy/same_dualgpu_box_wsl2_vs_native_windows_17/)（確認日: 2026-10-17）
- [TechTimes: WSL 3 at Build 2026: Near-Native GPU and NPU Passthrough](https://www.techtimes.com/articles/317598/20260602/wsl-3-build-2026-near-native-gpu-npu-passthrough-brings-local-ai-windows.htm)（確認日: 2026-10-17）
