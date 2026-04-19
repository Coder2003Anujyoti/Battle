const express = require('express');
const { Server } = require('socket.io');
const setupSockets = require('./sockets/index');
const creation=require("./files/creation.js")
const bodyParser = require('body-parser');
const cors=require('cors');
const http = require('http');
const app = express();
const  connectDB = require('./db/config.js');
const dotenv = require('dotenv');
dotenv.config();
connectDB();
app.use(cors({
  origin:'*'
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
  transports: ["websocket"], 
  pingInterval: 25000,  
  pingTimeout: 15000
});
setupSockets(io);
app.use(creation)
server.listen(8000, () => {
  console.log('Server running on port 8000');
});