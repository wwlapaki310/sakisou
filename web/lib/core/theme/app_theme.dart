import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // 咲想カラーパレット
  static const Color sakuraPink = Color(0xFFE8B4CB);
  static const Color sakuraLight = Color(0xFFF5D7E3);
  static const Color sakuraDeep = Color(0xFFD499B9);
  static const Color cream = Color(0xFFF7F3E9);
  static const Color sageGreen = Color(0xFF6B8E5A);
  static const Color mossGreen = Color(0xFF4F6B43);
  static const Color textPrimary = Color(0xFF2C2C2C);
  static const Color textSecondary = Color(0xFF5A5A5A);
  static const Color textLight = Color(0xFF8A8A8A);
  
  // 感情表現色
  static const Color loveRed = Color(0xFFD67B7B);
  static const Color gratitudeYellow = Color(0xFFF4E4A6);
  static const Color apologyBlue = Color(0xFFA6C8E4);
  static const Color hopeOrange = Color(0xFFF2B366);
  static const Color sadnessPurple = Color(0xFFB8A6D6);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: sakuraPink,
        secondary: sageGreen,
        surface: cream,
        background: cream,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        onBackground: textPrimary,
      ),
      
      // フォント設定
      textTheme: GoogleFonts.notoSansJpTextTheme().copyWith(
        displayLarge: GoogleFonts.notoSansJp(
          fontSize: 57,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        displayMedium: GoogleFonts.notoSansJp(
          fontSize: 45,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        displaySmall: GoogleFonts.notoSansJp(
          fontSize: 36,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        headlineLarge: GoogleFonts.notoSansJp(
          fontSize: 32,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineMedium: GoogleFonts.notoSansJp(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineSmall: GoogleFonts.notoSansJp(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: GoogleFonts.notoSansJp(
          fontSize: 22,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        titleMedium: GoogleFonts.notoSansJp(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        titleSmall: GoogleFonts.notoSansJp(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.notoSansJp(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        bodyMedium: GoogleFonts.notoSansJp(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        bodySmall: GoogleFonts.notoSansJp(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          color: textSecondary,
        ),
      ),
      
      // AppBar テーマ
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.notoSansJp(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),
      
      // ボタンテーマ
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: sakuraPink,
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: sakuraPink.withOpacity(0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: 32,
            vertical: 16,
          ),
          textStyle: GoogleFonts.notoSansJp(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // テキストフィールドテーマ
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: sakuraLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: sakuraLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: sakuraPink, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.red.shade300),
        ),
        contentPadding: const EdgeInsets.all(20),
        hintStyle: GoogleFonts.notoSansJp(
          color: textLight,
          fontSize: 16,
        ),
      ),
      
      // カードテーマ
      cardTheme: CardTheme(
        elevation: 4,
        shadowColor: sakuraPink.withOpacity(0.2),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        color: Colors.white,
      ),
    );
  }
  
  // グラデーション
  static const LinearGradient sakuraGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [sakuraLight, sakuraPink],
  );
  
  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [cream, sakuraLight],
  );
}
