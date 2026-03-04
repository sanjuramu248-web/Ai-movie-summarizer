import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import movieRoutes from "./routes/movie.routes"

const app = express();

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000", "https://ai-movie-insights-mu.vercel.app"]
}));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Routes
app.use("/api/movies", movieRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export { app };
