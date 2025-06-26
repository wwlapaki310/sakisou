class Flower {
  final String id;
  final String name;
  final String nameEn;
  final List<String> meanings;
  final List<String> emotions;
  final List<String> colors;
  final String season;
  final double popularity;
  final String? imageUrl;
  final String? description;

  const Flower({
    required this.id,
    required this.name,
    required this.nameEn,
    required this.meanings,
    required this.emotions,
    required this.colors,
    required this.season,
    this.popularity = 0.0,
    this.imageUrl,
    this.description,
  });

  factory Flower.fromJson(Map<String, dynamic> json) {
    return Flower(
      id: json['id'] as String,
      name: json['name'] as String,
      nameEn: json['nameEn'] as String,
      meanings: List<String>.from(json['meanings'] as List),
      emotions: List<String>.from(json['emotions'] as List),
      colors: List<String>.from(json['colors'] as List),
      season: json['season'] as String,
      popularity: (json['popularity'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['imageUrl'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameEn': nameEn,
      'meanings': meanings,
      'emotions': emotions,
      'colors': colors,
      'season': season,
      'popularity': popularity,
      'imageUrl': imageUrl,
      'description': description,
    };
  }

  @override
  String toString() {
    return 'Flower(id: $id, name: $name, meanings: $meanings)';
  }
}

class FlowerRecommendation {
  final Flower flower;
  final double matchScore;
  final String reason;
  final List<String> matchedEmotions;

  const FlowerRecommendation({
    required this.flower,
    required this.matchScore,
    required this.reason,
    required this.matchedEmotions,
  });

  factory FlowerRecommendation.fromJson(Map<String, dynamic> json) {
    return FlowerRecommendation(
      flower: Flower.fromJson(json['flower'] as Map<String, dynamic>),
      matchScore: (json['match_score'] as num).toDouble(),
      reason: json['reason'] as String,
      matchedEmotions: List<String>.from(json['matched_emotions'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'flower': flower.toJson(),
      'match_score': matchScore,
      'reason': reason,
      'matched_emotions': matchedEmotions,
    };
  }
}
