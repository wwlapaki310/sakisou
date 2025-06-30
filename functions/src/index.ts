import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Vertex AI
const project = process.env.GOOGLE_CLOUD_PROJECT || 'sakisou-dev';
const location = 'us-central1';
const vertexAI = new VertexAI({ project, location });

// Initialize Gemini model
const model = 'gemini-1.5-flash-001';

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
    version: "3.0.0",
    environment: process.env.NODE_ENV || "development",
    ai_provider: "Google Cloud Vertex AI",
    model: model
  });
});

// Flower language database
const flowerDatabase = [
  {
    name: "かすみ草",
    nameEn: "Baby's Breath",
    meaning: "清らかな心、感謝",
    meaningEn: "Pure heart, gratitude",
    colors: ["white"],
    season: "all",
    rarity: "common",
    emotions: ["gratitude", "purity", "appreciation"]
  },
  {
    name: "ピンクのバラ",
    nameEn: "Pink Rose", 
    meaning: "感謝、上品",
    meaningEn: "Gratitude, elegance",
    colors: ["pink"],
    season: "all",
    rarity: "common",
    emotions: ["gratitude", "love", "appreciation"]
  },
  {
    name: "ガーベラ",
    nameEn: "Gerbera",
    meaning: "希望、常に前進",
    meaningEn: "Hope, always moving forward",
    colors: ["yellow", "orange", "pink"],
    season: "all", 
    rarity: "common",
    emotions: ["hope", "encouragement", "optimism"]
  },
  {
    name: "ひまわり",
    nameEn: "Sunflower",
    meaning: "憧れ、あなただけを見つめる",
    meaningEn: "Admiration, looking only at you",
    colors: ["yellow"],
    season: "summer",
    rarity: "common",
    emotions: ["admiration", "loyalty", "encouragement"]
  },
  {
    name: "白いユリ",
    nameEn: "White Lily",
    meaning: "純潔、威厳、心からの謝罪",
    meaningEn: "Purity, dignity, sincere apology",
    colors: ["white"],
    season: "spring",
    rarity: "common",
    emotions: ["apology", "purity", "sincerity"]
  },
  {
    name: "忘れな草",
    nameEn: "Forget-me-not",
    meaning: "真実の愛、私を忘れないで",
    meaningEn: "True love, don't forget me",
    colors: ["blue"],
    season: "spring",
    rarity: "common",
    emotions: ["remembrance", "true_love", "longing"]
  },
  {
    name: "白いカーネーション",
    nameEn: "White Carnation",
    meaning: "純粋な愛、尊敬",
    meaningEn: "Pure love, respect",
    colors: ["white"],
    season: "all",
    rarity: "common",
    emotions: ["respect", "pure_love", "admiration"]
  },
  {
    name: "アルストロメリア",
    nameEn: "Alstroemeria",
    meaning: "持続する友情、エール",
    meaningEn: "Lasting friendship, encouragement",
    colors: ["pink", "yellow", "white"],
    season: "all",
    rarity: "common",
    emotions: ["friendship", "encouragement", "support"]
  }
];

// Enhanced emotion analysis using Vertex AI Gemini
app.post("/api/analyze-emotion", async (req, res) => {
  try {
    console.log("Emotion analysis called with:", req.body);
    
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: "メッセージが入力されていません",
        code: "INVALID_MESSAGE"
      });
    }

    // Create Gemini model instance
    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Create prompt for emotion analysis
    const prompt = `
あなたは感情分析と花言葉のエキスパートです。以下のメッセージを分析し、適切な花言葉を提案してください。

メッセージ: "${message}"

以下の形式でJSONレスポンスを返してください：
{
  "emotions": ["感情1", "感情2", "感情3"],
  "confidence": 0.0-1.0の信頼度,
  "explanation": "感情分析の説明（日本語、100文字程度）",
  "flowerSuggestions": ["flower1", "flower2", "flower3"]
}

感情の種類: gratitude(感謝), love(愛), apology(謝罪), encouragement(応援), hope(希望), friendship(友情), admiration(憧れ), support(支援), joy(喜び), sadness(悲しみ), remembrance(思い出), purity(純粋), respect(尊敬)

花の種類: かすみ草, ピンクのバラ, ガーベラ, ひまわり, 白いユリ, 忘れな草, 白いカーネーション, アルストロメリア
`;

    // Call Vertex AI Gemini API
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini API response:", text);

    // Parse the JSON response
    let aiAnalysis;
    try {
      // Extract JSON from the response (handle potential markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response, using fallback:", parseError);
      // Fallback analysis
      aiAnalysis = {
        emotions: ["gratitude"],
        confidence: 0.7,
        explanation: "メッセージからポジティブな感情が感じられます。",
        flowerSuggestions: ["かすみ草", "ピンクのバラ", "ガーベラ"]
      };
    }

    // Match flowers from database
    const matchedFlowers = flowerDatabase.filter(flower => 
      aiAnalysis.flowerSuggestions?.some(suggestion => 
        flower.name.includes(suggestion) || flower.nameEn.toLowerCase().includes(suggestion.toLowerCase())
      )
    );

    // If no matches, use flowers that match detected emotions
    let finalFlowers = matchedFlowers;
    if (finalFlowers.length === 0) {
      finalFlowers = flowerDatabase.filter(flower =>
        flower.emotions.some(emotion => aiAnalysis.emotions.includes(emotion))
      ).slice(0, 3);
    }

    // Ensure we have at least 3 flowers
    if (finalFlowers.length < 3) {
      const remainingFlowers = flowerDatabase.filter(flower => 
        !finalFlowers.some(f => f.name === flower.name)
      );
      finalFlowers = [...finalFlowers, ...remainingFlowers].slice(0, 3);
    }

    // Add reasoning for each flower
    const flowersWithReason = finalFlowers.map(flower => ({
      ...flower,
      reason: `${aiAnalysis.explanation}この感情に${flower.name}がぴったりです。`
    }));

    const response_data = {
      emotions: aiAnalysis.emotions || ["gratitude"],
      confidence: aiAnalysis.confidence || 0.8,
      flowers: flowersWithReason,
      explanation: aiAnalysis.explanation || "あなたのメッセージから温かい気持ちが感じられます。",
      emotionId: "analysis-" + Date.now(),
      processedAt: new Date().toISOString(),
      aiProvider: "Google Cloud Vertex AI",
      model: model
    };

    res.status(200).json(response_data);
  } catch (error) {
    console.error("Error in emotion analysis:", error);
    
    // Fallback response in case of AI API failure
    const fallbackFlowers = flowerDatabase.slice(0, 3).map(flower => ({
      ...flower,
      reason: "メッセージから温かい気持ちが感じられます。"
    }));

    res.status(200).json({
      emotions: ["gratitude"],
      confidence: 0.7,
      flowers: fallbackFlowers,
      explanation: "あなたのメッセージから温かい気持ちが感じられます。",
      emotionId: "analysis-fallback-" + Date.now(),
      processedAt: new Date().toISOString(),
      aiProvider: "Google Cloud Vertex AI (Fallback)",
      model: model,
      note: "AI分析でエラーが発生したため、デフォルトの分析結果を返しています。"
    });
  }
});

