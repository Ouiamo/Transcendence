import { IoGridOutline, IoGameControllerOutline, IoSettingsOutline, IoPersonCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { Trophy } from 'lucide-react';
import { logoutUser } from './socketService';

interface sideb {
    user_: any;
    gotohome: () => void;
    delete_obj: (data: any) => void;
    gotodashbord: () => void;
    gotoprofil: () => void;
    gotofriends: () => void;
    gotosetting: () => void;
    gotoleaderboard: () => void;
    gotolocalgame : ()=> void;
    setActiveSafe : (s:any) => void;
}
export function Sidebar({ user_, gotohome, delete_obj, gotodashbord, gotoprofil, gotofriends, gotosetting, gotoleaderboard, gotolocalgame , setActiveSafe}: sideb) {
   
const active = localStorage.getItem('sidebar-active');
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
                localStorage.removeItem('sidebar-active');
            }
        }
        catch (error) {
            alert("error in lougout");
        }
    }
    const iconBase =
        "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer";
    const iconActive =
        "bg-[#c44cff]/20 text-[#c44cff] shadow-[0_0_18px_#c44cff] rounded-full";
    const iconInactive =
        "text-[#3b2a55] hover:text-[#c44cff] hover:bg-[#c44cff]/10";
    const labelStyle = "absolute left-[72px] px-3 py-1 rounded-full p-[10px] text-sm font-medium whitespace-nowrap" +
        "bg-[#c44cff]/15 text-[#c44cff] shadow-[0_0_12px_#c44cff] " + "opacity-0 -translate-x-2 pointer-events-none " +
        "transition-all duration-300 " + "group-hover:opacity-100 group-hover:translate-x-0";

    return (

        <aside className="fixed top-0 left-0  w-[88px] h-screen bg-[#0b0618] border-r border-[#c44cff]/20 flex flex-col items-center justify-between h-full py-4">
            <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center border border-[#c44cff]/60 text-[#c44cff] shadow-[0_0_16px_#c44cff] mt-[10px] text-[30px]">
                {user_?.username?.[0]?.toUpperCase()}
            </div>

            <nav className="flex-1 flex items-center justify-center w-full mr-[50px]">
                <ul className="flex flex-col items-center justify-center gap-[50px] w-full list-none">
                    <li onClick={() => { setActiveSafe("dashboard"); gotodashbord(); }}
                        className={`${iconBase} ${active === "dashboard" ? iconActive : iconInactive} relative group`}><IoGridOutline size={35} />
                        <span className={labelStyle}>
                            Dashboard
                        </span></li>
                    <li onClick={() => { setActiveSafe("game"); gotolocalgame(); }}
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







































































































































































