
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
import { GamePage} from "./G.tsx"
import { Gamepage_r } from './G.tsx';
// import {G} from "./G.tsx"

//import Home from './Home';

type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R'
function App(){

  const [currentPage, setCurrentPage] = useState<page>('HOME');
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);
  const obj_login = (data : any | any)=>{
    if(data)
      setdatauser(data.user);
   else
       setdatauser(null);
    console.log("App*********** received data:", user_data)
  }

useEffect(() => {
  const checkSession = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/me', {
        method: 'GET',
        credentials: 'include',
      });
      console.log("currente page  is ", {currentPage});
      if (res.ok) {
        const data = await res.json();
        console.log("data apes de json ", data.user);
        setdatauser(data.user)
        
        // if(save1=== 'GAME_L')
        // {
        //   console.log("dkhaltttttttttt");
        //   setCurrentPage('GAME_L');

        // }
        // else 
         setCurrentPage('DASHBOARD');
      } 
      
      else {
        setCurrentPage('HOME');
        localStorage.setItem('page', 'HOME');
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
  console.log("currente page is :::::::::::", currentPage);
 
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
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login} gotogame={()=>setCurrentPage('GAME_L')} gotogame_r={()=>setCurrentPage('GAME_R')} />
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

        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login}/>
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
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login}/>

        i m in remotttttttttttt 
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_r  />
          <canvas ref={canvasRef} id="board" />  
        i m in game 
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
