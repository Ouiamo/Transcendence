import { useState, useEffect } from "react";
import { FaTrophy, FaSkull, FaGamepad, FaPercentage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { logoutUser } from './socketService';

function SmallStatCard({ icon, value, label }: any) {
  return (
    <div className="flex-1 min-w-[180px] bg-[#120d1d]/60 border border-[#c44cff]/50 rounded-[12px] p-3 flex flex-row items-center gap-3 justify-center">
      <div className="flex flex-col  justify-center  items-center mt-[10px] p-[3px] flex-1">

        <div>{icon}</div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold">{value || 0}</h3>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </div>

    </div>
  );
}



interface ProfilInterface {
  user: any;
  gotohome: () => void;
  delete_obj: (data: any) => void;
  gotosetting: () => void;
}

interface Stats {
  user_id: number;
  wins: number;
  loss: number;
  total_matches: number;
  win_rate: number;
}

interface History {
  id: number;
  opp_username: string;
  user_score: number;
  opp_score: number;
  match_type: string;
  isWin: boolean;
}



function Profil({ user, delete_obj, gotohome, gotosetting }: ProfilInterface) {
  localStorage.setItem('page', 'PROFIL');
  const logout = async () => {
    try {
      if (user && user.id && user.username) {
        logoutUser(user.id, user.username);
      }
      const logo = await fetch('https://localhost:3010/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (logo.ok) {
        alert("logout succes");
        console.log("logout sucess");
        delete_obj(null);
        gotohome();
        localStorage.removeItem('page');
        localStorage.removeItem('sidebar-active');
      }
    }
    catch (error) {
      alert("error in lougout");
    }
  }
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<History[] | null>(null);
  const [userRank, setRank] = useState<number>(0);
  
  useEffect(() => {
    fetch('https://localhost:3010/api/stats', { credentials: "include" })
    .then(res => res.json())
    .then(data => setStats(data))
    .catch(err => console.error(err));
  }, []);
  
  useEffect(() => {
    fetch('https://localhost:3010/api/history/get_history', { credentials: "include" })
    .then(res => res.json())
    .then(data => setHistory(data))
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch('https://localhost:3010/api/stats/user_ranking', { credentials: "include" })
    .then(res => res.json())
    .then(data => setRank(data))
    .catch(err => console.error(err));
  }, []);

  function AchievementCard({title, desc, done}: any) {
    if (title === "First Victory" && stats?.wins && stats.wins > 0)
      done = true;
    if (title === "Century Club" && stats?.total_matches && stats.total_matches > 99)
      done = true;
    if (title === "Perfect Game" && stats?.total_matches)
    {
      history?.forEach((result:any) => {
      if (result.user_score === 11 && result.opp_score === 0)
        done = true;
    });
    }
    console.log("user rank is :::", userRank);
    if (title === "Legend" && userRank < 11)
      done = true;
    return (
      <div className={`flex-1 rounded-xl p-[4px] flex items-center justify-between transition-all duration-300 ${
        done 
          ? 'bg-[#120d1d]/80 border border-[#c44cff]/60 shadow-[0_0_15px_rgba(196,76,255,0.3)]' 
          : 'bg-[#120d1d]/20 border border-[#c44cff]/10 opacity-50'
      }`}>
        <div className="flex items-center gap-[3px] flex-col p-[4px]">
          <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${
            done 
              ? 'bg-[#c44cff] shadow-[0_0_10px_rgba(196,76,255,0.5)]' 
              : 'bg-gray-600/30'
          }`}>
            <FaTrophy className={done ? 'text-white' : 'text-gray-500'} />
          </div>

          <div>
            <p className={`font-bold ${done ? 'text-white' : 'text-gray-600'}`}>{title}</p>
            <p className={`text-xs ${done ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
          </div>
        </div>

      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0e0818] text-white p-[6px] ">

   
      <div className=" mx-auto bg-[#120d1d]/80 border border-[#c44cff]/50 rounded-[12px] p-[6px] flex items-center  mt-[10px]  justify-between">

        <div className="flex items-center gap-[20px] mb-[10px]">
          <div className="w-[80px] h-[80px] rounded-full border-2 border-[#c44cff] overflow-hidden animate__animated animate__flip">
  <img
    src={user.avatarUrl}
    className="w-full h-full object-cover "
    />
</div>


          <div>
            <div className="flex items-center gap-[12px]">
              <h2 className="text-3xl font-bold">{user.username}</h2>
              <button
                onClick={gotosetting}
                className="group relative p-[2px] bg-transparent cursor-pointer no-underline outline-none border-none border-0 focus:ring-0"
              >
                <FiEdit className="text-[#c44cff] group-hover:scale-110 transition-transform   transition-all duration-300 ease-in-out uppercase font-bold text-xs tracking-widest active:scale-95 
    hover:text-[#ffff] 
    hover:shadow-[0_0_20px_rgba(196,76,255,0.6),0_0_40px_rgba(196,76,255,0.2)]
    hover:border-white" size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Member since January 2026
            </p>
            <p>{user.email}</p>

            <div className="flex gap-[2px] mt-[2px]">
              <span className="px-[3px] py-[1px] bg-[#c44cff]/20 text-[#c44cff] rounded-full text-xs">
                Level 12
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="
    mr-[15px] bg-transparent px-[25px] py-[10px] 
    border border-[#c44cff] text-[#c44cff] rounded-full 
    transition-all duration-300 ease-in-out
    uppercase font-bold text-xs tracking-widest
    active:scale-95 
    hover:bg-[#c44cff] 
    hover:text-[#ffff] 
    hover:shadow-[0_0_20px_rgba(196,76,255,0.6),0_0_40px_rgba(196,76,255,0.2)]
    hover:border-white
  "
        >
          LOGOUT
        </button>
      </div>

   
      <div className="max-w-5xl mx-auto flex flex-row flex-wrap gap-[12px] mt-[20px]">



        <SmallStatCard
          icon={<FaGamepad className="text-[#00F7FF] " size={24} />}
          value={stats?.total_matches}
          label="Total Games"
        />

        <SmallStatCard
          icon={<FaTrophy className="text-[#00ff88] " size={24} />}
          value={stats?.wins}
          label="Wins"
        />

        <SmallStatCard
          icon={<FaPercentage className="text-[#FFE52A]" size={24} />}
          value={`${stats?.win_rate || 0}%`}
          label="Win Rate"
        />

        <SmallStatCard
          icon={<FaSkull className="text-[#ff4444]" size={24} />}
          value={stats?.loss}
          label="Losses"
        />
      </div>

      <div className="max-w-5xl mx-auto mt-[10px] ">
        <h3 className="text-xl font-bold">Achievements</h3>

        <div className="max-w-5xl mx-auto flex flex-row flex-wrap gap-[12px] mt-[20px]">
         
          <AchievementCard
            title="First Victory"
            desc="Win your first match"
            
          />

          <AchievementCard
            title="Century Club"
            desc="Play 100 games"
      
          />

          <AchievementCard
            title="Perfect Game"
            desc="Win 11-0"
          />

          <AchievementCard
            title="Legend"
            desc="Reach top 10 leaderboard"
          />

        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-2 sm:px-0  bg-[#120d1d]/80 " >
        <h3 className="text-xl font-bold mb-4">Match History</h3>

        <div className="flex flex-col gap-[10px] ">
          {history?.slice().reverse().map((match, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-[#c44cff]/50 p-[12px] sm:p-4 rounded-[12px] group w-full"
            >
             
              <div className="flex items-center gap-2 sm:gap-[4px] flex-[1.5] min-w-0">
                <div className={`flex-shrink-0 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border-2 p-[2px] ${match.isWin ? 'border-[#00ff88]' : 'border-[#ff4444]'}`}>
                  <img
                    src={user.avatarUrl}
                    alt="you"
                    className="w-full h-full rounded-full object-cover bg-[#1a1033]"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="ml-[10px] text-white font-bold text-xs sm:text-sm uppercase tracking-wide truncate">
                    {user.username}
                  </h4>
                  <span className={`w-fit text-[8px] sm:text-[9px] px-1.5 py-[1px] rounded-md font-bold ${match.match_type === 'REMOTE' ? 'bg-blue-500/20 text-blue-400' :
                    match.match_type === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                    {match.match_type}
                  </span>
                </div>
              </div>

            
              <div className="flex flex-col items-center flex-1">
                <div className="text-lg sm:text-2xl font-black text-white flex items-center gap-[2px] sm:gap-[3px]">
                  <span className={match.isWin ? 'text-[#00ff88]' : 'text-white'}>{match.user_score}</span>
                  <span className="text-gray-600 font-light">-</span>
                  <span className={!match.isWin ? 'text-[#ff4444]' : 'text-white'}>{match.opp_score}</span>
                </div>
                <p className="text-[10px] sm:text-[14px] text-gray-500 uppercase font-bold tracking-[1px] sm:tracking-[2px]">Score</p>
              </div>

         
              <div className="flex items-center gap-2 sm:gap-[4px] flex-[1.5] min-w-0 justify-end">
                <div className="flex flex-col min-w-0 items-end">
                  <h4 className="mr-[10px] text-white font-bold text-xs sm:text-sm uppercase tracking-wide truncate">
                    {match.opp_username}
                  </h4>
                </div>
                <div className={`flex-shrink-0 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border-2 p-[2px] border-[#c44cff]`}>
                  <img
                    src={match.opp_username === 'AI' ? `https://localhost:3010/api/avatar/file/ia.png` : `https://localhost:3010/api/avatar/file/guest.png`}
                    alt="opponent"
                    className="w-full h-full rounded-full object-cover bg-[#1a1033]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

  );
}


// function Profil({ user }: ProfilInterface) {
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [history, setHistory] = useState<History[] | null>(null);
//   const [activetable, setActivetable] = useState<'STATS' | 'HISTORY' | 'ACHIEVEMENTS'>('STATS');

//   const statusColor = user.status === 1 ? "bg-[#00ff88]" : user.status === 2 ? "bg-[#bc13fe]" : "bg-[#ffff]";

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch('https://localhost:3010/api/stats', { credentials: "include" });
//         if (res.ok) {
//           const data = await res.json();
//           setStats(data);
//         }
//       } catch (err) { console.error('Stats error:', err); }
//     };
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch('https://localhost:3010/api/history/get_history', { credentials: "include" });
//         if (res.ok) {
//           const data = await res.json();
//           setHistory(data);
//         }
//       } catch (err) { console.error('History error:', err); }
//     };
//     fetchHistory();
//   }, []);
// console.log("avatr howa hada ", user.avatarUrl);
//   return (
//     <div className="flex flex-col w-full  min-h-screen p-[10px] sm:p-8 bg-[#1a1033] text-white overflow-x-hidden">

//       {/* User Header */}
//       <div className="relative z-10 flex flex-row sm:flex-row items-center gap-[16px] w-full max-w-4xl mx-auto p-6 bg-[rgba(25,16,51,0.8)] rounded-full border border-white/10 shadow-2xl">
//         <div className="relative p-[10px]">
//           <div className=" w-[60px] h-[60px] rounded-full border-2 border-[#ff44ff] shadow-[0_0_15px_#ff44ff] overflow-hidden">
//             <img  src={`${user.avatarUrl}` || "avatar_test.jpg"} className="w-full h-full object-cover" />
//           </div>
//           <span className={`absolute bottom-1 right-1 w-[4px] h-[4px] rounded-full border-2 border-[#1a1033] ${statusColor}`}></span>
//         </div>

//         <div className="flex flex-col items-center sm:items-start gap-2">
//           <div className="flex items-center gap-[3px]">
//             <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter">{user.username}</h2>
//             <FiEdit className="text-[#ff44ff] hover:text-white cursor-pointer transition-all" size={20} />
//           </div>
//           <p className="text-gray-400 text-sm">{user.email}</p>
//         </div>
//       </div>

//       {/* Navigation Buttons - تأكدت من أن الـ z-index عالي والـ pointer-events فعالة */}
//       <div className="relative  z-20 flex flex-wrap gap-[9px] justify-center mt-[40px] w-full max-w-4xl mx-auto">
//         {['STATS', 'HISTORY', 'ACHIEVEMENTS'].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActivetable(tab as any)}
//             className={`flex-1 min-w-[100px] h-[50px] mt-[20px]  rounded-full   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] ${
//               activetable === tab 
//               ? "bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white scale-105 shadow-[#ff44ff]/40" 
//               : "bg-[#2d2159] text-gray-400 hover:bg-[#3d2d7a] hover:text-[#ffff]"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Content Area */}
//       <div className="relative z-10 w-full  max-w-[900px] max-w-4xl mx-auto mt-8">

//         {/* STATS Grid */}
//         {activetable === 'STATS' && (
//           <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-[35px] mt-[35px] ">

//             <StatCard icon={<FaTrophy className="text-[#00ff88]  " size={30}/>} label="Wins" value={stats?.wins} color="from-[#00ff88]/20" />
//             <StatCard icon={<FaSkull className="text-[#ff4444] "size={30}  />} label="Losses" value={stats?.loss} color="from-[#ff4444]/20" />
//             <StatCard icon={<FaGamepad className="text-[#00F7FF]"size={30} />} label="Total" value={stats?.total_matches} color="from-[#00F7FF]/20" />
//             <StatCard icon={<FaPercentage className="text-[#FFE52A]"size={30} />} label="Win Rate" value={`${stats?.win_rate || 0}%`} color="from-[#FFE52A]/20" />
//           </div>
//         )}

//         {/* HISTORY List */}
//            {activetable === 'HISTORY' && (
//   <div className=" flex flex-col gap-4 mt-[35px] w-full max-w-[900px] animate-fadeIn">

//     {history?.map((match) => (
//       <div 
//         // key={match.user_id} 
//         className=" mt-[15px] flex items-center justify-between bg-[#2d2159] hover:bg-[#35276b] border border-white/10 p-4 rounded-[25px] transition-all duration-300 shadow-lg group">

//         {/* 1. Left: Opponent Info */}
//         <div className="flex items-center p-[10px] gap-[10px] flex-1">
//           <div className={`w-[50px] h-[50px] rounded-full border-2 p-[2px] ${match.isWin ? 'border-[#00ff88]' : 'border-[#ff4444]'}`}>
//             <img src={match.opp_username === 'AI' ? `https://localhost:3010/api/avatar/file/ia.png` : `https://localhost:3010/api/avatar/file/guest.png`}  alt="opponent" className="w-full h-full rounded-full object-cover bg-[#1a1033]" />
//           </div>
//           <div className="flex flex-col">
//             <h4 className="text-white font-bold text-[14px] uppercase tracking-wide">{match.opp_username}</h4>
//             <div className="flex items-center gap-[2px]">
//               <span className={`text-[9px] px-2 py-[1px] rounded-md font-bold ${
//                 match.match_type === 'REMOTE' ? 'bg-blue-500/20 text-blue-400' : 
//                 match.match_type === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
//               }`}>
//                 {match.match_type}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* 2. Center: Score */}
//         <div className="flex flex-col items-center p-[20px]  flex-1">
//           <div className="text-2xl font-black text-white flex items-center gap-3">
//             <span className={match.isWin ? 'text-[#00ff88] ' : 'text-white'}>{match.user_score}</span>
//             <span className="text-gray-600 font-light ">-</span>
//             <span className={!match.isWin ? 'text-[#ff4444]' : 'text-white'}>{match.opp_score}</span>
//           </div>
//           <p className="text-[20px] text-gray-500 uppercase font-bold tracking-[2px]">Score</p>
//         </div>

//         {/* 3. Right: Result Badge */}
//         <div className="flex-1 flex justify-end">
//           <div className={`px-[5px] py-[2px] rounded-xl font-black text-[12px] shadow-sm ${
//             match.isWin 
//             ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' 
//             : 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/20'
//           }`}>
//             {match.isWin ? 'VICTORY' : 'DEFEAT'}
//           </div>
//         </div>

//       </div>
//     ))}

//     {/* Optional: Show message if no history */}
//     {History.length === 0 && (
//       <div className="text-center p-10 bg-[#2d2159]/50 rounded-[30px] border border-dashed border-white/10 text-gray-500">
//         No matches played yet.
//       </div>
//     )}
//   </div>
// )}
//       </div>
//     </div>
//   );
// }

// // Sub-component for Stats to keep code clean
// function StatCard({ icon, label, value, color }: any) {
//   return (
//     <div className={`flex flex-col border rounded-full items-center justify-center p-[6px] bg-gradient-to-br ${color} to-[rgba(25,16,51,0.9)] border border-white/5 rounded-2xl shadow-xl`}>
//       <div className="mb-[3px] p-[20px]  bg-[#ffff]/20 rounded-full "  >{icon}</div>
//       <p className="text-gray-400 text-[10px] font-bold uppercase text-[16px] tracking-widest">{label}</p>
//       <h3 className="text-2xl font-black mt-1">{value || 0}</h3>
//     </div>
//   );
// }

export default Profil;