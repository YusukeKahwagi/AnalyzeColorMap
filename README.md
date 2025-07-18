# 🎨 analyzeColorMap

画像の色を解析・可視化するためのツールです。
画像全体の色相・彩度・明度をグラフで表示します。自作イラストや写真の色彩調整などにご活用ください。
GitHub Pages によって公開されており、ローカル環境に依存せず、ブラウザ上で手軽に利用できます。

🔗 **公開ページ**  
👉 https://yusukekahwagi.github.io/AnalyzeColorMap/

---

## 📌 概要

`analyzeColorMap` は、画像をアップロードして、色情報（主に HSV: 色相・彩度・明度）を抽出・可視化するためのWebアプリケーションです。

主な機能：

- 画像ファイル（例：JPEG, PNG）の読み込み
- 画像内のピクセルごとの色情報（Hue, Saturation, Value）を抽出
- 2次元グラフ上に彩度×明度の分布を可視化
- 三角形や円状のグラフによる色分布の直感的理解

---

## 🛠 使用技術

| 技術         | 内容                    |
|--------------|-------------------------|
| HTML/CSS     | UI構築                  |
| JavaScript   | 画像読み込み・色情報処理・描画処理 |
| Canvas API   | ピクセル単位の色情報取得、および可視化 |
| GitHub Pages | 静的サイトホスティング   |

---

## 📷 使い方

1. ページを開く：[https://gekilyn.github.io/analyzeColorMap/](https://gekilyn.github.io/analyzeColorMap/)
2. 画面上の「画像アップロード」ボタンから画像ファイルを選択
3. 選択した画像の色情報が自動的に解析され、グラフとして表示されます

---
