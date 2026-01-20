
import React from "react";
import { useState } from "react";
import { FiEdit, FiCheck,FiTrendingUp, FiTrendingDown, FiAward, FiTarget } from "react-icons/fi";

interface profil_iterface {

  user: any;

}

function Profil({ user }: profil_iterface) {

localStorage.setItem('page', 'PROFIL');
  type t = 'STATS' | 'HISTORY' | 'ACHIEVEMENTS';
  const [activetable, setactivetable] = useState<t>('STATS');
  const gotostats = ()=>{
    setactivetable('STATS');
  }
    const gotohis = ()=>{
    setactivetable('HISTORY');
  }
    const gotoachi = ()=>{
    setactivetable('ACHIEVEMENTS');
  }
  const statusColor = user.status === 1 ? "bg-[#00ff88]" :
    user.status === 2 ? "bg-[#bc13fe]" :
      "bg-[#00ff88]";
  console.error("user is in profl ", user);
  return (

    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-row mt-[40px] gap-[20px] w-[90%] max-w-[900px] p-[20px] bg-[rgba(25,16,51,0.8)] rounded-[40px] border-[1px] border-white/20 shadow-2xl ">

        <div className="relative w-[80px] h-[80px]">


          <div className="w-full h-full rounded-full border-2 border-[#ff44ff] shadow-[0_0_15px_#ff44ff] overflow-hidden">
            <img src={user.avatar_url || "/avatar_test.jpg"} className="w-full h-full object-cover" />
          </div>


          <span className={`absolute bottom-[4px] right-[4px] w-[6px] h-[6px]  rounded-full border-[3px] border-[#1a1033] z-10 ${statusColor}`}></span>
        </div>
        <div className="flex flex-row gap-[2px]">

          <div className=" text-white text-[20px] uppercase tracking-wider leading-none">
            {user.username}
          </div>
          <FiEdit className="text-[#ff44ff] hover:text-white transition-colors cursor-pointer" size={16} />
        </div>
      </div>
    <div className="flex flex-row w-[90%] max-w-[900px] gap-[20px] ">
      <button className="mt-[20px] w-[200px] h-[44px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" onClick={gotostats}>STATE</button>
            <button className="mt-[20px] w-[200px] h-[44px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" onClick={gotohis}>HISTORY</button>

            <button className="mt-[20px] w-[200px] h-[44px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" onClick={gotoachi}>ACHIVEMENT</button>

     
    </div>
{
  activetable === 'STATS' &&
  <div className=" grid grid-cols-3 mt-[25px] w-full max-w-[900px]" >
    <div className=" w-[200px] h-[150px] bg-[#2d2159]">
  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Total Wins</p>
    </div>

    <div>hii</div>
    <div>koooo</div>
   
  </div>
}
{
  activetable === 'HISTORY' && 
  <div>
    hello from historyyyyyyyyyy
  </div>
}
{
  activetable === 'ACHIEVEMENTS' &&
  <div>
    hello fromm achivvvvvvvvvvvvv
  </div>
}
    </div>

  )
}
export default Profil;