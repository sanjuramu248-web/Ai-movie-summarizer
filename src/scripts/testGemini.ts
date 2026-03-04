import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
  console.log("🧪 Testing Gemini AI...\n");
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Not set");
  console.log("");

  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ Gemini API key not configured!");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("Testing with sample reviews...");
    
    const sampleReviews = [
      "This movie is absolutely amazing! The action sequences are mind-blowing.",
      "One of the best sci-fi films ever made. Keanu Reeves is perfect.",
      "The visual effects are stunning and the story is thought-provoking."
    ];

    const prompt = `Analyze the following movie reviews and provide:
1. A concise summary of audience opinions (2-3 sentences)
2. Overall sentiment (must be exactly one of: positive, negative, or mixed)

Reviews:
${sampleReviews.join('\n\n')}

Respond in JSON format: { "summary": "...", "sentiment": "positive|negative|mixed" }`;

    console.log("\nSending request to Gemini...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n✅ Response received!");
    console.log("Raw response:", text);
    console.log("");

    // Try to parse
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsedResult = JSON.parse(jsonText);
    console.log("✅ Parsed result:");
    console.log("Summary:", parsedResult.summary);
    console.log("Sentiment:", parsedResult.sentiment);
    console.log("\n✅ Gemini AI is working correctly!");

  } catch (error: any) {
    console.log("\n❌ Error occurred:");
    console.log("Error message:", error.message);
    console.log("Error details:", error);
    
    if (error.message?.includes('API key')) {
      console.log("\n⚠️  API key issue. Please verify your GEMINI_API_KEY");
    }
  }
}

testGemini();
