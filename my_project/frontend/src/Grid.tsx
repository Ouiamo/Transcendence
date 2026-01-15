import React from "react";
import { FiGlobe, } from "react-icons/fi";
import { IoGameControllerOutline, IoSearch } from "react-icons/io5";
export function Grid() {



    return (
        <div className="flex flex-col items-center justify-center  bg-[rgba(45,27,105,0.7)]  h-screen w-full "> 
            {/* <div className="w-full h-[40px]  flex bg-[#FAF2A1] items-center justify-center  ">hello frome serche
            <input >
            </input>
            <IoSearch className="mt-[10px] "/>
            </div> */}
        <div className="flex flex-col items-center justify-center bg-[rgba(45,27,105,0.7)]  h-screen w-full     ">
         
            <div className="h-[80px]">

                <h2 className=" font-['Courier_New',monospace] text-white text-center  font-black uppercase">
                   SELECT GAME MODE
                </h2>
            </div>
            <div className="grid grid-cols-2 w-fite  gap-[30px] text-[#ff99ff]  justify-items-center h-[200px] ">
                <div className="w-[250px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
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
                <div className=" w-[250px] bg-gradient-to-br from-[rgba(45,27,105,0.8)] to-[rgba(166,77,121,0.8)] backdrop-blur-md rounded-2xl p-8 border-2 border-[#ff44ff] transition-all duration-300 hover:scale-105 hover:border-[#ff99ff] border-[1px] border-[#ff44ff]/70  rounded-[30px] justify-content-center  shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
                    <div  className="flex justify-center items-center flex-col">
                    <IoGameControllerOutline className=" h-[50px] w-[30px]"/>
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


            </div>
        </div>
        </div>


    )


}

// bg-[#ff99ff]