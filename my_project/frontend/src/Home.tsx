// import Pong2 from "./Pong2.json"
// import Lottie from "lottie-react"
// import { GiPingPongBat } from "react-icons/gi";
// interface homeinterfae {

//     gotologin: () => void;
//     gotosignup: () => void;
// }
// function Home({ gotologin, gotosignup }: homeinterfae) {

//     return (
//         <div className="flex flex-row w-full h-full ">
//         <div className="h-full w-full flex flex-col items-center justify-center">

//             <header className=" flex flex-col justify-center items-center">
//                 <div className="py-3 flex w-[120px] h-[120px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] items-center justify-center rounded-full shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
//                     < GiPingPongBat className=" text-white w-[70px] h-[70px] " />
//                 </div>
//                 <h1 className=" text-[#ff99ff] ">PING | PONG</h1>
//                 <p className="text-[14px]">Welcome! Access your account</p>
//             </header>
//             <section className="flex flex-col  ">
//                 <button className="mt-[20px] w-[250px] h-[44px] py-3 px-6  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] " onClick={gotologin} >Login</button>
//                <button onClick={gotosignup} className="mt-[20px] w-[250px] h-[44px] rounded-full bg-transparent text-[#ff44ff]/70 border border-[#ff44ff]/70 hover:border-[#ff44ff] hover:text-[#ff44ff] transition-all duration-300">
//     Sign Up
// </button>
//             </section>

//         </div>
//             <div className=" ">
//                 <Lottie animationData={Pong2}/>
//             </div>
//              </div>
//     )

// }
// export default Home;

import Pong2 from "./Pong2.json"
import Lottie from "lottie-react"

interface HomeInterface {
  gotologin: () => void
  gotosignup: () => void
}

function Home({ gotologin, gotosignup }: HomeInterface) {
  return (
    <div className="min-h-screen w-full bg-[#06060d] flex flex-col items-center justify-center text-white relative overflow-hidden">

      <div className="flex flex-col items-center gap-8 md:gap-10">
        <div className="w-[180px] h-[120px] rounded-xl border border-[#c84cff]/40 
                        shadow-[0_0_40px_rgba(200,76,255,0.25)] 
                        flex items-center justify-center relative">

          <div className="absolute inset-0 opacity-80">
            <Lottie animationData={Pong2} loop style={{ width: 300, height: 300 }} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <h1 className="pong-title text-[75px] md:text-[70px] font-extrabold glow-text leading-none">
            PONG
          </h1>

          <p className="text-sm tracking-widest uppercase text-gray-400 ">
            Competitive Pong Experience
          </p>


        </div>
        <div className="w-[260px] h-[1px] bg-[#d86bff]/40 mt-10"></div>
        <div className="flex gap-6 mt-10">
    
          <button
            onClick={gotologin}
            className="w-[120px] h-[38px]
               rounded-full
               bg-[#d86bff]
               text-black text-xs font-bold tracking-widest
               shadow-[0_0_20px_rgba(216,107,255,0.8)]
               hover:shadow-[0_0_30px_rgba(216,107,255,1)]
               transition"
          >
            LOGIN
          </button>

          <button
            onClick={gotosignup}
            className="w-[120px] h-[38px]
               rounded-full
               border border-[#d86bff]
               text-[#d86bff] text-xs font-bold tracking-widest
               hover:bg-[#d86bff]/10
               hover:shadow-[0_0_20px_rgba(216,107,255,0.6)]
               transition"
          >
            SIGN UP
          </button>
        </div>


      </div>
      <div className="flex justify-center">
        <p className="flex flex-col items-center gap-4 text-[14px] tracking-widest text-[#9201CB]/70">
          <span>Enter the arena. Challenge players worldwide.</span>
          <span>Become a legend.</span>
        </p>
      </div>
    </div>
  )
}

export default Home

