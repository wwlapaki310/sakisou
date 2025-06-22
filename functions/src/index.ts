import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import {analyzeEmotionHandler} from "./handlers/emotion";
import {generateBouquetHandler} from "./handlers/bouquet";
import {getPublicBouquetsHandler} from "./handlers/gallery";
import {errorHandler} from "./middleware/errorHandler";
import {rateLimitMiddleware} from "./middleware/rateLimit";

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json({limit: "10mb"}));
app.use(rateLimitMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.post("/api/analyze-emotion", analyzeEmotionHandler);
app.post("/api/generate-bouquet", generateBouquetHandler);
app.get("/api/public-bouquets", getPublicBouquetsHandler);

// Error handling middleware
app.use(errorHandler);

// Export the Express app as a Firebase Function
exports.api = functions
    .region("us-central1")
    .runWith({
      timeoutSeconds: 300,
      memory: "1GB",
    })
    .https.onRequest(app);

// Cleanup old temporary files (runs daily)
exports.cleanupTempFiles = functions
    .region("us-central1")
    .pubsub.schedule("0 2 * * *")
    .timeZone("Asia/Tokyo")
    .onRun(async (context) => {
      const bucket = admin.storage().bucket();
      const [files] = await bucket.getFiles({
        prefix: "temp/",
      });

      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - 24); // 24 hours ago

      const deletePromises = files
          .filter((file) => {
            const created = new Date(file.metadata.timeCreated!);
            return created < cutoffDate;
          })
          .map((file) => file.delete());

      await Promise.all(deletePromises);
      console.log(`Cleaned up ${deletePromises.length} temporary files`);
    });
