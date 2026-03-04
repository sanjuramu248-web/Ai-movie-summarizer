import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function testTMDB() {
  const imdbId = "tt0133093"; // The Matrix
  
  console.log("🧪 Testing TMDB API...\n");
  console.log("TMDB_API_KEY:", process.env.TMDB_API_KEY ? "✅ Set" : "❌ Not set");
  console.log("");

  if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === "your_tmdb_api_key_here") {
    console.log("❌ TMDB API key not configured!");
    console.log("\n📝 To get a TMDB API key:");
    console.log("1. Go to: https://www.themoviedb.org/signup");
    console.log("2. Create an account");
    console.log("3. Go to: https://www.themoviedb.org/settings/api");
    console.log("4. Request an API key (choose 'Developer')");
    console.log("5. Copy the API key and add to .env file");
    return;
  }

  try {
    // Step 1: Find movie by IMDb ID
    console.log("Step 1: Finding movie by IMDb ID...");
    const findRes = await axios.get(
      `https://api.themoviedb.org/3/find/${imdbId}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          external_source: 'imdb_id'
        }
      }
    );

    const movieResults = findRes.data.movie_results;
    if (!movieResults || movieResults.length === 0) {
      console.log("❌ Movie not found");
      return;
    }

    const tmdbId = movieResults[0].id;
    console.log(`✅ Found movie: ${movieResults[0].title} (TMDB ID: ${tmdbId})`);
    console.log("");

    // Step 2: Get reviews
    console.log("Step 2: Fetching reviews...");
    const reviewsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/reviews`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          page: 1
        }
      }
    );

    const reviews = reviewsRes.data.results || [];
    console.log(`✅ Found ${reviews.length} reviews`);
    console.log("");

    if (reviews.length > 0) {
      console.log("Sample review:");
      console.log("Author:", reviews[0].author);
      console.log("Content:", reviews[0].content.substring(0, 200) + "...");
      console.log("Rating:", reviews[0].author_details?.rating || "N/A");
    } else {
      console.log("ℹ️  No reviews available for this movie");
      console.log("Try another movie like:");
      console.log("- tt0468569 (The Dark Knight)");
      console.log("- tt1375666 (Inception)");
    }

    console.log("\n✅ TMDB API is working correctly!");

  } catch (error: any) {
    console.log("❌ Error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log("\n⚠️  Invalid API key. Please check your TMDB_API_KEY in .env");
    }
  }
}

testTMDB();
