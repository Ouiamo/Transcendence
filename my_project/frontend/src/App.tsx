
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
// import TwofaEmail from './TwofaEmail.tsx';
import { Friendlist } from './Friendlist.tsx'
import Friends from './Friends.tsx';
import Setting from './Setting.tsx';
import Leaderboard from './leaderboard.tsx';
import { connectSocket, disconnectSocket, clearUserDataFromStorage } from './socketService.tsx';
// import {G} from "./G.tsx"



type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R' | 'GAME_I' | 'PROFIL'| 'FRIENDS' | 'SETTING' | 'twofa' | 'email' | 'LEADERBOARD'
function App(){
 
  const [currentPage, setCurrentPage] = useState<page>('HOME');
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
    console.log("Current Page is:", currentPage);

const gotowfa =() =>{
    localStorage.setItem('page', 'twofa');
  setCurrentPage( 'twofa');
}
const gotoHome =() =>{
    localStorage.setItem('page', 'HOME');
  setCurrentPage( 'HOME');
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
    if(user_data)
    {
      console.log("MY INFOOOOO ",user_data); 
      // Only connect socket for valid logged-in user
      connectSocket(user_data.id, user_data.username);
    } else {
      // If no user data, ensure socket is disconnected
      disconnectSocket();
    }
  }, [user_data]);

  // New useEffect for early socket connection
  useEffect(() => {
    // Don't auto-connect socket from storage
    // Only connect after validating session in checkSession
    // connectSocketFromStorage(); // REMOVED - prevents users appearing online before login
  }, []); // Run once on mount

useEffect(() => {
  // console.log("items is ^^^^^^^^^^^^^ ", twofa);
  const checkSession = async () => {
    try {
      const res = await fetch('https://localhost:3010/api/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setdatauser(data.user)
        
        // Socket will be connected via the useEffect that watches user_data
        
        const save = localStorage.getItem('page'); 
        if(save === 'GAME_L')
          setCurrentPage('GAME_L');
        else if(save === 'GAME_R')
          setCurrentPage('GAME_R');
        else if(save === 'SETTING')
          setCurrentPage('SETTING');
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
        // Session is invalid, clear stored data and disconnect socket
        clearUserDataFromStorage();
        disconnectSocket();
        setCurrentPage('HOME');
      }
    } catch (err) {
      // Error occurred, clear stored data and disconnect socket
      clearUserDataFromStorage();
      disconnectSocket();
      setCurrentPage('HOME');
    }
    finally
    {
      setLoading(false);
    }
  };
  checkSession();
}, []);
if(loading) return <div>Loading...</div>
  return (
    <div >

      {
        currentPage === 'twofa' &&(
        <div className="fex flex-col w-full h-full ">
          <Twofa gotoDASHBOARD={gotodash} gotohome={gotoHome}/>
        </div>
      )}
      {currentPage === 'HOME' && (
        <div className=" min-h-screen w-full flex items-center justify-center bg-[#0d0221]">
         <Home gotologin={()=> setCurrentPage('LOGIN')} gotosignup={()=> setCurrentPage('SIGNUP')}/>
        </div>
      )}


      {currentPage === 'LOGIN' && ( 
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0221] ">
    
      
           <Login gotohome={()=> setCurrentPage('HOME')} gotoDASHBOARD={()=>setCurrentPage('DASHBOARD')} onloginsucces={obj_login} gotosingup={()=>setCurrentPage('SIGNUP')} gotwofa={gotowfa}/>
       
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
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login}  listfriends={listfriends}  goto={gotogamelocal} gotoia={gotogameia} gotodashbord={gotodash}  gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} />
      </div>
    
    }
  
    {
      currentPage ==='GAME_L' &&
      <div className=" flex    "> 

        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>
          <div className="flex-1 flex   w-full items-center justify-center ">  
          < GamePage  username={user_data.username}/>

        <canvas ref={canvasRef} id="board" />
          </div>
         
      </div>

    }
    {
      currentPage === 'GAME_R'&& 
      <div>
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>
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
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>

       
          <div className="flex-1 ml-[200px] mt-[30px]  w-full items-center justify-center">  
          < Gamepage_i  username={user_data.username}/>
          <canvas ref={canvasRef} id="board" />  
     
      </div>
      </div>

    }
    
    {currentPage === 'PROFIL' && (
  <div className="flex flex-row min-h-screen w-full bg-[#0d0221] gap-[60px] overflow-x-hidden">
    {/* Sidebar: نعطيه عرضاً ثابتاً صغيراً أو نسبة مئوية */}
    <div className="flex-none w-[60px] md:w-[250px] transition-all duration-300">
               <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>
    </div>

    {/* Content: يأخذ المساحة المتبقية كاملة */}
    <div className="flex-grow flex justify-center p-2 md:p-8 " >
      <div className="w-full max-w-[1200px]">
        <Profil user={user_data  } delete_obj={obj_login} gotohome={gotoHome} gotosetting={gotoseting}/>
      </div>
    </div>
  </div>
)}
    {
      currentPage === 'LEADERBOARD' &&
      <div className="flex  flex-row gap-[140px] w-full h-full">
        <div className="flex">
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>

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
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>

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
            <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal}/>
        </div>
        <div className="flex w-full h-full ">
        <Setting user={user_data}/>
        </div> 
      </div>
    }
    {/* {
      // currentPage === 'email' &&(
      //   <div className="fex flex-col w-full h-full ">
      //     <TwofaEmail gotoemail={gotoemail} gotohome={gotoHome}/>
      //   </div>
      )
    } */}
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

