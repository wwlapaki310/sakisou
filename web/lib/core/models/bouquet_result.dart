import 'emotion.dart';
import 'flower.dart';

class BouquetResult {
  final String id;
  final String inputMessage;
  final EmotionAnalysisResult emotionAnalysis;
  final List<FlowerRecommendation> recommendedFlowers;
  final String bouquetImageUrl;
  final String? shareCardUrl;
  final DateTime createdAt;
  final Map<String, dynamic>? metadata;

  const BouquetResult({
    required this.id,
    required this.inputMessage,
    required this.emotionAnalysis,
    required this.recommendedFlowers,
    required this.bouquetImageUrl,
    this.shareCardUrl,
    required this.createdAt,
    this.metadata,
  });

  factory BouquetResult.fromJson(Map<String, dynamic> json) {
    return BouquetResult(
      id: json['id'] as String,
      inputMessage: json['input_message'] as String,
      emotionAnalysis: EmotionAnalysisResult.fromJson(
        json['emotion_analysis'] as Map<String, dynamic>,
      ),
      recommendedFlowers: (json['recommended_flowers'] as List)
          .map((e) => FlowerRecommendation.fromJson(e as Map<String, dynamic>))
          .toList(),
      bouquetImageUrl: json['bouquet_image_url'] as String,
      shareCardUrl: json['share_card_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'input_message': inputMessage,
      'emotion_analysis': emotionAnalysis.toJson(),
      'recommended_flowers': recommendedFlowers.map((e) => e.toJson()).toList(),
      'bouquet_image_url': bouquetImageUrl,
      'share_card_url': shareCardUrl,
      'created_at': createdAt.toIso8601String(),
      'metadata': metadata,
    };
  }

  /// 主要な感情を取得
  Emotion get primaryEmotion => emotionAnalysis.primaryEmotion;

  /// メインの花を取得
  FlowerRecommendation? get primaryFlower {
    if (recommendedFlowers.isEmpty) return null;
    return recommendedFlowers.first;
  }

  /// 花束のタイトルを生成
  String get title {
    if (recommendedFlowers.isEmpty) return '美しい花束';
    
    final flowerNames = recommendedFlowers
        .take(3)
        .map((f) => f.flower.name)
        .join('、');
    
    return '${primaryEmotion.name}の花束 ($flowerNames)';
  }

  /// 花束の説明文を生成
  String get description {
    final emotion = primaryEmotion.name;
    final flowerCount = recommendedFlowers.length;
    
    return 'あなたの「$emotion」の想いを込めて、${flowerCount}種類の花で花束を作りました。';
  }

  /// SNSシェア用テキストを生成
  String get shareText {
    final emotion = primaryEmotion.name;
    final mainFlower = primaryFlower?.flower.name ?? '花';
    
    return '''咲想で「$emotion」の花束を作りました🌸

メインの花: $mainFlower
花言葉: ${primaryFlower?.flower.meanings.join('、') ?? ''}

#咲想 #AI花束 #花言葉 #想いを花に''';
  }

  @override
  String toString() {
    return 'BouquetResult(id: $id, emotion: ${primaryEmotion.name}, flowers: ${recommendedFlowers.length})';
  }
}

/// 花束生成のリクエスト用クラス
class BouquetRequest {
  final String message;
  final String? style;
  final List<String>? preferredColors;
  final Map<String, dynamic>? options;

  const BouquetRequest({
    required this.message,
    this.style,
    this.preferredColors,
    this.options,
  });

  Map<String, dynamic> toJson() {
    return {
      'message': message,
      if (style != null) 'style': style,
      if (preferredColors != null) 'preferred_colors': preferredColors,
      if (options != null) 'options': options,
    };
  }
}
