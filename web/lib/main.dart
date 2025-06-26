import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'core/theme/app_theme.dart';
import 'presentation/screens/home_screen.dart';
import 'presentation/screens/input_screen.dart';
import 'presentation/screens/loading_screen.dart';
import 'presentation/screens/result_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Firebase初期化
  await Firebase.initializeApp(
    options: const FirebaseOptions(
      apiKey: "your-api-key",
      authDomain: "sakisou-hackathon.firebaseapp.com",
      projectId: "sakisou-hackathon",
      storageBucket: "sakisou-hackathon.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef",
    ),
  );
  
  runApp(
    const ProviderScope(
      child: SakisouWebApp(),
    ),
  );
}

class SakisouWebApp extends StatelessWidget {
  const SakisouWebApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '咲想 - 想いを花に',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: _router,
    );
  }
}

// ルーティング設定
final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/input',
      name: 'input',
      builder: (context, state) => const EmotionInputScreen(),
    ),
    GoRoute(
      path: '/loading',
      name: 'loading',
      builder: (context, state) {
        final message = state.uri.queryParameters['message'] ?? '';
        return LoadingScreen(inputMessage: message);
      },
    ),
    GoRoute(
      path: '/result',
      name: 'result',
      builder: (context, state) {
        final resultData = state.extra as Map<String, dynamic>?;
        return BouquetResultScreen(resultData: resultData);
      },
    ),
  ],
);
