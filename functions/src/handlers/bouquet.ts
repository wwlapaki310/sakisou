import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {generateBouquetImage} from "../services/vertex";
import {GenerateBouquetRequest, GenerateBouquetResponse, GeneratedBouquet} from "../types";
import {AppError} from "../types";
import {asyncHandler} from "../middleware/errorHandler";
import {v4 as uuidv4} from "uuid";
import {z} from "zod";

const db = admin.firestore();

// Validation schema
const GenerateBouquetSchema = z.object({
  emotionId: z.string().min(1),
  flowers: z.array(z.object({
    name: z.string(),
    nameEn: z.string(),
    meaning: z.string(),
    meaningEn: z.string().optional(),
    colors: z.array(z.string()),
    season: z.enum(["spring", "summer", "autumn", "winter", "all"]),
    rarity: z.enum(["common", "rare", "exotic"]),
  })).min(1).max(10),
  style: z.enum(["realistic", "artistic", "minimalist", "romantic", "modern", "classical"]).optional().default("realistic"),
  isPublic: z.boolean().optional().default(false),
  userId: z.string().optional(),
});

/**
 * Generate bouquet image from selected flowers
 */
export const generateBouquetHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Validate request body
      const validationResult = GenerateBouquetSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(
            "Invalid request data",
            "VALIDATION_ERROR",
            400,
            validationResult.error.errors
        );
      }

      const {emotionId, flowers, style, isPublic, userId} = validationResult.data;

      console.log(`Generating bouquet for emotion ${emotionId} with ${flowers.length} flowers`);

      try {
        // Verify emotion exists if emotionId is provided
        if (emotionId !== "anonymous") {
          const emotionDoc = await db.collection("emotions").doc(emotionId).get();
          if (!emotionDoc.exists) {
            throw new AppError(
                "Emotion analysis not found",
                "NOT_FOUND",
                404
            );
          }
        }

        // Generate bouquet image using Vertex AI
        const imageResult = await generateBouquetImage(flowers, style);

        const bouquetId = uuidv4();
        const now = admin.firestore.Timestamp.now();

        // Prepare bouquet data
        const bouquetData: GeneratedBouquet = {
          id: bouquetId,
          emotionId,
          userId: userId || "anonymous",
          flowers,
          imageUrl: imageResult.imageUrl,
          prompt: imageResult.prompt,
          style,
          isPublic: isPublic || false,
          likes: 0,
          shares: 0,
          createdAt: now,
          updatedAt: now,
        };

        // Save to Firestore if user is authenticated
        if (userId && userId !== "anonymous") {
          await db.collection("bouquets").doc(bouquetId).set(bouquetData);
          console.log(`Saved bouquet ${bouquetId} for user ${userId}`);

          // Update user stats
          const userRef = db.collection("users").doc(userId);
          await userRef.update({
            "stats.totalBouquets": admin.firestore.FieldValue.increment(1),
            updatedAt: now,
          });
        }

        // Prepare response
        const response: GenerateBouquetResponse = {
          bouquetId,
          imageUrl: imageResult.imageUrl,
          prompt: imageResult.prompt,
          flowers,
          style,
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error generating bouquet:", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
            "Failed to generate bouquet",
            "BOUQUET_GENERATION_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get bouquet by ID
 */
export const getBouquetHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {bouquetId} = req.params;

      if (!bouquetId) {
        throw new AppError(
            "Bouquet ID is required",
            "VALIDATION_ERROR",
            400
        );
      }

      try {
        const doc = await db.collection("bouquets").doc(bouquetId).get();

        if (!doc.exists) {
          throw new AppError(
              "Bouquet not found",
              "NOT_FOUND",
              404
          );
        }

        const bouquet: GeneratedBouquet = {
          id: doc.id,
          ...doc.data(),
        } as GeneratedBouquet;

        res.status(200).json(bouquet);
      } catch (error) {
        console.error("Error getting bouquet:", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
            "Failed to get bouquet",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get user's bouquet history
 */
export const getUserBouquetsHandler = asyncHandler(
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
        let query = db.collection("bouquets")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(limit);

        if (startAfter) {
          const startAfterDoc = await db.collection("bouquets").doc(startAfter).get();
          if (startAfterDoc.exists) {
            query = query.startAfter(startAfterDoc);
          }
        }

        const snapshot = await query.get();
        const bouquets: GeneratedBouquet[] = [];

        snapshot.forEach((doc) => {
          bouquets.push({
            id: doc.id,
            ...doc.data(),
          } as GeneratedBouquet);
        });

        res.status(200).json({
          bouquets,
          hasMore: bouquets.length === limit,
          nextPageToken: bouquets.length > 0 ? bouquets[bouquets.length - 1].id : null,
        });
      } catch (error) {
        console.error("Error getting user bouquets:", error);
        throw new AppError(
            "Failed to get user bouquets",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Update bouquet (like, share, etc.)
 */
export const updateBouquetHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {bouquetId} = req.params;
      const {action} = req.body; // "like", "unlike", "share"

      if (!bouquetId || !action) {
        throw new AppError(
            "Bouquet ID and action are required",
            "VALIDATION_ERROR",
            400
        );
      }

      try {
        const bouquetRef = db.collection("bouquets").doc(bouquetId);
        const doc = await bouquetRef.get();

        if (!doc.exists) {
          throw new AppError(
              "Bouquet not found",
              "NOT_FOUND",
              404
          );
        }

        const updateData: any = {
          updatedAt: admin.firestore.Timestamp.now(),
        };

        switch (action) {
          case "like":
            updateData.likes = admin.firestore.FieldValue.increment(1);
            break;
          case "unlike":
            updateData.likes = admin.firestore.FieldValue.increment(-1);
            break;
          case "share":
            updateData.shares = admin.firestore.FieldValue.increment(1);
            break;
          default:
            throw new AppError(
                "Invalid action",
                "VALIDATION_ERROR",
                400
            );
        }

        await bouquetRef.update(updateData);

        res.status(200).json({
          success: true,
          action,
          bouquetId,
        });
      } catch (error) {
        console.error("Error updating bouquet:", error);
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError(
            "Failed to update bouquet",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);