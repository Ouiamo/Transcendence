import { useState } from "react"
import { useEffect } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";

interface intersetting {
  user: any;
}

function Box({ icon, label, value, }: { icon: JSX.Element; label: string; value: string; }) {
  return (
    <div
      className="min-w-[300px] max-w-[300px] bg-[#120d1d]/40 flex flex-row items-center gap-[20px] ml-[20px]"
    >
      <div
        className="w-[11px] h-[11px] flex items-center justify-center text-[#ff77ff] shadow-[0_0_20px_rgba(196,76,255,0.45)]"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center bg-[#c44cff]/20"
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold leading-none text-white">
          {value}
        </p>
        <p className="text-[10px] text-[#8F929E] mt-[1px]">
          {label}
        </p>
      </div>
    </div>
  );
}


function TwoFASetting({ user }: intersetting) {
  console.log("user f setting tsx hiiiiiiiiiiiiiiiii ", user);
  const [twoFactor, setTwoFactor] = useState<boolean>(user?.twofa_enabled ?? false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ firstname: '', lastname: '', username: '', email: '', avatar_url: '' , currentPassword: '', newPassword: '', confirmPassword: '' });
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
    const datatosand: any = {};
    const getBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };
    if (selectedFile) {
      console.log(" file issssssss ", selectedFile);
      hasdata = true;
      datatosand.avatar_url = await getBase64(selectedFile);
    }

    if (formData.firstname.trim() != "") {
      datatosand.firstname = formData.firstname;
      hasdata = true;
    }
    if (formData.lastname.trim() != "") {
      datatosand.lastname = formData.lastname;
      hasdata = true;
    }
    if (formData.username.trim() != "") {
      datatosand.username = formData.username;
      hasdata = true;
    }
    if (formData.email.trim() != "") {
      datatosand.email = formData.email;
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
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[4px]">
        {/* Avatar */}
        <div className="flex flex-col w-[750px] h-fit border border-[#c44cff]/20 gap-[15px] ">
          <Box icon={<FiUser size={24} />} value="Profile" label="Update your profile information" />
          <div className="flex flex-col gap-[15px] ">
            {/* <div className="flex flex-col items-center gap-[6px]">
              <div className=" relative  w-[50px] h-[50px]  ">
                <img
                  src={previewUrl || user?.avatarUrl || 'https://localhost:3010/api/avatar/file/default-avatar.png'}
                  className="w-full h-full rounded-full object-cover border-2 border-[#ff99ff]"
                  alt="Avatar Preview"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-[#ff99ff]  rounded-full text-black font-bold hover:bg-[#ff77ff] transition-all"
              >
                Change Photo
              </label> */}
            <div className="flex flex-col ml-[60px] ">
              <div className="relative w-[50px] h-[50px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#c44cff]/20 border border-[#c44cff]/40 shadow-[0_0_45px_rgba(196,76,255,0.6)] transition hover:shadow-[0_0_60px_rgba(196,76,255,0.85)]">
                  <img
                    src={previewUrl || user?.avatarUrl || "https://localhost:3010/api/avatar/file/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className=" absolute bottom-1 right-1 w-[10px] h-[10px]  border border-transparent rounded-full
                  flex items-center justify-center text-[#ff77ff] cursor-pointer shadow-[0_0_18px_rgba(196,76,255,0.6)] hover:bg-[#c44cff]/20 transition">
                  <FiEdit2 size={16} />
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
              <p className="text-[14px] text-[#ff77ff]">change avatar</p>
            </div>
          </div>
          {/* Name fields */}
          <div className="flex gap-[30px] justify-center px-[40px] ml-[10px]">
            <input
              type="text"
              placeholder="Firstname"
              className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
            <input
              type="text"
              placeholder="Lastname"
              className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
          </div>
          <div className="flex gap-[30px] justify-center px-[40px] ml-[10px]">
            <input
              type="text"
              placeholder="Username"
              className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {/* Password fields */}
          <div className="flex flex-col gap-[15px] justify-center ml-[10px] px-[40px]">
            <input
              type="password"
              placeholder="Current Password"
              className="bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white  outline-none px-[4px] focus:border-[#c44cff]"
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
            <div className="flex gap-[30px] ">
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="flex-1 bg-[#0b0618] border border-[#c44cff]/40 h-[30px] rounded-full text-white outline-none px-[4px] focus:border-[#c44cff]"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-4">
            <button
              className="w-[200px] h-[30px] rounded- bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]
                 text-white font-bold uppercase shadow-[0_0_15px_rgba(255,68,255,0.4)]
                 hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              onClick={handelupdateprofile}
            >
              Save Changes
            </button>
          </div>
        </div>
        <div className="flex flex-col  ">
          <div className="flex flex-col  border border-[#ff99ff] w-[700px] p-6">
            <h3 className="text-xl font-bold mb-4">Two-Factor Authentication</h3>
            <button
              onClick={() => { toggle2FA() }}
              className="mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white font-bold hover:shadow-[0_0_25px_rgba(255,68,255,0.7)]"
            >
              {twoFactor ? "Disable 2FA" : "Enable 2FA"}
            </button>
            <p className="mb-4">2FA is: <span className="font-bold">{twoFactor ? "ON" : "OFF"}</span></p>

            {showVerification && (
              <div className="flex flex-col items-center gap-8">
                {qrCode && (
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <p className="text-center">Scan this QR code with your Authenticator app:</p>
                    <img src={qrCode} alt="Scan this QR code" className="border-2 border-[#ff99ff] rounded-lg p-2" />
                  </div>
                )}

                <p className="text-center font-semibold">Enter the 6-digit code from your app:</p>
                <div className="flex gap-2 justify-center">
                  {verificationCode.map((digit, index) => (
                    <input
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#32174D',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '18px',
                        border: '2px solid #ff99ff',
                        boxShadow: '0 0 10px rgba(255,68,255,0.5)',
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
                    //  className="
                    //             w-9 h-9
                    //             text-center
                    //             text-lg
                    //             font-bold
                    //             bg-black/40
                    //             text-white
                    //             border-2 border-[#ff99ff]
                    //             rounded-md
                    //             outline-none
                    //             focus:border-[#ff44ff]
                    //             focus:shadow-[0_0_10px_rgba(255,68,255,0.5)]
                    //             "
                    // autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button
                  onClick={verifyCode}
                  className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]">

                  Verify Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Setting({ user }: intersetting) {
  return (
    <div className="min-h-screen w-full bg-[#0b0618] text-white flex justify-center py-[20px]">
      <div className="w-full max-w-6xl space-y-[10px]">
        <div>
          <h1 className="flex glow-text">Settings</h1>
          <p className="text-[#8F929E] mt-[1px]">Manage your account and preferences</p>
        </div>
        <div className="flex flex-col gap-[20px]">

          <TwoFASetting user={user} />
        </div>
      </div>
    </div>
  )
}

