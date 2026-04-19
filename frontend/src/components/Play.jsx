import React,{useState,useEffect,useRef} from "react";
import { useLocation,useNavigate } from "react-router-dom";
import {socket} from "../socket/socket"
const Play = () => {
const location = useLocation();
const [val,setVal]=useState([])
const [msg,setMsg]=useState("")
const [turn,setTurn]=useState("")
const [choice,setChoice]=useState(0)
const [start,setStart]=useState(false)
const [lock,setLock]=useState(false)
const [timer,setTimer]=useState(20)
const inactivityTimeout = useRef(null);
const countdownInterval = useRef(null);
const buttons=[1,2,3,4,5,6]
const { matchID,matchtype,name,firstname,secondname,firstteam,secondteam,firstplayers,secondplayers } = location.state;
const teamicons=[{team:"Yoddhas",image:"Icons/Yoddhas Icon.webp"},{team:"Titans",image:"Icons/Titans Icon.webp"},{team:"Giants",image:"Icons/Giants Icon.webp"},{team:"Thalaivas",image:"Icons/Thalaivas Icon.webp"}]
const isFirst = name === firstname;
const currentTeam = isFirst ? firstteam : secondteam;
const currentPlayers = isFirst ? firstplayers : secondplayers;
const triggerInactivity = () => {
    setMsg('Connection issues...');
    socket.disconnect()
  };
  const resetInactivityTimer = () => {
  if (!start || val.game.result !== "") return;
  if (inactivityTimeout.current) {
  clearTimeout(inactivityTimeout.current);
  }
  if (countdownInterval.current) {
  clearInterval(countdownInterval.current);
}
  inactivityTimeout.current = setTimeout(triggerInactivity,20000);
  setTimer(20);
  countdownInterval.current = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(countdownInterval.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};
useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
const send_details=()=>{
if (!socket.connected) {
    socket.connect(); // ensure connection
  }
socket.emit("join-gaming-room",{
  name, team:currentTeam, player:currentPlayers, matchID, matchtype, teamone:firstteam, teamtwo:secondteam
})
  setLock(true)
}
const optio=(i)=>{
socket.emit("gaming-move",{choice:i})
clearInterval(countdownInterval.current);
clearTimeout(inactivityTimeout.current);
  setChoice(i)
}
useEffect(() => {
  if (start==true && val.game.result === "" && turn === "Your Turn") {
    resetInactivityTimer();
  }
}, [start, turn]);
useEffect(()=>{
socket.on("connect", () => {
  console.log("Connected:", socket.id);
  });
socket.on("gaming-wait",(m)=>{
  setMsg(m)
})
socket.on("gaming-start",(m)=>{
setVal(m)
  setMsg("")
  setStart(true)
})
socket.on("make-score",(m)=>{
if(m.game.result != ""){
clearInterval(countdownInterval.current);
clearTimeout(inactivityTimeout.current);
}
  setVal(m)
})
socket.on("gaming-turn",(m)=>{
if(m == "Your Turn"){
  setTurn(m)
  setChoice(0)
  resetInactivityTimer();
}
else{
  setTurn(m)
  clearInterval(countdownInterval.current);
 clearTimeout(inactivityTimeout.current);
 setTimer(0)
}
})
socket.on('gaming-Left',(mseg)=>{
  clearInterval(countdownInterval.current);
  clearTimeout(inactivityTimeout.current);
    setMsg(mseg)
  
  })
  return () => {
    socket.disconnect()
    clearInterval(countdownInterval.current);
    clearTimeout(inactivityTimeout.current);
  };
},[])
  return (
    <>
{ msg!= "" && 
<div className="text-center text-md flex flex-col gap-4 justify-center items-center font-bold my-44 text-black font-bold">
<h1>{msg}</h1>
{ msg != 'Waiting for another player...' &&
<button className="w-28 py-2 my-6 px-2 flex justify-center items-center bg-sky-700 text-white rounded-md font-bold" onClick={()=>window.location.reload()}>Restart</button>}
</div>
}
{
  msg=="" && val.length == 0 &&
  <>
<div className="flex flex-col ml-2 mr-2 gap-4 my-4 justify-center items-center lg:px-20 md:justify-center md:items-center md:py-3 lg:ml-16 lg:gap-10 lg:items-center lg:justify-center lg:flex-row lg:flex-wrap">
<div className="flex flex-col rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
 <div className="w-full mt-2 flex flex-row">
 <div className="w-2/5 ml-2 gap-1 flex flex-col items-center justify-center">
 <img src={teamicons.filter((it)=>it.team==firstteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${firstteam}.webp`} className="w-12 h-12"/>
 </div>
  <div className="w-1/5 ml-2 mr-2 flex flex-col items-center justify-center">
<h1 className="text-base text-black font-bold">V/S</h1>
 </div>
 <div className="w-2/5 gap-1 mr-2 flex flex-col items-center justify-center">
 <img src={teamicons.filter((it)=>it.team==secondteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${secondteam}.webp`} className="w-12 h-12"/>
 </div>
    </div>
    </div>
</div>
<div className="flex flex-col gap-4 justify-center items-center my-2">
<div className="flex flex-col items-center gap-2">
<img src={`Logos/${currentTeam}.webp`} className="w-16 h-16"/>
</div>
<div className="flex flex-wrap justify-center gap-3">
{ currentPlayers?.map((player, index) => (
<div key={index} className="flex flex-col items-center justify-center p-3 w-24 gap-2">
<img src={player.image} className="w-20 h-20" />
<p className="text-md text-black font-semibold text-center">{player.name}</p>
</div>))
}
</div>
{ lock==false &&
<button className="w-28 py-2 px-2 flex justify-center items-center bg-sky-700 text-white rounded-md font-bold" onClick={send_details}>Start Game</button>}
</div>
  </>
}
{
  msg=="" && start==true &&
  <>
{ timer>0 && turn=="Your Turn" && val.game.result=="" &&
<div className="flex gap-2 justify-end items-center my-3 mr-3 min-h-[50px]">
  <p className="font-bold text-md whitespace-nowrap">
  Time Left-:
  </p>
  <div className="w-12 h-12 rounded-full bg-sky-100 border-4 border-sky-600 flex items-center justify-center text-2xl font-bold text-sky-800 shadow-md transition-all duration-300">
    <span>
      {timer}
    </span>

  </div>
</div>
}
{ val.game.result == "" && 
<div className={`flex items-center justify-center gap-2 font-bold ${turn === "Your Turn" ? "p-1" : "p-4"}`}>
 
  <span className="text-base text-center">
    {val.game.turn} </span>
     <img
    src={`Logos/${val.players.find(i => i.name === val.game.turn).team}.webp`}
    className="w-10 h-10"
    alt="team"
  />
      <span className="text-base text-center">
    is Batting
  </span>
</div>
}
<div className={`flex gap-12 ml-3 mr-3 ${val.game.result !== "" ? "my-6" : ""}`}>
<div className="flex flex-col justify-center items-center gap-2">
<img src={`Logos/${val.players[0].team}.webp`} className="w-12 h-12"/>
<div className="bg-sky-700 flex flex-col justify-center items-center p-4 rounded-md">
<img src={val.game.turn == val.players[0].name ? val.players[0].player[val.game.batindex].image : val.players[0].player[val.game.ballindex].image } className="w-36 h-36" />
<p className="text-base text-white font-bold">{val.game.turn == val.players[0].name ? val.players[0].player[val.game.batindex].name : val.players[0].player[val.game.ballindex].name}</p>
<p className="text-base my-4 text-white font-bold">{val.players[0].choice}</p>
</div>
</div>
<div className="flex flex-col justify-center items-center gap-2">
<img src={`Logos/${val.players[1].team}.webp`} className="w-12 h-12"/>
<div className="bg-sky-700 flex flex-col justify-center items-center p-4 rounded-md">
<img src={val.game.turn == val.players[1].name ? val.players[1].player[val.game.batindex].image : val.players[1].player[val.game.ballindex].image} className="w-36 h-36" />
<p className="text-base text-white font-bold">{val.game.turn == val.players[1].name ? val.players[1].player[val.game.batindex].name : val.players[1].player[val.game.ballindex].name}</p>
<p className="text-base my-4 text-white font-bold">{val.players[1].choice}</p>
</div>
</div>
</div>
{ turn=="Your Turn" && choice==0 && val.game.result == "" &&
<div className="flex flex-row flex-wrap justify-center py-6 gap-4">
{buttons.map((i)=>{
return(<>
<div className="px-4 py-4 rounded-full bg-sky-700" onClick={()=>optio(i)}>
<button className="text-xl text-white font-bold">{i}</button>
 </div></>)})}
</div>
}
{
  turn=="Opposition Turn" &&  val.game.result == "" &&
  <>
{  
    choice != 0 ? <p className="font-bold text-center my-6">You Choose {choice}</p> :   <p className="font-bold text-center my-6">Opposition Turn</p>  
  }  
  
  </>
}
{
  val.game.result == "" && <>
  <div className="flex w-full items-center justify-center gap-3">
  <img src={`Logos/${val.players.find((i)=>i.name == val.game.turn).team}.webp`} className="w-20 h-20" />
  <p className="font-bold">{val.players.find((i)=> i.name == val.game.turn).name}-: {val.game.scores[val.game.turn]}/{val.game.wickets[val.game.turn]}</p>
    <p className="font-bold">({Math.floor(val.game.balls/6)}.{Math.floor(val.game.balls%6)})</p>
  </div>
{ val.game.target != -1 &&
<p className="font-bold text-center text-base">Target-: {val.game.target}</p>}
  </>
}
{
  val.game.result !== '' && 
  <div className="text-center flex flex-col gap-1 justify-center items-center text-black font-bold my-6">
{ val.game.result != "Match is Tied" &&
 <img src="Icons/trophy.webp" className="w-10 h-10" />
 }
<h1>{val.game.result}</h1>
    {
      Object.entries(val.game.scores).map(([key, value]) => {
        const wickets = val.game.wickets[key]; 

        return (
          <div key={key} className="flex text-center justify-center items-center gap-2">
            {
              val.players[0].name === key
                ? <img src={`Logos/${val.players[0].team}.webp`} className="w-12 h-12 rounded-md" />
                : <img src={`Logos/${val.players[1].team}.webp`} className="w-12 h-12 rounded-md" />
            }

            <h1>
              {key} scored: {value}/{wickets}
            </h1>
          </div>
        );
      })
    }

    {
      val.game.result === "Match is Tied" && 
      <button
        className="w-28 py-2 my-6 px-2 flex justify-center items-center bg-sky-700 text-white rounded-md font-bold"
        onClick={() => window.location.reload()}
      >
        Restart
      </button>
    }

  </div>
}
  </>
}

    </>
  );
};


export default Play;
