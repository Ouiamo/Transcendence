import { useEffect, useState } from 'react';
// import { FiGlobe, } from "react-icons/fi";
// import { IoGameControllerOutline } from "react-icons/io5";
import { FiTarget, FiAward, FiZap, FiMonitor, FiWifi } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import StatsCharts from './graph';
import type { JSX } from "react";

interface Stats {
  user_id: number;
  wins: number;
  loss: number;
  total_matches: number;
  win_rate: number | string;
  points: number;
} 

interface gridinter {
    listfriends: () => void;
    goto: () => void;
    goto_ia: () => void;
    setActiveSafe : (s:any) => void;
    // setSidebarActive: (key: "dashboard" | "game" | "leaderboard" | "settings" | "profile" | "friends") => void;

}
function StatBox({ icon, label, value }: { icon: JSX.Element, label: string, value: number | string }) {
    return (
        <div className="min-w-[300px] max-w-[300px] bg-[#120d1d]/40 border-[2px] border-[#c44cff]/50  rounded-[12px] flex flex-row gap-[20px] items-center ">
            <div className="p-[3px] bg-[#241b35] rounded-full text-[#c44cff] text-xl flex items-center ml-[10px] ">
                {icon } 
            </div>
            <div >
                <p className="text-2xl font-bold leading-none text-white">{value}</p>
                <p className="text-[10px] text- uppercase tracking-widest mt-1">{label}</p>
            </div>
        </div>
    );
}


function GameCard({ icon, title, description, color, onClick }: { icon: JSX.Element, title: string, description: string, color: string, onClick: () => void }) {
    return (<div className="
  flex gap-[25px] min-h-[300px] max-h-[380px] flex-col items-center
  bg-[#120d1d]/60 border-[2px]  border-[#c44cff]/50 rounded-[12px]
  flex-1 min-w-[300px] max-w-[300px]
  transition-all duration-300 ease-out
  hover:shadow-[0_0_20px_rgba(255,68,255,0.8)]

  hover:-translate-y-1
">


        
                <div className="bg-[#241b35] p-[5px] rounded-full text-[#c44cff] mb-[6px] mt-[12px]  ">
                    {icon}
                </div>

                <h3 className="text-white text-xl font-bold mb-[2px] tracking-tight uppercase glow-text">{title}</h3>
                <p className="text-[#8F929E] text-sm text-center px-[4px] leading-relaxed mb-[8px] h-[12px]">
                    {description}
                </p>


                <button
                    onClick={onClick}
                    className={`mt-[20px] min-w-[200px] max-w-[280px] min-h-[38px] max-h-[80px] py-[3px] px-[6px] mt-[4px] rounded-full ${color} text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]`}
                >
                    Play Now
                </button>
  
        </div>
    );
}
export function Grid({ listfriends, goto, goto_ia, setActiveSafe }: gridinter) {
      const [stats, setStats] = useState<Stats | null>(null);

     useEffect(() => {
        fetch('https://localhost:3010/api/stats', { credentials: "include" })
          .then(res => res.json())
          .then(data => setStats(data))
          .catch(err => console.error(err));
      }, []);

  return (
  <div className="w-full mx-auto bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221] min-h-screen text-white">

    <div className="max-w-[1200px] mx-auto p-[20px]">

      <div className="flex flex-col items-center">

        <header className="space-y-[10px] text-center">
          <h1 className="text-5xl font-bold tracking-tight mt-[18px]">
            <span className="glow-text">Welcome back,</span>
            <span className="text-[#c44cff] "> Player</span>
          </h1>
          <p className="text-gray-400 mt-[20px]">
            Choose your game mode and start competing
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-[40px] mt-[20px]">
          <StatBox icon={<FiTarget size={32} />} label="Games Played" value={stats?.total_matches ?? 0} />
          <StatBox icon={<FiAward size={32} />} label="Win Rate" value={`${stats?.win_rate || 0}%`} />
          <StatBox icon={<FiZap size={32} />} label="Points " value={stats?.points ?? 0} />
        </div>

        <section className="mt-[40px] w-full">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold">Choose Game Mode</h2>
          </div>

          <div className="flex flex-wrap gap-[40px] justify-center mt-[20px]">
            <GameCard
              icon={<FiMonitor size={32} className="text-[#c44cff]" />}
              title="Local Match"
              description="Play against a friend on the same device."
              color='bg-[#c44cff]'
              onClick={() => { setActiveSafe("game"); goto() }}
            />

            <GameCard
              icon={<FiWifi size={32} className="text-[#d86bff]" />}
              title="Online Match"
              description="Challenge players worldwide."
              color='bg-[#d86bff]'
              onClick={() => { setActiveSafe("game"); listfriends() }}
            />

            <GameCard
              icon={<RiRobot2Line size={32} className="text-[#a855f7]" />}
              title="IA TRAINING"
              description="Test your skills against AI."
              color='bg-[#a855f7]'
              onClick={() => { setActiveSafe("game"); goto_ia() }}
            />
          </div>
        </section>

        <section className="mt-[40px] w-full">
          <div className="flex justify-center">
            <h2 className="text-2xl font-bold">
              Gaming Stats & Skill Progress
            </h2>
          </div>

          <div className="mt-[20px] w-full">
            <StatsCharts />
          </div>
        </section>

      </div>

    </div>

  </div>
)



}



// const [searchfor, setusernameshearch] = useState('');
// bg-[#ff99ff]
// {/* <div className=" bg-[rgba(45,27,105,0.7)]  items-center justify-center ">
//     <div className="relative flex items-center  w-full  items-center justify-center">
//         <IoSearch className="absolute  text-[#ff44ff]  bg-[rgba(45,27,105,0.7)]text-xl pointer-events-none z-10 " />
//         <input
//             style={{  paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//             className=" caret-[#ff44ff] w-[250px] h-[33px] rounded-full   bg-[rgba(45,27,105,0.7)]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]   transition-all" type="text" placeholder="Entrer votre gmail" autoComplete="off" spellCheck="false" value={searchfor} onChange={(e) => setusernameshearch(e.target.value)} ></input>

//     </div>
//     </div> */}