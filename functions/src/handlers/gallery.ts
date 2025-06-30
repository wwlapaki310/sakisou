import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {PublicBouquetsRequest, PublicBouquetsResponse, GeneratedBouquet} from "../types";
import {AppError} from "../types";
import {asyncHandler} from "../middleware/errorHandler";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Get public bouquets for gallery
 */
export const getPublicBouquetsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const limit = parseInt(req.query.limit as string) || 20;
      const orderBy = (req.query.orderBy as string) || "createdAt";
      const startAfter = req.query.startAfter as string;

      // Validate orderBy parameter
      const validOrderBy = ["createdAt", "likes", "shares"];
      if (!validOrderBy.includes(orderBy)) {
        throw new AppError(
            "Invalid orderBy parameter",
            "VALIDATION_ERROR",
            400
        );
      }

      try {
        let query = db.collection("bouquets")
            .where("isPublic", "==", true)
            .orderBy(orderBy, "desc")
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
          const data = doc.data();
          bouquets.push({
            id: doc.id,
            ...data,
            // Don't expose user email or sensitive info in public gallery
            userId: data.userId ? "user" : "anonymous",
          } as GeneratedBouquet);
        });

        const response: PublicBouquetsResponse = {
          bouquets,
          hasMore: bouquets.length === limit,
          nextPageToken: bouquets.length > 0 ? bouquets[bouquets.length - 1].id : undefined,
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error getting public bouquets:", error);
        throw new AppError(
            "Failed to get public bouquets",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Search public bouquets
 */
export const searchPublicBouquetsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {emotions, flowers, style} = req.query;
      const limit = parseInt(req.query.limit as string) || 20;

      try {
        let query = db.collection("bouquets")
            .where("isPublic", "==", true);

        // Add filters based on query parameters
        if (style && typeof style === "string") {
          query = query.where("style", "==", style);
        }

        // For emotion and flower filtering, we'll need to do client-side filtering
        // since Firestore has limitations on array-contains queries
        query = query.orderBy("createdAt", "desc").limit(limit * 2); // Get more to filter

        const snapshot = await query.get();
        let bouquets: GeneratedBouquet[] = [];

        snapshot.forEach((doc) => {
          bouquets.push({
            id: doc.id,
            ...doc.data(),
            userId: "user", // Anonymize in public search
          } as GeneratedBouquet);
        });

        // Client-side filtering for emotions and flowers
        if (emotions && typeof emotions === "string") {
          const emotionList = emotions.split(",").map((e) => e.trim().toLowerCase());
          bouquets = bouquets.filter((bouquet) => {
            // This would require storing emotion data with bouquet
            // For now, skip this filter
            return true;
          });
        }

        if (flowers && typeof flowers === "string") {
          const flowerList = flowers.split(",").map((f) => f.trim().toLowerCase());
          bouquets = bouquets.filter((bouquet) => {
            return bouquet.flowers.some((flower) => 
              flowerList.some((searchFlower) => 
                flower.name.toLowerCase().includes(searchFlower) ||
                flower.nameEn.toLowerCase().includes(searchFlower)
              )
            );
          });
        }

        // Limit results after filtering
        bouquets = bouquets.slice(0, limit);

        const response: PublicBouquetsResponse = {
          bouquets,
          hasMore: bouquets.length === limit,
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error searching public bouquets:", error);
        throw new AppError(
            "Failed to search public bouquets",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get trending bouquets (most liked/shared recently)
 */
export const getTrendingBouquetsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const limit = parseInt(req.query.limit as string) || 10;
      const days = parseInt(req.query.days as string) || 7;

      try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffDate);

        // Get bouquets from the last N days, ordered by likes
        const query = db.collection("bouquets")
            .where("isPublic", "==", true)
            .where("createdAt", ">=", cutoffTimestamp)
            .orderBy("createdAt", "desc")
            .orderBy("likes", "desc")
            .limit(limit);

        const snapshot = await query.get();
        const bouquets: GeneratedBouquet[] = [];

        snapshot.forEach((doc) => {
          bouquets.push({
            id: doc.id,
            ...doc.data(),
            userId: "user", // Anonymize
          } as GeneratedBouquet);
        });

        // Sort by engagement score (likes + shares)
        bouquets.sort((a, b) => {
          const scoreA = (a.likes || 0) + (a.shares || 0);
          const scoreB = (b.likes || 0) + (b.shares || 0);
          return scoreB - scoreA;
        });

        const response: PublicBouquetsResponse = {
          bouquets,
          hasMore: false, // Trending doesn't have pagination
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error getting trending bouquets:", error);
        throw new AppError(
            "Failed to get trending bouquets",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);

/**
 * Get bouquet statistics for admin/analytics
 */
export const getBouquetStatsHandler = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Get total counts
        const [totalBouquets, publicBouquets] = await Promise.all([
          db.collection("bouquets").count().get(),
          db.collection("bouquets").where("isPublic", "==", true).count().get(),
        ]);

        // Get recent activity (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayTimestamp = admin.firestore.Timestamp.fromDate(yesterday);

        const recentBouquets = await db.collection("bouquets")
            .where("createdAt", ">=", yesterdayTimestamp)
            .count()
            .get();

        // Get popular styles
        const stylesSnapshot = await db.collection("bouquets")
            .where("isPublic", "==", true)
            .get();

        const styleCounts: Record<string, number> = {};
        stylesSnapshot.forEach((doc) => {
          const style = doc.data().style || "realistic";
          styleCounts[style] = (styleCounts[style] || 0) + 1;
        });

        const response = {
          totalBouquets: totalBouquets.data().count,
          publicBouquets: publicBouquets.data().count,
          recentBouquets: recentBouquets.data().count,
          popularStyles: Object.entries(styleCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([style, count]) => ({style, count})),
          timestamp: new Date().toISOString(),
        };

        res.status(200).json(response);
      } catch (error) {
        console.error("Error getting bouquet stats:", error);
        throw new AppError(
            "Failed to get bouquet statistics",
            "DATABASE_ERROR",
            500,
            error
        );
      }
    }
);