class Emotion {
  final String name;
  final double intensity;
  final String category;
  final String description;

  const Emotion({
    required this.name,
    required this.intensity,
    required this.category,
    required this.description,
  });

  factory Emotion.fromJson(Map<String, dynamic> json) {
    return Emotion(
      name: json['name'] as String,
      intensity: (json['intensity'] as num).toDouble(),
      category: json['category'] as String,
      description: json['description'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'intensity': intensity,
      'category': category,
      'description': description,
    };
  }

  @override
  String toString() {
    return 'Emotion(name: $name, intensity: $intensity, category: $category)';
  }
}

class EmotionAnalysisResult {
  final Emotion primaryEmotion;
  final List<Emotion> secondaryEmotions;
  final double confidence;
  final String explanation;
  final List<String> keywords;

  const EmotionAnalysisResult({
    required this.primaryEmotion,
    required this.secondaryEmotions,
    required this.confidence,
    required this.explanation,
    required this.keywords,
  });

  factory EmotionAnalysisResult.fromJson(Map<String, dynamic> json) {
    return EmotionAnalysisResult(
      primaryEmotion: Emotion.fromJson(json['primary_emotion'] as Map<String, dynamic>),
      secondaryEmotions: (json['secondary_emotions'] as List)
          .map((e) => Emotion.fromJson(e as Map<String, dynamic>))
          .toList(),
      confidence: (json['confidence'] as num).toDouble(),
      explanation: json['explanation'] as String,
      keywords: List<String>.from(json['keywords'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'primary_emotion': primaryEmotion.toJson(),
      'secondary_emotions': secondaryEmotions.map((e) => e.toJson()).toList(),
      'confidence': confidence,
      'explanation': explanation,
      'keywords': keywords,
    };
  }
}
