// import { useState } from "react";
// import { signupUser } from './Api';
// import { FaGoogle } from "react-icons/fa";
// import { Si42 } from "react-icons/si";
// import Login3 from "./Login3.json"

// import Lottie from "lottie-react"
// interface Sinuptest {
//     gotohome: () => void;
//     gotologin: () => void;
//     gotoDASHBOARD: () => void;
// }


// function Signup({ gotohome, gotologin, gotoDASHBOARD }: Sinuptest) {
//     const [username, setusername] = useState('');
//     const [lastname, setlastname] = useState('');
//     const [firstname, setfirstname] = useState('');
//     const [gmail, setgamil] = useState('');
//     const [motdepass, setmotdepass] = useState('');

//     const handel_auth_goole = async () => {
//         window.location.href = 'https://localhost:3010/api/auth/google'
//         // window.open('https://localhost:3010/api/auth/google');
//         //gotoDASHBOARD();
//     }
//     const handel_auth_42 = async () => {
//         window.open('https://localhost:3010/api/auth/42');
//         gotoDASHBOARD();
//     }
//     const handleSignup = async () => {
//         if (!username || !gmail || !lastname || !motdepass) {
//             alert("Veuillez remplir tous les champs");
//             return;
//         }
//         const cleangmail = gmail.trim();
//         if (!cleangmail.includes('@') || !cleangmail.includes('.')) {
//             alert("syntax error gmail");
//             return;
//         }
//         if (motdepass.length < 6) {
//             alert("Le mot de passe doit contenir au moins 6 caractères");
//             return;
//         }
//         const data_user = {

//             firstname: firstname,
//             lastname: lastname,
//             username: username,
//             email: cleangmail,
//             password: motdepass,

//         }
//         try {
//             const result = await signupUser(data_user);
//             console.error("signupppppppppppppppP**** ", result.code);
//             if(result.code == 400)
//             {
//                 alert("compet deja existe ");
//                 return ;
//             }
//             if (result.success) {
//                 alert("signup sucess");
//                 gotologin();
//             }
//             else
//                 alert("error serveuwwwwr ");

//         }
//         catch (error) {
//             alert("error serveureeeeee ");
//         }
//         // console.log(data_user);
//     }
//     return (
// <div className="relative min-h-screen w-full bg-[#0d0221] flex flex-row items-center justify-center  ">
//             <div className=" w-[400px] h-[400px] flex  px-[80px] ">
//                 <div className=" px-[100px] py-[100px] ">

//                   <Lottie animationData={Login3}  />
//                 </div>

//             </div>
//         <div className="flex flex-col items-center  border-[2px] w-[350px] h-[620px]  bg-[#0d0221] border-[2px] border-[#ff44ff]/30 rounded-[30px] shadow-[0_0_20px_rgba(255,68,255,0.8)] pt-10 pb-10 px-8">
//             <header className="flex flex-col  items-center ">
//                 <h1 className="text-white font-2xl text-3xl">Inscription</h1>
//                 <p className="text-[#ff44ff]/70 text-[10px]">Créez votre compte pour commencer</p>
//             </header>
//             <section className=" px-12 flex flex-col  items-center gap-y-6 w-full">
//                 <div className=" gap-y-2 ">
//                     <p className="text-[8px]">Nom d'utilisateur</p>
//                     <input style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//                         className=" caret-[#ff44ff] h-[44px]   w-[250px] rounded-full bg-[#0d0221]   outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]  placeholder:font-['Orbitron'] transition-all" type="text" placeholder="Entrer votre nom" autoComplete="off" spellCheck="false" value={firstname} onChange={(e) => setfirstname(e.target.value)}></input>
//                 </div>
//                 <div>
//                     <p className="text-[8px]">Prenom d'utilisateur</p>
//                     <input style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//                         className=" caret-[#ff44ff] h-[44px]   w-[250px] rounded-full bg-[#0d0221]  outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] placeholder:font-['Orbitron']  transition-all" type="text" placeholder="Enter  votre prenom" autoComplete="off" spellCheck="false" value={lastname} onChange={(e) => setlastname(e.target.value)}></input>
//                 </div>
//                 <div>
//                     <p className="text-[8px]">Username</p>
//                     <input style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//                         className=" caret-[#ff44ff] h-[44px]   w-[250px] rounded-full bg-[#0d0221]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] placeholder:font-['Orbitron']  transition-all" type="text" placeholder="Enter votre username" autoComplete="off" spellCheck="false" value={username} onChange={(e) => setusername(e.target.value)}>
//                     </input>
//                 </div>
//                 <div>
//                     <p className="text-[8px]">Gmali</p>
//                     <input style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//                         className=" caret-[#ff44ff] h-[44px]   w-[250px] rounded-full bg-[#0d0221]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] placeholder:font-['Orbitron']  transition-all" type="gmail" placeholder="Entrer votre gamil" autoComplete="off" spellCheck="false" value={gmail} onChange={(e) => setgamil(e.target.value)}></input>
//                 </div>
//                 <div>
//                     <p className="text-[8px]">Mot de passe</p>
//                     <input style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
//                         className=" caret-[#ff44ff] h-[44px]   w-[250px] rounded-full bg-[#0d0221]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]   placeholder:font-['Orbitron'] transition-all" type="password" placeholder="Créez un mot de passe"  autoComplete="off" spellCheck="false" value={motdepass} onChange={(e) => setmotdepass(e.target.value)}></input>
//                 </div>
//                 <footer className="flex-1 w-full h-auto mt-[15px] flex flex-col items-center gap-y-6">
//                     <div className="flex flex-row items-center justify-between w-full max-w-[80px] mx-auto mt-10 px-2">

