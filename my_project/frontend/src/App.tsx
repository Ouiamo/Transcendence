
import './style.css';
import { useState } from 'react';
import './App.css'
import Signup from './Signup';
import Login from  './Login';
//import Home from './Home';

type page = 'HOME'| 'LOGIN' | 'SIGNUP'
function App(){
  const [currentPage, setCurrentPage] = useState<page>('HOME');
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
        <div>
    
           <h2>This is Login Page</h2>
           <Login gotohome={()=> setCurrentPage('HOME')}/>
        </div>
      )}

    {
      currentPage === 'SIGNUP' &&
      <div>
      <h2> this is Signup page </h2>
      <Signup gotohome={()=>setCurrentPage('HOME') } gotologin={()=>setCurrentPage('LOGIN')}/>
      </div>
    }

    </div>
  );
}
//<Signup gotohom={() => setCurrentPage('HOME')} />

export default App;

//{currentPage === 'HOME' && <Home onPlay={() => setCurrentPage('HOME')} />}



















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
