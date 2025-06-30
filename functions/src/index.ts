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

// Enhanced CORS middleware for development
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'https://sakisou-hackathon.web.app',
    'https://sakisou-hackathon.firebaseapp.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers for preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

// Rate limiting (less strict for development)
if (process.env.NODE_ENV === 'production') {
  app.use(rateLimitMiddleware);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    cors: "enabled"
  });
});

// API Routes
app.post("/api/analyze-emotion", analyzeEmotionHandler);
app.post("/api/generate-bouquet", generateBouquetHandler);
app.get("/api/public-bouquets", getPublicBouquetsHandler);

// Catch all route for debugging
app.use("*", (req, res) => {
  console.log(`Request to ${req.originalUrl} not found`);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

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
