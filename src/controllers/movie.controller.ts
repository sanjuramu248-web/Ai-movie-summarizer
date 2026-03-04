import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { imdbSchema } from "../validation/movie.validator"; 
import { fetchMovieDetails, fetchMovieReviews } from "../services/movie.service";
import { generateAISummary } from "../services/ai.service";

export const getMovieInsight = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Validate input
    const { imdbId } = imdbSchema.parse(req.body);

    // 2️⃣ Check if movie already exists in DB (cache optimization)
    const existingMovie = await prisma.movie.findUnique({
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
    const movieData = await fetchMovieDetails(imdbId);

    // 4️⃣ Fetch reviews from TMDB
    const reviews = await fetchMovieReviews(imdbId);

    // 5️⃣ Generate AI summary (even if no reviews)
    let aiResult;
    if (reviews.length > 0) {
      aiResult = await generateAISummary(reviews.map((r: any) => r.content));
    } else {
      // Use AI to generate insights from plot when no reviews available
      aiResult = await generateAISummary([movieData.plot || "No plot available"]);
    }

    // 6️⃣ Save movie in DB
    const createdMovie = await prisma.movie.create({
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
            sentiment: aiResult.sentiment.toUpperCase() as any
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

  } catch (error: any) {
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