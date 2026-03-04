"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieInsight = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const movie_validator_1 = require("../validation/movie.validator");
const movie_service_1 = require("../services/movie.service");
const ai_service_1 = require("../services/ai.service");
const getMovieInsight = async (req, res) => {
    try {
        // 1️⃣ Validate input
        const { imdbId } = movie_validator_1.imdbSchema.parse(req.body);
        // 2️⃣ Check if movie already exists in DB (cache optimization)
        const existingMovie = await prisma_1.default.movie.findUnique({
            where: { imdbId },
            include: {
                aiInsight: true,
                reviews: true
            }
        });
        if (existingMovie && existingMovie.aiInsight) {
            return res.json({
                success: true,
                data: existingMovie
            });
        }
        // 3️⃣ Fetch movie details from OMDb
        const movieData = await (0, movie_service_1.fetchMovieDetails)(imdbId);
        // 4️⃣ Fetch reviews from TMDB
        const reviews = await (0, movie_service_1.fetchMovieReviews)(imdbId);
        // 5️⃣ Generate AI summary (even if no reviews)
        let aiResult;
        if (reviews.length > 0) {
            aiResult = await (0, ai_service_1.generateAISummary)(reviews.map((r) => r.content));
        }
        else {
            // Use AI to generate insights from plot when no reviews available
            aiResult = await (0, ai_service_1.generateAISummary)([movieData.plot || "No plot available"]);
        }
        // 6️⃣ Save movie in DB
        const createdMovie = await prisma_1.default.movie.create({
            data: {
                imdbId,
                title: movieData.title,
                poster: movieData.poster,
                year: movieData.year,
                rating: movieData.rating,
                plot: movieData.plot,
                cast: movieData.cast,
                reviews: {
                    create: reviews
                },
                aiInsight: {
                    create: {
                        summary: aiResult.summary,
                        sentiment: aiResult.sentiment.toUpperCase()
                    }
                }
            },
            include: {
                reviews: true,
                aiInsight: true
            }
        });
        res.json({
            success: true,
            data: createdMovie
        });
    }
    catch (error) {
        console.error(error);
        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0]?.message || "Validation failed",
                errors: error.errors
            });
        }
        res.status(400).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};
exports.getMovieInsight = getMovieInsight;
//# sourceMappingURL=movie.controller.js.map