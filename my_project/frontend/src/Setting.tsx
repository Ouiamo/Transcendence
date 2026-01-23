import React, { useState } from "react"


function TwoFASetting () {
  const [twoFactor, setTwoFactor] = useState(false)

  // const [method, setMethod] = useState<"email" | "authenticator" | null>(null)
  const [code, setCode] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null)

  const enable2FA = async (mthd: "email" | "authenticator") => {
    try {

      const res = await fetch("https://localhost:3010/api/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mthd }),
      })

      console.log("data lijattt hiya $$$$$$$$$$$$$ ", res);
      if(res.ok)
      {

        const data = await res.json()
        if (mthd === "authenticator") {
          setQrCode(data.qrCode)
          localStorage.setItem('twofa', 'authenticator');
         // enable(data.qrCode);
          console.log("ana hnaaaaaaaaaaaaaaa ", data.qrCode);
        }
      }
      else{
        console.log("erro akhotiii");
      }
    }
    catch (err) {
      console.log("errror fetchhhhhhh");
      return;
    }


  }

  return (
    <div>
      <div>
        <h3>TwoFASetting</h3>
        <button onClick={() => setTwoFactor(!twoFactor)}>2FA</button>
        <p>2FA is: {twoFactor ? "ON" : "OFF"}</p>

        {twoFactor && (
          <div>
            <p>Choose 2FA method:</p>
            <button onClick={() => enable2FA("email")}>Email</button>
            <button onClick={() => enable2FA("authenticator")}>
              Authenticator App
            </button>
          </div>
        )}

        {qrCode && (
          <div>
            <p>Scan this QR code with your Authenticator app:</p>
            <img src={qrCode} alt="Scan this QR code" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Setting() {
  return (
    <div>
      <h1>Settings</h1>
      <TwoFASetting />
    </div>
  )
}

