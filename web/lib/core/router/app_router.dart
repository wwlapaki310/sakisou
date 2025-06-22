import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../constants/app_constants.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/emotion/presentation/screens/emotion_input_screen.dart';
import '../../features/emotion/presentation/screens/emotion_result_screen.dart';
import '../../features/bouquet/presentation/screens/bouquet_generation_screen.dart';
import '../../features/bouquet/presentation/screens/bouquet_detail_screen.dart';
import '../../features/gallery/presentation/screens/gallery_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/shared/presentation/screens/error_screen.dart';
import '../../features/shared/presentation/screens/not_found_screen.dart';

/// Router configuration for the app
class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: RoutePaths.home,
    debugLogDiagnostics: true,
    
    routes: [
      // Home route
      GoRoute(
        path: RoutePaths.home,
        name: 'home',
        pageBuilder: (context, state) => const MaterialPage(
          child: HomeScreen(),
        ),
      ),
      
      // Auth routes
      GoRoute(
        path: RoutePaths.login,
        name: 'login',
        pageBuilder: (context, state) => const MaterialPage(
          child: LoginScreen(),
        ),
      ),
      
      // Emotion analysis routes
      GoRoute(
        path: RoutePaths.emotion,
        name: 'emotion',
        pageBuilder: (context, state) => const MaterialPage(
          child: EmotionInputScreen(),
        ),
      ),
      
      GoRoute(
        path: '/emotion/result/:emotionId',
        name: 'emotion-result',
        pageBuilder: (context, state) {
          final emotionId = state.pathParameters['emotionId']!;
          return MaterialPage(
            child: EmotionResultScreen(emotionId: emotionId),
          );
        },
      ),
      
      // Bouquet routes
      GoRoute(
        path: RoutePaths.bouquet,
        name: 'bouquet',
        pageBuilder: (context, state) {
          final emotionId = state.uri.queryParameters['emotionId'];
          return MaterialPage(
            child: BouquetGenerationScreen(emotionId: emotionId),
          );
        },
      ),
      
      GoRoute(
        path: '/bouquet/:bouquetId',
        name: 'bouquet-detail',
        pageBuilder: (context, state) {
          final bouquetId = state.pathParameters['bouquetId']!;
          return MaterialPage(
            child: BouquetDetailScreen(bouquetId: bouquetId),
          );
        },
      ),
      
      // Gallery route
      GoRoute(
        path: RoutePaths.gallery,
        name: 'gallery',
        pageBuilder: (context, state) => const MaterialPage(
          child: GalleryScreen(),
        ),
      ),
      
      // Profile route
      GoRoute(
        path: RoutePaths.profile,
        name: 'profile',
        pageBuilder: (context, state) => const MaterialPage(
          child: ProfileScreen(),
        ),
      ),
      
      // Error handling routes
      GoRoute(
        path: RoutePaths.notFound,
        name: 'not-found',
        pageBuilder: (context, state) => const MaterialPage(
          child: NotFoundScreen(),
        ),
      ),
      
      GoRoute(
        path: RoutePaths.error,
        name: 'error',
        pageBuilder: (context, state) {
          final error = state.extra as String?;
          return MaterialPage(
            child: ErrorScreen(error: error),
          );
        },
      ),
    ],
    
    // Error page builder
    errorPageBuilder: (context, state) => MaterialPage(
      key: state.pageKey,
      child: ErrorScreen(error: state.error?.toString()),
    ),
    
    // Redirect logic (for auth, etc.)
    redirect: (context, state) {
      // Add authentication redirect logic here if needed
      return null;
    },
  );
}

/// Provider for the router
final routerProvider = Provider<GoRouter>((ref) {
  return AppRouter.router;
});