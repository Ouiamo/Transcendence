;
import { FiGlobe, } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { FiTarget, FiAward, FiZap, FiMonitor, FiWifi, FiCpu } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import StatsCharts from './graph';
import type { JSX } from "react";


interface gridinter {
    listfriends: () => void;
    goto: () => void;
    goto_ia: () => void;

}
function StatBox({ icon, label, value }: { icon: JSX.Element, label: string, value: string }) {
    return (
        <div className="flex-1 min-w-[200px] bg-[#120d1d]/40 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#241b35] rounded-xl text-[#c44cff] text-xl">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold leading-none text-white">{value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{label}</p>
            </div>
        </div>
    );
}

// function GameCard({ icon, title, description, onClick }: { icon: JSX.Element, title: string, description: string, onClick: () => void }) {
//     return (
//         <div onClick={onClick}
//             className="flex flex-col items-center justify-center
//             flex-1 min-w-[280px] max-w-[350px] h-[300px]
//             bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)]
//             backdrop-blur-md rounded-[30px]
//             border border-[#ff44ff]/70
//             shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]
//             transition-all duration-300
//             hover:scale-105 hover:border-[#ff99ff]
//             cursor-pointer">
//             <div className="text-[#ff99ff] mb-4">{icon}</div>
//             <p className="text-white font-['Courier_New',monospace] text-lg">{title}</p>
//             <p className="text-xs text-gray-400 text-center px-6 mt-1">{description}</p>
//             <div className="flex gap-3 mt-4">
//                 <span className="w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]" />
//                 <span className="w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]" />
//                 <span className="w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_15px_#C77DFF]" />
//             </div>
//         </div>
//     );
// }

function GameCard({ icon, title, description, onClick }: { icon: JSX.Element, title: string, description: string, onClick: () => void }) {
    return (
        <div className="flex flex-col items-center bg-[#120d1d]/60 border border-white/10 rounded-3xl p-8 flex-1 min-w-[300px] max-w-[380px] transition-all hover:border-[#c44cff]/40 group">
            {/* Icon Box */}
            <div className="bg-[#241b35] p-5 rounded-2xl text-[#c44cff] mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            
            <h3 className="text-white text-xl font-bold mb-2 tracking-tight uppercase">{title}</h3>
            <p className="text-gray-400 text-sm text-center px-4 leading-relaxed mb-8 h-12">
                {description}
            </p>

            {/* Play Button - Exactly like the image */}
            <button 
                onClick={onClick}
                className="w-full py-3 bg-[#241b35] hover:bg-[#c44cff] text-white text-xs font-bold rounded-xl transition-all tracking-[0.2em] uppercase"
            >
                Play Now
            </button>
        </div>
    );
}
export function Grid({ listfriends, goto, goto_ia }: gridinter) {

    return (
        
        < div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 bg-[#0b0618] min-h-screen text-white" >
                <header className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Welcome back, <span className="text-[#c44cff]">Player</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Choose your game mode and start competing</p>
                </header>
                <div className="flex flex-wrap justify-center gap-6">
                    <StatBox icon={<FiTarget />} label="Games Played" value="127" />
                    <StatBox icon={<FiAward />} label="Win Rate" value="68%" />
                    <StatBox icon={<FiZap />} label="Current Streak" value="5" />
                </div>
            <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight">Choose Game Mode</h2>
                <div className="flex flex-wrap gap-8 justify-start">
                    < GameCard
                        icon={<FiMonitor size={32} />}
                        title="Local Match"
                        description="Play against a friend on the same device. Classic arcade style."
                        onClick={goto} />
                    <GameCard
                        icon={<FiWifi size={32} />}
                        title="Online Match"
                        description="Challenge players worldwide in real-time competitive matches."
                        onClick={listfriends} />
                    <GameCard
                        icon={<RiRobot2Line size={32} />}
                        title="IA TRAINING"
                        description="Test your skills against our advanced AI opponent."
                        onClick={goto_ia}/>
                </div>
            </section>
            <section className="pt-8">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Gaming Stats & Skill Progress</h2>
                <div className="bg-[#120d1d]/40 border border-white/5 rounded-3xl p-6">
                    <StatsCharts />
                </div>
            </section>
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