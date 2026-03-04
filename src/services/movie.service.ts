import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

export const fetchMovieDetails = async (imdbId: string) => {
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
    );

    const data = res.data as any;

    if (data.Response === "False") {
      throw new Error("Movie not found");
    }

    return {
      title: data.Title,
      poster: data.Poster,
      year: data.Year,
      rating: data.imdbRating,
      plot: data.Plot,
      cast: data.Actors
    };
  } catch (error) {
    throw new Error("Failed to fetch movie from OMDb");
  }
};

export const fetchMovieReviews = async (imdbId: string) => {
  try {
    // Step 1: Convert IMDb ID to TMDB ID
    const findRes = await axios.get(
      `https://api.themoviedb.org/3/find/${imdbId}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          external_source: 'imdb_id'
        }
      }
    );

    const movieResults = (findRes.data as any).movie_results;
    if (!movieResults || movieResults.length === 0) {
      return [];
    }

    const tmdbId = movieResults[0].id;

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

    const reviews = (reviewsRes.data as any).results || [];

    return reviews.map((review: any) => ({
      author: review.author,
      content: review.content,
      rating: review.author_details?.rating || null
    }));
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return [];
  }
};