//                         <button className="p-3 border-none outline-none  bg-transparent  shrink-0" onClick={handel_auth_goole}>
//                             <FaGoogle className="text-[#ff44ff] text-xl   transition-all duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
//                     "   />
//                         </button>

//                         <button className="p-3 bg-white/10 rounded-full bg-transparent  border-none outline-none  shrink-0" onClick={handel_auth_42}>
//                             <Si42 className="text-[#ff44ff] text-xl group-hover:scale-110 transition-all  duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" />
//                         </button>

//                     </div>
//                     <button className="mt-[20px] w-[250px] h-[44px] py-3 px-6 mt-4 rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" onClick={handleSignup}>S'inscrire</button>
//                     <a className="mt-[10px]  text-[#ff44ff] text-[10px] font-bold hover:underline hover:text-[#ff99ff]  transition-all " onClick={gotohome}>Home </a>

//                 </footer>
//             </section>
//         </div>
//         </div>


//     )
// }
// export default Signup;
import { useState } from "react";
import { signupUser } from './Api';
import { FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import Login3 from "./Login3.json";
import Lottie from "lottie-react";

interface Sinuptest {
    gotohome: () => void;
    gotologin: () => void;
    gotoDASHBOARD: () => void;
}

function Signup({ gotohome, gotologin, gotoDASHBOARD }: Sinuptest) {
    localStorage.setItem('page', 'SIGNUP');
    const [username, setusername] = useState('');
    const [lastname, setlastname] = useState('');
    const [firstname, setfirstname] = useState('');
    const [gmail, setgamil] = useState('');
    const [motdepass, setmotdepass] = useState('');
    const handel_auth_goole = async () => {
        window.location.href = 'https://localhost:3010/api/auth/google';
        gotoDASHBOARD();
    }
    const handel_auth_42 = async () => {
        window.open('https://localhost:3010/api/auth/42');
        gotoDASHBOARD();
    }
    const handleSignup = async () => {
        if (!username || !gmail || !lastname || !motdepass) {
            alert("Please fill in all fields");
            return;
        }
        const data_user = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: gmail.trim(),
            password: motdepass,
        };
        try {
            const result = await signupUser(data_user);
            if (result.code === 400) {
                alert("Account already exists");
                return;
            }
            if (result.success) {
                alert("Signup successful");
                gotologin();
            } else {
                alert("Server error");
            }
        } catch (error) {
            alert("Connection error");
        }
    };

    return (
        <div className="relative min-h-screen w-full  flex flex-row md:flex-row items-center justify-center  gap-[20px]">

            <div className=" md:flex flex-1 max-w-[500px] justify-center items-center">
                <div className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] aspect-square flex items-center justify-center">
                    <Lottie
                        animationData={Login3}
                        loop={true}
                        className="w-full h-full"
                    />
                </div>
            </div>

            {/* Form Section - Fully Responsive */}
            <div className="flex flex-col items-center w-full max-w-[600px] min-h-[650px] bg-[#c44cff]/20   border-2 border-[#c44cff] rounded-[30px] shadow-[0_0_30px_rgba(255,68,255,0.2)] py-[8px] px-[16px] sm:px-10">
                <header className="flex flex-col items-center mb-8">
                    <h1 className="glow-text">Sign Up</h1>
                    <p className="text-[#c44cff] mt-[2px]  font-['Orbitron']">Create your account to start</p>
                </header>

                <section className="flex flex-col items-center gap-y-[16px] w-full">
                    {/* Row 1: First Name & Last Name */}
                    <div className="flex flex-row w-full gap-[4px] px-[2px] mb-[4px] ">
                        <div className="flex-1 flex flex-col items-start p-[10px]">
                            <p className="text-[#c44cff] text-[10px] uppercase ml-[4px] mb-[10px] font-bold font-['Orbitron']">First Name</p>
                            <input spellCheck="false"
                                style={{ WebkitTextFillColor: 'white' }}
                                className="caret-[#ff44ff] h-[40px] w-full rounded-[12px] bg-[#0d0221] text-white 
                       
                       outline-none border border-[#c44cff] glow-input px-[5px]
                       placeholder:text-[#ff44ff]/20 placeholder:font-['Orbitron'] transition-all text-sm"
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setfirstname(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-start p-[10px]">
                            <p className="text-[#c44cff] text-[10px] uppercase ml-[4px] mb-[10px] font-bold font-['Orbitron']">Last Name</p>
                            <input spellCheck="false"
                                style={{ WebkitTextFillColor: 'white' } }
                                className="caret-[#ff44ff] h-[40px] w-full rounded-[12px] bg-[#0d0221] text-white  outline-none border border-[#c44cff] glow-input px-[5px] placeholder:text-[#ff44ff]/20 placeholder:font-['Orbitron'] transition-all"
                                type="text" placeholder="Last Name" value={lastname} onChange={(e) => setlastname(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 2: Username & Email Address */}
                    <div className="flex flex-row w-full gap-[4px] px-[2px] mb-[4px]">
                        <div className="flex-1 flex flex-col items-start p-[10px]">
                            <p className="text-[#c44cff] text-[10px] uppercase ml-[4px] mb-[10px] font-bold font-['Orbitron']">Username</p>
                            <input
                                style={{ WebkitTextFillColor: 'white' }}
                                className="caret-[#ff44ff] h-[40px] w-full rounded-[12px] bg-[#0d0221] text-white  outline-none border border-[#c44cff] glow-input px-[5px] placeholder:text-[#ff44ff]/20 placeholder:font-['Orbitron'] transition-all"
                                type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex flex-col items-start p-[10px]">
                            <p className="text-[#c44cff] text-[10px] uppercase ml-[4px] mb-[10px] font-bold font-['Orbitron']">Email Address</p>
                            <input
                                style={{ WebkitTextFillColor: 'white' }}
                                className="caret-[#ff44ff] h-[40px] w-full rounded-[12px] bg-[#0d0221] text-white  outline-none border border-[#c44cff] glow-input px-[5px]  placeholder:text-[#ff44ff]/20  placeholder:font-['Orbitron'] transition-all"
                                type="email" placeholder="Email" value={gmail} onChange={(e) => setgamil(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start  justify-center px-[2px]">
                        <div className="flex w-full h-full justify-center ">

                            <p className="text-[#c44cff] text-[10px] uppercase ml-[4px] mb-[10px] font-bold font-['Orbitron']">Password</p>
                        </div>
                        <div className="flex w-full h-full justify-center  ">

                            <input
                                style={{ WebkitTextFillColor: 'white' }}
                                className="caret-[#ff44ff] h-[40px] w-[80%]  px-[5px] rounded-[12px] bg-[#0d0221] text-white px-6 outline-none border border-[#c44cff] glow-input placeholder:text-[#ff44ff]/20 placeholder:font-['Orbitron'] transition-all text-sm"
                                type="password"
                                placeholder="Create a password"
                                value={motdepass}
                                onChange={(e) => setmotdepass(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <footer className="flex-1 w-full mt-[15px] flex flex-col items-center gap-y-[14px]">
                      
                        <div className="flex flex-row items-center justify-center w-full gap-[30px] mt-[4px]">
                            <button
                                className="p-[3px] border-none outline-none bg-transparent shrink-0 group"
                                onClick={handel_auth_goole}
                            >
                                <FaGoogle className="text-[#c44cff] text-[20px] transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,68,255,0.8)] hover:scale-125 active:scale-90" />
                            </button>

                            <button
                                className="p-[3px] border-none outline-none bg-transparent shrink-0 group"
                                onClick={handel_auth_42}
                            >
                                <Si42 className="text-[#c44cff] text-[20px] transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,68,255,0.8)] hover:scale-125 active:scale-90" />
                            </button>
                        </div>

                        
                        <button
                            className="w-full max-w-[280px] h-[46px] rounded-[12px] border-none outline-none
                            text-white text-xs font-extrabold tracking-widest
                            bg-gradient-to-r from-[#a25cff] via-[#c84cff] to-[#d86bff]
             shadow-[0_0_20px_rgba(216,107,255,0.8)]
             hover:shadow-[0_0_30px_rgba(216,107,255,1)]
             transition-all  uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                            onClick={handleSignup}
                        >
                            Sign up
                        </button>

                        <a
                            className="mt-[2px] text-[#c44cff] text-[11px] font-bold cursor-pointer hover:underline hover:text-[#ff99ff] transition-all uppercase tracking-tighter"
                            onClick={gotohome}
                        >
                            Home
                        </a>
                    </footer>
                </section>
            </div>
        </div>
    );
}

export default Signup;