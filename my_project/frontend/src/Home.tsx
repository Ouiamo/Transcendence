

import Pong2 from "./Pong2.json"
import Lottie from "lottie-react"

interface HomeInterface {
  gotologin: () => void
  gotosignup: () => void
  gotoprivacy: () => void
  gototerms: () => void
}

function Home({ gotologin, gotosignup, gotoprivacy, gototerms }: HomeInterface) {
  localStorage.setItem('page', 'HOME');
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221] flex flex-col items-center justify-center text-white relative overflow-hidden">

      <div className="flex flex-col items-center gap-[16px] md:gap-10px">
        <div className="w-[180px] h-[120px] rounded-[16px] border border-[#c84cff]/40 
                        shadow-[0_0_40px_rgba(200,76,255,0.25)] 
                        flex items-center justify-center relative">

          <div className="absolute inset-0 opacity-80">
            <Lottie animationData={Pong2} loop style={{ width: 300, height: 300 }} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[16px]">
          <h1 className="pong-title text-[75px] md:text-[70px] font-extrabold glow-text leading-none mb-[2px] ">
            PONG
          </h1>

          <p className="text-[16px] uppercase text-[#c4c4ff]/80 mb-[10px] mt-[2px] font-bold"
            style={{ fontSize: '18px' }}>
            Competitive Pong Experience
          </p>


        </div>
        <div className="w-[300px] h-[2px] mt-10 bg-gradient-to-r from-[#b085ff] via-[#c4c4ff] to-[#ff7cff] rounded-full shadow-[0_0_10px_#b085ff]"></div>
        <div className="flex gap-[20px] mt-[10px]">

          <button
            onClick={gotologin}
            className="w-[120px] h-[38px] rounded-[10px] border-none outline-none
             bg-gradient-to-r from-[#a25cff] via-[#c84cff] to-[#d86bff]
             text-white text-xs font-extrabold tracking-widest
             shadow-[0_0_20px_rgba(216,107,255,0.8)]
             hover:shadow-[0_0_30px_rgba(216,107,255,1)]
             transition-all"
          >
            LOGIN
          </button>

          <button
            onClick={gotosignup}
            className="w-[120px] h-[38px] rounded-[10px] 
             border border-[#d86bff] text-[#d86bff] text-xs font-extrabold tracking-widest
             hover:bg-[#d86bff]/10
             hover:shadow-[0_0_30px_rgba(216,107,255,0.6)]
             transition-all"
          >
            SIGN UP
          </button>
        </div>


      </div>
      <div className=" w-full flex flex-col items-center gap-[4px] text-[14px] mt-[60px]">
        <span className="text-[#c4c4ff]/80 drop-shadow-[0_0_6px_#c4c4ff]">Enter the arena. Challenge players worldwide.</span>
        <span className="text-[#c4c4ff]/60 drop-shadow-[0_0_4px_#b0aaff]">Become a legend.</span>
      </div>
      <div className="w-full flex flex-col items-center gap-[8px] text-[9px] mt-[120px]">
        <span
          onClick={gotoprivacy}
          className="underline hover:text-white cursor-pointer"
        >
          Privacy Policy
        </span>
        <span
          onClick={gototerms}
          className="underline hover:text-white cursor-pointer"
        >
          Terms of Service
        </span>
      </div>
    </div>
  )
}

export default Home

