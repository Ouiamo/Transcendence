import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { API_URL } from "./Api.tsx";
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useEffect,useState } from 'react';
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
import { connectSocket, disconnectSocket, onPrivateGameInvite } from './socketService.tsx';


// type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL' | 'GAME_L' | 'GAME_R' | 'GAME_I' | 'PROFIL'| 'FRIENDS' | 'SETTING' | 'twofa' | 'email' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS';
function App(){
  const navigate = useNavigate();
  type side = 'dashboard' | 'game' | 'leaderboard' | 'settings' | 'profile' | 'friends';
  const [active, setActive] = useState<side>('dashboard');
  
      const setActiveSafe = (key: typeof active) => {
          setActive(key);
      };
  const [loading, setLoading] = useState(true);
  const[user_data, setdatauser] = useState<any>(null);

  const obj_login = (data : any | any)=>{
    if(data){
      setdatauser(data.user);
      }
   else
       setdatauser(null);
  }

  
  useEffect(() => {
    if(user_data) {
      console.log("MY INFOOOOO ", user_data); 
      connectSocket(user_data.id, user_data.username);
      onPrivateGameInvite((data) => {
        console.log("🎮 CALLBACK: navigating to /remoteGame with gameData:", data);
        navigate('/remoteGame', { state: { gameData: data } });
      });
    } else {
      disconnectSocket();
    }
  }, [user_data]);

  useEffect(() => {
    const handleGameEnded = (e: any) => {
      console.log("🏆 game_ended event received", e.detail);
      navigate('/remoteGame', { replace: true }); 
    };
    window.addEventListener('game_ended', handleGameEnded);
    return () => window.removeEventListener('game_ended', handleGameEnded);
  }, [navigate]);

useEffect(() => {
  console.log("items is ^^^^^^^^^^^^^ jitttt ");
  const checkSession = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log("data dyl google is ", data);
        setdatauser(data.user);
        console.log("data.user.twofa is ", data.user.twofa_enabled)
      } 
      else {
        console.log(" yes im not haniiiiiiiiiiii ");
        disconnectSocket();
      }
    } catch (err) {
      disconnectSocket();
      navigate('/home');
    }
    finally
    {
      setLoading(false);
    }
  };
  checkSession();
}, []);
const Layout = ({ children, gotohome, gotoprofil, user, delete_obj, goto, gotodashbord, gotofriends, gotosetting, gotoleaderboard, setActiveSafe }: any) => {
  return (
    <div className="flex min-h-screen w-full bg-[#0b0618] overflow-hidden">
      <div className="flex-none z-50">
        <Sidebar 
          user_={user} 
          gotohome={gotohome} 
          delete_obj={delete_obj} 
          gotodashbord={gotodashbord} 
          gotoprofil={gotoprofil} 
          gotofriends={gotofriends} 
          gotosetting={gotosetting} 
          gotoleaderboard={gotoleaderboard} 
          gotolocalgame={goto} 
          setActiveSafe={setActiveSafe}
        />
      </div>
 <div className="flex-1 overflow-hidden pl-[80px] min-w-0 bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]">
    {children}
</div>
    </div>
  );
};

function RemoteGameRoute({ user, delete_obj, setActiveSafe }: any) {
  const location = useLocation();
  const nav = useNavigate();
  const gameData = location.state?.gameData;
  useEffect(() => {
    if (gameData) {
      window.history.replaceState({}, '');
    }
  }, [gameData]);

  return (
    <Layout
      gotohome={() => nav('/home')}
      gotoprofil={() => nav('/profil')}
      user={user}
      delete_obj={delete_obj}
      listfriends={() => nav('/remoteGame')}
      goto={() => nav('/localGame')}
      gotoia={() => nav('/iaGame')}
      gotodashbord={() => nav('/dashboard')}
      gotofriends={() => nav('/friends')}
      gotosetting={() => nav('/setting')}
      gotoleaderboard={() => nav('/leaderboard')}
      setActiveSafe={setActiveSafe}
    >
      {gameData ? (
        <Gamepage_r data1={gameData} currentUser={user} />
      ) : (
        <Friendlist />
      )}
    </Layout>
  );
}

