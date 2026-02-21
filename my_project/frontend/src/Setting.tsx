import { useState } from "react"
import { useEffect } from "react";
import { FiEdit2, FiUser, FiShield } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUser } from './socketService';
import { API_URL } from "./Api.tsx";

interface intersetting {
  user: any;
  delete_obj: (data: any) => void;
  gotohome: () => void;
}

// const handleLogout = async () => {
//   try {
//     await fetch(`${API_URL}/api/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     // redirect after logout
//     window.location.href = "/login"; // or /signup
//   } catch (err) {
//     console.error("Logout failed", err);
//   }
// };


function TwoFASetting({ user, delete_obj, gotohome }: intersetting) {
  const logout = async () => {
    try {
      // First disconnect the socket to immediately mark user offline
      if (user && user.id && user.username) {
        logoutUser(user.id, user.username);
      }

      const logo = await fetch(`${API_URL}/api/logout`, {
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
        const res = await fetch(`${API_URL}/api/2fa/disable`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          setTwoFactor(false);
          setQrCode(null);
          setShowVerification(false);
          setVerificationCode(['', '', '', '', '', '']);
          delete_obj({ user: { ...user, twofa_enabled: false } });
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
        alert("No profile data found. You can update your profile to get started.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
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
        setFormData({
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          avatar_url: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSelectedFile(null);
        // setPreviewUrl(null);
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

      const res = await fetch(`${API_URL}/api/2fa/enable`, {
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
      const res = await fetch(`${API_URL}/api/2fa/authenticator/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTwoFactor(true);
        delete_obj({ user: { ...user, twofa_enabled: true } });
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
(console.log("avatr li fe setting howa ::: ", user?.avatarUrl));
  return (
    <div className="w-full wh-full flex flex-col">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] w-full max-w-[750px] mx-auto ">
        {/* Avatar */}
        <div className=" flex flex-col md:flex-row  max-auto max-w-[750px] h-fit gap-[16px] rounded-[12px] shadow-[0_0_10px_rgba(255,68,255,0.5)]
  bg-gradient-to-br from-[#120d1d]/70 via-[#0b0618]/80 to-[#120d1d]/70 border border-[#c44cff]/20 p-[24px]">
          <div className="flex items-center gap-[20px] ">
            <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#c44cff]/20 text-[#ff77ff] shadow-[0_0_20px_rgba(196,76,255,0.6)]
  ">
              <FiUser size={24} />
            </div>

            <div className="flex flex-col  ">
              <h3 className="text-lg font-semibold text-white">Profile</h3>
              <p className="text-sm text-[#8F929E]">Update your profile information</p>
            </div>
          </div>
          <div className="flex flex-col gap-[4px] ">
            <div className="flex flex-row gap-[14px] ml-[20px] sm:ml-[60px]">

              <div className="relative w-[60px] h-[60px] flex-none">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#c44cff]/10 border border-[#c44cff]/20 shadow-[0_0_10px_rgba(255,68,255,0.5)]">
                  <img
                    referrerPolicy="no-referrer"
              crossOrigin="anonymous"
                    src={previewUrl || user?.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <label
                htmlFor="avatar-upload"
                className="flex items-center gap-[4px] cursor-pointer group transition-all"
              >
                <span className="text-[14px] text-[#ff77ff] font-medium group-hover:text-white transition-colors">
                  Change avatar
                </span>
                <div className="p-1.5 rounded-full bg-[#c44cff]/10 border border-[#c44cff]/20 text-[#ff77ff] group-hover:bg-[#c44cff]/30 shadow-[0_0_10px_rgba(196,76,255,0.3)]">
                  <FiEdit2 size={14} />
                </div>

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
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-[12px] sm:gap-[30px] justify-center px-[4px] sm:px-[40px] w-full ">
            <input
              type="text"
              value={formData.firstname}
              placeholder="Firstname"
              className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              type="text"
              value={formData.lastname}
              placeholder="Lastname"
              className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
          </div>
          <div className="flex flex-row sm:flex-row gap-[12px] sm:gap-[30px] justify-center px-[4px] sm:px-[40px] w-full mt-[4px] sm:mt-0">
            <input
              type="text"
              value={formData.username}
              placeholder="Username"
              className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="email"
              value={formData.email}
              placeholder="Email"
              className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* 3. Password fields */}
          <div className="flex flex-col gap-[10px] justify-center items-center  sm:px-[40px] w-full mt-[4px]">
            <input
              type="password"
              value={formData.currentPassword}
              placeholder="Current Password"
              className="  caret-[#ff44ff] w-[96%] bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
            <div className="flex w-full items-center flex-row sm:flex-row gap-[10px] sm:gap-[30px]">
              <input
                value={formData.newPassword}
                type="password"
                placeholder="New Password"
                className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <input
                type="password"
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                className="caret-[#ff44ff] w-full sm:flex-1 bg-[#0b0618] text-[#ffffff] border border-[#c44cff]/40 h-[35px] rounded-full outline-none px-[16px] focus:border-[#c44cff] "
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-center mt-[4px]">
            <button
              className="w-[150px] h-[30px] rounded-full mt-[10px]
                 text-white  bg-gradient-to-r from-[#a25cff] via-[#c84cff] to-[#d86bff]
             shadow-[0_0_20px_rgba(216,107,255,0.8)]
             hover:shadow-[0_0_30px_rgba(216,107,255,1)]
             transition-all  uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
              onClick={handelupdateprofile}
            >
              Save Changes
            </button>
          </div>
        </div>
       {/* Security Section */}
<div className="
    flex flex-col 
    w-full 
    lg:max-w-[750px]
    h-fit 
    rounded-[12px]
    bg-gradient-to-br from-[#120d1d]/70 via-[#0b0618]/80 to-[#120d1d]/70
    border border-[#c44cff]/20
    shadow-[0_0_10px_rgba(255,68,255,0.5)]
">

    {/* Header */}
    <div className="flex items-center gap-[20px] ml-[10px]  ">
        <div className="  w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#c44cff]/20 text-[#ff77ff] 
            shadow-[0_0_20px_rgba(196,76,255,0.6)] 
            shrink-0
        ">
            <FiShield size={24} />
        </div>

        <div>
            <h3 className="text-lg font-semibold text-white">Security</h3>
            <p className="text-sm text-[#8F929E]">Protect your account</p>
        </div>
    </div>

    {/* 2FA Row */}
    <div className="flex flex-wrap items-center justify-between gap-[3px] sm:ml-[55px] ml-[10px] mr-[10px]
    ">
        <div>
            <h4 className="text-white font-medium text-sm sm:text-base ml-[10px]">
                Two-Factor Authentication
            </h4>
            <p className="text-[11px] sm:text-xs text-[#8F929E] ml-[10px]">
                Add an extra layer of security
            </p>
        </div>

        {/* Toggle */}
        <button
            onClick={toggle2FA}
            className={`border-none 
                relative w-[48px] h-[24px] rounded-full 
                shrink-0 transition-colors duration-300
                ${twoFactor 
                  ? 'bg-[#22c55e]/50 shadow-[0_0_20px_rgba(34,197,94,0.8)]' 
                  : 'bg-[#8F929E]/30'}
            `}
        >
            <span className={`
                absolute top-[3px] left-[3px] 
                w-[16px] h-[16px] rounded-full 
                transform transition-all duration-300
                ${twoFactor 
                  ? 'translate-x-[24px] bg-[#4ade80]' 
                  : 'translate-x-0 bg-[#8F929E]/40'}
            `} />
        </button>
    </div>

    {/* Security Status Box */}
    <div className="mx-auto  w-[90%] mt-[10px] mb-[10px] flex  flex-row items-center gap-[3px] rounded-[20px] p-[4px] border border-[#c44cff]/40 shadow-[0_0_10px_rgba(255,68,255,0.5)] bg-[#0b0618]/60 overflow-hidden">
        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ml-[10px] mt-[10px]
            shrink-0
            ${twoFactor 
              ? 'bg-[#22c55e]/15 text-[#4ade80] shadow-[0_0_10px_rgba(34,197,94,0.6)]' 
              : 'bg-[#ef4444]/15 text-[#f87171]'}
        `}>
            <FiShield size={24} />
        </div>

        <div className="flex flex-1 flex-col min-w-0 ml-[10px] ">
            <p className="text-sm font-medium text-white break-words">
                Security Status: {twoFactor ? 'Enhanced' : 'Basic'}
            </p>

            <p className="text-xs text-[#8F929E] leading-relaxed break-words">
                {twoFactor 
                  ? 'Your account is protected' 
                  : 'Enable 2FA for better protection'}
            </p>
        </div>
    </div>

{/* </div> */}

    {/* Verification Section */}
    {showVerification && (
        <div className="flex flex-col items-center gap-[15px] mt-4">
            {qrCode && (
                <div className="flex flex-col items-center gap-3">
                    <p className="text-center text-xs text-[#8F929E] px-4">Scan this QR code with your Authenticator app:</p>
                    <div className="p-[2px] bg-white rounded-lg ">
                        <img src={qrCode} alt="Scan this" className="w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] shadow-[0_0_40px_rgba(196,76,255,0.15)] " />
                    </div>
                </div>
            )}

            <p className="text-center text-sm font-semibold text-white">Enter the 6-digit code:</p>
            <div className="flex gap-[6px] justify-center flex-wrap px-[2px]">
                {verificationCode.map((digit, index) => (
                    <input
                        key={index}
                        id={`code-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        style={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: '#06060d',
                            color: '#c44cff',
                            textAlign: 'center',
                            fontSize: '18px',
                            boxShadow: '0 0 15px rgba(255,68,255,0.3)',
                            borderRadius: '8px',
                            border: '1px solid rgba(196, 76, 255, 0.3)'
                        }}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-[2px] w-full">
                <button
                    onClick={verifyCode}
                    className="w-[180px]   mb-[10px] h-[35px] rounded-full  text-white font-bold
                    bg-gradient-to-r from-[#a25cff] via-[#c84cff] to-[#d86bff]
             shadow-[0_0_20px_rgba(216,107,255,0.8)]
             hover:shadow-[0_0_30px_rgba(216,107,255,1)]
             transition-all  uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]"
                >
                    Verify Code
                </button>
            </div>
        </div>
    )}
</div>
      </div>
{/* Danger Zone */}
<div className="mt-[20px]
  w-full max-w-[700px] mx-auto
  rounded-[12px]
  bg-gradient-to-br from-[#2a0f16]/70 via-[#14070c]/80 to-[#2a0f16]/70
  border border-[#ef4444]/30
  shadow-[0_0_30px_rgba(239,68,68,0.15)]
  p-[24px]
  flex flex-col sm:flex-row
  justify-between items-start sm:items-center
  gap-[16px]
  mt-[10px]
">

  <div className="flex flex-col">
    <h3 className="text-[#f87171]">
      Danger Zone
    </h3>
    <p className=" text-[#8F929E]">
      Irreversible actions. Please proceed carefully.
    </p>
  </div>

  <button
    className="
      px-[20px] py-[8px]
      rounded-full
      text-sm font-bold uppercase tracking-wider
      border border-[#ef4444]/40
      text-[#f87171]
      bg-[#ef4444]/20
      hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]
      transition-all duration-300
      active:scale-[0.97]
    "
    onClick={async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (!confirmDelete) return;

      try {
        console.log("🗑️ Deleting account...");
        
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          alert('Account deleted successfully');
          localStorage.clear();
          delete_obj(null);
          gotohome();
          
        } else {
          alert('Error: ' + (data.error || 'Failed to delete account'));
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Network error');
      }
    }}
  >
    Delete Account
  </button>

</div>

      <div className="w-full flex  justify-center md:justify-start">
     
        <button
          onClick={logout}
          className="mt-[20px]   flex items-center justify-center gap-[8px] bg-transparent 
      rounded-[10px] border-[2px] border-[#f87171]/40
      w-[140px] h-[40px] 
      text-[#f87171] text-sm font-bold
      hover:bg-[#f87171]/10 hover:shadow-[0_0_20px_rgba(248,113,113,0.6)] transition-all
      active:scale-95"
        >
          <IoLogOutOutline size={22} />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}

export default function Setting({ user, delete_obj, gotohome }: intersetting) {
  return (

    <div className="w-full min-h-screen bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221]">
{/* <div className="w-full bg-[#0d0221] py-[6px] px-[4px] md:py-6"> */}


      <div className="max-w-6xl mx-auto w-full space-y-[8px]">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter  glow-text uppercase">
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