import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Simple CORS middleware for development
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check called");
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Mock emotion analysis for testing
app.post("/api/analyze-emotion", (req, res) => {
  console.log("Emotion analysis called with:", req.body);
  
  const mockResponse = {
    emotions: ["gratitude", "appreciation", "warmth"],
    confidence: 0.85,
    flowers: [
      {
        name: "かすみ草",
        nameEn: "Baby's Breath",
        meaning: "清らかな心、感謝",
        meaningEn: "Pure heart, gratitude",
        colors: ["white"],
        season: "all",
        rarity: "common",
        reason: "感謝の気持ちを表現するのにぴったりです"
      },
      {
        name: "ピンクのバラ",
        nameEn: "Pink Rose", 
        meaning: "感謝、上品",
        meaningEn: "Gratitude, elegance",
        colors: ["pink"],
        season: "all",
        rarity: "common",
        reason: "温かい感謝の想いを伝えます"
      },
      {
        name: "ガーベラ",
        nameEn: "Gerbera",
        meaning: "希望、常に前進",
        meaningEn: "Hope, always moving forward",
        colors: ["yellow", "orange", "pink"],
        season: "all", 
        rarity: "common",
        reason: "前向きな気持ちを表現します"
      }
    ],
    explanation: "あなたのメッセージからは深い感謝と温かい気持ちが感じられます。",
    emotionId: "test-" + Date.now()
  };

  res.status(200).json(mockResponse);
});

// Mock bouquet generation for testing
app.post("/api/generate-bouquet", (req, res) => {
  console.log("Bouquet generation called with:", req.body);
  
  const mockResponse = {
    bouquetId: "bouquet-" + Date.now(),
    imageUrl: "https://via.placeholder.com/400x300/E8B4CB/FFFFFF?text=Beautiful+Bouquet",
    prompt: "A beautiful bouquet with the selected flowers",
    flowers: req.body.flowers || [],
    style: req.body.style || "realistic"
  };

  res.status(200).json(mockResponse);
});

// Catch all other routes
app.use("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Export the Express app as a Firebase Function
exports.api = functions
    .region("us-central1")
    .runWith({
      timeoutSeconds: 60,
      memory: "512MB",
    })
    .https.onRequest(app);

console.log("Firebase Functions loaded successfully");
