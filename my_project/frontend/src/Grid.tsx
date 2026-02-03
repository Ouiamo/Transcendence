;
// import React, { useState } from "react";
import { FiGlobe, } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import StatsCharts from './graph';
// import { useRef } from "react";
// import { initGame } from "../../game/frontend/game.ts"


interface gridinter {
    // <<<<<<< HEAD
    //     gotogame : ()=> void;
    //     // gotogame_r : ()=>void;
    //     listfriends : ()=>void;
    // }
    // export function Grid( {gotogame, listfriends}:gridinter) {

    // =======

    listfriends: () => void;
    goto: () => void;
    goto_ia: () => void;

}
export function Grid({ listfriends, goto, goto_ia }: gridinter) {


    // const [searchfor, setusernameshearch] = useState('');
    return (
        // {/* <div className=" bg-[rgba(45,27,105,0.7)]  items-center justify-center ">
        //     <div className="relative flex items-center  w-full  items-center justify-center">
        //         <IoSearch className="absolute  text-[#ff44ff]  bg-[rgba(45,27,105,0.7)]text-xl pointer-events-none z-10 " />
        //         <input
        //             style={{  paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
        //             className=" caret-[#ff44ff] w-[250px] h-[33px] rounded-full   bg-[rgba(45,27,105,0.7)]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]   transition-all" type="text" placeholder="Entrer votre gmail" autoComplete="off" spellCheck="false" value={searchfor} onChange={(e) => setusernameshearch(e.target.value)} ></input>

        //     </div>
        //     </div> */}
        < div className="flex flex-col items-center justify-center h-screen w-full px-4 sm:px-8" >
            <div className="h-[80px]">
                <h2 className=" font-['Courier_New',monospace] text-[#c44cff] font-bold tracking-widest uppercase">
                    SELECT GAME MODE
                </h2>
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-8 w-full py-8 text-[#ff99ff]">
                <div onClick={listfriends} className="flex-1 min-w-[280px] max-w-[350px] h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl  border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px]   shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff] " >

                    <div className="flex justify-center items-center  w-[350px] h-[300px] flex-col">
                        <FiGlobe className=" h-[55px] w-[60px]" />
                        <p className="text-[#ffff] font-['Courier_New',monospace] ">REMOTE GAME</p>
                        <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  ">Play against players worldwide</p>
                        <div className="flex flex-row gap-4 overflow-x-auto px-4 sm:px-8">
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_15px_#C77DFF]"></div>
                        </div>
                    </div>

                </div>
                <div onClick={goto} className=" flex-1 min-w-[280px] max-w-[350px] h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
                    <div className="flex justify-center items-center  w-[350px] h-[300px] flex-col">
                        <IoGameControllerOutline className=" h-[55px] w-[60px]" />
                        <p className="text-[#ffff] font-['Courier_New',monospace] "> LOCAL GAME </p>
                        <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  t"> Play with a friend locally</p>


                        <div className="fflex flex-row gap-4 overflow-x-auto px-4 sm:px-8">
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_15px_#C77DFF]"></div>
                        </div>
                    </div>
                </div>
                <div onClick={goto_ia} className="flex-1 min-w-[280px] max-w-[350px] h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">

                    <div className="flex justify-center items-center  w-[350px] h-[300px] flex-col">
                        <RiRobot2Line className=" h-[55px] w-[60px] " />
                        <p className="text-[#ffff] font-['Courier_New',monospace] "> IA TRAINING </p>
                        <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  t"> Challenge the intelligence artificielle</p>


                        <div className="fflex flex-row gap-4 overflow-x-auto px-4 sm:px-8">
                            <div className=" w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_10px_#C77DFF]"></div>
                            <div className="flex-shrink-0 w-1 h-1 rounded-full bg-[#C77DFF] shadow-[0_0_15px_#C77DFF]"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full px-4 sm:px-8 mt-8">
                <StatsCharts />
            </div>
        </div >

    )


}

// bg-[#ff99ff]