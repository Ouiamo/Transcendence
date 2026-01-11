
import './style.css';
import { use, useEffect,useState } from 'react';

import Signup from './Signup';
import Login from  './Login';
import Dashboard from './Dashboard';
import Profil from './Profil';
import { loginUser } from './Api';
//import Home from './Home';

type page = 'HOME'| 'LOGIN' | 'SIGNUP' | 'DASHBOARD'| 'PROFIL'
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
     
      if (res.ok) {
        const data = await res.json();
        console.log("data apes de json ", data.user);
        setdatauser(data.user)
        setCurrentPage('DASHBOARD');
      } else {
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
if(loading) return <div>is loading</div>
  return (
    <div >
      

      {currentPage === 'HOME' && (
        <div className='container'>
          <h1>Welcome to Pong</h1>
          <nav>
            <button onClick={() => setCurrentPage('LOGIN')}>GO TO LOGIN</button>
            <button onClick={() => setCurrentPage('SIGNUP')}>GO TO SIGNUP</button>
          </nav>
        </div>
      )}


      {currentPage === 'LOGIN' && ( 
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0221] ">
    
      
           <Login gotohome={()=> setCurrentPage('HOME')} gotoDASHBOARD={()=>setCurrentPage('DASHBOARD')} onloginsucces={obj_login} gotosingup={()=>setCurrentPage('SIGNUP')}/>
       
        </div>
      )}

    {
      currentPage === 'SIGNUP' &&
      <div>
      <h2> this is Signup page </h2>
      <Signup gotohome={()=>setCurrentPage('HOME') } gotologin={()=>setCurrentPage('LOGIN')}/>
      </div>
    }
    {

      currentPage === 'DASHBOARD'&&
      <div className="h-screen w-full">
        < Dashboard gotohome={()=>setCurrentPage('HOME')} gotoprofil={ ()=>setCurrentPage('PROFIL')} user={user_data} delete_obj={obj_login}/>
      </div>
    
    }
    {
      currentPage === 'PROFIL' &&
      <div> i m in profil
        <Profil gotohome={()=> setCurrentPage('HOME')}/>
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
