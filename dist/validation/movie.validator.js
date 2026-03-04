"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiInsightSchema = exports.reviewSchema = exports.imdbSchema = void 0;
const zod_1 = require("zod");
/* IMDb ID validation */
exports.imdbSchema = zod_1.z.object({
    imdbId: zod_1.z
        .string()
        .min(1, "IMDb ID is required")
        .regex(/^tt\d{7,8}$/, "Invalid IMDb ID format (example: tt0133093)")
});
exports.reviewSchema = zod_1.z.object({
    author: zod_1.z.string().optional(),
    content: zod_1.z.string().min(5, "Review must be at least 5 chars"),
    rating: zod_1.z.number().min(0).max(10).optional()
});
exports.aiInsightSchema = zod_1.z.object({
    summary: zod_1.z.string().min(10),
    sentiment: zod_1.z.enum(["POSITIVE", "MIXED", "NEGATIVE"])
});
//# sourceMappingURL=movie.validator.js.map