const prisma = require("../config/prisma");

exports.redirectToStore = async (req,res)=>{

  try{

    const {gameId} = req.params;

    const game = await prisma.game.findUnique({
      where:{id:parseInt(gameId)}
    });

    if(!game){
      return res.status(404).json({error:"Game not found"});
    }

    res.json({
      title:game.title,
      platform:game.platform,
      storeUrl:game.storeUrl
    });

  }catch(error){

    res.status(500).json({error:error.message});

  }

}