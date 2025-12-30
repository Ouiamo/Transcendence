
import { useState } from 'react';
import './Dashboard.css'
import { IoSearch, IoHomeOutline, IoSettingsOutline, IoNotificationsOutline, IoPersonCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";
interface Dashboardtest {
    gotohome: () => void;
    //  gotogame: () => void;
    gotoprofil: ()=>void;
  
}
function Dashboard({ gotohome, gotoprofil }: Dashboardtest) {
    const user_name = localStorage.getItem('username');
    const [username_search, setusernameshearch] = useState('');
    const [input_search, handelsearch] = useState(false);
    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        gotohome();
    }
const debug = ()=>{
    console.log('user name is ',{user_name}, 'serch name is ', {username_search} );
}
    return (

        <div className='direction'>

            <aside>
                {/* <img className='profil_class'
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=wafa"

                />
                <span className='profil_name'>{user_name}</span> */}
{/* <div className="h-20 w-20 bg-red-500 shadow-[0_0_20px_red] rounded-full">hello from tilwinnnd</div> */}
                <nav >
                    <div className='bottom_dash'>
                        <ul >
                            <li>
                                <IoSearch onClick={() => handelsearch(true)} />
                                {input_search === true &&

                                    <input className='search' type='text' placeholder='Search for players...' value={username_search} onChange={(e) => setusernameshearch(e.target.value)} onClick={debug}></input>   
                                }
                                {
                                    username_search &&
                                    <p>serching for {username_search}</p>
                                }
                            </li>

                            <li> <IoNotificationsOutline /></li>
                            <li><IoGameControllerOutline /></li>
                            <li><IoSettingsOutline /></li>
                            <li> <IoHomeOutline onClick={gotohome} /></li>
                            <li><IoPersonCircleOutline onClick={gotoprofil}/></li>
                        </ul>
                    </div>
                </nav>


            </aside>
            <button  onClick={logout} className='bottom_out'> Logout
                <IoLogOutOutline  /></button>
        </div>
    )
}

export default Dashboard