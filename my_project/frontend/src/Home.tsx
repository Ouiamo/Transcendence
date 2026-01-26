import React from "react";
import Pong2 from "./Pong2.json"
import Lottie from "lottie-react"
import { GiPingPongBat } from "react-icons/gi";
interface homeinterfae {
    
    gotologin: () => void;
    gotosignup: () => void;
}
function Home({ gotologin, gotosignup }: homeinterfae) {

    return (
        <div className="flex flex-row w-full h-full ">
        <div className="h-full w-full flex flex-col items-center justify-center">

            <header className=" flex flex-col justify-center items-center">
                <div className="py-3 flex w-[120px] h-[120px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] items-center justify-center rounded-full shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
                    < GiPingPongBat className=" text-white w-[70px] h-[70px] " />
                </div>
                <h1 className=" text-[#ff99ff] ">PING | PONG</h1>
                <p className="text-[14px]">Welcome! Access your account</p>
            </header>
            <section className="flex flex-col  ">
                <button className="mt-[20px] w-[250px] h-[44px] py-3 px-6  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] " onClick={gotologin} >Login</button>
               <button onClick={gotosignup} className="mt-[20px] w-[250px] h-[44px] rounded-full bg-transparent text-[#ff44ff]/70 border border-[#ff44ff]/70 hover:border-[#ff44ff] hover:text-[#ff44ff] transition-all duration-300">
    Sign Up
</button>
            </section>

        </div>
            <div className=" ">
                <Lottie animationData={Pong2}/>
            </div>
             </div>
    )

}
export default Home;