// *********************************************** //mouna ht atchofi hadi khod mnha fikra kifach thali mouchkil dial refresh kola mra
// import './style.css';
// import { useEffect, useState, useRef } from 'react';
// import Profil from './Profil';
// import Dashboard from './Dashboard';
// import Setting from './Setting';
// import Twofa from './Twofa';
// import { Sidebar } from './Sidebar';
// import Home from './Home';
// import Login from './Login';
// import Signup from './Signup';
// import { GamePage, Gamepage_i } from './G';
// import Friends from './Friends';
// import Friendlist from './Friendlist';

// type Page =
//   | 'HOME'
//   | 'LOGIN'
//   | 'SIGNUP'
//   | 'DASHBOARD'
//   | 'PROFIL'
//   | 'GAME_L'
//   | 'GAME_R'
//   | 'GAME_I'
//   | 'FRIENDS'
//   | 'SETTING'
//   | 'twofa';

// function App() {
//   const [currentPage, setCurrentPage] = useState<Page>('HOME');
//   const [loading, setLoading] = useState(true);
//   const [user_data, setUserData] = useState<any>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   // Fetch user profile once on mount
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const res = await fetch('https://localhost:3010/api/profile', {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUserData(data.user);

//           // Restore last page from localStorage
//           const save = localStorage.getItem('page') as Page | null;
//           if (save) setCurrentPage(save);
//           else setCurrentPage('DASHBOARD');
//         } else {
//           setCurrentPage('HOME');
//         }
//       } catch (err) {
//         setCurrentPage('HOME');
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkSession();
//   }, []);

//   // Save page to localStorage on change
//   const changePage = (page: Page) => {
//     localStorage.setItem('page', page);
//     setCurrentPage(page);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="w-full h-full">
//       {currentPage === 'HOME' && (
//         <Home gotologin={() => changePage('LOGIN')} gotosignup={() => changePage('SIGNUP')} />
//       )}

//       {currentPage === 'LOGIN' && (
//         <Login
//           gotohome={() => changePage('HOME')}
//           gotoDASHBOARD={() => changePage('DASHBOARD')}
//           onloginsucces={(data: any) => setUserData(data.user)}
//           gotosingup={() => changePage('SIGNUP')}
//           gotwofa={() => changePage('twofa')}
//         />
//       )}

//       {currentPage === 'SIGNUP' && (
//         <Signup
//           gotohome={() => changePage('HOME')}
//           gotologin={() => changePage('LOGIN')}
//           gotoDASHBOARD={() => changePage('DASHBOARD')}
//         />
//       )}

//       {currentPage === 'DASHBOARD' && user_data && (
//         <Dashboard
//           user={user_data}
//           gotoprofil={() => changePage('PROFIL')}
//           gotofriends={() => changePage('FRIENDS')}
//           gotosetting={() => changePage('SETTING')}
//           goto={() => changePage('GAME_L')}
//           gotoia={() => changePage('GAME_I')}
//           listfriends={() => changePage('GAME_R')}
//           gotodashbord={() => changePage('DASHBOARD')}
//           delete_obj={() => setUserData(null)}
//         />
//       )}

//       {currentPage === 'PROFIL' && user_data && (
//         <div className="flex flex-row gap-[140px]">
//           <Sidebar
//             user_={user_data}
//             gotohome={() => changePage('HOME')}
//             delete_obj={() => setUserData(null)}
//             gotodashbord={() => changePage('DASHBOARD')}
//             gotoprofil={() => changePage('PROFIL')}
//             gotofriends={() => changePage('FRIENDS')}
//             gotosetting={() => changePage('SETTING')}
//           />
//           <Profil user={user_data} />
//         </div>
//       )}

//       {currentPage === 'SETTING' && user_data && (
//         <div className="flex flex-row gap-[150px]">
//           <Sidebar
//             user_={user_data}
//             gotohome={() => changePage('HOME')}
//             delete_obj={() => setUserData(null)}
//             gotodashbord={() => changePage('DASHBOARD')}
//             gotoprofil={() => changePage('PROFIL')}
//             gotofriends={() => changePage('FRIENDS')}
//             gotosetting={() => changePage('SETTING')}
//           />
//           <Setting user={user_data} />
//         </div>
//       )}

//       {currentPage === 'twofa' && user_data && (
//         <Twofa gotoDASHBOARD={() => changePage('DASHBOARD')} gotohome={() => changePage('HOME')} />
//       )}
//     </div>
//   );
// }

// export default App;
