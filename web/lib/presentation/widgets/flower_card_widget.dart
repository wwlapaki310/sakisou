import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/models/flower.dart';

class FlowerCardWidget extends StatelessWidget {
  final FlowerRecommendation flower;
  final bool isMain;

  const FlowerCardWidget({
    super.key,
    required this.flower,
    this.isMain = false,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isMain ? 12 : 6,
      shadowColor: isMain 
          ? AppTheme.sakuraPink.withOpacity(0.3)
          : Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: isMain 
            ? BorderSide(color: AppTheme.sakuraPink, width: 2)
            : BorderSide.none,
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            // 花のアイコン
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: isMain 
                    ? AppTheme.sakuraPink.withOpacity(0.1)
                    : AppTheme.sageGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(
                  color: isMain ? AppTheme.sakuraPink : AppTheme.sageGreen,
                  width: 2,
                ),
              ),
              child: Icon(
                Icons.local_florist,
                color: isMain ? AppTheme.sakuraPink : AppTheme.sageGreen,
                size: 28,
              ),
            ),
            
            const SizedBox(width: 16),
            
            // 花の情報
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 花の名前
                  Row(
                    children: [
                      if (isMain) ...[
                        Icon(
                          Icons.star,
                          color: AppTheme.gratitudeYellow,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                      ],
                      Expanded(
                        child: Text(
                          flower.flower.name,
                          style: TextStyle(
                            fontSize: isMain ? 18 : 16,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 4),
                  
                  // 英語名
                  Text(
                    flower.flower.nameEn,
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textSecondary,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  
                  const SizedBox(height: 8),
                  
                  // 花言葉
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: flower.flower.meanings.take(3).map((meaning) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: isMain 
                              ? AppTheme.sakuraLight
                              : AppTheme.cream,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isMain 
                                ? AppTheme.sakuraPink.withOpacity(0.3)
                                : AppTheme.sageGreen.withOpacity(0.3),
                          ),
                        ),
                        child: Text(
                          meaning,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  
                  if (flower.reason.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      flower.reason,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            
            // マッチスコア
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: isMain ? AppTheme.sakuraPink : AppTheme.sageGreen,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${(flower.matchScore * 100).round()}%',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                ),
                if (isMain) ...[
                  const SizedBox(height: 4),
                  Text(
                    'メイン',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.sakuraPink,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
