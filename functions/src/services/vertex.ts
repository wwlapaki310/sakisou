import {VertexAI} from "@google-cloud/vertexai";
import {VertexImageRequest, VertexImageResponse, Flower} from "../types";
import {AppError} from "../types";
import * as admin from "firebase-admin";
import {v4 as uuidv4} from "uuid";

const PROJECT_ID = process.env.GCLOUD_PROJECT || "sakisou-dev";
const LOCATION = process.env.VERTEX_AI_LOCATION || "us-central1";
const MODEL_NAME = process.env.IMAGE_MODEL_NAME || "imagen-3.0-generate-001";

const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

const model = vertexAI.getGenerativeModel({
  model: MODEL_NAME,
});

/**
 * Generate bouquet image using Vertex AI Image Generation
 */
export async function generateBouquetImage(
    flowers: Flower[],
    style: string = "realistic",
    aspectRatio: "1:1" | "9:16" | "16:9" | "4:3" = "1:1"
): Promise<VertexImageResponse> {
  try {
    const prompt = createBouquetPrompt(flowers, style);

    console.log("Generating image with prompt:", prompt);

    const request = {
      contents: [
        {
          role: "user" as const,
          parts: [
            {
              text: `Generate a beautiful bouquet image with this description: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.8,
      },
    };

    // Note: This is a placeholder for actual image generation
    // Vertex AI Image Generation API integration would go here
    // For now, we'll create a mock response
    const imageUrl = await uploadMockImage(flowers, style);

    return {
      imageUrl,
      prompt,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error generating bouquet image:", error);
    throw new AppError(
        "Failed to generate bouquet image",
        "VERTEX_IMAGE_ERROR",
        500,
        error
    );
  }
}

/**
 * Create descriptive prompt for bouquet image generation
 */
function createBouquetPrompt(flowers: Flower[], style: string): string {
  const flowerDescriptions = flowers.map((flower) => {
    const colors = flower.colors.join(", ");
    return `${flower.nameEn} (${colors})`;
  }).join(", ");

  const styleDescriptions = {
    realistic: "photorealistic, detailed, natural lighting, professional photography",
    artistic: "artistic, painterly, impressionistic, soft brushstrokes",
    minimalist: "clean, simple, minimal background, elegant composition",
    romantic: "soft, dreamy, pastel colors, romantic atmosphere",
    modern: "contemporary, bold colors, geometric arrangement",
    classical: "traditional, formal arrangement, vintage style",
  };

  const styleDesc = styleDescriptions[style as keyof typeof styleDescriptions] ||
                   styleDescriptions.realistic;

  return `A beautiful bouquet containing ${flowerDescriptions}. 
Style: ${styleDesc}. 
High quality, professional composition, beautiful lighting, 
elegant arrangement, fresh flowers, detailed petals and leaves, 
appropriate for expressing deep emotions and feelings. 
The bouquet should evoke the traditional Japanese concept of 
hanakotoba (flower language) and convey heartfelt emotions.`;
}

/**
 * Upload mock image (placeholder until actual image generation is implemented)
 */
async function uploadMockImage(flowers: Flower[], style: string): Promise<string> {
  const bucket = admin.storage().bucket();
  const fileName = `bouquets/mock/${uuidv4()}.jpg`;

  // Create a simple text-based mock image data
  const mockImageData = Buffer.from(
      `Mock bouquet image:\nFlowers: ${flowers.map((f) => f.nameEn).join(", ")}\nStyle: ${style}`,
      "utf8"
  );

  const file = bucket.file(fileName);
  await file.save(mockImageData, {
    metadata: {
      contentType: "text/plain", // This would be "image/jpeg" for real images
      metadata: {
        flowers: flowers.map((f) => f.nameEn).join(","),
        style,
        generatedAt: new Date().toISOString(),
      },
    },
  });

  // Make the file publicly accessible
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

/**
 * Delete temporary image files
 */
export async function cleanupTempImages(olderThanHours: number = 24): Promise<number> {
  try {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({
      prefix: "temp/",
    });

    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

    const filesToDelete = files.filter((file) => {
      const created = new Date(file.metadata.timeCreated!);
      return created < cutoffDate;
    });

    await Promise.all(filesToDelete.map((file) => file.delete()));

    console.log(`Cleaned up ${filesToDelete.length} temporary image files`);
    return filesToDelete.length;
  } catch (error) {
    console.error("Error cleaning up temporary images:", error);
    throw new AppError(
        "Failed to cleanup temporary images",
        "CLEANUP_ERROR",
        500,
        error
    );
  }
}