const prisma = require("../config/prisma");

exports.addGame = async (req, res) => {
  try {
    const { title, description, genre, rating, coverImage, releaseDate } = req.body;

    const game = await prisma.game.create({
      data: {
        title,
        description,
        genre,
        rating,
        coverImage,
        releaseDate: new Date(releaseDate)
      }
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await prisma.game.findMany();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) }
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchGames = async (req, res) => {

  try {

    const { query } = req.query;

    const games = await prisma.game.findMany({
      where: {
        title: {
          contains: query
        }
      }
    });

    res.json(games);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.getTrendingGames = async (req, res) => {

  try {

    const games = await prisma.game.findMany({
      include: {
        reviews: true,
        wishlist: true
      }
    });

    const trending = games
      .map(game => ({
        ...game,
        reviewCount: game.reviews.length,
        wishlistCount: game.wishlist.length
      }))
      .sort((a, b) =>
        (b.reviewCount + b.wishlistCount) -
        (a.reviewCount + a.wishlistCount)
      )
      .slice(0, 10);

    res.json(trending);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.createGame = async (req,res)=>{

  try{

    const {title,description,genre,rating,coverImage,releaseDate,platform,storeUrl} = req.body;

    const game = await prisma.game.create({
      data:{
        title,
        description,
        genre,
        rating,
        coverImage,
        releaseDate,
        platform,
        storeUrl
      }
    });

    res.json(game);

  }catch(error){
    res.status(500).json({error:error.message});
  }

}