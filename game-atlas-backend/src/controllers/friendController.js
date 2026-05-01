const prisma = require("../config/prisma");

exports.sendFriendRequest = async (req, res) => {

  try {

    const userId = req.user.userId;
    const { friendId } = req.body;

    const request = await prisma.friend.create({
      data: {
        userId,
        friendId
      }
    });

    res.json(request);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.acceptFriendRequest = async (req, res) => {

  try {

    const { requestId } = req.body;

    const request = await prisma.friend.update({
      where: { id: requestId },
      data: { status: "accepted" }
    });

    res.json(request);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getFriends = async (req, res) => {

  try {

    const userId = req.user.userId;

    const friends = await prisma.friend.findMany({
      where: {
        userId,
        status: "accepted"
      },
      include: {
        friend: true
      }
    });

    res.json(friends);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};