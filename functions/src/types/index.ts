import {Timestamp} from "firebase-admin/firestore";

// === Core Data Models ===

export interface Flower {
  name: string;
  nameEn: string;
  meaning: string;
  meaningEn: string;
  colors: string[];
  season: "spring" | "summer" | "autumn" | "winter" | "all";
  rarity: "common" | "rare" | "exotic";
  imageUrl?: string;
}

export interface EmotionAnalysis {
  id: string;
  userId: string;
  inputText: string;
  detectedEmotions: string[];
  confidence: number;
  recommendedFlowers: Flower[];
  language: "ja" | "en";
  createdAt: Timestamp;
}

export interface GeneratedBouquet {
  id: string;
  emotionId: string;
  userId: string;
  flowers: Flower[];
  imageUrl: string;
  prompt: string;
  style: string;
  isPublic: boolean;
  likes: number;
  shares: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  preferences: {
    language: "ja" | "en";
    theme: "light" | "dark";
    defaultPublic: boolean;
  };
  stats: {
    totalBouquets: number;
    totalLikes: number;
    joinedAt: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// === API Request/Response Types ===

export interface AnalyzeEmotionRequest {
  text: string;
  language?: "ja" | "en";
  userId?: string;
}

export interface AnalyzeEmotionResponse {
  emotions: string[];
  confidence: number;
  flowers: Flower[];
  explanation: string;
  emotionId: string;
}

export interface GenerateBouquetRequest {
  emotionId: string;
  flowers: Flower[];
  style?: "realistic" | "artistic" | "minimalist" | "romantic";
  isPublic?: boolean;
  userId?: string;
}

export interface GenerateBouquetResponse {
  bouquetId: string;
  imageUrl: string;
  prompt: string;
  flowers: Flower[];
  style: string;
}

export interface PublicBouquetsRequest {
  limit?: number;
  orderBy?: "createdAt" | "likes" | "shares";
  startAfter?: string;
}

export interface PublicBouquetsResponse {
  bouquets: GeneratedBouquet[];
  hasMore: boolean;
  nextPageToken?: string;
}

// === Gemini API Types ===

export interface GeminiEmotionPrompt {
  text: string;
  language: "ja" | "en";
}

export interface GeminiEmotionResponse {
  emotions: string[];
  confidence: number;
  flowers: {
    name: string;
    nameEn: string;
    meaning: string;
    reason: string;
  }[];
  explanation: string;
}

// === Vertex AI Types ===

export interface VertexImageRequest {
  prompt: string;
  aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3";
  style?: string;
  quality?: "standard" | "high";
}

export interface VertexImageResponse {
  imageUrl: string;
  prompt: string;
  generatedAt: string;
}

// === Error Types ===

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
      message: string,
      code: string = "INTERNAL_ERROR",
      statusCode: number = 500,
      details?: any
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
  }
}

// === Constants ===

export const EMOTION_CATEGORIES = [
  "joy", "sadness", "anger", "fear", "surprise", "disgust",
  "love", "gratitude", "hope", "nostalgia", "peace", "excitement",
  "comfort", "longing", "appreciation", "sympathy", "celebration",
] as const;

export const BOUQUET_STYLES = [
  "realistic", "artistic", "minimalist", "romantic", "modern", "classical",
] as const;

export type EmotionCategory = typeof EMOTION_CATEGORIES[number];
export type BouquetStyle = typeof BOUQUET_STYLES[number];