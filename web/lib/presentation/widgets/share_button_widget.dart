import 'package:flutter/material.dart';
import 'dart:html' as html;

import '../../core/theme/app_theme.dart';
import '../../core/models/bouquet_result.dart';

class ShareButtonWidget extends StatelessWidget {
  final BouquetResult result;

  const ShareButtonWidget({
    super.key,
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () => _shareContent(context),
      icon: Icon(Icons.share_outlined),
      label: Text('シェア'),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.sakuraPink,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 8,
        shadowColor: AppTheme.sakuraPink.withOpacity(0.3),
      ),
    );
  }

  void _shareContent(BuildContext context) {
    // Web Share API が利用可能か確認
    if (_isWebShareAvailable()) {
      _shareWithWebShareAPI();
    } else {
      // フォールバック: シェアダイアログを表示
      _showShareDialog(context);
    }
  }

  bool _isWebShareAvailable() {
    // Web Share API のサポート確認
    return html.window.navigator.canShare != null;
  }

  void _shareWithWebShareAPI() {
    try {
      html.window.navigator.share({
        'title': '咲想で作った花束',
        'text': result.shareText,
        'url': html.window.location.href,
      });
    } catch (e) {
      print('Web Share API error: $e');
    }
  }

  void _showShareDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'シェアする',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              
              const SizedBox(height: 24),
              
              // シェアオプション
              Column(
                children: [
                  _ShareOption(
                    icon: Icons.link,
                    label: 'リンクをコピー',
                    onTap: () => _copyLink(context),
                  ),
                  const SizedBox(height: 12),
                  _ShareOption(
                    icon: Icons.download,
                    label: 'テキストをコピー',
                    onTap: () => _copyText(context),
                  ),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // 閉じるボタン
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('閉じる'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _copyLink(BuildContext context) {
    final url = html.window.location.href;
    html.window.navigator.clipboard?.writeText(url);
    
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('リンクをコピーしました'),
        backgroundColor: AppTheme.sageGreen,
      ),
    );
  }

  void _copyText(BuildContext context) {
    html.window.navigator.clipboard?.writeText(result.shareText);
    
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('テキストをコピーしました'),
        backgroundColor: AppTheme.sageGreen,
      ),
    );
  }
}

class _ShareOption extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ShareOption({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: AppTheme.sakuraLight,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.sakuraLight,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                icon,
                color: AppTheme.sakuraPink,
                size: 20,
              ),
            ),
            const SizedBox(width: 16),
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppTheme.textPrimary,
              ),
            ),
            const Spacer(),
            Icon(
              Icons.arrow_forward_ios,
              color: AppTheme.textSecondary,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
