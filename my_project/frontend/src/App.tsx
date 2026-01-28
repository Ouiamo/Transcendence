
import './style.css';
import { useEffect,useState } from 'react';
import { useRef } from "react";
import Twofa from './Twofa.tsx';
// import Lottie from "lottie-react"
import Signup from './Signup';
import Home from './Home'
import Login from  './Login';
import Dashboard from './Dashboard';
import Profil from './Profil';
// import { loginUser } from './Api';
import { Sidebar } from './Sidebar';
// import {initGame} from "../../game/frontend/game.ts"
import { GamePage, Gamepage_i} from "./G.tsx"
// import { Gamepage_r } from './G.tsx';
import TwofaEmail from './TwofaEmail.tsx';
import { Friendlist } from './Friendlist.tsx'
import Friends from './Friends.tsx';
import Setting from './Setting.tsx';
import Leaderboard from './leaderboard.tsx';
// import {G} from "./G.tsx"



type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R' | 'GAME_I' | 'PROFIL'| 'FRIENDS' | 'SETTING' | 'twofa' | 'email' | 'LEADERBOARD'
function App(){
  // const [twoFactor, setTwoFactor] = useState(false)
 
  const [currentPage, setCurrentPage] = useState<page>('HOME');
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);
    console.log("Current Page is:", currentPage);
//  const set_is_enable = ()=>{
//   setTwoFactor(twoFactor);
//   console.log(" towafa is ^^^^^^^^^^ ", twoFactor)
//  }
const gotowfa =() =>{
    localStorage.setItem('page', 'twofa');
  setCurrentPage( 'twofa');
}
const gotoHome =() =>{
    localStorage.setItem('page', 'HOME');
  setCurrentPage( 'HOME');
}
const gotoemail =() =>{
    localStorage.setItem('page', 'email');
  setCurrentPage( 'email');
}
  const gotogamelocal = ()=>{
    localStorage.setItem('page', 'GAME_L');
    setCurrentPage('GAME_L');
  }
    const listfriends = ()=>{
    localStorage.setItem('page', 'GAME_R');
    setCurrentPage('GAME_R');
  }
     const gotogameia = ()=>{
    localStorage.setItem('page', 'GAME_I');
    setCurrentPage('GAME_I');
  }
  const gotoprofil =()=>
  {
    localStorage.setItem('page', 'PROFIL');
    setCurrentPage('PROFIL');
  }
  const   gotofriends = ()=>{
    localStorage.setItem('page', 'FRIENDS');
    setCurrentPage('FRIENDS');
  }
   const   gotoseting = ()=>{
    localStorage.setItem('page', 'SETTING');
    setCurrentPage('SETTING');
  }
   const gotodash = ()=>{
    localStorage.setItem('page', 'DASHBOARD');
    setCurrentPage('DASHBOARD');
  }
  const gotoleaderboard =() =>{
    localStorage.setItem('page', 'LEADERBOARD');
  setCurrentPage( 'LEADERBOARD');
}
  const obj_login = (data : any | any)=>{
    if(data){
      setdatauser(data.user);
      }
   else
       setdatauser(null);
  }

useEffect(() => {
  const twofa = localStorage.getItem('twofa');
  console.log("items is ^^^^^^^^^^^^^ ", twofa);
  const checkSession = async () => {
    try {
      const res = await fetch('https://localhost:3010/api/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setdatauser(data.user)
        const save = localStorage.getItem('page');
        if(save === 'GAME_L')
          setCurrentPage('GAME_L');
        else if(save === 'GAME_R')
          setCurrentPage('GAME_R');
        else if(save === 'SETTING')
          setCurrentPage('SETTING');
        else if(save === 'email')
          setCurrentPage('email');
        else if(save == 'GAME_I')
          setCurrentPage('GAME_I');
        else if(save == 'PROFIL')
            setCurrentPage('PROFIL');
        else if(save == 'FRIENDS')
            setCurrentPage('FRIENDS');
        else if(save == 'twofa')
            setCurrentPage('twofa');
        else if(save == 'LEADERBOARD')
            setCurrentPage('LEADERBOARD');
        else
           setCurrentPage('DASHBOARD');
      } 
      else {
        setCurrentPage('HOME');
      }
    } catch (err) {
      setCurrentPage('HOME');
    }
    finally
    {
      setLoading(false);
    }
  };
  checkSession();
}, []);
       const canvasRef = useRef<HTMLCanvasElement | null>(null);
 
