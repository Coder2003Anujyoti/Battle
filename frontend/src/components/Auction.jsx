import React,{useState,useEffect} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import {socket} from "../socket/socket"
const Auction = () => {
const location = useLocation();
const { id, name } = location.state;
const [msg,setMsg]=useState("")
const [roundEnded, setRoundEnded] = useState(null)
const [player,setPlayer]=useState([])
const [data,setData]=useState([])
const [timer,setTimer]=useState(10)
const [count,setCount]=useState(0)
const [disable,setDisable]=useState(false)
const [info,setInfo]=useState([])
const [bid,setBid]=useState(0)
const [subtimer,setSubtimer]=useState(5)
const [all,setAll]=useState([])
const [lock,setLock]=useState(false)
const navigate=useNavigate()
const send_name = () => {
  if (!socket.connected) {
    socket.connect(); // ensure connection
  }

  socket.emit("join-auction-room", { name, id });
  setLock(true);
};
useEffect(()=>{
socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("auction-wait",(m)=>{
    setMsg(m.msg)
  })
socket.on("auction-start-game",(m)=>{
let val=m.players.filter((i)=>i.id==socket.id)
setPlayer(val)
setCount(prev => prev + 1)
setData(prev => {
  if (prev?.name === m.auction?.name) return prev
  return m.auction
})
setTimer(m.auction.timer)
setDisable(false)
setInfo([])
setMsg("")
setLock(false)
setRoundEnded(false)
})
socket.on("auction-timer",(count)=>{
  if (!roundEnded) {
    setTimer(count)
  }
})
socket.on("auction-bid-update",(m)=>{
let vals=m.room.filter((i)=>i.id==socket.id)
if (m.bidders[m.bidders.length - 1] === vals[0].name){
setInfo(prev => [...m.bidders])
setBid(m.bid)
setDisable(true)
}
else{
setInfo(prev => [...m.bidders])
setBid(m.bid)
setDisable(false)
}
})
socket.on("auction-updates",(m)=>{
let val=m.players.filter((i)=>i.id==socket.id)
setPlayer(val)
setData(prev => {
  if (prev?.name === m.data?.name) return prev
  return m.data
})
setInfo(prev => [...m.data.bidders])
})
socket.on("auction-round-end",(m)=>{
setRoundEnded(true)
setSubtimer(prev => {
  if (prev === m.nextIn) return prev
  return m.nextIn
})
setTimer(0)
})
socket.on("auction-final-updates",(m,ack)=>{
setAll(m.players)
ack()
})
socket.on("auction-Left",(m)=>{
setMsg(m)
setPlayer([])
})
return ()=>
socket.disconnect()
},[])
  return (
    <>
{
  msg=="" && player.length==0 && <>
  <div className="my-44 text-black font-bold flex flex-col justify-center items-center">
  <p>Name-: {name}</p>
  <p>RoomID-: {id}</p>
  { lock==false && 
    <button onClick={send_name} className={`px-6 py-3 my-6 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-sky-700  hover:scale-105`}>Join Auction</button>
    }
  </div>
  </>
}
{
  msg !== "" && player.length === 0 && (
    <>
<div className="my-44">
<p className="text-center text-md lg:text-base  text-black font-bold">
  {msg}
 </p>

      {msg !== "Waiting for others....." && (
        <div className="text-black my-12 font-bold flex flex-col justify-center items-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-sky-700 hover:scale-105"
          >
            Restart
          </button>
        </div>
      )}
  </div>
    </>
  )
}
{
  msg === "" && player.length > 0 && all.length === 0 && (
    <>
      {/* ⏱ Timer */}
<div className="flex gap-2 justify-end items-center my-3 mr-3 min-h-[50px]">
  <p className="font-bold text-md whitespace-nowrap">
    {roundEnded === false ? "Time Left to Bid-:" : "Next Pokemon in-:"}
  </p>

  <div className="w-12 h-12 rounded-full bg-sky-100 border-4 border-sky-600 flex items-center justify-center text-2xl font-bold text-sky-800 shadow-md transition-all duration-300">
    
    {/* Keep both mounted, just toggle visibility */}
    <span className={`${roundEnded === false ? "block" : "hidden"}`}>
      {timer}
    </span>

    <span className={`${roundEnded === true && subtimer > 0 ? "block" : "hidden"}`}>
      {subtimer}
    </span>

  </div>
</div>

      {/* 🧍 Player */}
      <div className="flex flex-col justify-center items-center gap-6 text-black font-bold text-lg">
        <img src={data?.image} className="w-60 h-60" />
        <p>{count}) {data?.name}</p>
      </div>

      {/* 💰 Bid Info */}
      <div className="w-full flex justify-center items-center text-md my-8 font-bold text-black">
{info.length > 0 ? (
  <p>{info[info.length - 1]} - {bid}</p>
) : (
  timer === 0 && <p>Unsold</p>
)}
      </div>

      {/* 🔘 Bid Button */}
      {(
        !disable &&
        player[0]?.players?.length < 5 &&
        timer > 0 &&
        player[0]?.purse > bid &&
        player[0]?.purse > 0
      ) && (
        <div className="flex justify-center items-center gap-6 my-8">
          <button
            onClick={() => {
              socket.emit("move-auction-bid", {
                name: player[0]?.name,
                id: player[0]?.roomID
              })
              // ⚠️ better to remove this if server controls state
              setDisable(true)
            }}
            className="px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-sky-700 hover:scale-105"
          >
            Bid Player
          </button>
        </div>
      )}

      {/* 👤 User Info */}
      <div className="flex flex-col justify-center items-center text-black font-bold text-lg">
        <p>Name-: {player[0]?.name}</p>
        <p>Purse-: {player[0]?.purse}</p>
        <p>Players Bought-: {player[0]?.players?.length}/5</p>
      </div>
    </>
  )
}
{
  msg=="" && all.length > 0 &&
    <div className="my-44 text-black font-bold flex flex-col justify-center items-center">
  <p className="text-md">Thanks for participating...</p>
  <button onClick={()=>{
    navigate("/page", {
  state: {
    id,
    name,
    teams:[]
  }
});
  }} className={`px-6 py-3 my-6 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-sky-700  hover:scale-105`}>Go Back</button>
  </div>
     
}
    </>
  );
};

export default Auction;
