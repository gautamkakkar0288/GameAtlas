const prisma = require("../config/prisma");

exports.addReview = async (req, res) => {
  try {

    const userId = req.user.userId;
    const { gameId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        gameId
      }
    });

    res.json(review);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGameReviews = async (req, res) => {

  try {

    const gameId = parseInt(req.params.gameId);

    const reviews = await prisma.review.findMany({
      where: {
        gameId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getAverageRating = async (req, res) => {

  try {

    const gameId = parseInt(req.params.gameId);

    const result = await prisma.review.aggregate({
      where: { gameId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    res.json({
      averageRating: result._avg.rating,
      totalReviews: result._count.rating
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};