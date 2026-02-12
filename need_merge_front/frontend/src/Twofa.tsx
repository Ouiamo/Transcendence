import { useState } from "react";
interface twotinter{
  gotoDASHBOARD :()=>void;
  gotohome : ()=>void;
}
function Twofa( {gotoDASHBOARD, gotohome}:twotinter)  {
    const [code, settwofa] = useState('');
    const verify_twofa= async(code: string) =>{
    try {
          console.log(" code isssss ________________-+ ", code);
          const res = await fetch(
          "https://localhost:3010/api/2fa/authenticator/verify",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );
         if(res.ok)
          {
            console.log("data lijattt hiya $$$$$$$$$$$$$ ", res);
            alert("✅ Identity verified! Welcome to Ping Pong 🏓");
            gotoDASHBOARD();
   
         }
         else{
           alert("❌ Invalid code. Check your authenticator app and try again.");
           console.log("erro akhotiii" ,res);
         }
       }
       catch (err) {
          alert("🚨 Network error");
          console.log("errror fetchhhhhhh");
       }
    }
return (
  <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0d0221] text-white p-4 lg:p-12 
                  overflow-x-hidden box-border">
      
      {/* Logo Section */}
      <div className="flex justify-center lg:justify-start lg:w-fit mb-4 lg:mb-0 flex-none">
          <h1 className="text-[#ff99ff]/60 uppercase font-black tracking-widest text-lg">
              ping pong
          </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center w-full min-w-0">
          <div className="flex flex-col items-center w-full max-w-[450px] gap-[40px] px-[2px] sm:px-0">
              
              <div className="text-center w-full">
                  <h2 className="glow-text text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight break-words leading-tight">
                      Verify your identity
                  </h2>
                  <p className="text-[#8F929E] text-xs sm:text-sm mt-4 opacity-80 max-w-[300px] mx-auto">
                      Open your authenticator app and enter the Ping Pong security code
                  </p>
              </div>
              <div className="w-full flex justify-center">
                  <input
                   spellCheck="false"
                      style={{ color: 'white', WebkitTextFillColor: 'white' }}
                      className="w-full h-[50px] rounded-[12px] bg-[#0b0618] text-white 
                               outline-none border border-[#ff44ff]/40 px-4 caret-[#ff44ff]
                               placeholder:text-[#ff44ff]/20 focus:border-[#ff44ff] 
                               focus:shadow-[0_0_15px_rgba(255,68,255,0.4)] transition-all duration-300
                               min-w-0" 
                      type="text"
                      placeholder="Enter code..."
                      value={code}
                      onChange={(e) => settwofa(e.target.value)}
                  />
              </div>
              <div className="flex flex-row sm:flex-row w-full gap-[20px]">
                  <button 
                      className="w-full sm:flex-1 h-[50px] rounded-[12px] bg-gradient-to-r from-[#a25cff] via-[#c84cff] to-[#d86bff]
                               text-white font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,68,255,0.4)]
                               hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                      onClick={() => verify_twofa(code)}
                  >
                      Sign In
                  </button>
                  
                  <button 
                      className="w-full sm:flex-1 h-[50px] rounded-[12px] border border-[#ff99ff]/50 
                               text-[#ff99ff] font-bold text-[10px] sm:text-xs uppercase tracking-widest
                               hover:bg-[#ff99ff]/10 transition-all"
                      onClick={gotohome}
                  >
                      Go Home
                  </button>
              </div>
          </div>
      </div>
  </div>
);
}

export default Twofa;