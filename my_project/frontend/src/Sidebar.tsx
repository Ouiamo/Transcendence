import React from "react";
import { IoSearch, IoHomeOutline, IoSettingsOutline, IoNotificationsOutline, IoPersonCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";

interface sideb{
    user_ : any;
    gotohome : ()=>void;
    delete_obj: (data: any) => void;
    gotodashbord: ()=>void;
}
export function Sidebar({user_, gotohome, delete_obj, gotodashbord}:sideb){
    console.log(user_);
       const logout = async () => {
        try {

            const logo = await fetch('http://localhost:3010/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
            console.log("status cod ", logo);
            if (logo.ok) {
                alert("logout succes");
                console.log("logout sucess");
                delete_obj(null);
                // console.log(user)
                gotohome();
                // user = null;
            }
        }
        catch (error) {
            alert("error in lougout");
        }
    }
    return(
              
            <aside className=" fixed top-0 left-0 w-[80px] h-full   bg-[rgba(45,27,105,0.7)] flex flex-col items-center py-10 justify-between shrink-0 border-r-[1px] border-[#ff44ff]/30">
                <div className=" w-[60px] h-[20px] bg-gradient-to-br from-[#ff44ff] to-[#ff99ff] flex items-center justify-center shadow-[0_0_10px_#ff44ff]">
                    <span className="text-white text-[10px] font-bold truncate px-1 items-center">{user_?.username}</span>
                </div>
                <nav className="flex-1 flex items-center justify-center">
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '30px' , color:'white !important'}} className="text-white text-2xl list-none">
                        {/* <IconContext.Provider value={{ color: "white", size: "1.5em", className: "global-class-name" }}></IconContext.Provider> */}
                        <li><IoSearch  className="!text-[#ff44ff] text-3xl cursor-pointer drop-shadow-[0_0_8px_#ff44ff] cursor-pointer hover:scale-125 transition-all duration-200" /></li>
                        <li><IoNotificationsOutline className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
                        <li><IoGameControllerOutline className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
                        <li><IoSettingsOutline className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"/></li>
                        <li><IoHomeOutline className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200"onClick={gotodashbord} /></li>
                        <li><IoPersonCircleOutline className="!text-[#ff44ff] text-3xl cursor-pointer hover:scale-125 transition-all duration-200" /></li>
                    </ul>
                </nav>


            <button className="w-[60px] h-[35px]   bg-[rgba(45,27,105,0.7)] flex items-center justify-center shadow-[0_0_10px_#ff44ff] border border-[#ff44ff]/30 cursor-pointer hover:scale-110 transition-all duration-200 rounded-full" onClick={logout} > 
                <IoLogOutOutline  className="!text-[#ff44ff] text-3xl " /></button>
            </aside>
       
    );

}