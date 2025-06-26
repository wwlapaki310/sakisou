import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../core/theme/app_theme.dart';
import '../../core/models/bouquet_result.dart';
import '../widgets/flower_card_widget.dart';
import '../widgets/share_button_widget.dart';

class BouquetResultScreen extends StatelessWidget {
  final Map<String, dynamic>? resultData;

  const BouquetResultScreen({
    super.key,
    this.resultData,
  });

  @override
  Widget build(BuildContext context) {
    // データが無い場合のフォールバック
    if (resultData == null) {
      return _buildErrorState(context);
    }

    // 結果データをパース（実際はAPIから取得）
    final result = _parseResultData(resultData!);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              children: [
                // ヘッダー
                _buildHeader(context),
                
                // メインコンテンツ
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // 花束画像
                      _buildBouquetImage(result),
                      
                      const SizedBox(height: 32),
                      
                      // 感情分析結果
                      _buildEmotionCard(result),
                      
                      const SizedBox(height: 24),
                      
                      // 推薦された花々
                      _buildFlowersList(result),
                      
                      const SizedBox(height: 32),
                      
                      // アクションボタン
                      _buildActionButtons(context, result),
                      
                      const SizedBox(height: 24),
                      
                      // 新しい花束を作る
                      _buildNewBouquetButton(context),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.go('/'),
            icon: Icon(Icons.home_outlined),
            style: IconButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              '✨ 花束が完成しました',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(duration: 600.ms)
        .slideY(begin: -0.3, end: 0);
  }

  Widget _buildBouquetImage(BouquetResult result) {
    return Card(
      elevation: 16,
      shadowColor: AppTheme.sakuraPink.withOpacity(0.3),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: AspectRatio(
          aspectRatio: 1.0,
          child: CachedNetworkImage(
            imageUrl: result.bouquetImageUrl,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              color: AppTheme.sakuraLight,
              child: Center(
                child: CircularProgressIndicator(
                  color: AppTheme.sakuraPink,
                ),
              ),
            ),
            errorWidget: (context, url, error) => Container(
              color: AppTheme.sakuraLight,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.local_florist,
                    size: 64,
                    color: AppTheme.sakuraPink,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '美しい花束',
                    style: TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(delay: 300.ms, duration: 1000.ms)
        .scale(begin: Offset(0.8, 0.8), end: Offset(1.0, 1.0))
        .then()
        .shimmer(duration: 2000.ms);
  }

  Widget _buildEmotionCard(BouquetResult result) {
    final emotion = result.primaryEmotion;
    
    return Card(
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.sakuraPink.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.psychology_outlined,
                    color: AppTheme.sakuraPink,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'あなたの想い',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        emotion.name,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.sakuraPink,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.sageGreen,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    '${(emotion.intensity * 100).round()}%',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cream,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '"${result.inputMessage}"',
                style: TextStyle(
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.textPrimary,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: 600.ms, duration: 800.ms)
        .slideY(begin: 0.3, end: 0);
  }

  Widget _buildFlowersList(BouquetResult result) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'この花束に込められた花言葉',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        ...result.recommendedFlowers.asMap().entries.map((entry) {
          final index = entry.key;
          final flower = entry.value;
          return Padding(
            padding: EdgeInsets.only(bottom: index < result.recommendedFlowers.length - 1 ? 16 : 0),
            child: FlowerCardWidget(
              flower: flower,
              isMain: index == 0,
            )
                .animate()
                .fadeIn(delay: (800 + index * 200).ms, duration: 600.ms)
                .slideX(begin: 0.3, end: 0),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context, BouquetResult result) {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => _downloadImage(result.bouquetImageUrl),
            icon: Icon(Icons.download_outlined),
            label: Text('画像を保存'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.sageGreen,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: ShareButtonWidget(
            result: result,
          ),
        ),
      ],
    )
        .animate()
        .fadeIn(delay: 1200.ms, duration: 800.ms)
        .slideY(begin: 0.3, end: 0);
  }

  Widget _buildNewBouquetButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () => context.go('/input'),
        icon: Icon(Icons.add_circle_outline),
        label: Text('新しい花束を作る'),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppTheme.sakuraPink,
          side: BorderSide(color: AppTheme.sakuraPink),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(delay: 1400.ms, duration: 800.ms);
  }

  Widget _buildErrorState(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: AppTheme.apologyBlue,
              ),
              const SizedBox(height: 16),
              Text(
                'エラーが発生しました',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: Text('ホームに戻る'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ダミーデータ生成（実際の実装では削除）
  BouquetResult _parseResultData(Map<String, dynamic> data) {
    // TODO: 実際のAPIレスポンスをパースする
    return BouquetResult(
      id: 'demo-123',
      inputMessage: data['message'] ?? 'ありがとう、感謝しています',
      emotionAnalysis: _createDummyEmotion(),
      recommendedFlowers: _createDummyFlowers(),
      bouquetImageUrl: 'https://via.placeholder.com/400x400/E8B4CB/FFFFFF?text=Beautiful+Bouquet',
      createdAt: DateTime.now(),
    );
  }

  // ダミーデータ（開発用）
  dynamic _createDummyEmotion() {
    // TODO: 実際のEmotionAnalysisResultを返す
    return null;
  }

  List<dynamic> _createDummyFlowers() {
    // TODO: 実際のFlowerRecommendationリストを返す
    return [];
  }

  void _downloadImage(String imageUrl) {
    // TODO: Web用画像ダウンロード実装
    print('Downloading image: $imageUrl');
  }
}
