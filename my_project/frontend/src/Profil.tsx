import { useState, useEffect } from "react";
import { FaTrophy, FaSkull, FaGamepad, FaPercentage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

interface ProfilInterface {
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
  id: number; // غيرت user_id لـ id لتفادي مشاكل الـ key في الـ map
  opp_username: string;
  user_score: number;
  opp_score: number;
  match_type: string;
  isWin: boolean;
}

function Profil({ user }: ProfilInterface) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<History[] | null>(null);
  const [activetable, setActivetable] = useState<'STATS' | 'HISTORY' | 'ACHIEVEMENTS'>('STATS');

  const statusColor = user.status === 1 ? "bg-[#00ff88]" : user.status === 2 ? "bg-[#bc13fe]" : "bg-[#ffff]";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('https://localhost:3010/api/stats', { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) { console.error('Stats error:', err); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('https://localhost:3010/api/history/get_history', { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) { console.error('History error:', err); }
    };
    fetchHistory();
  }, []);
console.log("avatr howa hada ", user.avatarUrl);
  return (
    <div className="flex flex-col w-full  min-h-screen p-[10px] sm:p-8 bg-[#1a1033] text-white overflow-x-hidden">
      
      {/* User Header */}
      <div className="relative z-10 flex flex-row sm:flex-row items-center gap-[16px] w-full max-w-4xl mx-auto p-6 bg-[rgba(25,16,51,0.8)] rounded-full border border-white/10 shadow-2xl">
        <div className="relative p-[10px]">
          <div className=" w-[60px] h-[60px] rounded-full border-2 border-[#ff44ff] shadow-[0_0_15px_#ff44ff] overflow-hidden">
            <img  src={`${user.avatarUrl}` || "avatar_test.jpg"} className="w-full h-full object-cover" />
          </div>
          <span className={`absolute bottom-1 right-1 w-[4px] h-[4px] rounded-full border-2 border-[#1a1033] ${statusColor}`}></span>
        </div>
        
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div className="flex items-center gap-[3px]">
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter">{user.username}</h2>
            <FiEdit className="text-[#ff44ff] hover:text-white cursor-pointer transition-all" size={20} />
          </div>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Navigation Buttons - تأكدت من أن الـ z-index عالي والـ pointer-events فعالة */}
      <div className="relative  z-20 flex flex-wrap gap-[9px] justify-center mt-[40px] w-full max-w-4xl mx-auto">
        {['STATS', 'HISTORY', 'ACHIEVEMENTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActivetable(tab as any)}
            className={`flex-1 min-w-[100px] h-[50px] mt-[20px]  rounded-full   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] ${
              activetable === tab 
              ? "bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white scale-105 shadow-[#ff44ff]/40" 
              : "bg-[#2d2159] text-gray-400 hover:bg-[#3d2d7a] hover:text-[#ffff]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full  max-w-[900px] max-w-4xl mx-auto mt-8">
        
        {/* STATS Grid */}
        {activetable === 'STATS' && (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-[35px] mt-[35px] ">
            
            <StatCard icon={<FaTrophy className="text-[#00ff88]  " size={30}/>} label="Wins" value={stats?.wins} color="from-[#00ff88]/20" />
            <StatCard icon={<FaSkull className="text-[#ff4444] "size={30}  />} label="Losses" value={stats?.loss} color="from-[#ff4444]/20" />
            <StatCard icon={<FaGamepad className="text-[#00F7FF]"size={30} />} label="Total" value={stats?.total_matches} color="from-[#00F7FF]/20" />
            <StatCard icon={<FaPercentage className="text-[#FFE52A]"size={30} />} label="Win Rate" value={`${stats?.win_rate || 0}%`} color="from-[#FFE52A]/20" />
          </div>
        )}

        {/* HISTORY List */}
           {activetable === 'HISTORY' && (
  <div className=" flex flex-col gap-4 mt-[35px] w-full max-w-[900px] animate-fadeIn">
    
    {history?.map((match) => (
      <div 
        // key={match.user_id} 
        className=" mt-[15px] flex items-center justify-between bg-[#2d2159] hover:bg-[#35276b] border border-white/10 p-4 rounded-[25px] transition-all duration-300 shadow-lg group">
        
        {/* 1. Left: Opponent Info */}
        <div className="flex items-center p-[10px] gap-[10px] flex-1">
          <div className={`w-[50px] h-[50px] rounded-full border-2 p-[2px] ${match.isWin ? 'border-[#00ff88]' : 'border-[#ff4444]'}`}>
            <img src={match.opp_username === 'AI' ? `https://api.dicebear.com/7.x/bottts/svg?seed=2` : `https://api.dicebear.com/7.x/avataaars/svg?seed=3`}  alt="opponent" className="w-full h-full rounded-full object-cover bg-[#1a1033]" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-[14px] uppercase tracking-wide">{match.opp_username}</h4>
            <div className="flex items-center gap-[2px]">
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
        <div className="flex flex-col items-center p-[20px]  flex-1">
          <div className="text-2xl font-black text-white flex items-center gap-3">
            <span className={match.isWin ? 'text-[#00ff88] ' : 'text-white'}>{match.user_score}</span>
            <span className="text-gray-600 font-light ">-</span>
            <span className={!match.isWin ? 'text-[#ff4444]' : 'text-white'}>{match.opp_score}</span>
          </div>
          <p className="text-[20px] text-gray-500 uppercase font-bold tracking-[2px]">Score</p>
        </div>

        {/* 3. Right: Result Badge */}
        <div className="flex-1 flex justify-end">
          <div className={`px-[5px] py-[2px] rounded-xl font-black text-[12px] shadow-sm ${
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
    {History.length === 0 && (
      <div className="text-center p-10 bg-[#2d2159]/50 rounded-[30px] border border-dashed border-white/10 text-gray-500">
        No matches played yet.
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`flex flex-col border rounded-full items-center justify-center p-[6px] bg-gradient-to-br ${color} to-[rgba(25,16,51,0.9)] border border-white/5 rounded-2xl shadow-xl`}>
      <div className="mb-[3px] p-[20px]  bg-[#ffff]/20 rounded-full "  >{icon}</div>
      <p className="text-gray-400 text-[10px] font-bold uppercase text-[16px] tracking-widest">{label}</p>
      <h3 className="text-2xl font-black mt-1">{value || 0}</h3>
    </div>
  );
}

export default Profil;