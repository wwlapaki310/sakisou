# 🤝 Contributing to 咲想（sakisou）

咲想（sakisou）プロジェクトへの貢献に興味を持っていただき、ありがとうございます！

## 📋 開発の流れ

### 1. Issue ベース開発
- すべての作業は [Issues](https://github.com/wwlapaki310/sakisou/issues) から始まります
- 新機能や修正は必ず Issue を作成してから開始してください
- Issue には適切なラベルを付けてください

### 2. ブランチ戦略
```bash
# メインブランチ
main                    # 本番環境用、安定版

# 開発ブランチ
feature/issue-{number}  # 新機能開発
bugfix/issue-{number}   # バグ修正
hotfix/issue-{number}   # 緊急修正
```

### 3. 開発手順
1. **Issue の確認**: 開発する Issue を選択・アサイン
2. **ブランチ作成**: `feature/issue-{number}` 形式でブランチを作成
3. **開発**: コードの実装とテスト
4. **プルリクエスト**: `main` ブランチに向けて PR を作成
5. **レビュー**: コードレビューとテスト確認
6. **マージ**: 承認後に `main` ブランチにマージ

## 🛠️ 開発環境のセットアップ

### 前提条件
- Node.js 18.x 以上
- Flutter 3.24.x 以上
- Google Cloud CLI
- Docker & Docker Compose (推奨)

### セットアップ手順
```bash
# リポジトリのクローン
git clone https://github.com/wwlapaki310/sakisou.git
cd sakisou

# セットアップスクリプトの実行
chmod +x scripts/setup.sh
./scripts/setup.sh

# 環境変数の設定
# backend/.env と frontend/.env を適切に設定

# 開発環境の起動
docker-compose up -d
# または
firebase emulators:start
```

## 📝 コーディング規約

### TypeScript/JavaScript (Backend)
```javascript
// ESLint + Prettier を使用
// コメントは日本語でOK

/**
 * 感情分析を行う関数
 * @param message - 分析対象のメッセージ
 * @returns 分析結果
 */
const analyzeEmotion = async (message: string): Promise<EmotionResult> => {
  // 実装
};

// 定数は UPPER_CASE
const API_ENDPOINTS = {
  GEMINI: '/api/gemini',
  VERTEX_AI: '/api/vertex-ai'
};

// 型定義は interface を優先
interface FlowerRecommendation {
  name: string;
  meaning: string[];
  matchScore: number;
}
```

### Dart (Frontend)
```dart
// Dart/Flutter の標準規約に従う
// コメントは日本語でOK

/// 花の推薦結果を表示するウィジェット
class FlowerRecommendationCard extends StatelessWidget {
  const FlowerRecommendationCard({
    super.key,
    required this.flower,
    this.onTap,
  });

  final Flower flower;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      // 実装
    );
  }
}

// 定数はlowerCamelCase
const String defaultFlowerImage = 'assets/images/default_flower.png';

// プライベートメソッドは_prefix
void _handleFlowerSelection(Flower flower) {
  // 実装
}
```

## 🧪 テスト

### Backend Tests
```bash
cd backend
npm test                # 全テスト実行
npm run test:watch      # ウォッチモード
npm run test:coverage   # カバレッジ付き
```

### Frontend Tests
```bash
cd frontend
flutter test                    # ユニットテスト
flutter test integration_test/  # 統合テスト
flutter test --coverage         # カバレッジ付き
```

### テスト作成指針
- 新機能には必ずテストを作成
- カバレッジは80%以上を目指す
- エッジケースとエラー処理のテストを忘れずに

## 🔄 プルリクエスト

### PR テンプレート
```markdown
## 概要
- Issue #XX に対応
- 感情分析機能の実装

## 変更内容
- [ ] Gemini API との連携機能追加
- [ ] エラーハンドリングの実装
- [ ] ユニットテストの追加

## テスト
- [ ] ユニットテスト: ✅ 全て通過
- [ ] 統合テスト: ✅ 全て通過
- [ ] 手動テスト: ✅ 正常動作確認

## チェックリスト
- [ ] コードレビューを受けた
- [ ] テストが全て通過している
- [ ] ドキュメントを更新した
- [ ] 破壊的変更がないか確認した
```

### PR 作成時の注意
- タイトルは簡潔で分かりやすく
- 関連 Issue を必ず記載
- 変更内容を詳細に説明
- スクリーンショットや動画を添付（UI変更時）

## 🐛 バグ報告

### Issue テンプレート
```markdown
## バグの概要
花束生成時にエラーが発生する

## 再現手順
1. ホーム画面で「ありがとう」と入力
2. 分析ボタンをタップ
3. 花の推薦画面で画像生成ボタンをタップ
4. エラーダイアログが表示される

## 期待される動作
花束画像が正常に生成される

## 実際の動作
エラーメッセージ: "Image generation failed"

## 環境
- OS: iOS 17.0
- アプリバージョン: 1.0.0
- デバイス: iPhone 14

## 追加情報
- エラーログ
- スクリーンショット
```

---

## 🙏 最後に

咲想（sakisou）は「花言葉でつながる、新しいコミュニケーション」を目指すプロジェクトです。

皆さんの創造性とプログラミングスキルで、素晴らしいアプリケーションを一緒に作り上げましょう！

**一緒に最優秀賞を目指しましょう！** 🏆✨

---

*Happy Coding! 🌸*