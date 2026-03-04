import { generateAISummary } from "../services/ai.service";

async function testAI() {
  console.log("🧪 Testing AI Service...\n");

  // Test 1: With a plot (no reviews scenario)
  console.log("Test 1: Analyzing movie plot");
  const plotTest = await generateAISummary([
    "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes, while the government sees him as a threat to law and order. Rocky must battle threats from all sides for unchallenged supremacy."
  ]);
  console.log("Result:", plotTest);
  console.log("");

  // Test 2: With reviews
  console.log("Test 2: Analyzing movie reviews");
  const reviewsTest = await generateAISummary([
    "This movie is absolutely amazing! The action sequences are mind-blowing and the performances are top-notch.",
    "One of the best action films I've seen. The cinematography is stunning and the story keeps you engaged throughout.",
    "A masterpiece! The director has created something truly special here."
  ]);
  console.log("Result:", reviewsTest);
  console.log("");

  // Test 3: Empty array
  console.log("Test 3: Empty reviews array");
  const emptyTest = await generateAISummary([]);
  console.log("Result:", emptyTest);
  
  console.log("\n✅ AI Testing Complete!");
}

testAI().catch(console.error);
