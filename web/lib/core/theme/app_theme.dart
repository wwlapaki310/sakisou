import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Application theme configuration
class AppTheme {
  // Color palette based on Japanese aesthetic
  static const Color _primaryColor = Color(0xFFE8B4CB); // 桜色 (Sakura pink)
  static const Color _secondaryColor = Color(0xFFF7F3E9); // クリーム色
  static const Color _accentColor = Color(0xFF6B8E5A); // 葉緑色
  static const Color _textColor = Color(0xFF2C2C2C); // 墨色
  static const Color _backgroundColor = Color(0xFFFFFBF5); // 米色
  
  // Additional colors
  static const Color _surfaceColor = Color(0xFFFFFFFF);
  static const Color _errorColor = Color(0xFFE57373);
  static const Color _warningColor = Color(0xFFFFB74D);
  static const Color _successColor = Color(0xFF81C784);
  static const Color _infoColor = Color(0xFF64B5F6);
  
  // Dark theme colors
  static const Color _darkPrimaryColor = Color(0xFFD8A4BD);
  static const Color _darkBackgroundColor = Color(0xFF1A1A1A);
  static const Color _darkSurfaceColor = Color(0xFF2D2D2D);
  static const Color _darkTextColor = Color(0xFFE0E0E0);
  
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      
      // Color scheme
      colorScheme: ColorScheme.fromSeed(
        seedColor: _primaryColor,
        brightness: Brightness.light,
        primary: _primaryColor,
        secondary: _accentColor,
        surface: _surfaceColor,
        background: _backgroundColor,
        error: _errorColor,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: _textColor,
        onBackground: _textColor,
        onError: Colors.white,
      ),
      
      // Text theme
      textTheme: _buildTextTheme(Brightness.light),
      
      // App bar theme
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: _backgroundColor,
        foregroundColor: _textColor,
        centerTitle: true,
        titleTextStyle: GoogleFonts.notoSansJp(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: _textColor,
        ),
      ),
      
      // Card theme
      cardTheme: const CardTheme(
        elevation: 2,
        margin: EdgeInsets.all(8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
      ),
      
      // Button themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _primaryColor,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.notoSansJp(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: _primaryColor,
          side: const BorderSide(color: _primaryColor),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.notoSansJp(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: _accentColor,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: GoogleFonts.notoSansJp(
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      
      // Input decoration theme
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.grey),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _primaryColor, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _errorColor),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _errorColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        hintStyle: GoogleFonts.notoSansJp(
          color: Colors.grey.shade600,
        ),
      ),
      
      // Chip theme
      chipTheme: ChipThemeData(
        backgroundColor: _secondaryColor,
        selectedColor: _primaryColor,
        labelStyle: GoogleFonts.notoSansJp(
          fontSize: 14,
          color: _textColor,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
      
      // Icon theme
      iconTheme: const IconThemeData(
        color: _accentColor,
        size: 24,
      ),
      
      // Divider theme
      dividerTheme: DividerThemeData(
        color: Colors.grey.shade300,
        thickness: 1,
        space: 1,
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      
      // Color scheme
      colorScheme: ColorScheme.fromSeed(
        seedColor: _darkPrimaryColor,
        brightness: Brightness.dark,
        primary: _darkPrimaryColor,
        secondary: _accentColor,
        surface: _darkSurfaceColor,
        background: _darkBackgroundColor,
        error: _errorColor,
        onPrimary: _darkBackgroundColor,
        onSecondary: Colors.white,
        onSurface: _darkTextColor,
        onBackground: _darkTextColor,
        onError: Colors.white,
      ),
      
      // Text theme
      textTheme: _buildTextTheme(Brightness.dark),
      
      // App bar theme
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: _darkBackgroundColor,
        foregroundColor: _darkTextColor,
        centerTitle: true,
        titleTextStyle: GoogleFonts.notoSansJp(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: _darkTextColor,
        ),
      ),
      
      // Card theme
      cardTheme: CardTheme(
        elevation: 4,
        color: _darkSurfaceColor,
        margin: const EdgeInsets.all(8),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
      ),
      
      // Button themes (similar to light theme but with dark colors)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: _darkPrimaryColor,
          foregroundColor: _darkBackgroundColor,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.notoSansJp(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
  
  static TextTheme _buildTextTheme(Brightness brightness) {
    final Color textColor = brightness == Brightness.light ? _textColor : _darkTextColor;
    
    return TextTheme(
      // Display styles
      displayLarge: GoogleFonts.notoSansJp(
        fontSize: 57,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      displayMedium: GoogleFonts.notoSansJp(
        fontSize: 45,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      displaySmall: GoogleFonts.notoSansJp(
        fontSize: 36,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      
      // Headline styles
      headlineLarge: GoogleFonts.notoSansJp(
        fontSize: 32,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      headlineMedium: GoogleFonts.notoSansJp(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      headlineSmall: GoogleFonts.notoSansJp(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      
      // Title styles
      titleLarge: GoogleFonts.notoSansJp(
        fontSize: 22,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      titleMedium: GoogleFonts.notoSansJp(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      titleSmall: GoogleFonts.notoSansJp(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      
      // Body styles
      bodyLarge: GoogleFonts.notoSansJp(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      bodyMedium: GoogleFonts.notoSansJp(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      bodySmall: GoogleFonts.notoSansJp(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: textColor,
      ),
      
      // Label styles
      labelLarge: GoogleFonts.notoSansJp(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      labelMedium: GoogleFonts.notoSansJp(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      labelSmall: GoogleFonts.notoSansJp(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
    );
  }
  
  // Custom color getters
  static Color get primaryColor => _primaryColor;
  static Color get secondaryColor => _secondaryColor;
  static Color get accentColor => _accentColor;
  static Color get textColor => _textColor;
  static Color get backgroundColor => _backgroundColor;
  static Color get errorColor => _errorColor;
  static Color get warningColor => _warningColor;
  static Color get successColor => _successColor;
  static Color get infoColor => _infoColor;
}