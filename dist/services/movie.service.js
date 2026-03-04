"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMovieReviews = exports.fetchMovieDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fetchMovieDetails = async (imdbId) => {
    try {
        const res = await axios_1.default.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`);
        const data = res.data;
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
    }
    catch (error) {
        throw new Error("Failed to fetch movie from OMDb");
    }
};
exports.fetchMovieDetails = fetchMovieDetails;
const fetchMovieReviews = async (imdbId) => {
    try {
        // Step 1: Convert IMDb ID to TMDB ID
        const findRes = await axios_1.default.get(`https://api.themoviedb.org/3/find/${imdbId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                external_source: 'imdb_id'
            }
        });
        const movieResults = findRes.data.movie_results;
        if (!movieResults || movieResults.length === 0) {
            return [];
        }
        const tmdbId = movieResults[0].id;
        const reviewsRes = await axios_1.default.get(`https://api.themoviedb.org/3/movie/${tmdbId}/reviews`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        });
        const reviews = reviewsRes.data.results || [];
        return reviews.map((review) => ({
            author: review.author,
            content: review.content,
            rating: review.author_details?.rating || null
        }));
    }
    catch (error) {
        console.error("TMDB fetch error:", error);
        return [];
    }
};
exports.fetchMovieReviews = fetchMovieReviews;
//# sourceMappingURL=movie.service.js.map