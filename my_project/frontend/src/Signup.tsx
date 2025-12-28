import { useState } from "react";
import {signupUser} from  './Api';
import {loginUser} from  './Api';

interface Sinuptest {
    gotohome: () => void;
    gotologin: ()=> void;
}


function Signup({ gotohome , gotologin}: Sinuptest) {
    const [username, setusername] = useState('');
    const [lastname, setlastname] = useState('');
    const [firstname, setfirstname] = useState('');
    const [gmail, setgamil] = useState('');
    const [motdepass, setmotdepass] = useState('');
   
    const handleSignup  =async () => {
        if(!username || !gmail || !lastname || !motdepass)
        {
            alert("no empty input ");
            return ;
        }
    const  cleangmail =  gmail.trim();
        console.log(cleangmail ,"....");
        if(!cleangmail.includes('@') || !cleangmail.includes('.'))
        {
            alert("syntax error gmail");
            return;
        }
        if(motdepass.length < 6){
            alert("motpass lenght requierd 6 nbr");
            return;
        }
        const data_user = {
        
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: cleangmail,
           password: motdepass,
           
        }
        try{
            const result = await signupUser(data_user);
            if(result.success)
            {
                alert("signup sucess");
                gotologin();
            }
            else 
                alert("error serveur ");

        }
        catch(error){
            alert("error serveur ");
        }
       // console.log(data_user);
    }
    return (
        <div>
            <input type="text" placeholder="set your firstname" value={firstname} onChange={(e) => setfirstname(e.target.value)}></input>
            <input type="text" placeholder="set your lastname" value={lastname} onChange={(e) => setlastname(e.target.value)}></input>    
            <input type="text" placeholder="set your username" value={username} onChange={(e) => setusername(e.target.value)}>
            </input>
            <input type="gmail" placeholder="set your gamil" value={gmail} onChange={(e) => setgamil(e.target.value)}></input>
            <input type="password" placeholder="set your mot de passe" value={motdepass} onChange={(e) => setmotdepass(e.target.value)}></input>
            <button  onClick={handleSignup}>creat account</button>
            <button onClick={gotohome}>go to Home</button>

        </div>
        
    )
}
export default Signup;