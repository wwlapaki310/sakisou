import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/theme/app_theme.dart';

class EmotionInputScreen extends StatefulWidget {
  const EmotionInputScreen({super.key});

  @override
  State<EmotionInputScreen> createState() => _EmotionInputScreenState();
}

class _EmotionInputScreenState extends State<EmotionInputScreen> {
  final TextEditingController _messageController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _generateBouquet() {
    final message = _messageController.text.trim();
    if (message.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('想いを入力してください'),
          backgroundColor: AppTheme.apologyBlue,
        ),
      );
      return;
    }

    // ローディング画面へ遷移
    context.go('/loading?message=${Uri.encodeComponent(message)}');
  }

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
                constraints: const BoxConstraints(maxWidth: 600),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ヘッダー
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => context.go('/'),
                          icon: Icon(Icons.arrow_back_ios),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppTheme.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Text(
                          '想いを入力',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      ],
                    )
                        .animate()
                        .fadeIn(duration: 600.ms)
                        .slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 40),
                    
                    // メインカード
                    Card(
                      elevation: 12,
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // タイトル
                            Row(
                              children: [
                                Container(
                                  width: 4,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: AppTheme.sakuraPink,
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'あなたの想いを聞かせてください',
                                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                          fontWeight: FontWeight.w600,
                                          color: AppTheme.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'AIがあなたの感情を分析し、最適な花を選びます',
                                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                          color: AppTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 32),
                            
                            // テキスト入力フィールド
                            TextField(
                              controller: _messageController,
                              maxLines: 6,
                              maxLength: 500,
                              decoration: InputDecoration(
                                hintText: 'ここに自由に気持ちを書いてください...\n\n例：\n「ありがとう、とても嬉しかった」\n「ごめんなさい、悪いことをしました」\n「頑張って、応援しています」',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                counterStyle: TextStyle(
                                  color: AppTheme.textLight,
                                ),
                              ),
                              style: TextStyle(
                                fontSize: 16,
                                height: 1.5,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            
                            const SizedBox(height: 24),
                            
                            // 例文チップ
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: [
                                _ExampleChip(
                                  text: 'ありがとう、感謝しています',
                                  onTap: () => _setExample('ありがとう、感謝しています'),
                                ),
                                _ExampleChip(
                                  text: 'ごめんなさい、申し訳ありません',
                                  onTap: () => _setExample('ごめんなさい、申し訳ありません'),
                                ),
                                _ExampleChip(
                                  text: '頑張って、応援しています',
                                  onTap: () => _setExample('頑張って、応援しています'),
                                ),
                                _ExampleChip(
                                  text: '大好きです、愛しています',
                                  onTap: () => _setExample('大好きです、愛しています'),
                                ),
                                _ExampleChip(
                                  text: '寂しいです、会いたい',
                                  onTap: () => _setExample('寂しいです、会いたい'),
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 32),
                            
                            // 生成ボタン
                            ElevatedButton(
                              onPressed: _isLoading ? null : _generateBouquet,
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 20),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                elevation: 8,
                              ),
                              child: _isLoading
                                  ? SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white,
                                        ),
                                      ),
                                    )
                                  : Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.auto_awesome, size: 24),
                                        const SizedBox(width: 12),
                                        Text(
                                          '花束を生成する',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                            ),
                          ],
                        ),
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 200.ms, duration: 800.ms)
                        .slideY(begin: 0.3, end: 0),
                    
                    const SizedBox(height: 24),
                    
                    // 注意事項
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.sakuraLight.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppTheme.sakuraPink.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: AppTheme.textSecondary,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              '入力された内容は花言葉の選択にのみ使用され、保存されません',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 400.ms, duration: 800.ms),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _setExample(String text) {
    _messageController.text = text;
    setState(() {});
  }
}

class _ExampleChip extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const _ExampleChip({
    required this.text,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: AppTheme.sakuraPink.withOpacity(0.5),
          ),
          boxShadow: [
            BoxShadow(
              color: AppTheme.sakuraPink.withOpacity(0.1),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppTheme.textPrimary,
          ),
        ),
      ),
    );
  }
}
