# 🌸 咲想（sakisou） - 想いを花に変換するWebアプリ

[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com)
[![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## ⚠️ 重要な注意事項
**現在のアプリは `public/` ディレクトリにあります。`web/` ディレクトリは古いFlutter版で無視してください。**

## 💡 コンセプト

**咲想（sakisou）**──「咲」は花ひらくこと、「想」は心に抱く想い。  
**想いを咲かせる、花と共に。**

あなたの気持ちを AI が読み取り、それにふさわしい花言葉を持つ花を提案し、美しい花束の画像を生成するWebアプリです。

**⚡ シンプル構成版** - 確実に動作する美しいWebページ

## 🎯 主な機能

- 📝 **感情抽出機能** : 自然文からユーザーの気持ちを分析（Gemini API）
- 🌸 **花言葉マッチング** : 抽出した感情に最適な花言葉を持つ花を推薦
- 🎨 **花束画像生成** : AI による美しい花束のビジュアル作成（Vertex AI）
- 📱 **レスポンシブデザイン** : スマートフォンからデスクトップまで対応
- ✨ **美しいアニメーション** : 花びらが舞うエフェクトと日本の美意識

## 🏗️ システム構成（現在版）

```
📁 sakisou/
├── 🌐 public/           # ← 【メインアプリ】HTML/CSS/JS
│   ├── index.html       # メインページ
│   ├── style.css        # スタイリング
│   └── app.js          # メインロジック
├── ⚙️ functions/        # Firebase Functions（AI機能）
│   └── src/
│       └── index.ts     # API エンドポイント
├── 🔧 firebase.json     # Firebase設定
├── 🌍 .env             # 環境変数
└── ❌ web/             # ← 【無視】古いFlutter版
```

## 🚀 クイックスタート

### 1. リポジトリをクローン
```bash
git clone https://github.com/wwlapaki310/sakisou.git
cd sakisou
```

### 2. Firebase Emulator を起動
```bash
# Firebase CLI をインストール（まだの場合）
npm install -g firebase-tools

# Emulator を起動
firebase emulators:start
```

### 3. ブラウザでアクセス
```
http://localhost:5000
```

**🎉 これだけで動作します！**

## 💻 開発詳細

### Firebase Functions のビルド
```bash
cd functions
npm install
npm run build
```

### ローカル開発での確認
1. **Firebase Emulator Suite UI**: http://localhost:4000
2. **メインアプリ**: http://localhost:5000 ← **`public/`が表示されます**
3. **Functions API**: http://localhost:5001/sakisou-dev/us-central1/api

### API エンドポイント
- `GET /health` - ヘルスチェック
- `POST /api/analyze-emotion` - 感情分析
- `POST /api/generate-bouquet` - 花束画像生成

## 🎨 技術スタック

| 機能                 | 使用技術                                           |
|----------------------|---------------------------------------------------|
| フロントエンド        | HTML5 + CSS3 + Vanilla JavaScript                |
| バックエンド         | Firebase Functions (TypeScript)                  |
| 感情抽出・花推薦      | Gemini API（自然文解析＋花言葉マッチング）        |
| 花束画像生成          | Vertex AI Image Generation                        |
| ホスティング         | Firebase Hosting                                  |
| データベース         | Firebase Firestore                               |

## 🌸 特徴的なUI/UX

### デザインコンセプト
- **日本の美意識** を現代的に表現
- **花びらが舞い散る** 背景アニメーション
- **感情に応じた色彩変化**
- **レスポンシブデザイン** でどのデバイスでも美しく

### カラーパレット
- **Primary** : `#E8B4CB` (桜色)
- **Secondary** : `#F7F3E9` (クリーム色)
- **Accent** : `#6B8E5A` (葉緑色)
- **Text** : `#2C2C2C` (墨色)

## 🛠️ トラブルシューティング

### Firebase Emulator が起動しない
```bash
# Firebase にログイン
firebase login

# プロジェクトを設定
firebase use --add

# 再度起動
firebase emulators:start
```

### API が応答しない
1. Firebase Emulator が起動しているか確認
2. ブラウザの開発者ツールでエラーを確認
3. `http://localhost:5001` でFunctions APIが動作しているか確認

### .env が読み込まれない
- `.env` ファイルがルートディレクトリにあることを確認
- Firebase Functions は `.env` を自動で読み込みます

## 🏆 ハッカソン対応

### Google Cloud 必須サービス
- ✅ **Firebase Functions** : サーバーレスバックエンド
- ✅ **Firebase Hosting** : Webアプリホスティング
- ✅ **Gemini API** : 感情抽出・花言葉マッチング
- ✅ **Vertex AI Image Generation** : 花束画像生成

### 受賞狙い
- 🥇 **最優秀賞** : 革新的なAI体験「想いを咲かせる」
- 🏅 **Firebase賞** : Firebase エコシステムの活用
- 🏅 **Moonshot賞** : 花言葉×AI という新発想

## 📋 デプロイ（本番環境）

### Firebase Hosting にデプロイ
```bash
# ビルド（必要に応じて）
cd functions && npm run build && cd ..

# デプロイ
firebase deploy
```

### 環境変数の設定（本番）
```bash
# Firebase Functions 環境変数を設定
firebase functions:config:set gemini.api_key="YOUR_API_KEY"
firebase functions:config:set vertex.project_id="YOUR_PROJECT_ID"
```

## 🎬 デモ・プレゼン用

### 3分デモシナリオ
1. **導入** (30秒) - コンセプトと課題
2. **実演** (90秒) - 実際の変換体験
3. **技術** (60秒) - AI技術とアーキテクチャ

### サンプル入力例
```
感謝系：
「長い間支えてくれて、本当にありがとう」

応援系：
「頑張って！あなたなら必ずできる」

謝罪系：
「ごめんなさい、心から反省しています」
```

## 🤝 開発者情報

**Author**: [@wwlapaki310](https://github.com/wwlapaki310)  
**Project**: AI Agent Hackathon with Google Cloud  
**License**: MIT License

## 🌟 今後の展望

- 🌍 **グローバル展開** : 多言語対応
- 🎯 **パーソナライゼーション** : ユーザー学習機能
- 🛍️ **EC連携** : 実際の花ギフト購入
- 🎨 **AR対応** : 花束のAR表示

## 📂 プロジェクト構成

### 現在のmainブランチ（推奨）
- **`public/`** : HTML/CSS/JavaScriptベースのシンプル構成 ← **使用中**

### バックアップブランチ
- **`flutter-backup`** : Flutter版のバックアップ
- **`web/`** : 削除予定の古いFlutter関連ファイル ← **無視してください**

---

**🌸 想いを咲かせる。花と共に、心をつなぐ。**

Made with ❤️ for AI Agent Hackathon with Google Cloud
