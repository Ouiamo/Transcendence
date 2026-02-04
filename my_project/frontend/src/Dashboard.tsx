
// import { use, useState } from 'react';

import { Sidebar } from './Sidebar';
import { Grid } from './Grid';
interface Dashboardtest {
    user: any;
    gotohome: () => void;
    gotoprofil: () => void;
    delete_obj: (data: any) => void;
    listfriends: () => void;
    goto: () => void;
    gotodashbord: () => void;
    gotoia: () => void;
    gotofriends: () => void;
    gotosetting: () => void;
    gotoleaderboard: ()=> void;
    


}



function Dashboard({ gotohome, gotoprofil, user, delete_obj, listfriends, goto, gotodashbord, gotoia, gotofriends, gotosetting, gotoleaderboard}: Dashboardtest) {

    return (
        <div className=" flex h-screen w-full bg-[#0b0618] text-white overflow-hidden">
            <div className=" h-full border-r border-white/40 flex  w-full ">
                <div>
                    <Sidebar user_={user} gotohome={gotohome} delete_obj={delete_obj} gotodashbord={gotodashbord} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotosetting} gotoleaderboard={gotoleaderboard} gotolocalgame={goto}/>
                </div>
                <div className="flex 1 h-full overflow-y-auto custom-scrollbar w-full">

                    <Grid listfriends={listfriends} goto={goto} goto_ia={gotoia} />
                </div>
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