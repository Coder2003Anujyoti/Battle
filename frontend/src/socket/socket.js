import { io } from "socket.io-client";
export const socket = io("https://miniature-toma-aliudufu-dfe931ca.koyeb.app/", {
  reconnection: true,
  reconnectionAttempts: Infinity,   
  reconnectionDelay: 1000,         
  reconnectionDelayMax: 5000,     
  timeout: 20000,                  
  transports: ["websocket"],       
  autoConnect: true,
});