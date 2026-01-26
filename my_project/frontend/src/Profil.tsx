
import { useState } from "react";
import { FaTrophy, FaSkull, FaGamepad, FaPercentage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";


interface profil_iterface {

  user: any;

}

interface Stats {
  user_id: number;
  wins: number;
  loss: number;
  total_matches: number;
  win_rate: number;
}

interface History {
  user_id: number;
  opp_username: string;
  user_score: number;
  opp_score: number;
  match_type: string;
  isWin: boolean;
}

function Profil({ user }: profil_iterface) {

const [stats, setStats] = useState<Stats | null>(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch('https://localhost:3010/api/stats', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };
  
  fetchStats();
}, []);

const [history, setHistory] = useState<History[] | null>(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch('https://localhost:3010/api/history/get_history', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };
  
  fetchStats();
}, []);

// `https://localhost:3010${user.avatarUrl}`
  console.log("xihaja bax t", user);
  console.log("avatarrrrrr is ", user.avatarUrl);
  localStorage.setItem('page', 'PROFIL');
  // console.log("avatr gooogl is ", user.avatar_url);
  // const mockHistory = [
  // { id: 1, opponent: "Ghost_Rider", myScore: 5, oppScore: 2, match_type: "REMOTE", date: "2 hours ago", isWin: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
  // { id: 2, opponent: "AI_Master", myScore: 3, oppScore: 5, type: "AI", date: "Yesterday", isWin: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=2" },
  // { id: 3, opponent: "Local_Guest", myScore: 5, oppScore: 4, type: "LOCAL", date: "3 days ago", isWin: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
// ];
  type t = 'STATS' | 'HISTORY' | 'ACHIEVEMENTS';
  const [activetable, setactivetable] = useState<t>('STATS');
  const gotostats = () => {
    setactivetable('STATS');
  }
  const gotohis = () => {
    setactivetable('HISTORY');
  }
  const gotoachi = () => {
    setactivetable('ACHIEVEMENTS');
  }
  const statusColor = user.status === 1 ? "bg-[#00ff88]" : user.status === 2 ? "bg-[#bc13fe]" : "bg-[#00ff88]";
  // console.error("user is in profl ", user);
  return (

    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-row mt-[40px] gap-[20px] w-[90%] max-w-[900px] p-[20px] bg-[rgba(25,16,51,0.8)] rounded-[40px] border-[1px] border-white/20 shadow-2xl ">

        <div className="relative w-[80px] h-[80px]">


          <div className="w-full h-full rounded-full border-2 border-[#ff44ff] shadow-[0_0_15px_#ff44ff] overflow-hidden">
            <img
              src={`${user.avatarUrl}` || "avatar_test.jpg"}
              className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
        <div className=" grid grid-cols-4 mt-[25px] w-full max-w-[900px] " >
          <div className=" flex flex-col justify-center items-center w-[200px] h-[150px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-[10px] ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#00ff88]/25 border border-[#00ff88]/20 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              <FaTrophy className="text-[#00ff88]" size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Total Wins</p>
            <h3 className="text-white text-3xl font-black">
              {stats?.wins || 0}
            </h3>
          </div>

          <div className="flex flex-col justify-center items-center w-[200px] h-[150px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-[10px] ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#F63049]/25 border border-[#ff4444]/20 shadow-[0_0_15px_rgba(255,68,68,0.2)]">

              <FaSkull />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Total loss</p>
              <h3 className="text-white text-3xl font-black">
                {stats?.loss || 0}
              </h3>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-[200px] h-[150px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-[10px] ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#00F7FF]/25 text-white mb-3">
              <FaGamepad size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Total match</p>
            <h3 className="text-white text-3xl font-black">
              {stats?.total_matches || 0}
            </h3>
          </div>
            <div className="flex flex-col justify-center items-center w-[200px] h-[150px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-[10px] ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#FFE52A]/30 text-white mb-3">
              <FaPercentage size={20} />
            </div>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Win Rate</p>
            <h3 className="text-white text-3xl font-black">
              {stats?.win_rate || 0}
            </h3>
          </div>

        </div>
      }
    {activetable === 'HISTORY' && (
  <div className="flex flex-col gap-4 mt-[25px] w-full max-w-[900px] animate-fadeIn">
    
    {history?.map((match) => (
      <div 
        key={match.user_id} 
        className="flex items-center justify-between bg-[#2d2159] hover:bg-[#35276b] border border-white/10 p-4 rounded-[25px] transition-all duration-300 shadow-lg group">
        
        {/* 1. Left: Opponent Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-[50px] h-[50px] rounded-full border-2 p-[2px] ${match.isWin ? 'border-[#00ff88]' : 'border-[#ff4444]'}`}>
            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=2`}  alt="opponent" className="w-full h-full rounded-full object-cover bg-[#1a1033]" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[14px] uppercase tracking-wide">{match.opp_username}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-2 py-[1px] rounded-md font-bold ${
                match.match_type === 'REMOTE' ? 'bg-blue-500/20 text-blue-400' : 
                match.match_type === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {match.match_type}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Center: Score */}
        <div className="flex flex-col items-center flex-1">
          <div className="text-2xl font-black text-white flex items-center gap-3">
            <span className={match.isWin ? 'text-[#00ff88]' : 'text-white'}>{match.user_score}</span>
            <span className="text-gray-600 font-light">-</span>
            <span className={!match.isWin ? 'text-[#ff4444]' : 'text-white'}>{match.opp_score}</span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[2px]">Score</p>
        </div>

        {/* 3. Right: Result Badge */}
        <div className="flex-1 flex justify-end">
          <div className={`px-5 py-2 rounded-xl font-black text-[12px] shadow-sm ${
            match.isWin 
            ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' 
            : 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20'
          }`}>
            {match.isWin ? 'VICTORY' : 'DEFEAT'}
          </div>
        </div>

      </div>
    ))}
    
    {/* Optional: Show message if no history */}
    {/* {History.length === 0 && (
      <div className="text-center p-10 bg-[#2d2159]/50 rounded-[30px] border border-dashed border-white/10 text-gray-500">
        No matches played yet.
      </div>
    )} */}
  </div>
)}
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