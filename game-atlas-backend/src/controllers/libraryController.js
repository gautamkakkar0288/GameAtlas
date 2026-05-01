const prisma = require("../config/prisma");

exports.addToLibrary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId } = req.body;

    const existing = await prisma.userLibrary.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Game already in library" });
    }

    const entry = await prisma.userLibrary.create({
      data: {
        userId,
        gameId
      }
    });

    res.status(201).json({ message: "Game added to library", entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyLibrary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const library = await prisma.userLibrary.findMany({
      where: { userId },
      include: {
        game: true
      }
    });

    res.json(library);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.installGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId, installPath } = req.body;

    const updated = await prisma.userLibrary.update({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      },
      data: {
        installed: true,
        installPath
      }
    });

    res.json({
      message: "Game installed successfully",
      updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uninstallGame = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId } = req.body;

    const updated = await prisma.userLibrary.update({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      },
      data: {
        installed: false,
        installPath: null
      }
    });

    res.json({
      message: "Game uninstalled successfully",
      updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};