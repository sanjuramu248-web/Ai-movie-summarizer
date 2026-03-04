import { z } from "zod";

/* IMDb ID validation */
export const imdbSchema = z.object({
  imdbId: z
    .string()
    .min(1, "IMDb ID is required")
    .regex(/^tt\d{7,8}$/, "Invalid IMDb ID format (example: tt0133093)")
});


export const reviewSchema = z.object({
  author: z.string().optional(),
  content: z.string().min(5, "Review must be at least 5 chars"),
  rating: z.number().min(0).max(10).optional()
});


export const aiInsightSchema = z.object({
  summary: z.string().min(10),
  sentiment: z.enum(["POSITIVE", "MIXED", "NEGATIVE"])
});