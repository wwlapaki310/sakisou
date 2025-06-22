# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**咲想（sakisou）** is a Japanese AI application that analyzes user emotions from text input and recommends flowers based on their meanings (hanakotoba), then generates beautiful bouquet images. The app combines traditional Japanese flower language with modern AI technology to help users express feelings through visual flower arrangements.

## Architecture

This is a full-stack application with the following structure:

### Technology Stack
- **Frontend**: Flutter (mobile/web app) - Located in `frontend/` directory (not yet created)
- **Backend**: Node.js/Express + Cloud Run API - Located in `backend/` directory (not yet created) 
- **Database**: Firebase Firestore for data storage
- **AI Services**: 
  - Gemini API (Vertex AI) for emotion analysis and flower recommendations
  - Vertex AI Image Generation for bouquet image creation
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage for generated images
- **Hosting**: Firebase Hosting for web deployment

### Project Structure (Planned)
```
sakisou/
├── frontend/          # Flutter application
├── backend/           # Node.js API server  
├── functions/         # Firebase Functions
├── docs/             # Documentation
├── firebase.json     # Firebase configuration
├── firestore.rules   # Firestore security rules (to be created)
├── storage.rules     # Storage security rules (to be created)
└── firestore.indexes.json # Firestore indexes (to be created)
```

## Development Commands

### Firebase Commands
```bash
# Start Firebase emulators for local development
firebase emulators:start

# Deploy to Firebase
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
firebase deploy --only functions
```

### Flutter Commands (when frontend/ exists)
```bash
cd frontend

# Install dependencies
flutter pub get

# Run in development mode
flutter run

# Run tests
flutter test                    # Unit tests
flutter test integration_test/  # Integration tests  
flutter test --coverage        # With coverage

# Build for production
flutter build web              # Web build
flutter build apk             # Android APK
flutter build ios             # iOS build
```

### Backend Commands (when backend/ exists)
```bash
cd backend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test                # All tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage

# Lint and format
npm run lint
npm run format

# Build for production
npm run build
```

## Firebase Configuration

The Firebase project includes:
- **Firestore**: Document database for storing user data, flower recommendations, and image metadata
- **Storage**: File storage for generated bouquet images
- **Auth**: User authentication system
- **Hosting**: Web app hosting with SPA routing
- **Functions**: Server-side functions (Node.js 18 runtime)

### Emulator Ports
- Auth: 9099
- Firestore: 8001  
- Storage: 9199
- Functions: 5001 (default)
- UI: 4000

## Development Workflow

This project follows Issue-based development with the following branch strategy:

### Branch Strategy
- `main`: Production-ready stable code
- `feature/issue-{number}`: New feature development
- `bugfix/issue-{number}`: Bug fixes
- `hotfix/issue-{number}`: Emergency fixes

### Development Process
1. Create/assign Issue on GitHub
2. Create feature branch: `feature/issue-{number}`
3. Develop with tests
4. Create Pull Request to `main`
5. Code review and merge

## AI Integration Notes

### Gemini API Integration
- Used for emotion analysis from Japanese/English text input
- Matches emotions to appropriate flower meanings (hanakotoba)
- Returns structured flower recommendations with explanations

### Vertex AI Image Generation
- Creates beautiful bouquet images based on recommended flowers
- Requires careful prompt engineering for consistent quality
- Images stored in Firebase Storage with metadata in Firestore

## Environment Setup Requirements

### Prerequisites
- Node.js 18.x or higher
- Flutter 3.24.x or higher
- Google Cloud CLI
- Firebase CLI
- Docker & Docker Compose (optional, for containerized development)

### Google Cloud Services Required
- Vertex AI (Gemini API + Image Generation)
- Cloud Run (for backend API)
- Firebase project with billing enabled

## Key Files

- `firebase.json`: Firebase project configuration
- `firestore.rules`: Database security rules (to be created)
- `storage.rules`: File storage security rules (to be created)
- `docs/DEVELOPMENT_PLAN.md`: Detailed development phases and timeline
- `CONTRIBUTING.md`: Contribution guidelines and coding standards

## Development Timeline

**Project Duration**: June 22-30, 2025 (9 days)

### Phases
1. **Foundation** (6/22): Project setup, Firebase/GCP configuration
2. **AI Core** (6/23-6/26): Emotion analysis and image generation
3. **Frontend** (6/27-6/28): Flutter UI/UX implementation  
4. **Integration** (6/29): SNS sharing and e-commerce features
5. **Final** (6/30): Testing, deployment, documentation

## Target Awards

- **Grand Prize**: Innovative AI application concept
- **Flutter Award**: Beautiful multi-platform UI/UX
- **Firebase Award**: Comprehensive Firebase ecosystem usage
- **Moonshot Award**: Revolutionary emotion expression through flower language

## Cultural Context

The app leverages **hanakotoba** (花言葉) - traditional Japanese flower language where each flower carries specific meanings and emotions. This cultural element is central to the app's value proposition of helping users express feelings through beautiful, meaningful flower arrangements.