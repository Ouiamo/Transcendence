import React, { useState } from "react";
import { loginUser } from './Api';

interface Logintest {
    gotohome: () => void;
    gotoDASHBOARD: () => void;
    onloginsucces: (data: any) => void;
}

function Login({ gotohome, gotoDASHBOARD, onloginsucces }: Logintest) {

    const [passlogin, setpasslogin] = useState('');
    const [gmailogin, setgmailogin] = useState('');

    const handel_auth_goole = async () => {
        window.location.href = 'http://localhost:3010/api/auth/google'
        // window.open('http://localhost:3010/api/auth/google');
        //gotoDASHBOARD();
    }
    const handel_auth_42 = async () => {
        window.open('http://localhost:3010/api/auth/42');
        gotoDASHBOARD();
    }
    const handelLogin = async () => {
        const cleangmail_login = gmailogin.trim();
        const data_login = {
            email: cleangmail_login,
            password: passlogin,
        }
        try {
            const result = await loginUser(data_login);
            console.log("resultaaaaaaaaaaaaaaa" ,result );
            if (result.success) {
                alert("login sucess");
                onloginsucces(result)
                console.log("haniiiiiiiiiii");
                gotoDASHBOARD();
            }
            else {
                alert("error serveur");
                return;
            }
        }
        catch (erro) {
            alert("error server");
        }
  
    }
    return (
        <div>
            <input type="email" placeholder="set gmail" value={gmailogin} onChange={(e) => setgmailogin(e.target.value)}></input>
            <input type="password" placeholder="set password" value={passlogin} onChange={(e) => setpasslogin(e.target.value)}></input>
            <button onClick={handelLogin} > Login</button>
            <button onClick={gotohome}> go to home</button>
            <button onClick={handel_auth_goole}>Login with google</button>
            <button onClick={handel_auth_42}>Login with 42</button>

        </div>
    )

}
export default Login;