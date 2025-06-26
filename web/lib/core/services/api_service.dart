import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/emotion.dart';
import '../models/flower.dart';
import '../models/bouquet_result.dart';

class ApiService {
  // Firebase Functions のベースURL
  // 本番環境では実際のプロジェクトIDに置き換える
  static const String _baseUrl = 'https://us-central1-sakisou-hackathon.cloudfunctions.net/api';
  // 開発環境（エミュレータ）
  static const String _emulatorUrl = 'http://localhost:5001/sakisou-hackathon/us-central1/api';
  
  // 開発/本番環境の切り替え
  static const bool _useEmulator = true; // 開発時はtrue
  
  String get baseUrl => _useEmulator ? _emulatorUrl : _baseUrl;

  /// 感情分析と花束生成を実行
  Future<BouquetResult> generateBouquet(String message) async {
    try {
      // Step 1: 感情分析
      final emotionResult = await _analyzeEmotion(message);
      
      // Step 2: 花束生成
      final bouquetResult = await _generateBouquetImage(message, emotionResult);
      
      return bouquetResult;
      
    } catch (e) {
      throw Exception('花束生成に失敗しました: ${e.toString()}');
    }
  }

  /// 感情分析API呼び出し
  Future<EmotionAnalysisResult> _analyzeEmotion(String message) async {
    final url = Uri.parse('$baseUrl/analyze-emotion');
    
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'message': message,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return EmotionAnalysisResult.fromJson(data);
    } else {
      throw Exception('感情分析に失敗しました: ${response.statusCode}');
    }
  }

  /// 花束画像生成API呼び出し
  Future<BouquetResult> _generateBouquetImage(
    String message, 
    EmotionAnalysisResult emotionResult,
  ) async {
    final url = Uri.parse('$baseUrl/generate-bouquet');
    
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'message': message,
        'emotions': emotionResult.toJson(),
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return BouquetResult.fromJson(data);
    } else {
      throw Exception('花束生成に失敗しました: ${response.statusCode}');
    }
  }

  /// 花のマスターデータを取得
  Future<List<Flower>> getFlowers() async {
    final url = Uri.parse('$baseUrl/flowers');
    
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => Flower.fromJson(json)).toList();
    } else {
      throw Exception('花データの取得に失敗しました: ${response.statusCode}');
    }
  }

  /// 公開ギャラリーの取得
  Future<List<BouquetResult>> getPublicBouquets({
    int limit = 20,
    String? cursor,
  }) async {
    final url = Uri.parse('$baseUrl/public-bouquets');
    
    final queryParams = {
      'limit': limit.toString(),
      if (cursor != null) 'cursor': cursor,
    };
    
    final uri = url.replace(queryParameters: queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as List;
      return data.map((json) => BouquetResult.fromJson(json)).toList();
    } else {
      throw Exception('ギャラリーデータの取得に失敗しました: ${response.statusCode}');
    }
  }

  /// ヘルスチェック
  Future<bool> healthCheck() async {
    try {
      final url = Uri.parse('$baseUrl/health');
      final response = await http.get(url);
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

/// APIエラーハンドリング用例外クラス
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic originalError;

  ApiException(this.message, {this.statusCode, this.originalError});

  @override
  String toString() {
    return 'ApiException: $message';
  }
}
