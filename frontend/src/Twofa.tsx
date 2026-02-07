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
        <div className="flex flex-row w-full h-[500px]   gap-[50px]">
            <div className="flex  w-fit ">
                <h1 className="text-[#ff99ff]">ping pong </h1>
            </div>
            <div className="flex justify-center items-center  flex-1 h-full ">

            <div className="  flex flex-col   justify-center items-center   h-[500px] ">
                <h2 className="text-[#ff99ff] text-[70px]  ">Verify your identity</h2>
                <p className="flex ">  Open your authenticator app and enter the Ping Pong security code</p>
                <input
                    style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }} className=" mt-[30px] flex justify-center items-center caret-[#ff44ff]  w-[400px] h-[50px] rounded-full  bg-[#0d0221] text-white outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] transition-all" type="input" placeholder="set code..." autoComplete="off" spellCheck="false" value={code} onChange={(e) => settwofa(e.target.value)}></input>
                     <button className=" mt-[30px] w-[400px] h-[50px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
    "
                onClick={() => verify_twofa(code)} > se connecter</button>
                
                   <button className=" mt-[30px] w-[400px] h-[50px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
    "
                onClick={gotohome} > Go home</button>     
            </div>
            </div>
        </div>
    )
}

export default Twofa;