import React, { useState } from "react";
import {loginUser} from  './Api';

interface Logintest{
    gotohome : ()=>void ;
}

function Login({gotohome}: Logintest){

    const [passlogin, setpasslogin] = useState('');
    const [gmailogin, setgmailogin] = useState('');
const handelLogin = async() =>{
    const cleangmail_login = gmailogin.trim();
    const data_login = {
        email : cleangmail_login ,
        password : passlogin,
    }
    try{
        const result = await loginUser(data_login);
        if(result.success)
        {
            alert("login sucess");
            console.log("haniiiiiiiiiii");
           console.log(result);
            gotohome();
        }
        // if((result as any).accessToken)
        // {

        // }
        else{
            alert("error serveur");
            return;
        }
    }
    catch(erro){
        alert("error server");
    }
   // console.log(data_login);
}
    return(
        <div>
            <input type="email" placeholder="set gmail"value={gmailogin} onChange={(e) => setgmailogin(e.target.value)}></input>
            <input type="password" placeholder="set password"value={passlogin} onChange={(e) => setpasslogin(e.target.value)}></input>
            <button onClick={handelLogin} > Login</button>
            <button onClick={gotohome}> go to home</button>
        </div>
    )

}
export default  Login;