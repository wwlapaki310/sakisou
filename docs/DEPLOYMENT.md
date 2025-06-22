# 咲想（sakisou）デプロイガイド

## デプロイ概要

咲想アプリケーションは以下のコンポーネントで構成されており、それぞれ Firebase/Google Cloud 上にデプロイされます：

- **Flutter Web**: Firebase Hosting
- **Functions**: Firebase Functions (Node.js 18)
- **Database**: Firestore
- **Storage**: Firebase Storage
- **AI Services**: Vertex AI (Gemini + Image Generation)

## 前提条件

- Firebase CLI がインストール済み
- Google Cloud CLI がインストール済み
- 適切な権限を持つ Google Cloud プロジェクト
- [SETUP.md](./SETUP.md) の手順が完了済み

## デプロイ手順

### 1. 本番環境の準備

#### Google Cloud プロジェクトの設定

```bash
# 本番プロジェクトに切り替え
gcloud config set project sakisou-prod

# 必要なAPIを有効化
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
```

#### Firebase プロジェクトの設定

```bash
# 本番プロジェクトを追加
firebase use --add
# プロジェクトエイリアス: production
# プロジェクトID: sakisou-prod

# 本番環境に切り替え
firebase use production
```

### 2. 環境設定の更新

#### 本番環境変数の設定

```bash
# Functions の環境変数を設定
firebase functions:config:set \
  gemini.model_name="gemini-1.5-flash" \
  vertex.location="us-central1" \
  vertex.image_model="imagen-3.0-generate-001" \
  app.environment="production"

# 設定を確認
firebase functions:config:get
```

#### Firestore セキュリティルールの更新

```bash
# 本番用のセキュリティルールをデプロイ
firebase deploy --only firestore:rules
```

### 3. Flutter Web のビルド

```bash
cd web

# 依存関係のインストール
flutter pub get

# 本番用ビルド
flutter build web --release --web-renderer html

# ビルド結果を確認
ls -la build/web/
```

### 4. Firebase Functions のビルド

```bash
cd functions

# 依存関係のインストール
npm ci --only=production

# TypeScript のビルド
npm run build

# ビルド結果を確認
ls -la lib/
```

### 5. 全体デプロイ

#### 一括デプロイ

```bash
# ルートディレクトリで実行
firebase deploy --project production
```

#### 段階的デプロイ（推奨）

```bash
# 1. データベースルールとインデックス
firebase deploy --only firestore:rules,firestore:indexes --project production

# 2. ストレージルール
firebase deploy --only storage:rules --project production

# 3. Functions
firebase deploy --only functions --project production

# 4. Hosting (最後に実行)
firebase deploy --only hosting --project production
```

### 6. デプロイ後の確認

```bash
# アプリケーションのヘルスチェック
curl https://sakisou-prod.web.app/

# API エンドポイントの確認
curl https://us-central1-sakisou-prod.cloudfunctions.net/api/health

# Functions のステータス確認
firebase functions:log --project production
```

## CI/CD パイプライン

### GitHub Actions の設定

`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: functions/package-lock.json
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.0'
          channel: 'stable'
      
      - name: Install Functions dependencies
        run: |
          cd functions
          npm ci
      
      - name: Install Flutter dependencies
        run: |
          cd web
          flutter pub get
      
      - name: Run Functions tests
        run: |
          cd functions
          npm test
      
      - name: Run Flutter tests
        run: |
          cd web
          flutter test
      
      - name: Build Functions
        run: |
          cd functions
          npm run build
      
      - name: Build Flutter Web
        run: |
          cd web
          flutter build web --release
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.0'
      
      - name: Install dependencies and build
        run: |
          cd functions && npm ci && npm run build
          cd ../web && flutter pub get && flutter build web --release
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_SAKISOU_PROD }}'
          projectId: sakisou-prod
```

### パフォーマンスメトリクス

#### 監視すべき指標

1. **Firebase Functions**
   - 実行時間
   - メモリ使用量
   - エラー率
   - 同時実行数

2. **Firebase Hosting**
   - ページロード時間
   - CDN ヒット率
   - 帯域幅使用量

3. **Firestore**
   - 読み取り/書き込み操作数
   - インデックス使用状況
   - クエリ実行時間

4. **Vertex AI**
   - API リクエスト数
   - レスポンス時間
   - エラー率
   - 使用量とコスト

### コスト最適化

#### Firebase Functions
```javascript
// メモリとタイムアウトの最適化
exports.api = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 60,  // 必要最小限に設定
    memory: '512MB',     // 実際の使用量に合わせて調整
    maxInstances: 100    // 同時実行数制限
  })
  .https.onRequest(app);
```

#### Firestore
```bash
# 不要なインデックスの削除
firebase firestore:indexes:list --project production
firebase firestore:indexes:delete INDEX_ID --project production

# 複合インデックスの最適化
# firestore.indexes.json で必要なもののみ定義
```

#### Vertex AI
```typescript
// バッチ処理でAPIコール数を削減
const batchRequests = chunks.map(chunk => 
  processChunk(chunk)
);
const results = await Promise.all(batchRequests);
```

## 災害復旧計画

### バックアップ戦略

1. **自動バックアップ**
   ```bash
   # Firestore の自動エクスポート設定
   gcloud firestore operations list --project sakisou-prod
   ```

2. **手動バックアップ**
   ```bash
   # 週次バックアップ
   gcloud firestore export gs://sakisou-prod-backup/weekly/$(date +%Y%m%d) --project sakisou-prod
   ```

3. **コードのバックアップ**
   - GitHub リポジトリでのソースコード管理
   - リリースタグによるバージョン管理

### 復旧手順

1. **データベース復旧**
   ```bash
   # Firestore の復旧
   gcloud firestore import gs://sakisou-prod-backup/20250622 --project sakisou-prod
   ```

2. **アプリケーション復旧**
   ```bash
   # 前のバージョンにロールバック
   git checkout v1.0.0
   firebase deploy --project production
   ```

## 運用監視

### アラート設定

```yaml
# monitoring-policy.yaml
displayName: "Functions Error Rate"
combiner: OR
conditions:
  - displayName: "Error rate > 5%"
    conditionThreshold:
      filter: 'resource.type="cloud_function"'
      comparison: COMPARISON_GT
      thresholdValue: 0.05
```

### ログ管理

```bash
# 構造化ログの確認
gcloud logging read 'resource.type="cloud_function"' --project sakisou-prod

# エラーログのフィルタ
gcloud logging read 'severity>=ERROR' --project sakisou-prod
```

### SLA 定義

- **可用性**: 99.9% (月間ダウンタイム 43分以下)
- **レスポンス時間**: API の 95% が 2秒以内
- **エラー率**: 全リクエストの 1% 以下

---

本番運用での問題や改善提案がありましたら、[GitHub Issues](https://github.com/wwlapaki310/sakisou/issues) にてお知らせください。