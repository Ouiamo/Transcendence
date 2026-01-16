
import './style.css';
import { use, useEffect,useState } from 'react';
import { useRef } from "react";
import Lottie from "lottie-react"
import Signup from './Signup';
import Home from './Home'
import Login from  './Login';
import Dashboard from './Dashboard';
import Profil from './Profil';
import { loginUser } from './Api';
import { Sidebar } from './Sidebar';
import {initGame} from "../../game/frontend/game.ts"
import { GamePage, Gamepage_i} from "./G.tsx"
import { Gamepage_r } from './G.tsx';


type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R' | 'GAME_I'
function App(){
  const [currentPage, setCurrentPage] = useState<page>('HOME');
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);
  const gotogamelocal = ()=>{
    localStorage.setItem('page', 'GAME_L');
    setCurrentPage('GAME_L');
  }
    const gotogameremot = ()=>{
    localStorage.setItem('page', 'GAME_R');
    setCurrentPage('GAME_R');
  }
     const gotogameia = ()=>{
    localStorage.setItem('page', 'GAME_I');
    setCurrentPage('GAME_I');
  }
  const gotodash = ()=>{
    localStorage.setItem('page', 'DASHBOARD');
    setCurrentPage('DASHBOARD');
  }
  const obj_login = (data : any | any)=>{
    if(data)
      setdatauser(data.user);
   else
       setdatauser(null);
  }

useEffect(() => {
  const checkSession = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/me', {
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
        else if(save == 'GAME_I')
          setCurrentPage('GAME_I')
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
      

      {currentPage === 'HOME' && (
        <div className=" min-h-screen w-full flex items-center justify-center bg-[#0d0221]">
         <Home gotologin={()=> setCurrentPage('LOGIN')} gotosignup={()=> setCurrentPage('SIGNUP')}/>
        </div>
      )}


      {currentPage === 'LOGIN' && ( 
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0221] ">
    
      
           <Login gotohome={()=> setCurrentPage('HOME')} gotoDASHBOARD={()=>setCurrentPage('DASHBOARD')} onloginsucces={obj_login} gotosingup={()=>setCurrentPage('SIGNUP')}/>
       
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
      <div className="h-screen w-full">
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login}  gotogame_r={gotogameremot}  goto={gotogamelocal} gotoia={gotogameia} gotodashbord={gotodash}/>
      </div>
    
    }
    {
      currentPage === 'PROFIL' &&
      <div> i m in profil
        <Profil gotohome={()=> setCurrentPage('HOME')}/>
         </div>
    }
    {
      currentPage ==='GAME_L' &&
      <div className=" flex    "> 

        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash}/>
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < GamePage  />

        <canvas ref={canvasRef} id="board" />
          </div>
          
        i m in game 
      </div>

    }
    {
      currentPage === 'GAME_R'&& 
      <div>
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash}/>

       
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_r  />
          <canvas ref={canvasRef} id="board" />  
     
      </div>
      </div>

    }
     {
      currentPage === 'GAME_I'&& 
      <div>
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash}/>

       
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_i  />
          <canvas ref={canvasRef} id="board" />  
     
      </div>
      </div>

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
