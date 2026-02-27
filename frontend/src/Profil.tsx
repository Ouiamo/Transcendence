import { useState, useEffect } from "react";
import { FaTrophy, FaSkull, FaGamepad, FaPercentage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { logoutUser } from './socketService';
import { API_URL } from "./Api.tsx";

function SmallStatCard({ icon, value, label }: any) {
  return (
    <div className="flex-1 min-w-[180px] bg-[#120d1d]/60 border-[2px] border-[#c44cff]/50 rounded-[12px] p-3 flex flex-row items-center gap-3 justify-center">
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

function UserSticker({ name }: { name: string }) {
  return (
    <span className="ml-1 px-2 py-[1px] bg-[#c44cff]/20 text-[#c44cff] text-xs font-bold rounded-full">
      {name}
    </span>
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
  points: number;
}

interface History {
  id: number;
  opp_username: string;
  user_score: number;
  opp_score: number;
  match_type: string;
  isWin: boolean;
  opp_avatar: string;
}



function Profil({ user, delete_obj, gotohome, gotosetting }: ProfilInterface) {
  localStorage.setItem('page', 'PROFIL');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading profile...
      </div>
    );
  }


  const logout = async () => {
    try {
      if (user && user.id && user.username) {
        logoutUser(user.id, user.username);
      }
      const logo = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (logo.ok) {
        // alert("logout succes");
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
    fetch(`${API_URL}/api/stats`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, [user?.id]);

  useEffect(() => {
    fetch(`${API_URL}/api/history/get_history`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, [user?.id]);

  useEffect(() => {
    fetch(`${API_URL}/api/stats/user_ranking`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setRank(data))
      .catch(err => console.error(err));
  }, [user?.id]);

  function AchievementCard({ title, desc, done }: any) {
    if (title === "First Victory" && stats?.wins && stats.wins > 0)
      done = true;
    if (title === "Century Club" && stats?.total_matches && stats.total_matches > 99)
      done = true;
    if (title === "Perfect Game" && stats?.total_matches) {
      history?.forEach((result: any) => {
        if (result.user_score === 11 && result.opp_score === 0)
          done = true;
      });
    }
    if (title === "Legend" && userRank < 11)
      done = true;
    return (
      <div className={`flex-1 rounded-[12px] p-[4px] flex items-center justify-center  transition-all duration-300 ${done
        ? 'bg-[#120d1d]/80 border-[2px] border-[#c44cff]/60 shadow-[0_0_15px_rgba(196,76,255,0.3)]'
        : 'bg-[#120d1d]/20 border-[2px] border-[#ffff]/60 opacity-50'
        }`}>
        <div className="flex items-center gap-[3px] flex-col p-[4px]">
          <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${done
            ? 'bg-[#c44cff] shadow-[0_0_10px_rgba(196,76,255,0.5)]'
            : 'bg-gray-600/30'
            }`}>
            <FaTrophy className={done ? 'text-white' : 'text-gray-500'} />
          </div>

          <div className="flex flex-col justify-center items-center  ">
            <p className={`font-bold ${done ? 'text-white' : 'text-gray-600'}`}>{title}</p>
            <p className={`text-xs ${done ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
          </div>
        </div>

      </div>
    );
  }
  return (
    <div className="min-h-screen  text-white p-[6px] ">


<div className="mx-auto bg-[#120d1d]/80 border-[2px] border-[#c44cff]/50 rounded-[12px] p-[10px] flex flex-wrap items-center mt-[10px] justify-between gap-4">

        <div className="flex items-center gap-[20px] mb-[10px]">
          <div className="w-[80px] h-[80px] rounded-full border-2 border-[#c44cff] overflow-hidden animate__animated animate__flip">
            <img
              src={user.avatarUrl}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="w-full h-full object-cover aspect-square"
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
            <div className="flex flex-col  ">

            <p className=" text-[#ffff]/60 mb-[4px] gap-[14px] ">
              {user?.firstname}
              <UserSticker name="Player" />
            </p>
              <p className=" text-[#ffff]/60 mb-[4px] ">
              {user?.lastname}
              <UserSticker name="Gamer" />
            </p>

            <p className="text-[#ffff]/60">{user?.email}</p>

          
            </div>

            <div className="flex gap-[2px] mt-[2px]">
              <span className="px-[3px] py-[1px] bg-[#c44cff]/20 text-[#c44cff] rounded-full text-xs">
                {stats?.points}
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


      <div className="max-w-5xl mx-auto flex flex-row flex-wrap gap-[12px] mt-[20px] justify-center sm:justify-start">



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

        <div className="max-w-5xl mx-auto flex flex-row flex-wrap gap-[12px] mt-[20px] justify-center sm:justify-start">

          <AchievementCard
            title="First Victory"
            desc="Win your first match"

          />
          <AchievementCard
            title="Perfect Game"
            desc="Win 11-0"
          />
          <AchievementCard
            title="Legend"
            desc="Reach top 10 leaderboard"
          />
          <AchievementCard
            title="Century Club"
            desc="Play 100 games"

          />
        </div>
      </div>

      <div className=" mx-auto mt-[10px]  sm:p-4  " >
        <h3 className="text-xl font-bold mb-[4px]">Match History</h3>
<div className="flex flex-col gap-[10px] w-full">
  {history?.slice().reverse().map((match, index) => (
    <div
      key={index}
      className="flex items-center justify-between border border-[#c44cff]/50 p-2 sm:p-4 rounded-[12px] group w-full gap-2"
    >

      <div className="flex items-center gap-[7px] flex-1 min-w-0 p-[5px]">
        <div className={`flex-shrink-0 w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] rounded-full border-2 p-[2px] ${match.isWin ? 'border-[#00ff88]' : 'border-[#ff4444]'}`}>
          <img
            referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            src={user.avatarUrl}
            alt="you"
            className="w-full h-full rounded-full object-cover bg-[#1a1033]"
          />
        </div>
        <div className="flex flex-col min-w-0 overflow-hidden">
          <h4 className="text-white font-bold text-[10px] sm:text-sm uppercase truncate">
            {user.username}
          </h4>
          <span className="hidden sm:block w-fit text-[8px] sm:text-[9px] px-1.5 py-[1px] rounded-md font-bold bg-purple-500/20 text-purple-400">
            {match.match_type}
          </span>
        </div>
      </div>

     
      <div className="flex flex-col items-center justify-center shrink-0 px-">
        <div className="text-sm sm:text-2xl font-black text-white flex items-center gap-[2px]">
          <span className={match.isWin ? 'text-[#00ff88]' : 'text-white'}>{match.user_score}</span>
          <span className="text-gray-600">-</span>
          <span className={!match.isWin ? 'text-[#ff4444]' : 'text-white'}>{match.opp_score}</span>
        </div>
        <p className="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold">VS</p>
      </div>

    
      <div className="flex items-center gap-[7px] flex-1 min-w-0 justify-end p-[5px]">
        <div className="flex flex-col min-w-0 items-end overflow-hidden">
          <h4 className="text-white font-bold text-[10px] sm:text-sm uppercase truncate text-right w-full">
            {match.opp_username}
          </h4>
          {/* <div className={`px-1 sm:px-2 py-[1px] rounded-lg font-black text-[8px] sm:text-[10px] ${
            match.isWin ? 'bg-[#ff4444]/10 text-[#ff4444]' : 'bg-[#00ff88]/10 text-[#00ff88]'
          }`}>
            {match.isWin ? 'DEFEAT' : 'VICTORY'}
          </div> */}
        </div>
        <div className="flex-shrink-0 w-[35px] h-[35px] sm:w-[50px] sm:h-[50px] rounded-full border-[2px] p-[2px] border-[#c44cff]">
          <img
            src={
              match.match_type === 'AI'
                ? `${API_URL}/api/avatar/file/ia.png`
                : match.match_type === 'LOCAL'
                ? `${API_URL}/api/avatar/file/guest.png`
                : match.opp_avatar === null
                ? `${API_URL}/api/avatar/file/deleted.jpeg`
                : match.opp_avatar  
            }
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
export default Profil;