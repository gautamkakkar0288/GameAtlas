const prisma = require("../config/prisma");

exports.addAchievement = async (req, res) => {

  try {

    const { title, description, gameId } = req.body;

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        gameId
      }
    });

    res.json(achievement);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.unlockAchievement = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { achievementId } = req.body;

    const unlock = await prisma.userAchievement.create({

      data: {
        userId,
        achievementId
      }

    });

    res.json(unlock);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getUserAchievements = async (req, res) => {

  try {

    const userId = req.user.userId;

    const achievements = await prisma.userAchievement.findMany({

      where: { userId },

      include: {
        achievement: true
      }

    });

    res.json(achievements);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};