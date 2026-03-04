import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ GEMINI_API_KEY not set");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log("🔍 Fetching available models...\n");
    
    // Try different model names
    const modelsToTry = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro",
      "models/gemini-pro",
      "models/gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${response.text()}\n`);
        break;
      } catch (error: any) {
        console.log(`❌ ${modelName} failed: ${error.message}\n`);
      }
    }

  } catch (error: any) {
    console.log("Error:", error.message);
  }
}

listModels();
