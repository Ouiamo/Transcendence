;
import React, { useState } from "react";
import { FiGlobe, } from "react-icons/fi";
import { IoGameControllerOutline, IoSearch, } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { useRef } from "react";
import { initGame } from "../../game/frontend/game.ts"


interface gridinter {

    gotogame_r: () => void;
    goto: () => void;
    goto_ia: () => void;

}
export function Grid({ gotogame_r, goto, goto_ia }: gridinter) {

    const [searchfor, setusernameshearch] = useState('');
    return (
        <div className="flex flex-col items-center justify-center  bg-[rgba(45,27,105,0.7)]  h-screen w-full ">
            <div className="bg-[#ffff]">
            <div className="relative flex items-center  w-full ">
                <IoSearch className="absolute  text-[#ff44ff] text-xl pointer-events-none z-10 " />
                <input
                    style={{  paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
                    className=" caret-[#ff44ff] w-[250px] h-[33px] rounded-full   bg-[rgba(45,27,105,0.7)]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]   transition-all" type="text" placeholder="Entrer votre gmail" autoComplete="off" spellCheck="false" value={searchfor} onChange={(e) => setusernameshearch(e.target.value)} ></input>

            </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[rgba(45,27,105,0.7)]  h-screen w-full     ">

                <div className="h-[80px]">

                    <h2 className=" font-['Courier_New',monospace] text-white text-center  font-black uppercase">
                        SELECT GAME MODE
                    </h2>
                </div>
                <div className="grid grid-cols-3 w-fite  gap-[30px] text-[#ff99ff]  justify-items-center h-[200px] ">
                    <div onClick={gotogame_r} className="w-[250px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">

                        <div className="flex justify-center items-center flex-col">
                            <FiGlobe className=" h-[50px] w-[30px]" />
                            <p className="text-[#ffff] font-['Courier_New',monospace] ">REMOTE GAME</p>
                            <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  ">Play against players worldwide</p>
                            <div className="flex gap-[3px] mt-8 justify-center items-center">
                                <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                                <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                                <div style={{ width: '5px', height: '5px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_15px_#ff44ff]"></div>
                                <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                                <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            </div>
                        </div>

                    </div    >
                    <div onClick={goto} className=" w-[250px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">

                        <div className="flex justify-center items-center flex-col">
                            <IoGameControllerOutline className=" h-[50px] w-[30px]" />
                            <p className="text-[#ffff] font-['Courier_New',monospace] "> LOCAL GAME </p>
                            <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  t"> Play with a friend locally</p>

                        </div>
                        <div className="flex gap-[3px] mt-8 justify-center items-center">
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '5px', height: '5px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_15px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                        </div>
                    </div>
                    <div onClick={goto_ia} className=" w-[250px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">

                        <div className="flex justify-center items-center flex-col">
                            <RiRobot2Line className=" h-[50px] w-[30px] " />
                            <p className="text-[#ffff] font-['Courier_New',monospace] "> IA TRAINING </p>
                            <p className="text-xs text-gray-400 font-['Courier_New',monospace] text-center  t"> Challenge the intelligence artificielle</p>

                        </div>
                        <div className="flex gap-[3px] mt-8 justify-center items-center">
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '5px', height: '5px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_15px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                            <div style={{ width: '4px', height: '4px' }} className="rounded-full bg-[#ff44ff] shadow-[0_0_10px_#ff44ff]"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    )


}

// bg-[#ff99ff]