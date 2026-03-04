"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const router = (0, express_1.Router)();
router.post("/insight", movie_controller_1.getMovieInsight);
exports.default = router;
//# sourceMappingURL=movie.routes.js.map