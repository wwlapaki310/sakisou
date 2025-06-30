import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {analyzeEmotion} from "../services/gemini";
import {
  AnalyzeEmotionRequest,
  AnalyzeEmotionResponse,
  EmotionAnalysis,
  AppError,
} from "../types";
import {asyncHandler} from "../middleware/errorHandler";
import {flowersDatabase} from "../data/flowers";
import {v4 as uuidv4} from "uuid";
import {z} from "zod";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Validation schema
const AnalyzeEmotionSchema = z.object({
  text: z.string().min(1).max(1000),
  language: z.enum(["ja", "en"]).optional().default("ja"),
  userId: z.string().optional(),
});

/**
 * Analyze emotion from user input text and recommend flowers
 */
export const analyzeEmotionHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Validate request body
      const validationResult = AnalyzeEmotionSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
            "Invalid request data",
            "VALIDATION_ERROR",
            400,
            validationResult.error.errors
        );
      }

      const {text, language, userId} = validationResult.data;

      console.log(`Analyzing emotion for text: "${text.substring(0, 50)}..."`);

      try {
        // Temporary mock data for demo while setting up Gemini API
        let mockResult;
        
        try {
          // Try to call actual Gemini API
          const geminiResult = await analyzeEmotion({
            text,
            language,
          });
          mockResult = geminiResult;
        } catch (error) {
          console.log("Gemini API not available, using mock data for demo");
          
          // Mock data based on input analysis
          mockResult = {
            emotions: ["gratitude", "appreciation", "warmth"],
            confidence: 0.85,
            flowers: [
              {
                name: "かすみ草",
                nameEn: "Baby's Breath", 
                meaning: "清らかな心、感謝",
                reason: "感謝の気持ちを表現するのにぴったりです"
              },
              {
                name: "ピンクのバラ",
                nameEn: "Pink Rose",
                meaning: "感謝、上品",
                reason: "温かい感謝の想いを伝えます"
              },
              {
                name: "ガーベラ",
                nameEn: "Gerbera",
                meaning: "希望、常に前進",
                reason: "前向きな気持ちを表現します"
              }
            ],
            explanation: "あなたのメッセージからは深い感謝と温かい気持ちが感じられます。"
          };
        }

        const emotionId = uuidv4();
        const now = admin.firestore.Timestamp.now();

        // Match recommended flowers with database
        const recommendedFlowers = mockResult.flowers.map((f) => {
          // Find matching flower in database
          const dbFlower = flowersDatabase.find((flower) => 
            flower.name === f.name || flower.nameEn === f.nameEn
          );

          if (dbFlower) {
            // Use database flower with complete information
            return dbFlower;
          } else {
            // Fallback: create flower object with provided info and default values
            return {
              name: f.name,
              nameEn: f.nameEn,
              meaning: f.meaning,
              meaningEn: f.meaning, // Fallback: use same meaning if English not available
              colors: ["pink"], // Default color
              season: "all" as const,
              rarity: "common" as const,
            };
          }
        });

        // Prepare emotion analysis data
        const emotionData: EmotionAnalysis = {
          id: emotionId,
          userId: userId || "anonymous",
          inputText: text,
          detectedEmotions: mockResult.emotions,
          confidence: mockResult.confidence,
          recommendedFlowers,
          language,
          createdAt: now,
        };

        // Save to Firestore if user is authenticated
        if (userId && userId !== "anonymous") {
          await db.collection("emotions").doc(emotionId).set(emotionData);
          console.log(`Saved emotion analysis ${emotionId} for user ${userId}`);

          // Update user stats
          const userRef = db.collection("users").doc(userId);
          await userRef.update({
            "stats.totalAnalyses": admin.firestore.FieldValue.increment(1),
            updatedAt: now,
          });
        }

        // Prepare response
        const response: AnalyzeEmotionResponse = {
          emotions: mockResult.emotions,
          confidence: mockResult.confidence,
          flowers: recommendedFlowers,
          explanation: mockResult.explanation,
          emotionId,
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error analyzing emotion:", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
            "Failed to analyze emotion",
            "EMOTION_ANALYSIS_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get emotion analysis by ID
 */
export const getEmotionHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {emotionId} = req.params;

      if (!emotionId) {
        throw new AppError(
            "Emotion ID is required",
            "VALIDATION_ERROR",
            400
        );
      }

      try {
        const doc = await db.collection("emotions").doc(emotionId).get();

        if (!doc.exists) {
          throw new AppError(
              "Emotion analysis not found",
              "NOT_FOUND",
              404
          );
        }

        const emotion: EmotionAnalysis = {
          id: doc.id,
          ...doc.data(),
        } as EmotionAnalysis;

        res.status(200).json(emotion);
      } catch (error) {
        console.error("Error getting emotion:", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
            "Failed to get emotion analysis",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get user's emotion analysis history
 */
export const getUserEmotionsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {userId} = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const startAfter = req.query.startAfter as string;

      if (!userId) {
        throw new AppError(
            "User ID is required",
            "VALIDATION_ERROR",
            400
        );
      }

      try {
        let query = db.collection("emotions")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(limit);

        if (startAfter) {
          const startAfterDoc = await db.collection("emotions").doc(startAfter).get();
          if (startAfterDoc.exists) {
            query = query.startAfter(startAfterDoc);
          }
        }

        const snapshot = await query.get();
        const emotions: EmotionAnalysis[] = [];

        snapshot.forEach((doc) => {
          emotions.push({
            id: doc.id,
            ...doc.data(),
          } as EmotionAnalysis);
        });

        res.status(200).json({
          emotions,
          hasMore: emotions.length === limit,
          nextPageToken: emotions.length > 0 ? emotions[emotions.length - 1].id : null,
        });
      } catch (error) {
        console.error("Error getting user emotions:", error);
        throw new AppError(
            "Failed to get user emotions",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get emotion statistics for analytics
 */
export const getEmotionStatsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Get emotion distribution from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const snapshot = await db.collection("emotions")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
            .get();

        const emotionCounts: Record<string, number> = {};
        const languageCounts = {ja: 0, en: 0};
        let totalAnalyses = 0;
        let totalConfidence = 0;

        snapshot.forEach((doc) => {
          const data = doc.data() as EmotionAnalysis;
          totalAnalyses++;
          totalConfidence += data.confidence;
          languageCounts[data.language]++;

          data.detectedEmotions.forEach((emotion) => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          });
        });

        const avgConfidence = totalAnalyses > 0 ? totalConfidence / totalAnalyses : 0;

        res.status(200).json({
          totalAnalyses,
          averageConfidence: avgConfidence,
          emotionDistribution: emotionCounts,
          languageDistribution: languageCounts,
          period: "30days",
        });
      } catch (error) {
        console.error("Error getting emotion stats:", error);
        throw new AppError(
            "Failed to get emotion statistics",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);