if(loading) return <div>is loading</div>
  return (
    <div >

      {
        currentPage === 'twofa' &&(
        <div className="fex flex-col w-full h-full ">
          <Twofa gotoDASHBOARD={gotodash}/>
        </div>
      )}
      {currentPage === 'HOME' && (
        <div className=" min-h-screen w-full flex items-center justify-center bg-[#0d0221]">
         <Home gotologin={()=> setCurrentPage('LOGIN')} gotosignup={()=> setCurrentPage('SIGNUP')}/>
        </div>
      )}


      {currentPage === 'LOGIN' && ( 
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0221] ">
    
      
           <Login gotohome={()=> setCurrentPage('HOME')} gotoDASHBOARD={()=>setCurrentPage('DASHBOARD')} onloginsucces={obj_login} gotosingup={()=>setCurrentPage('SIGNUP')} gotwofa={gotowfa} gotoemail={gotoemail}/>
       
        </div>
      )}

    {
      currentPage === 'SIGNUP' &&
      <div className="min-h-screen w-full h-full flex items-center justify-center bg-[#0d0221] ">
    
      <Signup gotohome={()=>setCurrentPage('HOME') } gotologin={()=>setCurrentPage('LOGIN')}  gotoDASHBOARD={()=>setCurrentPage('DASHBOARD')}/>
      </div>
    }
    {

      currentPage === 'DASHBOARD'&&
      <div className="h-screen w-full flex-row ">
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login}  listfriends={listfriends}  goto={gotogamelocal} gotoia={gotogameia} gotodashbord={gotodash}  gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>
      </div>
    
    }
  
    {
      currentPage ==='GAME_L' &&
      <div className=" flex    "> 

        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < GamePage  username={user_data.username}/>

        <canvas ref={canvasRef} id="board" />
          </div>
          
        i m in game 
      </div>

    }
    {
      currentPage === 'GAME_R'&& 
      <div>
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>
        i m in remotttttttttttt 
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">
          < Friendlist />
          {/* < Gamepage_r  />
          <canvas ref={canvasRef} id="board" />    */}
          </div>
       
          {/* <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_r  />
          <canvas ref={canvasRef} id="board" />  
     
      </div> */}
      </div>

    }
     {
      currentPage === 'GAME_I'&& 
      <div className="flex  ">
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>

       
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_i  username={user_data.username}/>
          <canvas ref={canvasRef} id="board" />  
     
      </div>
      </div>

    }
    {
        currentPage === 'PROFIL' &&
      <div className="flex flex-row gap-[140px] ">
        <div>
           <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>
        </div>
        <div className="flex w-full h-full">
        <Profil user={user_data}/>
        </div>
      </div>
    }
    {
      currentPage === 'LEADERBOARD' &&
      <div className="flex  flex-row gap-[140px] w-full h-full">
        <div className="flex">
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>

        </div>
        <div className="flex ">
        <Leaderboard />
        </div>
      </div>
    }
    {
      currentPage === 'FRIENDS' &&
      <div className="flex  flex-row gap-[140px] w-full h-full">
        <div className="flex">
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>

        </div>
        <div className="flex ">
        <Friends />
        </div>
      </div>
    }
    {
      currentPage === 'SETTING' &&
      <div className="flex flex-row  gap-[150px]" >
        <div className="flex  ">
            <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard}/>
        </div>
        <div className="flex w-full h-full ">
        <Setting user={user_data}/>
        </div> 
      </div>
    }
    {
      currentPage === 'email' &&(
        <div className="fex flex-col w-full h-full ">
          <TwofaEmail gotoemail={gotoemail} gotohome={gotoHome}/>
        </div>
      )
    }
    </div>
  );
}


export default App;





















// function showHomePage(){
  
// }
// interface Player{
//   id : number;
//   firstname : string;
//   isonligne? : boolean;
//   avatar?: string;
// }

// interface profil{
//   user : Player;
// }
// function Profilplayer({user}:profil)
// {
//   return (
//     <div>
//       <h3>heloo</h3>
//       <h3>{user.firstname}</h3>
//     </div>
//   )
// }
// export default function App(){
// const player1: Player={
//   id :1,
//   firstname : "mlabyed",
// } 
// return (
//   <div>
//   <h3>player name is </h3>
//   <Profilplayer user={player1}/>
//   </div>
// )
// };
// showHomePage();
// function App(){
//   const [count, setCount] = useState(0)
//  return(
//   <div> 
//     <p>Score: {count}</p>
//     <button onClick={()=>setCount(count + 1)}>clic here</button>
//   </div>

//  )

// }
//export default  profilplayer ;
