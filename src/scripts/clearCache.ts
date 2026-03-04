import prisma from "../lib/prisma";

async function clearCache() {
  try {
    // Delete specific movie by IMDb ID
    const imdbId = process.argv[2] || "tt1009860";
    
    const deleted = await prisma.movie.delete({
      where: { imdbId }
    });
    
    console.log(`✅ Deleted movie: ${deleted.title} (${imdbId})`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.log('Movie not found in cache');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

clearCache();
