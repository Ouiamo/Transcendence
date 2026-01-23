import React from "react";
import { useState } from "react"


export default function Setting()
{
    const [twoFactor, setTwoFactor] = useState(false)
    const [method, setMethod] = useState<"email" | "app" | null>(null)
    return(
        <div>
            <h1>Settings</h1>
            <button onClick={() => setTwoFactor(!twoFactor)}>2FA</button>
            <p>2FA is : {twoFactor ? "ON" : "OFF"}</p>
            {twoFactor && (
            <div>
                <p>choose 2FA method:</p>
                <button onClick = {() => setMethod("email")}> Email</button>
                <button onClick={() => setMethod("app")}>Authenticator App</button>
            </div>
            )}
        </div>
    )
}

