import './style.css';
import { useEffect,useState } from 'react';
import { useRef } from "react";
import Twofa from './Twofa.tsx';
import Signup from './Signup';
import Home from './Home'
import Login from  './Login';
import Dashboard from './Dashboard';
import Profil from './Profil';
import { Sidebar } from './Sidebar';
import { GamePage, Gamepage_i, Gamepage_r } from "./G.tsx";
import { Friendlist } from './Friendlist.tsx';
import Friends from './Friends.tsx';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import Setting from './Setting.tsx';
import Leaderboard from './leaderboard.tsx';
import { connectSocket, disconnectSocket, clearUserDataFromStorage } from './socketService.tsx';


type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R' | 'GAME_I' | 'PROFIL'| 'FRIENDS' | 'SETTING' | 'twofa' | 'email' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS';
function App(){
  
  type side = 'dashboard' | 'game' | 'leaderboard' | 'settings' | 'profile' | 'friends';
  const [active, setActive] = useState<side>('dashboard');
  
      const setActiveSafe = (key: typeof active) => {
          setActive(key);
          localStorage.setItem('sidebar-active', key);
      };
  const [currentPage, setCurrentPage] = useState<page>('HOME');
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);
  const [privateGameActive, setPrivateGameActive] = useState(false);
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // console.log("Current Page is:", currentPage);

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
//rja3t had luseEffect bash  yb9a yban lia fal friend front bali online or offline 📢📢📢📢
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

  useEffect(() => {
    const handlePrivateGameStart = () => {
      console.log("🎮 Private game event received, forcing re-render");
      setPrivateGameActive(true);
      setCurrentPage('GAME_R');
    };

    window.addEventListener('private_game_start', handlePrivateGameStart);
    
    // Also check localStorage on mount
    const checkPrivateGame = () => {
      const privateRoom = localStorage.getItem('private_game_room');
      if (privateRoom) {
        console.log("🎮 Found existing private game on mount:", privateRoom);
        setPrivateGameActive(true);
      }
    };
    checkPrivateGame();
    
    return () => {
      window.removeEventListener('private_game_start', handlePrivateGameStart);
    };
  }, []);

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
        console.log("  save page isssssssssss ", save);
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
        else if(save == 'LOGIN')
            setCurrentPage('LOGIN');
        else if(save == 'SIGNUP')
            setCurrentPage('SIGNUP');
        else
           setCurrentPage('DASHBOARD');
      } 
      else {
        // Session is invalid, clear stored data and disconnect socket
        console.log(" yes im not nnnnnn ");
        const save = localStorage.getItem('page') ;
    if (save === 'LOGIN' || save === 'SIGNUP') {
        setCurrentPage(save);
    } else {
        setCurrentPage('HOME');
    }
        // clearUserDataFromStorage();
        disconnectSocket();
        // setCurrentPage('HOME');
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
console.log("currente page isssssssssssssss :::: ", currentPage)
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
          <Home 
          gotologin={()=> setCurrentPage('LOGIN')} 
          gotosignup={()=> setCurrentPage('SIGNUP')}
          gotoprivacy={()=> setCurrentPage('PRIVACY')}
          gototerms={()=> setCurrentPage('TERMS')}
          />
        </div>
      )}

      {currentPage === 'LOGIN' && ( 
        <div className="min-h-screen w-full flex items-center justify-center  bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]">
           <Login gotohome={()=> setCurrentPage('HOME')} gotoDASHBOARD={gotodash} onloginsucces={obj_login} gotosingup={()=>setCurrentPage('SIGNUP')} gotwofa={gotowfa}/>
        </div>
      )}

    {
      currentPage === 'SIGNUP' &&
      <div className="min-h-screen w-full h-full flex items-center justify-center bg-[#0d0221] ">
      <Signup gotohome={()=>setCurrentPage('HOME') } gotologin={()=>setCurrentPage('LOGIN')}  gotoDASHBOARD={gotodash}/>
      </div>
    }
    {
      currentPage === 'DASHBOARD'&&
      <div className="h-screen w-full flex-row ">
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login}  listfriends={listfriends}  goto={gotogamelocal} gotoia={gotogameia} gotodashbord={gotodash}  gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} setActiveSafe={setActiveSafe} />
      </div>
    }
  
    {
      currentPage ==='GAME_L' &&
     <div className="flex w-full h-screen bg-[#0b0618] overflow-hidden"> 
  <div className="flex-none z-50">
    <Sidebar user_={user_data}  gotohome={() => setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} 
      gotofriends={gotofriends} 
      gotosetting={gotoseting} 
      gotoleaderboard={gotoleaderboard} 
      gotolocalgame={gotogamelocal} 
      setActiveSafe={setActiveSafe}
    />
  </div>

  <div className="flex-1 flex flex-col pl-[88px] items-center justify-center p-4 min-w-0 overflow-auto  bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]">  
    <div className="w-full h-full max-w-[1200px] flex flex-col items-center justify-center ">
      <GamePage username={user_data.username}/>
    </div>
  </div> 
</div>
    }

    {
      currentPage ==='GAME_R' &&
     <div className="flex w-full h-screen bg-[#0b0618] overflow-hidden"> 
  <div className="flex-none z-50">
    <Sidebar user_={user_data}  gotohome={() => setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} 
      gotofriends={gotofriends} 
      gotosetting={gotoseting} 
      gotoleaderboard={gotoleaderboard} 
      gotolocalgame={gotogamelocal} 
      setActiveSafe={setActiveSafe}
    />
  </div>

  <div className="flex-1 flex flex-col items-center justify-center pl-[88px]  min-w-0 overflow-auto">
    {privateGameActive && localStorage.getItem('private_game_room') ? (
      <Gamepage_r/>
      ) : (
            <Friendlist onGameStart={() => {
              console.log("🎮 Game start callback triggered");
              setPrivateGameActive(true);
              setCurrentPage('GAME_R');
            }} />
          )}
  </div> 
</div>
    }
     {
      currentPage === 'GAME_I'&& 
      <div className="flex w-full h-screen bg-[#0b0618] overflow-hidden">
        <div  className="flex-none z-50">
        <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal} setActiveSafe={setActiveSafe}/>
        </div>
          <div className="flex-1 flex flex-col items-center justify-center pl-[88px]  min-w-0 overflow-auto bg-[#ffff]">  
          < Gamepage_i  username={user_data.username}/>
      </div>
      </div>
    }
    
    {currentPage === 'PROFIL' && (
  <div className="flex flex-row min-h-screen w-full bg-[#0d0221]  overflow-x-hidden">
    <div className="flex-none w-[60px] md:w-[250px] transition-all duration-300">
      <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal} setActiveSafe={setActiveSafe}/>
    </div>
    <div className="flex-grow flex justify-center p-[2px] md:p-8 bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]" >
      <div className="w-full max-w-[1200px]   pr-[88px]">
        <Profil user={user_data  } delete_obj={obj_login} gotohome={gotoHome} gotosetting={gotoseting}/>
      </div>
    </div>
  </div>
)}
  {
  currentPage === 'LEADERBOARD' &&
  <div className="min-h-screen w-full bg-[#06060d]">
    <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal} setActiveSafe={setActiveSafe}/>
    
    <div className="mr-[10px] ml-[120px] overflow-y-auto">
      <Leaderboard />
    </div>
  </div>
}

    {
      currentPage === 'FRIENDS' &&
      <div className="flex  flex-row gap-[90px] ">
        <div className="flex">
          <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal} setActiveSafe={setActiveSafe}/>
        </div>
        <div className="flex-1 overflow-auto">
          <Friends />
        </div>
      </div>
    }
    {
      currentPage === 'SETTING' &&
      <div className="flex flex-row  gap-[px]" >
        <div className="flex  ">
            <Sidebar user_={user_data} gotohome={()=> setCurrentPage('HOME')} delete_obj={obj_login} gotodashbord={gotodash} gotoprofil={gotoprofil} gotofriends={gotofriends} gotosetting={gotoseting} gotoleaderboard={gotoleaderboard} gotolocalgame={gotogamelocal} setActiveSafe={setActiveSafe}/>
        </div>
        <div className="flex w-full h-full pl-[88px] ">
        <Setting user={user_data} delete_obj={obj_login} gotohome={gotoHome}/>
        </div> 
      </div>
    }
    {currentPage === 'PRIVACY' && <PrivacyPolicy gotohome={gotoHome} />}
    {currentPage === 'TERMS' && <TermsOfService gotohome={gotoHome} />}
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
