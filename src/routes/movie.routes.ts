import { Router } from "express";
import { getMovieInsight } from "../controllers/movie.controller";

const router = Router();

router.post("/insight", getMovieInsight);

export default router;
