
import { use, useState } from 'react';

import { Sidebar } from './Sidebar';
import {Grid} from './Grid';
interface Dashboardtest {
    gotohome: () => void;
    gotoprofil: () => void;
    delete_obj: (data: any) => void;
    gotogame : ()=>void;
    user: any;
    listfriends : ()=>void;
}

function Dashboard({ gotohome, gotoprofil, user, delete_obj, gotogame , listfriends}: Dashboardtest) {
    const [username_search, setusernameshearch] = useState('');
    const [input_search, handelsearch] = useState(false);
 
    return (
<div className=" flex h-screen w-full bg-[#0d0221] ">
   <Sidebar user_={user} gotohome={gotohome} delete_obj={delete_obj} />
   <Grid  gotogame={gotogame} listfriends={listfriends}/>
   
</div>

  
    )
}

export default Dashboard
{/* {input_search === true &&

    <input className='search' type='text' placeholder='Search for players...' value={username_search} onChange={(e) => setusernameshearch(e.target.value)} onClick={debug}></input>   
}
{
    username_search &&
    <p>serching for {username_search}</p>
} */}