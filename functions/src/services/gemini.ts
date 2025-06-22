import {VertexAI} from "@google-cloud/vertexai";
import {GeminiEmotionPrompt, GeminiEmotionResponse, Flower} from "../types";
import {AppError} from "../types";
import {flowersDatabase} from "../data/flowers";

const PROJECT_ID = process.env.GCLOUD_PROJECT || "sakisou-dev";
const LOCATION = process.env.GEMINI_LOCATION || "us-central1";
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-1.5-flash";

const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

const model = vertexAI.getGenerativeModel({
  model: MODEL_NAME,
});

/**
 * Analyze emotion from text and recommend flowers using Gemini API
 */
export async function analyzeEmotion(
    request: GeminiEmotionPrompt
): Promise<GeminiEmotionResponse> {
  try {
    const prompt = createEmotionAnalysisPrompt(request.text, request.language);

    const result = await model.generateContent({
      contents: [{role: "user", parts: [{text: prompt}]}],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError(
          "No response from Gemini API",
          "GEMINI_NO_RESPONSE",
          500
      );
    }

    return parseGeminiResponse(text, request.language);
  } catch (error) {
    console.error("Error in Gemini emotion analysis:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
        "Failed to analyze emotion",
        "GEMINI_ANALYSIS_ERROR",
        500,
        error
    );
  }
}

/**
 * Create emotion analysis prompt for Gemini
 */
function createEmotionAnalysisPrompt(text: string, language: "ja" | "en"): string {
  const flowerNames = flowersDatabase.map((f) => {
    return language === "ja" ? f.name : f.nameEn;
  }).join(", ");

  if (language === "ja") {
    return `あなたは花言葉に詳しい心理カウンセラーです。
以下のテキストから感情を分析し、適切な花言葉を持つ花を3-5種類推薦してください。

【分析対象テキスト】
"${text}"

【利用可能な花】
${flowerNames}

【回答形式（必ずJSONで回答）】
{
  "emotions": ["感情1", "感情2", "感情3"],
  "confidence": 0.85,
  "flowers": [
    {
      "name": "桜",
      "nameEn": "Cherry Blossom",
      "meaning": "精神美、優美な女性",
      "reason": "この感情にふさわしい理由の説明"
    }
  ],
  "explanation": "感情分析の詳細説明"
}

注意：
- emotionsは主要な感情を3つまで
- confidenceは0-1の信頼度
- flowersは3-5種類
- 日本の花言葉文化を重視
- JSON形式で回答すること`;
  } else {
    return `You are a psychology counselor specializing in flower language.
Analyze the emotions in the following text and recommend 3-5 flowers with appropriate meanings.

【Text to Analyze】
"${text}"

【Available Flowers】
${flowerNames}

【Response Format (Must be JSON)】
{
  "emotions": ["emotion1", "emotion2", "emotion3"],
  "confidence": 0.85,
  "flowers": [
    {
      "name": "桜",
      "nameEn": "Cherry Blossom",
      "meaning": "Spiritual beauty, elegant woman",
      "reason": "Explanation of why this flower fits the emotion"
    }
  ],
  "explanation": "Detailed explanation of emotion analysis"
}

Note:
- emotions: up to 3 main emotions
- confidence: 0-1 confidence score
- flowers: 3-5 varieties
- Focus on Japanese flower language culture
- Respond in JSON format`;
  }
}

/**
 * Parse Gemini response and validate
 */
function parseGeminiResponse(
    text: string,
    language: "ja" | "en"
): GeminiEmotionResponse {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
                     text.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText);

    // Validate response structure
    if (!parsed.emotions || !Array.isArray(parsed.emotions)) {
      throw new Error("Invalid emotions format");
    }

    if (!parsed.flowers || !Array.isArray(parsed.flowers)) {
      throw new Error("Invalid flowers format");
    }

    if (typeof parsed.confidence !== "number" ||
        parsed.confidence < 0 || parsed.confidence > 1) {
      throw new Error("Invalid confidence value");
    }

    // Match recommended flowers with database
    const matchedFlowers: Flower[] = [];
    for (const flowerRec of parsed.flowers) {
      const flower = flowersDatabase.find((f) => {
        return f.name === flowerRec.name || f.nameEn === flowerRec.nameEn;
      });

      if (flower) {
        matchedFlowers.push(flower);
      }
    }

    return {
      emotions: parsed.emotions.slice(0, 3), // Limit to 3 emotions
      confidence: parsed.confidence,
      flowers: parsed.flowers,
      explanation: parsed.explanation || "",
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    console.error("Raw response:", text);
    throw new AppError(
        "Failed to parse emotion analysis response",
        "GEMINI_PARSE_ERROR",
        500,
        {originalResponse: text, parseError: error}
    );
  }
}