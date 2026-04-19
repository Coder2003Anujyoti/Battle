const mongoose=require('mongoose');
const playerSchema = new mongoose.Schema({
       id: {type:String},
       password:{type:String},
       contestants: {type:Array},
       matches: { type: Array },
       knockouts: { type: Array},
       teams: { type: Array},
       winner: {type:String},
       runnerup: {type:String},
       thirdplace: {type:String},
       auctionStarted:{type:Boolean}
    });
    const PlayerCollection = mongoose.model("pokemons",playerSchema);
module.exports=PlayerCollection;