const prisma = require("../config/prisma");

exports.addToWishlist = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { gameId } = req.body;

    const item = await prisma.wishlist.create({
      data: {
        userId,
        gameId
      }
    });

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getWishlist = async (req, res) => {

  try {

    const userId = req.user.userId;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        game: true
      }
    });

    res.json(wishlist);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.removeFromWishlist = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { gameId } = req.body;

    await prisma.wishlist.delete({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });

    res.json({
      message: "Removed from wishlist"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};