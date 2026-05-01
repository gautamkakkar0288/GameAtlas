const prisma = require("../config/prisma");

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // get user library with game genres
    const library = await prisma.userLibrary.findMany({
      where: { userId },
      include: {
        game: true
      }
    });

    if (library.length === 0) {
      return res.json({ message: "No games in library yet" });
    }

    // extract genres
    const genres = library.map(item => item.game.genre);

    // remove duplicates
    const uniqueGenres = [...new Set(genres)];

    // get games from those genres not already owned
    const ownedGameIds = library.map(item => item.gameId);

    const recommendations = await prisma.game.findMany({
      where: {
        genre: { in: uniqueGenres },
        id: { notIn: ownedGameIds }
      }
    });

    res.json(recommendations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};