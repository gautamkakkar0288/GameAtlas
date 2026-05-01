const prisma = require("../config/prisma");

exports.updatePlaytime = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { gameId, minutesPlayed } = req.body;

    const updated = await prisma.userLibrary.update({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      },
      data: {
        playtime: {
          increment: minutesPlayed
        }
      }
    });

    res.json({
      message: "Playtime updated",
      updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};