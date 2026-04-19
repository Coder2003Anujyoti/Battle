import React, { useState, useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import {useNavigate} from "react-router-dom"
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [activeBtn, setActiveBtn] = useState("create");
const [showpassword,setShowpassword]=useState(false)
const [showdeletepassword,setShowdeletepassword]=useState(false)
const [createid,setCreateid]=useState("")
const [createpswd,setCreatepswd]=useState("")
const [createlock,setCreatelock]=useState(false)
const [joinname,setJoinname]=useState("")
const [joinid,setJoinid]=useState("")
const [joinlock,setJoinlock]=useState(false)
const [deleteid,setDeleteid]=useState("")
const [deletepswd,setDeletepswd]=useState("")
const [deletelock,setDeletelock]=useState(false)
const navigate = useNavigate()
const adds_room=async()=>{
 if(createid.length>0 && createpswd.length>0 ){
   try {
    const response = await fetch("http://localhost:8000/add-pokemon-room", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id:createid,password:createpswd}),
    });
    if (!response.ok) {
     toast.error("Server error")
    }
    const result = await response.json();
    if(result.type == "error"){
      toast.error(`${result.message}`)
    }
    else{
      toast.success(`${result.message}`)
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
  finally{
    setCreateid("")
    setCreatepswd("")
    setCreatelock(false)
  }
}
 }
 const deletes_room=async()=>{
 if(deleteid.length>0 && deletepswd.length>0){
   try {
    const response = await fetch("http://localhost:8000/delete-pokemon-room", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id:deleteid,password:deletepswd}),
    });

    if (!response.ok) {
      toast.error("Server error")
    }
    const result = await response.json();
     if(result.type == "error"){
      toast.error(`${result.message}`)
    }
    else{
      toast.success(`${result.message}`)
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
  finally{
  setDeleteid("")
    setDeletepswd("")
    setDeletelock(false)
  }
}
 }
 const joins_room=async()=>{
  if(joinid.length>0 && joinname.length>0){
   try {
    const response = await fetch("http://localhost:8000/join-pokemon-room", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name:joinname,id:joinid}),
    });

    if (!response.ok) {
      toast.error("Server error")
    }
    const result = await response.json(); 
   if(result?.contestants?.length ==4 ){
    const arr = result.contestants.map((i)=> i.team)
const encoded = encodeURIComponent(JSON.stringify(arr));
    navigate("/page", {
  state: {
    id: joinid,
    name: joinname,
    teams: arr
  }
});
    }
  else if(result?.contestants?.length < 4){
    if(result.type == "error"){
      toast.error(`${result.message}`)
    }
    else{
      toast.success(`${result?.message ? result.message : "Registered Successfully"}`)
    }
  }
  else{
   if(result.type == "error"){
      toast.error(`${result.message}`)
    }
    else{
      toast.success(`${result.message}`)
    }
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
}
finally{
  setJoinid("")
  setJoinname("")
  setJoinlock(false)
}
}
}
const addroom=()=>{
if(createid.length>0 && createpswd.length>0 ){
    setCreatelock(true)
    adds_room()
  }
}
const delete_room=()=>{
if(deleteid.length>0 && deletepswd.length>0 ){
    setDeletelock(true)
    deletes_room()
  }
 }
 const join_room = ()=>{
  if(joinid.length>0 && joinname.length>0){
    setJoinlock(true)
    joins_room()
  }
 }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
  {loading && (
<div className="w-full flex flex-col items-center justify-center gap-4 my-56">
 <img src="images/Go.webp"  className="w-72 h-54 lg:w-96 lg:h-60" />
</div>)}
{!loading && (
<>
<Toaster position="top-center" toastOptions={{ className:"font-bold", duration: 2000 }} />
<div className="w-full h-18 flex gap-x-6 bg-sky-600">
 <img src="images/5.webp" className="w-30 h-16 ml-2 mr-2 mx-1 my-1" />
 <div className="w-full flex items-center justify-center">
<img src="images/Txt.webp" className="w-40 h-16" /> </div></div>
<div className="w-full flex items-center justify-center">
<img src="images/1.webp" className="p-1" />
</div>
<div className="flex justify-center items-center gap-6 mt-6 mx-4">
<button onClick={() => setActiveBtn("create")}
className={`px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-pink-500  hover:scale-105 ${activeBtn === "create" ? "ring-4 ring-pink-300/80 shadow-[0_0_20px_5px_rgba(255,255,255,0.7)] scale-105" : ""}`}>Create
</button>
<button onClick={() => setActiveBtn("join")}
className={`px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-indigo-500 hover:scale-105 ${activeBtn === "join" ? "ring-4 ring-indigo-300/80 shadow-[0_0_20px_5px_rgba(255,255,255,0.7)] scale-105" : ""}`}>Join
</button>
<button onClick={() => setActiveBtn("delete")}
className={`px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 bg-emerald-500  hover:scale-105 ${activeBtn === "delete" ? "ring-4 ring-emerald-300/80 shadow-[0_0_20px_5px_rgba(255,255,255,0.7)] scale-105" : ""}`}> Delete</button>
 </div>
 {
   activeBtn=="create" && <>
    <div className="max-w-xl w-full mx-auto my-6 px-4 sm:px-6 py-4 rounded-xl space-y-6">
   <h2 className="text-xl font-bold text-center text-white">Create Room</h2>
 <input type="text" value={createid} onChange={(e)=>setCreateid(e.target.value.replace(/\s/g,""))} placeholder="Enter Tournament ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
<div className="relative w-full mb-4">
<input type={showpassword ? 'text' : 'password'} value={createpswd} onChange={(e)=>setCreatepswd(e.target.value.replace(/\s/g,""))} placeholder="Enter Tournament Password" className="w-full px-4 py-2 border rounded-md font-semibold focus:outline-none pr-10" />
<button type="button" onClick={() => setShowpassword(!showpassword)}
className="absolute inset-y-0 right-2 flex items-center text-gray-500" >
{showpassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
</button>
</div>
<div className="flex flex-row mt-6 justify-center gap-3 ">
<button disabled={createlock} onClick={addroom} className="bg-sky-600 text-white text-base px-6 py-2 my-6 font-bold rounded-md shadow-md">Create Room</button>
  </div>
  </div>
   </>
 }
  {
   activeBtn=="join" && <>
    <div className="max-w-xl w-full mx-auto my-6 px-4 sm:px-6 py-4 rounded-xl space-y-6">
   <h2 className="text-xl font-bold text-center text-white">Join Room</h2>
 <input type="text" value={joinid} onChange={(e)=>setJoinid(e.target.value.replace(/\s/g,""))} placeholder="Enter Tournament ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
 <input type="text" value={joinname} onChange={(e)=>setJoinname(e.target.value.replace(/\s/g,""))} placeholder="Enter Name" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
    <div className="flex flex-row mt-6 justify-center gap-3 ">
<button disabled={joinlock} onClick={join_room} className="bg-sky-600 text-white text-base px-6 py-2 my-6 font-bold rounded-md shadow-md">Join Room</button>
  </div>
  </div>
   </>
 }
  {
   activeBtn=="delete" && <>
    <div className="max-w-xl w-full mx-auto my-6 px-4 sm:px-6 py-4 rounded-xl space-y-6">
   <h2 className="text-xl font-bold text-center text-white">Delete Room</h2>
 <input type="text" value={deleteid} onChange={(e)=>setDeleteid(e.target.value.replace(/\s/g,""))} placeholder="Enter Tournament ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
<div className="relative w-full mb-4">
<input type={showdeletepassword ? 'text' : 'password'} value={deletepswd} onChange={(e)=>setDeletepswd(e.target.value.replace(/\s/g,""))} placeholder="Enter Tournament Password" className="w-full px-4 py-2 border rounded-md font-semibold focus:outline-none pr-10" />
<button type="button" onClick={() => setShowdeletepassword(!showdeletepassword)}
className="absolute inset-y-0 right-2 flex items-center text-gray-500" >
{showdeletepassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
</button>
</div>
<div className="flex flex-row mt-6 justify-center gap-3 ">
<button disabled={deletelock} onClick={delete_room} className="bg-sky-600 text-white text-base px-6 py-2 my-6 font-bold rounded-md shadow-md">Delete Room</button>
  </div>
  </div>
   </>
 }
        </>
      )}
    </>
  );
};

export default Home;