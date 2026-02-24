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


function App(){
  const navigate = useNavigate();
  const location = useLocation();
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
      connectSocket(user_data.id, user_data.username);
      onPrivateGameInvite((data) => {
        navigate('/remoteGame', { state: { gameData: data } });
      });
    } else {
      disconnectSocket();
    }
  }, [user_data]);

  useEffect(() => {
    const handleGameEnded = () => {
      navigate('/remoteGame', { replace: true });
    };
    window.addEventListener('game_ended', handleGameEnded);
    return () => window.removeEventListener('game_ended', handleGameEnded);
  }, [navigate]);
//-----
useEffect(() => {
  const publicRoutes = ['/', '/home', '/signup', '/privacy', '/terms', '/twofa'];
  if (publicRoutes.includes(location.pathname)) {
    setLoading(false);
    return;
  }
  //----
  const checkSession = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setdatauser(data.user);
      } 
      else {
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
     (  <Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>)}/>
 <Route 
  path="/leaderboard" 
  element={user_data ?(
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
    </Layout> ) :(<Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>)
  } 
/>
<Route  path="/profil" element={user_data ? (
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
      
    </Layout>) : (<Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>)
} />
<Route path="friends" element={user_data ? (
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
    </Layout>) : (<Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>)
}/>
<Route path="setting" element={user_data ? (
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
    </Layout>): (<Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>)
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
     <Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>
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
      <Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>
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
      <Login gotohome={()=> navigate('/HOME')} gotoDASHBOARD={()=> navigate('/dashboard')} onloginsucces={obj_login} gotosingup={()=>navigate('/SIGNUP')} gotwofa={()=>navigate('twofa')}/>
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