const prisma = require("../config/prisma");
const { exec } = require("child_process");

exports.launchGame = async (req, res) => {
  try {

    const userId = req.user.userId;
    const { gameId } = req.body;

    const game = await prisma.userLibrary.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });

    if (!game || !game.installed) {
      return res.status(400).json({
        message: "Game not installed"
      });
    }

    exec(`"${game.installPath}"`);

    res.json({
      message: "Game launched"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};