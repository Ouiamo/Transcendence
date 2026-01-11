import React, { useState } from "react";
import { loginUser } from './Api';
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { Si42 } from "react-icons/si";
import { RiLockPasswordLine } from "react-icons/ri";
interface Logintest {
    gotohome: () => void;
    gotoDASHBOARD: () => void;
    onloginsucces: (data: any) => void;
    gotosingup: () => void;
}

function Login({ gotohome, gotoDASHBOARD, onloginsucces, gotosingup }: Logintest) {

    const [passlogin, setpasslogin] = useState('');
    const [gmailogin, setgmailogin] = useState('');

    const handel_auth_goole = async () => {
        window.location.href = 'http://localhost:3010/api/auth/google'
        // window.open('http://localhost:3010/api/auth/google');
        //gotoDASHBOARD();
    }
    const handel_auth_42 = async () => {
        window.open('http://localhost:3010/api/auth/42');
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
            console.log("resultaaaaaaaaaaaaaaa", result);
            if (result.success) {
                alert("login sucess");
                onloginsucces(result)
                console.log("haniiiiiiiiiii");
                gotoDASHBOARD();
            }
            else {
                alert("error serveur");
                return;
            }
        }
        catch (erro) {
            alert("error server");
        }

    }
    return (
        <div className=" flex  flex-col gap-y-10 items-center h-auto w-[300px] min-h-[350px]  shrink-0 border-[2px] border-[#ff44ff]/30 rounded-[30px] shadow-[0_0_20px_rgba(255,68,255,0.8)] pt-10 pb-10 px-8">
            <header className="flex flex-col gap-y-5 items-center justify-center w-full mt-20 ">
                <div className="py-3 flex w-[40px] h-[40px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] items-center justify-center rounded-full shadow-[0_0_30px_#ff44ff,0_0_10px_#ffffff]">
                    < IoPersonCircleOutline className=" text-white " />
                </div>
                <p className="text-white text-2xl font-[900]">Connexion</p>
                <p className="text-[#ff44ff]/70 text-[8px] ">Bienvenue ! Connectez-vous à votre compte</p>
            </header>
            <section className="flex flex-col gap-y-5 bg-red-500/10">
                <div className="flex flex-col  ">
                    <p className="text-white text-[8px]">Gmail d'utilisateur</p>
                    <div className="relative flex items-center w-full">

                        <IoPersonCircleOutline className="absolute left-3 text-[#ff44ff] text-xl pointer-events-none z-10" />

                        <input
                            style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }}
                            className="pr-4 py-3 rounded-full w-full  bg-[#0d0221]  text-white text-sm outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff]   transition-all" type="email" placeholder="Entrer votre gmail"
                            value={gmailogin}
                            onChange={(e) => setgmailogin(e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-col  ">
                    <p className="text- text-[8px]">Enter votre Mot de passe</p>
                    <div className="relative flex items-center w-full  ">
                        <RiLockPasswordLine className="absolute left-3 text-[#ff44ff] text-xl pointer-events-none z-10" />
                        <input
                            style={{ paddingLeft: '20px', color: 'white !important', WebkitTextFillColor: 'white' }} className=" pr-4 py-3 rounded-full w-full bg-[#0d0221] text-white outline-none border border-[#ff44ff]/70 placeholder:text-[#ff44ff]/40 focus:border-[#ff44ff] transition-all" type="password" placeholder="set password" value={passlogin} onChange={(e) => setpasslogin(e.target.value)}></input>

                    </div>
                </div>


                <div className="flex flex-col gap-y-5 ">
                    <div className="flex flex-row items-center justify-between w-full max-w-[80px] mx-auto mt-10 px-2">

                        <button className="p-3 border-none outline-none  bg-transparent  shrink-0" onClick={handel_auth_goole}>
                            <FaGoogle className="text-[#ff44ff] text-xl   transition-all duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
    "   />
                        </button>

                        <button className="p-3 bg-white/10 rounded-full bg-transparent  border-none outline-none  shrink-0" onClick={handel_auth_42}>
                            <Si42 className="text-[#ff44ff] text-xl group-hover:scale-110 transition-all  duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" />
                        </button>

                    </div>

                    <button className="w-full py-3 px-6 mt-4 rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
    " 
    onClick={handelLogin} > se connecter</button>


                </div>
                <div className="flex flex-row items-center justify-center gap-x-2 mt-4">

                    <p className="text-white/60 text-[10px]">
                        Vous n'avez pas de compte ?
                    </p>
                    <a onClick={gotosingup}
                        className="text-[#ff44ff] text-[10px] font-bold hover:underline hover:text-[#ff99ff]  transition-all"
                    >
                        S'inscrire
                       
                    </a>
                </div>
            </section>

        </div>
    )

}
export default Login;