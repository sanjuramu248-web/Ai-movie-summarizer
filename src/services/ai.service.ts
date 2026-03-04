import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateAISummary = async (reviews: string[]) => {
  try {
    // Validate input
    if (!reviews || reviews.length === 0 || !reviews[0]) {
      return {
        summary: "No reviews or plot information available for analysis",
        sentiment: "mixed"
      };
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const combinedReviews = reviews.join('\n\n');
    
    // Check if this is a plot (single item) or reviews (multiple items)
    const isPlot = reviews.length === 1 && reviews[0].length < 500;
    
    const prompt = isPlot 
      ? `Analyze the following movie plot and provide:
1. A brief insight about the movie's theme and appeal (2-3 sentences)
2. Expected sentiment based on the plot (must be exactly one of: positive, negative, or mixed)

Plot:
${combinedReviews}

Respond ONLY with valid JSON in this exact format: {"summary": "your analysis here", "sentiment": "positive"}`
      : `Analyze the following movie reviews and provide:
1. A concise summary of audience opinions (2-3 sentences)
2. Overall sentiment (must be exactly one of: positive, negative, or mixed)

Reviews:
${combinedReviews}

Respond ONLY with valid JSON in this exact format: {"summary": "your analysis here", "sentiment": "positive"}`;

    console.log("🤖 Calling Gemini AI...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("✅ AI Response received:", text.substring(0, 100) + "...");

    if (!text) {
      throw new Error("Empty response from AI");
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsedResult = JSON.parse(jsonText);
    
    // Validate parsed result
    if (!parsedResult.summary || !parsedResult.sentiment) {
      throw new Error("Invalid AI response format");
    }
    
    // Ensure sentiment is valid
    const validSentiments = ['positive', 'negative', 'mixed'];
    const sentiment = validSentiments.includes(parsedResult.sentiment.toLowerCase()) 
      ? parsedResult.sentiment.toLowerCase() 
      : 'mixed';
    
    console.log("✅ AI Analysis complete:", sentiment);
    
    return {
      summary: parsedResult.summary,
      sentiment: sentiment
    };
  } catch (error: any) {
    console.error("❌ AI generation error:", error.message || error);
    
    // Fallback to simple keyword analysis
    const combinedText = reviews.join(' ').toLowerCase();
    const positiveWords = ['amazing', 'excellent', 'great', 'love', 'perfect', 'best', 'wonderful', 'fantastic', 'brilliant'];
    const negativeWords = ['bad', 'terrible', 'worst', 'hate', 'awful', 'poor', 'disappointing', 'boring'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const matches = combinedText.match(new RegExp(word, 'gi'));
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const matches = combinedText.match(new RegExp(word, 'gi'));
      if (matches) negativeCount += matches.length;
    });
    
    let sentiment = "mixed";
    if (positiveCount > negativeCount * 1.5) sentiment = "positive";
    else if (negativeCount > positiveCount * 1.5) sentiment = "negative";
    
    console.log("⚠️ Using fallback analysis:", sentiment);
    
    return {
      summary: `Analysis based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}. Viewers ${sentiment === 'positive' ? 'highly praise' : sentiment === 'negative' ? 'express concerns about' : 'have mixed feelings about'} this film.`,
      sentiment
    };
  }
};
