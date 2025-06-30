import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Enhanced CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:3000', 
    'https://sakisou-dev.web.app',
    'https://sakisou-dev.firebaseapp.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? 'with body' : 'no body');
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check called");
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// Enhanced emotion analysis with better mock data
app.post("/api/analyze-emotion", (req, res) => {
  try {
    console.log("Emotion analysis called with:", req.body);
    
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: "メッセージが入力されていません",
        code: "INVALID_MESSAGE"
      });
    }

    // Enhanced mock response with multiple emotion patterns
    const emotionPatterns = [
      {
        keywords: ['ありがとう', '感謝', 'ありがた'],
        emotions: ["gratitude", "appreciation", "warmth"],
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
        explanation: "あなたのメッセージからは深い感謝と温かい気持ちが感じられます。"
      },
      {
        keywords: ['頑張', 'がんば', '応援', 'できる'],
        emotions: ["encouragement", "support", "hope"],
        flowers: [
          {
            name: "ひまわり",
            nameEn: "Sunflower",
            meaning: "憧れ、あなただけを見つめる",
            meaningEn: "Admiration, looking only at you",
            colors: ["yellow"],
            season: "summer",
            rarity: "common",
            reason: "力強い応援の気持ちを表現します"
          },
          {
            name: "ガーベラ",
            nameEn: "Gerbera", 
            meaning: "希望、常に前進",
            meaningEn: "Hope, always moving forward",
            colors: ["orange", "yellow"],
            season: "all",
            rarity: "common",
            reason: "前向きなエネルギーを込めて"
          },
          {
            name: "アルストロメリア",
            nameEn: "Alstroemeria",
            meaning: "持続する友情、エール",
            meaningEn: "Lasting friendship, encouragement",
            colors: ["pink", "yellow", "white"],
            season: "all",
            rarity: "common",
            reason: "継続的な応援の想いを表現します"
          }
        ],
        explanation: "あなたの応援メッセージには強い希望と支援の気持ちが込められています。"
      },
      {
        keywords: ['ごめん', '申し訳', '反省', '謝'],
        emotions: ["apology", "regret", "sincerity"],
        flowers: [
          {
            name: "白いユリ",
            nameEn: "White Lily",
            meaning: "純潔、威厳、心からの謝罪",
            meaningEn: "Purity, dignity, sincere apology",
            colors: ["white"],
            season: "spring",
            rarity: "common",
            reason: "真摯な謝罪の気持ちを表現します"
          },
          {
            name: "忘れな草",
            nameEn: "Forget-me-not",
            meaning: "真実の愛、私を忘れないで",
            meaningEn: "True love, don't forget me",
            colors: ["blue"],
            season: "spring",
            rarity: "common",
            reason: "関係を大切にしたい想いを込めて"
          },
          {
            name: "白いカーネーション",
            nameEn: "White Carnation",
            meaning: "純粋な愛、尊敬",
            meaningEn: "Pure love, respect",
            colors: ["white"],
            season: "all",
            rarity: "common",
            reason: "純粋な心からの謝罪を表現します"
          }
        ],
        explanation: "あなたのメッセージからは真摯な反省と謝罪の気持ちが伝わってきます。"
      }
    ];

    // Find matching pattern
    let selectedPattern = emotionPatterns[0]; // default to gratitude
    const lowerMessage = message.toLowerCase();
    
    for (const pattern of emotionPatterns) {
      if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
        selectedPattern = pattern;
        break;
      }
    }

    const mockResponse = {
      emotions: selectedPattern.emotions,
      confidence: 0.85,
      flowers: selectedPattern.flowers,
      explanation: selectedPattern.explanation,
      emotionId: "analysis-" + Date.now(),
      processedAt: new Date().toISOString()
    };

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error("Error in emotion analysis:", error);
    res.status(500).json({
      error: "感情分析中にエラーが発生しました",
      code: "ANALYSIS_ERROR"
    });
  }
});

// Enhanced bouquet generation with better mock images
app.post("/api/generate-bouquet", (req, res) => {
  try {
    console.log("Bouquet generation called with:", req.body);
    
    const { flowers, style = "realistic" } = req.body;
    
    if (!flowers || !Array.isArray(flowers) || flowers.length === 0) {
      return res.status(400).json({
        error: "花の情報が不正です",
        code: "INVALID_FLOWERS"
      });
    }

    // Better mock images based on flower types
    const mockImages = [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=400&fit=crop&crop=center", // Pink roses bouquet
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop&crop=center", // Mixed flower bouquet
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=400&fit=crop&crop=center", // White flowers bouquet
      "https://images.unsplash.com/photo-1594736797933-d0b22ee22fce?w=500&h=400&fit=crop&crop=center", // Sunflower bouquet
      "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&h=400&fit=crop&crop=center"  // Colorful bouquet
    ];

    // Select image based on flower colors
    let selectedImage = mockImages[0];
    const primaryColors = flowers[0]?.colors || ["pink"];
    
    if (primaryColors.includes("yellow")) {
      selectedImage = mockImages[3]; // Sunflower
    } else if (primaryColors.includes("white")) {
      selectedImage = mockImages[2]; // White flowers
    } else if (primaryColors.includes("pink")) {
      selectedImage = mockImages[0]; // Pink roses
    } else {
      selectedImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    }

    const flowerNames = flowers.map(f => f.name || f.nameEn).join(', ');

    const mockResponse = {
      bouquetId: "bouquet-" + Date.now(),
      imageUrl: selectedImage,
      prompt: `Beautiful bouquet with ${flowerNames} in ${style} style`,
      flowers: flowers,
      style: style,
      generatedAt: new Date().toISOString(),
      metadata: {
        width: 500,
        height: 400,
        format: "jpeg",
        source: "unsplash"
      }
    };

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error("Error in bouquet generation:", error);
    res.status(500).json({
      error: "花束生成中にエラーが発生しました",
      code: "GENERATION_ERROR"
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "サーバーでエラーが発生しました",
    code: "INTERNAL_ERROR"
  });
});

// Catch all other routes
app.use("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "エンドポイントが見つかりません",
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "GET /health",
      "POST /api/analyze-emotion",
      "POST /api/generate-bouquet"
    ]
  });
});

// Export the Express app as a Firebase Function
exports.api = functions
    .region("us-central1")
    .runWith({
      timeoutSeconds: 60,
      memory: "1GB",
    })
    .https.onRequest(app);

console.log("🌸 Sakisou Firebase Functions loaded successfully");