// Enhanced bouquet generation using Vertex AI for image generation prompts
app.post("/api/generate-bouquet", async (req, res) => {
  try {
    console.log("Bouquet generation called with:", req.body);
    
    const { flowers, style = "realistic" } = req.body;
    
    if (!flowers || !Array.isArray(flowers) || flowers.length === 0) {
      return res.status(400).json({
        error: "花の情報が不正です",
        code: "INVALID_FLOWERS"
      });
    }

    // Create Gemini model instance for prompt optimization
    const generativeModel = vertexAI.preview.getGenerativeModel({
      model: model,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.8,
      },
    });

    // Create flower description
    const flowerNames = flowers.map(f => f.name || f.nameEn).join(', ');
    const flowerColors = [...new Set(flowers.flatMap(f => f.colors))].join(', ');
    const flowerMeanings = flowers.map(f => f.meaning).join(', ');

    // Generate optimized image prompt using Gemini
    const promptGenerationPrompt = `
花束の画像生成用プロンプトを作成してください。

花の種類: ${flowerNames}
花の色: ${flowerColors}
花言葉: ${flowerMeanings}
スタイル: ${style}

以下の形式で英語のプロンプトを生成してください：
"A beautiful bouquet of [flowers] in [colors], arranged in [style] style, professional photography, high quality, detailed, soft lighting"

プロンプトのみを返してください（説明不要）。
`;

    let optimizedPrompt;
    try {
      const promptResult = await generativeModel.generateContent(promptGenerationPrompt);
      const promptResponse = await promptResult.response;
      optimizedPrompt = promptResponse.text().trim().replace(/"/g, '');
    } catch (error) {
      console.warn("Failed to generate optimized prompt, using default:", error);
      optimizedPrompt = `A beautiful bouquet of ${flowerNames} in ${flowerColors} colors, arranged in ${style} style, professional photography, high quality`;
    }

    // Use high-quality stock images as placeholders
    // In a real implementation, you would call an image generation API here
    const mockImages = [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=400&fit=crop&crop=center", // Pink roses bouquet
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop&crop=center", // Mixed flower bouquet
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&h=400&fit=crop&crop=center", // White flowers bouquet
      "https://images.unsplash.com/photo-1594736797933-d0b22ee22fce?w=500&h=400&fit=crop&crop=center", // Sunflower bouquet
      "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&h=400&fit=crop&crop=center"  // Colorful bouquet
    ];

    // Select image based on flower characteristics
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

    const response_data = {
      bouquetId: "bouquet-" + Date.now(),
      imageUrl: selectedImage,
      prompt: optimizedPrompt,
      flowers: flowers,
      style: style,
      generatedAt: new Date().toISOString(),
      aiProvider: "Google Cloud Vertex AI",
      model: model,
      metadata: {
        width: 500,
        height: 400,
        format: "jpeg",
        source: "unsplash",
        note: "Image generation using Vertex AI (currently using stock photos as placeholder)"
      }
    };

    res.status(200).json(response_data);
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

// Export the Express app as a Firebase Function (Cloud Run functions)
exports.api = functions
    .region("us-central1")
    .runWith({
      timeoutSeconds: 60,
      memory: "1GB",
    })
    .https.onRequest(app);

console.log("🌸 Sakisou Firebase Functions with Google Cloud Vertex AI loaded successfully");
