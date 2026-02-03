import { IoGridOutline, IoGameControllerOutline, IoSettingsOutline, IoPersonCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { Trophy } from 'lucide-react';
import { logoutUser } from './socketService';


import { useState } from "react";

interface sideb {
    user_: any;
    gotohome: () => void;
    delete_obj: (data: any) => void;
    gotodashbord: () => void;
    gotoprofil: () => void;
    gotofriends: () => void;
    gotosetting: () => void;
    gotoleaderboard: () => void;
}
export function Sidebar({ user_, gotohome, delete_obj, gotodashbord, gotoprofil, gotofriends, gotosetting, gotoleaderboard }: sideb) {
    const [active, setActive] = useState<"dashboard" | "game" | "leaderboard" | "settings" | "profile" | "friends">
        (() => (localStorage.getItem("sidebar-active") as any) || "dashboard");

    const setActiveSafe = (key: typeof active) => {
        setActive(key);
        localStorage.setItem("sidebar-active", key);
    };

    const logout = async () => {
        try {
            // First disconnect the socket to immediately mark user offline
            if (user_ && user_.id && user_.username) {
                logoutUser(user_.id, user_.username);
            }

            const logo = await fetch('https://localhost:3010/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
            if (logo.ok) {
                alert("logout succes");
                console.log("logout sucess");
                delete_obj(null);
                gotohome();
                localStorage.removeItem('page');
            }
        }
        catch (error) {
            alert("error in lougout");
        }
    }
    const iconBase =
        "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer";
    const iconActive =
        "bg-[#c44cff]/20 text-[#c44cff] shadow-[0_0_18px_#c44cff]";
    const iconInactive =
        "text-[#3b2a55] hover:text-[#c44cff] hover:bg-[#c44cff]/10";
    const labelStyle = "absolute left-[72px] px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap " +
        "bg-[#c44cff]/15 text-[#c44cff] shadow-[0_0_12px_#c44cff] " + "opacity-0 -translate-x-2 pointer-events-none " +
        "transition-all duration-300 " + "group-hover:opacity-100 group-hover:translate-x-0";

    return (

        <aside className="fixed top-0 left-0  w-[88px] h-screen bg-[#0b0618] border-r border-[#c44cff]/20 flex flex-col items-center justify-between h-full py-4">
            <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center border border-[#c44cff]/60 text-[#c44cff] shadow-[0_0_16px_#c44cff] font-bold text-[30px]">
                {user_?.username?.[0]?.toUpperCase()}
            </div>

            <nav className="flex-1 flex items-center justify-center w-full mr-[50px]">
                <ul className="flex flex-col items-center justify-center gap-[50px] w-full list-none">
                    <li onClick={() => { setActiveSafe("dashboard"); gotodashbord(); }}
                        className={`${iconBase} ${active === "dashboard" ? iconActive : iconInactive} relative group`}><IoGridOutline size={35} />
                        <span className={labelStyle}>
                            Dashboard
                        </span></li>
                    <li onClick={() => { setActiveSafe("game"); }}
                        className={`${iconBase} ${active === "game" ? iconActive : iconInactive} relative group`}><IoGameControllerOutline size={35} />
                        <span className={labelStyle}>
                            Game
                        </span></li>
                    <li onClick={() => { setActiveSafe("leaderboard"); gotoleaderboard(); }}
                        className={`${iconBase} ${active === "leaderboard" ? iconActive : iconInactive} relative group`}><Trophy size={35} />
                        <span className={labelStyle}>
                            Leaderboard
                        </span></li>
                    <li onClick={() => { setActiveSafe("profile"); gotoprofil(); }}
                        className={`${iconBase} ${active === "profile" ? iconActive : iconInactive} relative group`}><IoPersonCircleOutline size={35} />
                        <span className={labelStyle}>
                            Profile
                        </span></li>
                    <li onClick={() => { setActiveSafe("friends"); gotofriends(); }}
                        className={`${iconBase} ${active === "friends" ? iconActive : iconInactive} relative group`}><FaUsers size={35} />
                        <span className={labelStyle}>
                            Friends
                        </span></li>
                    <li onClick={() => { setActiveSafe("settings"); gotosetting(); }}
                        className={`${iconBase} ${active === "settings" ? iconActive : iconInactive} relative group`}><IoSettingsOutline size={35} />
                        <span className={labelStyle}>
                            Settings
                        </span></li>
                </ul>
            </nav>
            <li onClick={logout}
                className={`${iconBase} ${iconActive} relative group`}>
                <IoLogOutOutline size={40} />
                <span className={labelStyle}>
                    Logout
                </span></li>


        </aside>

    );
};

export default Sidebar;


// <aside className=" fixed top-0 left-0 w-[110px] h-full   bg-[#0d0218] flex flex-col items-center py-10 justify-between shrink-0 border-r-[1px] border-[#ff44ff]/30">
//     <div className="mt-[20px] w-[100px] h-[40px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] flex items-center justify-center shadow-[0_0_10px_#ff44ff]">
//         <span className="text-white text-[10px] font-bold truncate px-1 items-center">{user_?.username}</span>
//     </div>
//     <nav className="flex-1 flex items-center justify-center">
//         <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' , color:'white !important'}} className="text-white text-2xl list-none">
//             {/* <IconContext.Provider value={{ color: "white", size: "1.5em", className: "global-class-name" }}></IconContext.Provider> */}
//             {/* <li><IoSearch size={40} className="mr-[40px] !text-[#ff44ff] text-3xl cursor-pointer drop-shadow-[0_0_8px_#ff44ff] cursor-pointer hover:scale-125 transition-all duration-200" /></li> */}
//             <li><IoHomeOutline size={40} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"onClick={gotodashbord} /></li>
//             <li><IoNotificationsOutline size={40} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
//             <li><Trophy size={40} onClick={gotoleaderboard} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
//             <li><IoSettingsOutline size={40} onClick={gotosetting} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
//             <li><IoPersonCircleOutline size={40} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200" onClick={gotoprofil} /></li>
//             <li><FaUsers size={40} className="!text-[#6B4C7A] hover:!text-[#E879F9] text-3xl cursor-pointer hover:scale-125 transition-all duration-200" onClick={gotofriends} /></li>
//         </ul>
//     </nav>
// <button className=" w-[90px] h-[50px]   bg-[#4B2A6F] flex items-center justify-center shadow-[0_0_10px_#ff44ff] border border-[#ff44ff]/30 cursor-pointer hover:scale-110 transition-all duration-200 rounded-full" onClick={logout} >
//     <IoLogOutOutline size={35} className="!text-[#C77DFF] cursor-pointer drop-shadow-[0_0_8px_#C77DFF99] hover:scale-125 hover:text-[#E879F9] transition-all duration-200" /></button>
// </aside>




































































































































































