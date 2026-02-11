import { useState } from "react";
import { loginUser } from './Api';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import { RiLockPasswordLine } from "react-icons/ri";
import { API_URL } from "./Api";
interface Logintest {
    gotohome: () => void;
    gotoDASHBOARD: () => void;
    onloginsucces: (data: any) => void;
    gotosingup: () => void;
    gotwofa: () => void;
}

function Login({ gotohome, gotoDASHBOARD, onloginsucces, gotosingup, gotwofa }: Logintest) {

    const [passlogin, setpasslogin] = useState('');
    const [gmailogin, setgmailogin] = useState('');
localStorage.setItem('page', 'LOGIN');
    const handel_auth_goole = async () => {
        window.location.href = '/api/auth/google'  //backend
        console.log("haniiiiiiiiiiiiiiiiiiiiiiii google");
        gotoDASHBOARD();

    }
    const handel_auth_42 = async () => {
        window.location.href = ('/api/auth/42');
        gotoDASHBOARD();
    }
    const handelLogin = async () => {
        const cleangmail_login = gmailogin.trim();
        const data_login = {
            email: cleangmail_login,
            password: passlogin,
        }
        try { 
            const result = await loginUser(data_login);
            console.log("login resulttttttttttttaaaaaaaaa ", result);
            if (result.twofa_required) {
                if (result.method === "authenticator" && result.twofa_enabled) {
                     try {
                    const res1 = await fetch(`${API_URL}/api/profile`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if(res1.ok)
                    {
                        const ress1 = await await res1.json();
                        onloginsucces(ress1);
                        gotoDASHBOARD();
                    }
                }
                catch (err) {
                    console.log("error api profile ")
                }
                    gotwofa();
                }
                // else if (result.method === "email") {
                //     gotoemail();
                // }
            }
            else if (result.success) {
                alert("login sucess");
                try {
                    const res = await fetch(`${API_URL}/api/profile`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if(res.ok)
                    {
                        const ress = await await res.json();
                        onloginsucces(ress);
                        gotoDASHBOARD();
                    }
                }
                catch (err) {
                    console.log("error api profile ")
                }
            }
            else {
                alert("❌ Invalid credentials");
                return;
            }
        }
        catch (erro) {
            alert("🚨 Server erroreeeeeeeeeeeee");
        }

    }
    return (
        <div className=" flex  flex-col  items-center h-auto w-[400px] min-h-[600px]  shrink-0 border-[2px] border-[#c44cff] rounded-[12px] bg-[#0d0221] ">
            <header className="flex flex-col gap-y-5 items-center justify-center w-full mt-[30px] ">
                <div className="py-[3px]  px-[3px] flex w-[50px] h-[50px] bg-[#d86bff] items-center justify-center rounded-full shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
                    < IoPersonCircleOutline className=" text-white " size={30}/>
                </div>
                <p className="text-white text-[25px] font-[900] glow-text  ">Login</p>
                <p className="text-[#c44cff] text-[14px] ">Welcome! Log in to your account</p>
            </header>
            <section className="flex flex-col gap-[20px] bg-red-500/10 ">
                <div className="flex flex-col  ">
                    <p className="text-white text-[12px]">Email address</p>
                    <div className="relative flex items-center w-full">

                        <IoPersonCircleOutline className="absolute left-[10px] text-[#c44cff] text-xl pointer-events-none z-10" />

                        <input
                            style={{ paddingLeft: '35px', color: 'white !important', WebkitTextFillColor: 'white' }}
                            className="rounded-[10px]  caret-[#ff44ff] w-[250px] h-[45px]  bg-[#0d0221]  outline-none border border-[#c44cff] placeholder:text-[#ff44ff]/40    transition-all" autoComplete="off" spellCheck="false" type="email" placeholder="Enter your email" value={gmailogin} onChange={(e) => setgmailogin(e.target.value)} ></input>
                    </div>
                </div>
                <div className="flex flex-col  ">
                    <p className="text- text-[12px]">Enter your password</p>
                    <div className="relative flex items-center w-full  ">
                        <RiLockPasswordLine className="absolute left-[10px] text-[#c44cff] text-xl pointer-events-none z-10" />
                        <input
                            style={{ paddingLeft: '35px', color: 'white !important', WebkitTextFillColor: 'white' }} className=" rounded-[10px] caret-[#ff44ff]  w-[250px] h-[45px]  bg-[#0d0221] text-white outline-none border border-[#c44cff] placeholder:text-[#ff44ff]/40  transition-all" type="password" placeholder="Enter your password" autoComplete="off" spellCheck="false" value={passlogin} onChange={(e) => setpasslogin(e.target.value)}></input>

                    </div>
                </div>


                <div className="flex flex-col gap-[0px] ">
                    <button className=" mt-[20px] rounded-[10px] w-full  h-[45px]  bg-[#c44cff]  text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handelLogin} > sign in</button>
                    <div className="flex flex-row items-center justify-between w-full max-w-[80px] mx-auto  mt-[20px]">

                        <button className="p-[3px] border-none outline-none  bg-transparent  shrink-0" onClick={handel_auth_goole}>
                            <FaGoogle className="text-[#c44cff]  text-[20px]   transition-all duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"   />
                        </button>

                        <button className="p-[3px] bg-white/10 rounded-full bg-transparent  border-none outline-none  shrink-0" onClick={handel_auth_42}>
                            <Si42 className="text-[#c44cff] text-[22px] group-hover:scale-110 transition-all  duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" />
                        </button>

                    </div>


                </div>
                <div className="flex flex-row items-center justify-center gap-[15px] mb-[10px]">

                    <p className="text-white/60 text-[12px]">
                        Don’t have an account?
                    </p>
                    <a onClick={gotosingup}
                        className="text-[#c44cff] text-[12px] font-bold hover:underline hover:text-[#ff99ff]  transition-all"
                    >
                        Sign up

                    </a>
                    <a onClick={gotohome}
                        className="text-[#c44cff] text-[12px] font-bold hover:underline hover:text-[#ff99ff]  transition-all"
                    >
                        Go home

                    </a>
                </div>
            </section>

        </div>
    )

}
export default Login;