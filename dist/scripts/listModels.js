"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.log("❌ GEMINI_API_KEY not set");
        return;
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
            }
            catch (error) {
                console.log(`❌ ${modelName} failed: ${error.message}\n`);
            }
        }
    }
    catch (error) {
        console.log("Error:", error.message);
    }
}
listModels();
//# sourceMappingURL=listModels.js.map