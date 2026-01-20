
import { use, useState } from 'react';

import { Sidebar } from './Sidebar';
import {Grid} from './Grid';
interface Dashboardtest {
    gotohome: () => void;
    gotoprofil: () => void;
    delete_obj: (data: any) => void;
   
    user: any;
    // gotogame_r : ()=>void;
    listfriends: ()=>void;
    goto : ()=> void;
    gotodashbord : ()=>void;
    gotoia: ()=>void;
    


}
function Dashboard({ gotohome, gotoprofil, user, delete_obj , listfriends, goto, gotodashbord, gotoia}: Dashboardtest) {

    
 
    return (
<div className=" flex h-screen w-full flex-row gap-[200px]">
 <div className="flex ">

   <Sidebar user_={user} gotohome={gotohome} delete_obj={delete_obj} gotodashbord={gotodashbord} gotoprofil={gotoprofil}  />
    </div>
    <div className="flex">

   <Grid  listfriends={listfriends} goto={goto}  goto_ia={gotoia}/>
    </div>
   
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