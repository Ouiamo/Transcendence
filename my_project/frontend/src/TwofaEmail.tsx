// import  { useState } from "react";

// interface twoemailinter{
//   gotoemail : ()=>void;
//   gotohome: ()=>void;
// }
// function TwofaEmail( { gotohome}:twoemailinter)  {
//     const [code, settwofa] = useState('');

//    const send_email = async()=>{
//         try {
//           console.log("dkahltttttttt");
//             const res = await fetch("https://backend:3010/api/2fa/email/send", {
//                 method: "GET",
//                 credentials: "include",
//             });
//             if (res.ok) {

//                 alert("📧 A verification code has been sent to your email.");
//             } else {
//               console.log(" result a3ibad lah ", res)
//                 console.log("❌ Failed to send email 2FA code.");
//             }
//             } catch (err) {
//                 console.error("Error sending email 2FA:", err);
//                 alert("🚨 Network error while sending 2FA email.");
//             }
            
//     }
//     send_email();
//     const verify_twofa= async(code: string) =>{
//       try {
//         console.log(" code isssss ________________-+ ", code);
//         const res = await fetch(
//           "https://backend:3010/api/2fa/email/verify",
//           {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ code }),
//           }
//         );
//         if(res.ok)
//           {
//             console.log("data lijattt hiya $$$$$$$$$$$$$ ", res);
//             alert("✅ Email verified! Welcome to the Ping Pong arena 🏓");
//             window.location.href = "/dashboard";
            
//           }
//           else{
//             alert("❌ Wrong code. Check your email and try again.");
//             console.log("erro akhotiii" ,res);
//           }
//         }
//         catch (err) {
//           alert("🚨 Network error");
//           console.log("errror fetchhhhhhh");
//         }
//       }
//    //   send_email();
//     return (
//         <div className="flex flex-row w-full h-[500px]   gap-[50px]">
//             <div className="flex  w-fit ">
//                 <h1 className="text-[#ff99ff]">ping pong </h1>
//             </div>
//             <div className="flex justify-center items-center  flex-1 h-full ">

//             <div className="  flex flex-col   justify-center items-center   h-[500px] ">
//                 <h2 className="text-[#ff99ff] text-[70px]  ">Verify your identity</h2>
//                 <p className="flex ">🏓 Your Ping Pong code is waiting — check your email!</p>
//                 <input
//                     style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }} className=" mt-[30px] flex justify-center items-center caret-[#ff44ff]  w-[400px] h-[50px] rounded-full  bg-[#0d0221] text-white outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] transition-all" type="input" placeholder="set code..." autoComplete="off" spellCheck="false" value={code} onChange={(e) => settwofa(e.target.value)}></input>
//                      <button className=" mt-[30px] w-[400px] h-[50px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
//     "
//                 onClick={() => verify_twofa(code)} > se connecter</button>
//                 {/* <button  onClick={send_email} className="  mt-[30px] w-[400px] h-[50px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">sand </button> */}
//                  <button  onClick={gotohome} className="  mt-[30px] w-[400px] h-[50px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]">Go Home</button>
                       
                       
//             </div>
//             </div>
//         </div>
//     )
// }

// export default TwofaEmail;