if(loading) return <div>Loading...</div>
return (
  <Routes>
    <Route 
  path="/" 
  element={
    user_data ? (
      user_data.twofa_enabled === 1 ? (
        <Navigate to="/twofa" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      )
    ) : (
      <Navigate to="/home" replace />
    )
  } 
/>
<Route 
  path="/home" 
  element={
    <Home 
      gotologin={() => navigate('/login')} gotosignup={() => navigate('/signup')} gotoprivacy={() => navigate('/privacy')} gototerms={() => navigate('/terms')} 
    />
  } 
/>
    <Route path="/login" element={<Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>} />
    <Route path="/signup" element={<Signup gotohome={()=>navigate('/HOME') } gotologin={()=>navigate('/LOGIN')}  gotoDASHBOARD={()=> navigate('/dashboard')}/>} />

    <Route path="/dashboard" element={ 
      user_data ? (< Dashboard gotohome={()=>navigate('/HOME')} gotoprofil={ ()=>navigate('/profil')} user={user_data} delete_obj={obj_login}  listfriends={()=>navigate("/remoteGame")}  goto={()=>navigate("/localGame")} gotoia={()=>navigate("iaGame")} gotodashbord={()=>navigate('/dashboard')}  gotofriends={()=> navigate('/friends')} gotosetting={()=> navigate('/setting')} gotoleaderboard={()=> navigate('/leaderboard')} setActiveSafe={setActiveSafe}/>):
      (  <div className="text-white p-10">Loading...</div>)}/>
 <Route 
  path="/leaderboard" 
  element={
    <Layout 
      gotohome={() => navigate('/home')} 
      gotoprofil={() => navigate('/profil')} 
      user={user_data} 
      delete_obj={obj_login}  
      listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
      gotodashbord={() => navigate('/dashboard')}  
      gotofriends={() => navigate('/friends')} 
      gotosetting={() => navigate('/setting')} 
      gotoleaderboard={() => navigate('/leaderboard')} 
      setActiveSafe={setActiveSafe}
    >
      <Leaderboard /> 
    </Layout> 
  } 
/>
<Route  path="/profil" element={
    <Layout 
      gotohome={() => navigate('/')} 
      gotoprofil={() => navigate('/profil')} 
      user={user_data} 
      delete_obj={obj_login}  
      listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
      gotodashbord={() => navigate('/dashboard')}  
      gotofriends={() => navigate('/friends')} 
      gotosetting={() => navigate('/setting')} 
      gotoleaderboard={() => navigate('/leaderboard')} 
      setActiveSafe={setActiveSafe}
    >
        <Profil user={user_data  } delete_obj={obj_login} gotohome={()=> navigate('/home')} gotosetting={()=> navigate('setting')}/>
      
    </Layout>
} />
<Route path="friends" element={
    <Layout 
      gotohome={() => navigate('/home')} 
      gotoprofil={() => navigate('/profil')} 
      user={user_data} 
      delete_obj={obj_login}  
      listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
      gotodashbord={() => navigate('/dashboard')}  
      gotofriends={() => navigate('/friends')} 
      gotosetting={() => navigate('/setting')} 
      gotoleaderboard={() => navigate('/leaderboard')} 
      setActiveSafe={setActiveSafe}
    >
      <Friends/>
    </Layout>
}/>
<Route path="setting" element={
    <Layout 
      gotohome={() => navigate('/home')} 
      gotoprofil={() => navigate('/profil')} 
      user={user_data} 
      delete_obj={obj_login}  
      listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
      gotodashbord={() => navigate('/dashboard')}  
      gotofriends={() => navigate('/friends')} 
      gotosetting={() => navigate('/setting')} 
      gotoleaderboard={() => navigate('/leaderboard')} 
      setActiveSafe={setActiveSafe}
    >
       <Setting user={user_data} delete_obj={obj_login} gotohome={()=> navigate('home')}/>
    </Layout>
}/>
<Route
  path="localGame"
  element={
    user_data ? (
      <Layout 
        gotohome={() => navigate('/home')} 
        gotoprofil={() => navigate('/profil')} 
        user={user_data} 
        delete_obj={obj_login}  
     listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
        gotodashbord={() => navigate('/dashboard')}  
        gotofriends={() => navigate('/friends')} 
        gotosetting={() => navigate('/setting')} 
        gotoleaderboard={() => navigate('/leaderboard')} 
        setActiveSafe={setActiveSafe}
      >
        <GamePage username={user_data.username}/>
      </Layout>
    ) : (
      <div className="text-white p-10">Loading...</div>
    )
  }
/>

<Route
  path="iaGame"
  element={
    user_data ? (
      <Layout 
        gotohome={() => navigate('/home')} 
        gotoprofil={() => navigate('/profil')} 
        user={user_data} 
        delete_obj={obj_login}  
        listfriends={()=>navigate('remoteGame')}  
      goto={()=>navigate('localGame')} 
      gotoia={()=>navigate('iaeGame')} 
        gotodashbord={() => navigate('/dashboard')}  
        gotofriends={() => navigate('/friends')} 
        gotosetting={() => navigate('/setting')} 
        gotoleaderboard={() => navigate('/leaderboard')} 
        setActiveSafe={setActiveSafe}
      >
        <Gamepage_i username={user_data.username}/>

      </Layout>
    ) : (
      <div className="text-white p-10">Loading...</div>
    )
  }
/>
<Route
  path="remoteGame"
  element={
    user_data ? (
      <RemoteGameRoute
        user={user_data}
        delete_obj={obj_login}
        setActiveSafe={setActiveSafe}
      />
    ) : (
      <div className="text-white p-10">Loading...</div>
    )
  }
/>

<Route  path="twofa" element={ <Twofa gotoDASHBOARD={()=>navigate("/dashboard")} gotohome={()=> navigate("/home")}/>}/>
  <Route  path="terms" element={ <TermsOfService gotohome={()=>navigate("/home")} />}/>
   <Route  path="privacy" element={ <PrivacyPolicy  gotohome={()=>navigate("/home")} />}/>
    <Route 
    path="*" 
    element={
      user_data ? (
        <Navigate to="/dashboard" replace /> 
      ) : (
        <Navigate to="/home" replace />   
      )
    } 
  />

  </Routes>
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
//         const res = await fetch('`${API_URL}/api/profile', {
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
