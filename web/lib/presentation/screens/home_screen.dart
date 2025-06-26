import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/theme/app_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppTheme.backgroundGradient,
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 800),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // ロゴ・タイトル
                    Column(
                      children: [
                        Text(
                          '🌸',
                          style: TextStyle(fontSize: 80),
                        )
                            .animate()
                            .scale(duration: 800.ms, curve: Curves.elasticOut)
                            .then()
                            .shimmer(duration: 1500.ms),
                        
                        const SizedBox(height: 16),
                        
                        Text(
                          '咲想',
                          style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        )
                            .animate()
                            .fadeIn(delay: 400.ms, duration: 800.ms)
                            .slideY(begin: 0.3, end: 0),
                        
                        const SizedBox(height: 8),
                        
                        Text(
                          'Sakisou',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: AppTheme.textSecondary,
                            letterSpacing: 2,
                          ),
                        )
                            .animate()
                            .fadeIn(delay: 600.ms, duration: 800.ms)
                            .slideY(begin: 0.3, end: 0),
                      ],
                    ),
                    
                    const SizedBox(height: 40),
                    
                    // キャッチコピー
                    Card(
                      elevation: 8,
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          children: [
                            Text(
                              'あなたの想いを、花にして届ける',
                              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                color: AppTheme.textPrimary,
                                height: 1.5,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            
                            const SizedBox(height: 16),
                            
                            Text(
                              'AIが感情を分析し、最適な花言葉を持つ花を推薦。\n美しい花束の画像を生成します。',
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: AppTheme.textSecondary,
                                height: 1.6,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 800.ms, duration: 1000.ms)
                        .slideY(begin: 0.5, end: 0),
                    
                    const SizedBox(height: 48),
                    
                    // メインCTAボタン
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => context.go('/input'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          elevation: 8,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.edit_outlined, size: 24),
                            const SizedBox(width: 12),
                            Text(
                              '想いを入力する',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 1200.ms, duration: 800.ms)
                        .slideY(begin: 0.3, end: 0)
                        .then()
                        .shimmer(duration: 2000.ms, delay: 500.ms),
                    
                    const SizedBox(height: 24),
                    
                    // サブ情報
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _FeatureChip(
                          icon: Icons.psychology_outlined,
                          label: 'AI感情分析',
                        ),
                        const SizedBox(width: 12),
                        _FeatureChip(
                          icon: Icons.local_florist_outlined,
                          label: '花言葉マッチング',
                        ),
                        const SizedBox(width: 12),
                        _FeatureChip(
                          icon: Icons.image_outlined,
                          label: '美しい画像生成',
                        ),
                      ],
                    )
                        .animate()
                        .fadeIn(delay: 1400.ms, duration: 800.ms),
                    
                    const SizedBox(height: 48),
                    
                    // フッター
                    Text(
                      '想いを咲かせる。花と共に、心をつなぐ。',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.textLight,
                        fontStyle: FontStyle.italic,
                      ),
                      textAlign: TextAlign.center,
                    )
                        .animate()
                        .fadeIn(delay: 1600.ms, duration: 800.ms),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _FeatureChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _FeatureChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: AppTheme.sakuraLight,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.sakuraPink.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 16,
            color: AppTheme.textPrimary,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
