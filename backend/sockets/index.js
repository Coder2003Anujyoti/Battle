const auctionsocket=require("../manager/auctionsocket")
const gamingsocket=require("../manager/gamingsocket")
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
   auctionsocket(io,socket) 
   gamingsocket(io,socket)
  });
};