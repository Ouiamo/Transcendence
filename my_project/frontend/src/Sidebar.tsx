import { IoSearch, IoHomeOutline, IoSettingsOutline, IoNotificationsOutline, IoPersonCircleOutline, IoLogOutOutline } from "react-icons/io5";
import {FaUsers } from "react-icons/fa";

interface sideb{
    user_ : any;
    gotohome : ()=>void;
    delete_obj: (data: any) => void;
    gotodashbord: ()=>void;
    gotoprofil : ()=>void;
    gotofriends :()=> void;
    gotosetting : ()=> void;
}
export function Sidebar({user_, gotohome, delete_obj, gotodashbord, gotoprofil, gotofriends , gotosetting}:sideb){
    // console.log(user_);
       const logout = async () => {
        try {

            const logo = await fetch('https://localhost:3010/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
            // console.log("status cod ", logo);
            if (logo.ok) {
                alert("logout succes");
                console.log("logout sucess");
                delete_obj(null);
                // console.log(user)
                gotohome();
                 localStorage.removeItem('page');  
                // user = null;
            }
        }
        catch (error) {
            alert("error in lougout");
        }
    }
    return(
              
            <aside className=" fixed top-0 left-0 w-[150px] h-full   bg-[rgba(45,27,105,0.7)] flex flex-col items-center py-10 justify-between shrink-0 border-r-[1px] border-[#ff44ff]/30">
                <div className="mt-[20px] w-[100px] h-[40px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] flex items-center justify-center shadow-[0_0_10px_#ff44ff]">
                    <span className="text-white text-[10px] font-bold truncate px-1 items-center">{user_?.username}</span>
                </div>
                <nav className="flex-1 flex items-center justify-center">
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '50px' , color:'white !important'}} className="text-white text-2xl list-none">
                        {/* <IconContext.Provider value={{ color: "white", size: "1.5em", className: "global-class-name" }}></IconContext.Provider> */}
                        <li><IoSearch size={35} className="mr-[40px] !text-[#ff44ff] text-3xl cursor-pointer drop-shadow-[0_0_8px_#ff44ff] cursor-pointer hover:scale-125 transition-all duration-200" /></li>
                        <li><IoNotificationsOutline size={35} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
                        {/* <li><IoGameControllerOutline size={40} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li> */}
                        <li><IoSettingsOutline size={35} onClick={gotosetting} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
                        <li><IoHomeOutline size={35} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"onClick={gotodashbord} /></li>
                        <li><IoPersonCircleOutline size={35} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200" onClick={gotoprofil} /></li>
                        <li><FaUsers size={35} className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200" onClick={gotofriends} /></li>


                        
                    </ul>
                </nav>
            <button className=" w-[90px] h-[50px]   bg-[rgba(45,27,105,0.7)] flex items-center justify-center shadow-[0_0_10px_#ff44ff] border border-[#ff44ff]/30 cursor-pointer hover:scale-110 transition-all duration-200 rounded-full" onClick={logout} > 
                <IoLogOutOutline size={35} className="!text-[#ff44ff] text-3xl " /></button>
            </aside>
       
    );

}