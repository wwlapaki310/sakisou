/// Application-wide constants
class AppConstants {
  // App Info
  static const String appName = '咲想';
  static const String appNameEn = 'Sakisou';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'あなたの想いを、花にして届ける';
  
  // API
  static const String baseUrl = 'https://us-central1-sakisou-dev.cloudfunctions.net/api';
  static const String localUrl = 'http://localhost:5001/sakisou-dev/us-central1/api';
  
  // Firebase Collections
  static const String usersCollection = 'users';
  static const String emotionsCollection = 'emotions';
  static const String bouquetsCollection = 'bouquets';
  static const String flowersCollection = 'flowers';
  
  // Storage Paths
  static const String bouquetImagesPath = 'bouquets';
  static const String profileImagesPath = 'profiles';
  static const String tempImagesPath = 'temp';
  
  // Limits
  static const int maxTextLength = 1000;
  static const int maxFlowersPerBouquet = 10;
  static const int defaultPageSize = 20;
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  
  // UI
  static const double defaultPadding = 16.0;
  static const double compactPadding = 8.0;
  static const double largePadding = 24.0;
  static const double defaultBorderRadius = 12.0;
  static const double cardElevation = 2.0;
  
  // Animation Durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 300);
  static const Duration longAnimation = Duration(milliseconds: 500);
  
  // Colors (complementing theme)
  static const String primaryColorHex = '#E8B4CB';
  static const String secondaryColorHex = '#F7F3E9';
  static const String accentColorHex = '#6B8E5A';
  static const String textColorHex = '#2C2C2C';
  
  // Social
  static const String twitterUrl = 'https://twitter.com/intent/tweet';
  static const String githubUrl = 'https://github.com/wwlapaki310/sakisou';
  
  // External Links
  static const String rakutenApiUrl = 'https://app.rakuten.co.jp/services/api';
  static const String geminiApiUrl = 'https://generativelanguage.googleapis.com';
  
  // Error Messages
  static const String networkError = 'ネットワークエラーが発生しました';
  static const String unknownError = '不明なエラーが発生しました';
  static const String authError = '認証エラーが発生しました';
  
  // Feature Flags
  static const bool enableAnalytics = false;
  static const bool enableCrashlytics = false;
  static const bool enablePerformanceMonitoring = false;
  static const bool enableRemoteConfig = false;
  
  // Development
  static const bool isDebugMode = true;
  static const bool enableLogging = true;
  static const bool useMockData = false;
}

/// Route paths
class RoutePaths {
  // Main routes
  static const String home = '/';
  static const String emotion = '/emotion';
  static const String bouquet = '/bouquet';
  static const String gallery = '/gallery';
  static const String profile = '/profile';
  
  // Auth routes
  static const String login = '/login';
  static const String register = '/register';
  
  // Detail routes
  static const String bouquetDetail = '/bouquet/:id';
  static const String emotionDetail = '/emotion/:id';
  
  // Utility routes
  static const String about = '/about';
  static const String privacy = '/privacy';
  static const String terms = '/terms';
  static const String help = '/help';
  
  // Error routes
  static const String notFound = '/404';
  static const String error = '/error';
  
  // Admin routes (if needed)
  static const String admin = '/admin';
  static const String analytics = '/admin/analytics';
}

/// Asset paths
class AssetPaths {
  // Images
  static const String logoPath = 'assets/images/logo.png';
  static const String logoSvgPath = 'assets/images/logo.svg';
  static const String placeholderImagePath = 'assets/images/placeholder.png';
  static const String backgroundPath = 'assets/images/background.jpg';
  
  // Icons
  static const String sakuraIconPath = 'assets/icons/sakura.svg';
  static const String flowerIconPath = 'assets/icons/flower.svg';
  
  // Animations
  static const String loadingAnimationPath = 'assets/animations/loading.json';
  static const String successAnimationPath = 'assets/animations/success.json';
  static const String errorAnimationPath = 'assets/animations/error.json';
  
  // Fonts
  static const String notoSansJPPath = 'assets/fonts/NotoSansJP-Regular.ttf';
}

/// Emotion categories for the app
class EmotionCategories {
  static const List<String> primary = [
    'joy',      // 喜び
    'sadness',  // 悲しみ
    'love',     // 愛
    'gratitude', // 感謝
    'hope',     // 希望
    'peace',    // 平静
  ];
  
  static const List<String> secondary = [
    'anger',       // 怒り
    'fear',        // 恐れ
    'surprise',    // 驚き
    'nostalgia',   // 懷かしさ
    'longing',     // 憧れ
    'comfort',     // 安らぎ
    'excitement',  // 興奮
    'sympathy',    // 同情
    'celebration', // お祝い
    'farewell',    // お別れ
  ];
  
  static const Map<String, String> translations = {
    'joy': '喜び',
    'sadness': '悲しみ',
    'love': '愛',
    'gratitude': '感謝',
    'hope': '希望',
    'peace': '平静',
    'anger': '怒り',
    'fear': '恐れ',
    'surprise': '驚き',
    'nostalgia': '懷かしさ',
    'longing': '憧れ',
    'comfort': '安らぎ',
    'excitement': '興奮',
    'sympathy': '同情',
    'celebration': 'お祝い',
    'farewell': 'お別れ',
  };
}

/// Bouquet styles
class BouquetStyles {
  static const List<String> available = [
    'realistic',
    'artistic',
    'minimalist',
    'romantic',
    'modern',
    'classical',
  ];
  
  static const Map<String, String> translations = {
    'realistic': 'リアル',
    'artistic': 'アーティスティック',
    'minimalist': 'ミニマル',
    'romantic': 'ロマンティック',
    'modern': 'モダン',
    'classical': 'クラシカル',
  };
  
  static const Map<String, String> descriptions = {
    'realistic': '写実的で美しい花束',
    'artistic': '芸術的で表現力豊かなスタイル',
    'minimalist': 'シンプルで洗練されたデザイン',
    'romantic': 'ロマンティックで夢的な雰囲気',
    'modern': 'モダンでスタイリッシュなデザイン',
    'classical': '伝統的で品のあるスタイル',
  };
}