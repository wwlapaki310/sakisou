import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../core/theme/app_theme.dart';
import '../../core/services/api_service.dart';

class LoadingScreen extends StatefulWidget {
  final String inputMessage;

  const LoadingScreen({
    super.key,
    required this.inputMessage,
  });

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen>
    with TickerProviderStateMixin {
  late AnimationController _rotationController;
  late AnimationController _pulseController;
  
  String _currentStep = '感情を分析中...';
  int _stepIndex = 0;

  final List<String> _steps = [
    '感情を分析中...',
    '花言葉をマッチング中...',
    '美しい花束を生成中...',
    '仕上げ中...',
  ];

  @override
  void initState() {
    super.initState();
    
    _rotationController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();
    
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    
    _startGeneration();
  }

  @override
  void dispose() {
    _rotationController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _startGeneration() async {
    try {
      // ステップ1: 感情分析
      _updateStep(0);
      await Future.delayed(Duration(seconds: 2));
      
      // ステップ2: 花言葉マッチング
      _updateStep(1);
      await Future.delayed(Duration(seconds: 2));
      
      // ステップ3: 画像生成
      _updateStep(2);
      await Future.delayed(Duration(seconds: 3));
      
      // ステップ4: 仕上げ
      _updateStep(3);
      await Future.delayed(Duration(seconds: 1));
      
      // API呼び出し（実際の処理）
      final apiService = ApiService();
      final result = await apiService.generateBouquet(widget.inputMessage);
      
      // 結果画面へ遷移
      if (mounted) {
        context.go('/result', extra: result);
      }
      
    } catch (e) {
      // エラーハンドリング
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('エラーが発生しました: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
        context.go('/input');
      }
    }
  }

  void _updateStep(int stepIndex) {
    if (mounted) {
      setState(() {
        _stepIndex = stepIndex;
        _currentStep = _steps[stepIndex];
      });
    }
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
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // メインアニメーション
                  SizedBox(
                    width: 200,
                    height: 200,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // 外側の回転リング
                        AnimatedBuilder(
                          animation: _rotationController,
                          builder: (context, child) {
                            return Transform.rotate(
                              angle: _rotationController.value * 2 * 3.14159,
                              child: Container(
                                width: 180,
                                height: 180,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: AppTheme.sakuraPink,
                                    width: 3,
                                  ),
                                  gradient: LinearGradient(
                                    colors: [
                                      AppTheme.sakuraPink,
                                      AppTheme.sakuraLight,
                                      AppTheme.sakuraPink,
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        
                        // 中央の花アイコン
                        AnimatedBuilder(
                          animation: _pulseController,
                          builder: (context, child) {
                            return Transform.scale(
                              scale: 1.0 + (_pulseController.value * 0.3),
                              child: Container(
                                width: 120,
                                height: 120,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.sakuraPink.withOpacity(0.3),
                                      blurRadius: 20,
                                      spreadRadius: 5,
                                    ),
                                  ],
                                ),
                                child: Icon(
                                  Icons.local_florist,
                                  size: 60,
                                  color: AppTheme.sakuraPink,
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // ステップ表示
                  Text(
                    _currentStep,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  )
                      .animate()
                      .fadeIn(duration: 500.ms)
                      .slideY(begin: 0.3, end: 0),
                  
                  const SizedBox(height: 24),
                  
                  // プログレスバー
                  Container(
                    width: 280,
                    child: Column(
                      children: [
                        LinearProgressIndicator(
                          value: (_stepIndex + 1) / _steps.length,
                          backgroundColor: AppTheme.sakuraLight,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            AppTheme.sakuraPink,
                          ),
                          minHeight: 6,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${_stepIndex + 1} / ${_steps.length}',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // 入力メッセージプレビュー
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppTheme.sakuraLight,
                      ),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'あなたの想い',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '"${widget.inputMessage}"',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: AppTheme.textPrimary,
                            fontStyle: FontStyle.italic,
                            height: 1.5,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  )
                      .animate()
                      .fadeIn(delay: 1000.ms, duration: 800.ms)
                      .slideY(begin: 0.3, end: 0),
                  
                  const SizedBox(height: 60),
                  
                  // キャンセルボタン
                  TextButton(
                    onPressed: () => context.go('/input'),
                    style: TextButton.styleFrom(
                      foregroundColor: AppTheme.textSecondary,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.arrow_back_ios, size: 16),
                        const SizedBox(width: 4),
                        Text('入力に戻る'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
