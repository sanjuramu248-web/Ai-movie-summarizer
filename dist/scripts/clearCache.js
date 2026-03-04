"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
async function clearCache() {
    try {
        // Delete specific movie by IMDb ID
        const imdbId = process.argv[2] || "tt1009860";
        const deleted = await prisma_1.default.movie.delete({
            where: { imdbId }
        });
        console.log(`✅ Deleted movie: ${deleted.title} (${imdbId})`);
    }
    catch (error) {
        if (error.code === 'P2025') {
            console.log('Movie not found in cache');
        }
        else {
            console.error('Error:', error.message);
        }
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
clearCache();
//# sourceMappingURL=clearCache.js.map