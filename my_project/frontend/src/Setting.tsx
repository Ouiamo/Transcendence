import React, { useState } from "react"
interface intersetting {
  user: any;
}

function TwoFASetting({ user }: intersetting) {
  const [twoFactor, setTwoFactor] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstname: '', lastname: '', username: '', email: '' });


  const handelupdateprofile = async () => {
    // console.log(" jitttttttttt ");
    let hasdata = false ;
 const datatosand: any = {};
    if (selectedFile) {
      hasdata = true; 
    // datatosand.append('avatar', selectedFile); 
  }
    
    if (formData.firstname.trim() != "")
    {
      datatosand.firstname = formData.firstname;
      hasdata = true; 
    }
    if (formData.lastname.trim() != "")
    {
      datatosand.lastname = formData.lastname;
      hasdata = true; 
    }
    if (formData.username.trim() != "")
    {
      datatosand.username = formData.username;
      hasdata = true; 
    }
    if (formData.email.trim() != "")
    {
      datatosand.email = formData.email;
      hasdata = true; 
    }
 if(!hasdata )
 {
  alert("has no data ");
  return;
 }
    try {
      const response = await fetch('https://localhost:3010/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datatosand),
      });
      const result = await response.json();
      console.log("hiiiiiiiiiiiiiiiii ", result);

      if (response.ok) {
        alert("Profile updated! ✅");

      } else {
        alert(result.error);
      }
    }
    catch (err) {
      console.error("Update failed", err);
    }

  }
  const enable2FA = async (mthd: "email" | "authenticator") => {
    try {

      const res = await fetch("https://localhost:3010/api/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mthd }),
      })

      console.log("data lijattt hiya $$$$$$$$$$$$$ ", res);
      if (res.ok) {

        const data = await res.json()
        if (mthd === "authenticator") {
          setQrCode(data.qrCode)
          localStorage.setItem('twofa', 'authenticator');
          // enable(data.qrCode);
          console.log("ana hnaaaaaaaaaaaaaaa ", data.qrCode);
        }
      }
      else {
        console.log("erro akhotiii");
      }
    }
    catch (err) {
      console.log("errror fetchhhhhhh");
      return;
    }


  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px] justify-center  items-center w-full h-full ">
      <div className="flex flex-col w-[700px] h-fit border border-[#ff99ff] gap-[20px] ">
        apdate profile
        <div className="flex flex-col gap-[20px] ">
          <div className="flex flex-col items-center gap-[6px]">
            <div className=" relative  w-[50px] h-[50px]  ">

              <img
                src={previewUrl || user.avatarUrl}
                className="w-full h-full rounded-full object-cover border-2 border-[#ff99ff]"
                alt="Avatar Preview"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer bg-[#ff99ff]  rounded-full text-black font-bold hover:bg-[#ff77ff] transition-all"
            >
              Change Photo
            </label>


            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file)); 
                }
              }}
            />
          </div>
          <input
            type="text"
            placeholder="First Name"
            className="bg-black/20 border border-white/10 h-[30px]  rounded-full text-white outline-none focus:border-[#ff99ff]"
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
          />
          <input
            type="text"
            placeholder="lastname Name"
            className="bg-black/20 border border-white/10 h-[30px]  rounded-full text-white outline-none focus:border-[#ff99ff]"
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          />
          <input
            type="text"
            placeholder="username Name"
            className="bg-black/20 border border-white/10 h-[30px]  rounded-full text-white outline-none focus:border-[#ff99ff]"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="email Name"
            className="bg-black/20 border border-white/10 h-[30px]  rounded-full text-white outline-none focus:border-[#ff99ff]"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="flex justify-center">

            <button className="  mt-[20px] w-[200px] h-[44px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white font-bold  uppercase ttransition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]" onClick={handelupdateprofile}>save change </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col  ">
        <div className="flex flex-col  border border-[#ff99ff] w-[700px]">
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
    </div>
  )
}

export default function Setting({ user }: intersetting) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <h1 className="flex ">Settings</h1>
      <div className="flex ">

        <  TwoFASetting user={user} />
      </div>
    </div>
  )
}

