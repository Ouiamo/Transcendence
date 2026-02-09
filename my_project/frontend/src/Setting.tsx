import { useState } from "react"
import { useEffect } from "react";
import { FiEdit2, FiUser, FiShield } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUser } from './socketService';

interface intersetting {
  user: any;
  delete_obj: (data: any) => void;
  gotohome: () => void;
}

const handleLogout = async () => {
  try {
    await fetch("https://localhost:3010/api/logout", {
      method: "POST",
      credentials: "include",
    });

    // redirect after logout
    window.location.href = "/login"; // or /signup
  } catch (err) {
    console.error("Logout failed", err);
  }
};


function TwoFASetting({ user, delete_obj, gotohome }: intersetting) {
  const logout = async () => {
    try {
      // First disconnect the socket to immediately mark user offline
      if (user && user.id && user.username) {
        logoutUser(user.id, user.username);
      }

      const logo = await fetch('https://localhost:3010/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
      if (logo.ok) {
        alert("logout succes");
        console.log("logout sucess");
        delete_obj(null);
        gotohome();
        localStorage.removeItem('page');
        localStorage.removeItem('sidebar-active');
      }
    }
    catch (error) {
      alert("error in lougout");
    }
  }
  console.log("user f setting tsx hiiiiiiiiiiiiiiiii ", user);
  const [twoFactor, setTwoFactor] = useState<boolean>(user?.twofa_enabled ?? false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstname: '', lastname: '', username: '', email: '', avatar_url: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [showVerification, setShowVerification] = useState<boolean>(false);

  useEffect(() => {
    if (user?.twofa_enabled !== undefined) {
      setTwoFactor(user.twofa_enabled);
    }
  }, [user]);

  const toggle2FA = async () => {
    if (!twoFactor) {
      await enable2FA("authenticator");
    }
    else {
      try {
        const res = await fetch("https://localhost:3010/api/2fa/disable", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          setTwoFactor(false);
          setQrCode(null);
          setShowVerification(false);
          setVerificationCode(['', '', '', '', '', '']);
          alert("2FA disabled");
        }
      } catch (err) {
        console.error("Failed to disable 2FA", err);
      }
    }
  };

  const handelupdateprofile = async () => {
    // console.log(" jitttttttttt ");
    let hasdata = false;
    const datatosend: any = {};
    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };
    if (selectedFile) {
      console.log(" file issssssss  yes dkhlattt  ^^^^^ ", selectedFile);
      datatosend.avatar_url = await getBase64(selectedFile);
      hasdata = true;
    }

    if (formData.firstname.trim() !== '') {
      datatosend.firstname = formData.firstname;
      hasdata = true;
    }
    if (formData.lastname.trim() !== '') {
      datatosend.lastname = formData.lastname;
      hasdata = true;
    }
    if (formData.username.trim() !== '') {
      datatosend.username = formData.username;
      hasdata = true;
    }
    if (formData.email.trim() !== '') {
      datatosend.email = formData.email;
      hasdata = true;
    }
    if (formData.currentPassword.trim() !== '') {
      datatosend.currentPassword = formData.currentPassword;
      hasdata = true;
    }
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill all password fields to update your password.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }
      datatosend.currentPassword = currentPassword;
      datatosend.newPassword = newPassword;
      datatosend.confirmPassword = confirmPassword;
      hasdata = true;
    }
    if (!hasdata) {
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
        body: JSON.stringify(datatosend),
      });
      const result = await response.json();
      console.log("!!!!!!!!!!!!!!result ", result);
      if (response.ok) {
        alert("Profile updated successfully! ✅");
      } else {
        alert(result.error || 'Update failed.');
      }
    }
    catch (err) {
      console.error("Update failed", err);
    }

  }
  const enable2FA = async (mthd: "authenticator") => {
    try {

      const res = await fetch("https://localhost:3010/api/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mthd }),
      })
      if (res.ok) {
        const data = await res.json()
        console.log("data lijattt hiya $$$$$$$$$$$$$ ", data);
        if (mthd === "authenticator") {
          setQrCode(data.qrCode)
          setShowVerification(true);
          console.log("ana hnaaaaaaaaaaaaaaa ", data.qrCode);
        }
      }
      else {
        alert("❌ Failed to enable 2FA");
        console.log("erro akhotiii");
        return;
      }
    }
    catch (err) {
      console.log("errror fetchhhhhhh");
      return;
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    try {
      const res = await fetch("https://localhost:3010/api/2fa/authenticator/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTwoFactor(true);
        setShowVerification(false);
        setQrCode(null);
        setVerificationCode(['', '', '', '', '', '']);
        alert("✅ 2FA enabled successfully");
      } else {
        alert("❌ " + (data.message || "Invalid code"));
        setVerificationCode(['', '', '', '', '', '']);
        document.getElementById('code-input-0')?.focus();
      }
    } catch (err) {
      console.error("Verification failed", err);
      alert("❌ Verification failed");
    }
  };

  return (
    <div className="w-full wh-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[6px] w-full max-w-[700px] mx-auto ">
        {/* Avatar */}
        <div className="  flex flex-col md:flex-row  max-auto max-w-[700px] h-fit gap-[16px] rounded-2xl
  bg-gradient-to-br from-[#120d1d]/70 via-[#0b0618]/80 to-[#120d1d]/70 border border-[#c44cff]/20 p-[24px]">
          <div className="flex items-center gap-[20px]  ">
            <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#c44cff]/20 text-[#ff77ff] shadow-[0_0_20px_rgba(196,76,255,0.6)]
  ">
              <FiUser size={24} />
            </div>

            <div className="flex flex-col  ">
              <h3 className="text-lg font-semibold text-white">Profile</h3>
              <p className="text-sm text-[#8F929E]">Update your profile information</p>
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-row ml-[60px] bg-[#ffff]">
              <div className="relative w-[100px] h-fite">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-[#c44cff]/10 border border-[#c44cff]/20 rounded-full outline-none focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]">
                  <img
                    src={previewUrl || user?.avatarUrl}
                    alt="Avatar"
                    className=" w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className=" absolute bottom-1 right-1 w-full h-full  border border-transparent rounded-full
                  flex items-center justify-center text-[#ff77ff] cursor-pointer shadow-[0_0_18px_rgba(196,76,255,0.6)] hover:bg-[#c44cff]/20 transition">
                    <div className="flex flex-row w-full h-full bg-[#ffff]">
                   <p className="text-[14px] text-[#ff77ff]">change avatar</p>
                      <div className="flex">

                  <FiEdit2 size={16} />
                      </div>

                    </div>
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
             
            </div>
          </div>
          {/* 1. Name fields */}
{/* استعملنا flex-col (عمودي) وفي الشاشات المتوسطة sm:flex-row (أفقي) */}
<div className="flex flex-col sm:flex-row gap-[4px] sm:gap-[30px] justify-center px-[4px] sm:px-[40px] w-full">
    <input
        type="text"
        placeholder="Firstname"
        className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
    />
    <input
        type="text"
        placeholder="Lastname"
        className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
    />
</div>

{/* 2. Credentials fields */}
<div className="flex flex-col sm:flex-row gap-[4px] sm:gap-[30px] justify-center px-[4px] sm:px-[40px] w-full mt-[4px] sm:mt-0">
    <input
        type="text"
        placeholder="Username"
        className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    />
    <input
        type="email"
        placeholder="Email"
        className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
</div>

{/* 3. Password fields */}
<div className="flex flex-col gap-[4px] justify-center px-[4px] sm:px-[40px] w-full mt-[4px]">
    <input
        type="password"
        placeholder="Current Password"
        className="w-full bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
    />
    <div className="flex flex-col sm:flex-row gap-[4px] sm:gap-[30px]">
        <input
            type="password"
            placeholder="New Password"
            className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        />
        <input
            type="password"
            placeholder="Confirm Password"
            className="w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-4 focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
    </div>
</div>
          {/* Name fields */}
          {/* <div className="flex gap-[30px] justify-center px-[40px] ml-[10px] ">
            <input
              type="text"
              placeholder="Firstname"
              className="flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              type="text"
              placeholder="Lastname"
              className="flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
          </div>
          <div className="flex gap-[30px] justify-center px-[40px] ml-[10px]">
            <input */}
              {/* type="text"
              placeholder="Username"
              className="flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {/* Password fields */}
          {/* <div className="flex flex-col gap-[15px] justify-center ml-[10px] px-[40px]">
            <input
              type="password"
              placeholder="Current Password"
              className="bg-[#0b0618]  text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full  outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
            <div className="flex gap-[30px] ">
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="flex-1 bg-[#0b0618]  text-[#ffffff] border border-[#c44cff]/40 h-[30px] rounded-full outline-none px-[4px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} */}
              {/* /> */}
            {/* </div> */}
          {/* </div>  */}

          {/* Save Button */}
          <div className="flex justify-center mt-[4px]">
            <button
              className="w-[150px] h-[30px] rounded-full bg-[#d86bff]
                 text-white shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
              onClick={handelupdateprofile}
            >
              Save Changes
            </button>
          </div>
        </div>
        {/* security */}
        <div className="flex flex-col w-[750px] h-fit gap-[4px] rounded-2xl justify-center
                        bg-gradient-to-br from-[#120d1d]/70 via-[#0b0618]/80 to-[#120d1d]/70
                        border border-[#c44cff]/20
                        shadow-[0_0_40px_rgba(196,76,255,0.15)] p-[24px]">
          <div className="flex items-center gap-[4px]">
            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#c44cff]/20 text-[#ff77ff] shadow-[0_0_20px_rgba(196,76,255,0.6)]">
              <FiShield size={24} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Security</h3>
              <p className="text-sm text-[#8F929E]">Protect your account</p>
            </div>
          </div>
          <div className="flex items-center justify-between ml-[30px]">
            <div>
              <h4 className="text-white font-medium">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-[#8F929E]">
                Add an extra layer of security
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={toggle2FA}
              className={`relative w-[48px] h-[24px] rounded-full
              transition-colors duration-300
              ${twoFactor
                  ? 'bg-[#22c55e]/50 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
                  : 'bg-[#8F929E]/30'}`}>
              <span
                className={`absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full
                transform transition-all duration-300 ease-in-out
                ${twoFactor
                    ? 'translate-x-[24px] bg-[#4ade80] shadow-[0_0_12px_rgba(34,197,94,0.7)]'
                    : 'translate-x-0 bg-[#8F929E]/40'}`}
              />
            </button>
          </div>
          <div
            className={`ml-[30px] flex items-center gap-[4px]
    rounded-[20px] p-[30px] border border-[#c44cff]/40 h-[20px] px-[20px] focus:border-[#c44cff] shadow-[0_0_10px_rgba(255,68,255,0.5)]`}>
            <div className={` w-[20px] h-[20px] rounded-full flex items-center justify-center
                ${twoFactor ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              <div
                className={` w-[24px] h-[24px] rounded-full
    flex items-center justify-center
    ${twoFactor
                    ? 'bg-[#22c55e]/15 text-[#4ade80] shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                    : 'bg-[#ef4444]/15 text-[#f87171]'}
  `}>
                <FiShield size={18} />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Security Status: {twoFactor ? 'Enhanced' : 'Basic'}
              </p>
              <p className="text-xs text-[#8F929E]">
                {twoFactor
                  ? 'Your account is protected with 2FA'
                  : 'Enable 2FA for better protection'}
              </p>
            </div>
          </div>


          {showVerification && (
            <div className="flex flex-col items-center gap-[8px]">
              {qrCode && (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <p className="text-center">Scan this QR code with your Authenticator app:</p>
                  <img src={qrCode} alt="Scan this QR code" className="border-[1px] border-[#c44cff]/20 shadow-[0_0_10px_rgba(255,68,255,0.5)] rounded-lg " />
                </div>
              )}

              <p className="text-center font-semibold">Enter the 6-digit code from your app:</p>
              <div className="flex gap-[2px] justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#06060d',
                      color: '#8F929E',
                      textAlign: 'center',
                      fontSize: '18px',
                      // border: '1px solid #c44cff',
                      boxShadow: '0 0 20px rgba(255,68,255,0.5)',
                      borderRadius: '8px',
                    }}
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-[10px]">
                <button
                  onClick={verifyCode}
                  className="w-[150px] h-[30px] rounded-full bg-[#d86bff]
                   text-white shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Verify Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={logout}
        className="mt-[20px] flex items-center gap-[8px] bg-transparent 
          rounded-[10px] border border-[#f87171]/40
          px-[12px] py-[6px] text-[#f87171] text-xs
          hover:bg-[#f87171]/10 hover:shadow-[0_0_20px_rgba(248,113,113,0.6)] transition-all
        "
      >
        <IoLogOutOutline size={24} />
        <span>Logout</span>
      </button>

    </div>
  )
}

export default function Setting({ user, delete_obj, gotohome }: intersetting) {
  return (
   
    <div className="min-h-screen w-full bg-[#0d0221] py-[6px] px-[4px] md:py-10">

      <div className="max-w-6xl mx-auto w-full space-y-[8px]">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic glow-text uppercase">
            Settings
          </h1>
          <p className="text-[#8F929E] text-xs md:text-sm font-medium tracking-widest uppercase">
            Manage your account & security
          </p>
        </div>
        <div className="w-full ">
          <TwoFASetting
            user={user}
            delete_obj={delete_obj}
            gotohome={gotohome}
          />
        </div>

      </div>
    </div>
  )
}


// shadow-[0_0_40px_rgba(196,76,255,0.15)] shadow dyl setting 7aydto