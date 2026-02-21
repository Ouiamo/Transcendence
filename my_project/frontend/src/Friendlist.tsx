import { useEffect, useState } from 'react';
import { OnlineUsers, onOnlineUsersChange } from './socketService.tsx';

interface Friend {
  id: number;
  username: string;
  avatarUrl?: string;
  online?: boolean;
}

interface GameInvitation {
  invitation_id: number;
  sender_username: string;
  avatarUrl?: string;
}

export function Friendlist() {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is_Online, setIsOnline] = useState<Map<number, string>>(new Map());
  const [gameInvitations, setGameInvitations] = useState<GameInvitation[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch('/api/friends', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          console.log("data is ", data);
          setFriends(data.friends);
        }
      } catch (err) {
        setError("errooooooooor");
        console.error('Failed to load friends', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
    fetchGameInvitations();

    const intervalId = setInterval(() => {
      fetchGameInvitations();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const updateOnlineStatus = () => {
    if (!friends || friends.length === 0) {
      setIsOnline(new Map());
      return;
    }

    const onlineStatus = new Map<number, string>();

    console.log(" Checking online status for friends...");
    console.log(" Current OnlineUsers map:", Array.from(OnlineUsers.entries()));

    friends.forEach(friend => {
      if (OnlineUsers.has(friend.id)) {
        console.log(` ${friend.username} (ID: ${friend.id}) is ONLINE`);
        onlineStatus.set(friend.id, 'Online');
      } else {
        console.log(` ${friend.username} (ID: ${friend.id}) is OFFLINE`);
        onlineStatus.set(friend.id, 'Offline');
      }
    });

    setIsOnline(onlineStatus);
  };

  useEffect(() => {
    onOnlineUsersChange(() => {
      console.log(" OnlineUsers changed! Updating UI...");
      updateOnlineStatus();
    });
  }, [friends]);

  useEffect(() => {
    updateOnlineStatus();
  }, [friends]);

  const fetchGameInvitations = async () => {
    try {
      const res = await fetch('/api/game/invitations', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setGameInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error('Failed to load game invitations', err);
    }
  };

  const sendGameInvitation = async (friendUsername: string) => {
    try {
      const res = await fetch('/api/game/invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendUsername }),
        credentials: 'include',
      });

      if (res.ok) {
        await res.json();
        alert(`Game invitation sent to ${friendUsername}! 🎮`);
      } else {
        const errorData = await res.json();
        alert(`Failed to send invitation: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to send game invitation', err);
      alert('Failed to send game invitation');
    }
  };

  const acceptGameInvitation = async (invitationId: number, senderUsername: string) => {
    try {
      const res = await fetch('/api/game/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
        credentials: 'include',
      });

      if (res.ok) {
        await res.json();
        console.log(`🎮 Game invitation accepted from ${senderUsername}`);
        setGameInvitations(prev => prev.filter(inv => inv.invitation_id !== invitationId));
      } else {
        const errorData = await res.json();
        alert(`Failed to accept invitation: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to accept game invitation', err);
      alert('Failed to accept game invitation');
    }
  };

  const declineGameInvitation = async (invitationId: number) => {
    try {
      const res = await fetch(`/api/game/invitation/${invitationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setGameInvitations(prev => prev.filter(inv => inv.invitation_id !== invitationId));
        alert('Game invitation declined');
      } else {
        alert('Failed to decline invitation');
      }
    } catch (err) {
      console.error('Failed to decline game invitation', err);
      alert('Failed to decline game invitation');
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === 'Online' ? 'rgba(34, 197, 94, 1)' : 'rgba(100, 116, 139, 1)';
  };

  if (loading) return <div style={{ padding: '16px' }}>Loading friends…</div>;
  if (error) return <div style={{ padding: '16px', color: 'rgba(248, 113, 113, 1)' }}>Error: {error}</div>;
  return (
    <div className=" py-[18px] max-w-6xl mx-auto   ">
      {/* Header */}
      <div className="mb-[8px]">
        <h1 className="text-3xl font-bold text-white mb-[1px] glow-text justify-center flex">
          Friends
        </h1>
        <div className="text-sm text-gray-400 gap-[20px] flex items-center" >


          <span className="text-[20px]">
            {friends ? friends.filter((f) => is_Online.get(f.id) === 'Online').length : 0}
          </span>
          <span className="text-[#c44cff] text-[20px]">friends online</span>

        </div>
      </div>

      {/* MAIN GRID */}
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] lg:gap-[40px] p-[10px]">
        {/* Friends Grid */}
        <div className="grid gap-[14px] sm:grid-cols-2 xl:grid-cols-3 ">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-slate-800/40  border-[2px] border-[#c44cff]/50 rounded-[12px] p-[20px] shadow-lg"
              >
                <div className="flex items-center gap-[20px]">

                  {/* Avatar Wrapper */}
                  <div className="relative shrink-0 p-[px]">
                    <div
                      className={`w-[80px] h-[80px] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg
    bg-gradient-to-br from-pink-500 to-purple-600
    ${is_Online.get(friend.id) === 'Online'
                          ? 'border-[2px] border-[#48A111]'
                          : 'border-[2px] border-slate-700'
                        }`}
                    >
                      <div></div>
                      {friend.avatarUrl ? (
                        <img
                          src={friend.avatarUrl}
                          alt={friend.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        getInitials(friend.username)
                      )}
                    </div>

                    <div
                      className="absolute bottom-[4px] right-[4px] w-[14px] h-[14px] rounded-full border-[2.5px] "
                      style={{
                        backgroundColor: getStatusColor(is_Online.get(friend.id) || 'Offline'),
                        zIndex: 10,
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {friend.username}
                    </h3>
                    <p
                      className="text-xs"
                      style={{
                        color: getStatusColor(
                          is_Online.get(friend.id) || 'Offline'
                        ),
                      }}
                    >
                      {is_Online.get(friend.id) === 'Online'
                        ? 'Online'
                        : 'Offline'}
                    </p>
                  </div>

                  {/* Invite Button */}
                  {is_Online.get(friend.id) === 'Online' && (
                    <button
                      onClick={() => sendGameInvitation(friend.username)}
                      className="border-none outline-none w-[110px] h-[40px] rounded-full bg-gradient-to-r from-[#09a043]/60 to-[#09ff00]/60 text-[#098000] font-bold text-[17px] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:scale-[1.05] active:scale-[0.95]"
                    >
                      Invite
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-[10px] col-span-full">
              No friends yet.
            </div>
          )}
        </div>

        {/* Invitations Panel */}
        <div className="bg-slate-800/40 backdrop-blur-xl border-[2px] rounded-[12px]  border-[#c44cff]/50 p-[20px] shadow-lg">
          <h2 className="text-[#c44cff] text-lg font-semibold mb-4">
            Game Requests
          </h2>

              {gameInvitations.map((inv) => (
      <div
        key={inv.invitation_id}
        className="flex items-center justify-between gap-[13px] p-[20px] rounded-full border border-[#c44cff]/40 glow-border"
      >
        {/* Left Side: Avatar & Username */}
        <div className="flex items-center gap-[13px] min-w-0">
          <div className="relative shrink-0 ">
            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/20 overflow-hidden shadow-sm">
              {inv.avatarUrl ? (
                <img 
                  src={inv.avatarUrl} 
                  alt={inv.sender_username} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : (
                getInitials(inv.sender_username)
              )}
            </div>

          </div>
          
          <span className="text-white font-medium text-sm truncate max-w-[100px] ">
            {inv.sender_username}
          </span>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex gap-[12px] shrink-0">
          <button
            onClick={() => acceptGameInvitation(inv.invitation_id, inv.sender_username)}
            className="border-none outline-none w-[75px] h-[32px] rounded-full bg-gradient-to-r from-[#09a043]/60 to-[#09ff00]/60 text-[#0c4d11] font-bold text-[11px] uppercase transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,255,136,0.5)] hover:scale-[1.05] active:scale-[0.95]"
          >
            Accept
          </button>

          <button
            onClick={() => declineGameInvitation(inv.invitation_id)}
            className="border-none outline-none w-[75px] h-[32px] rounded-full border-[1px] border-[#da043a]/30 bg-gradient-to-r from-[#da043a]/40 to-[#da043a]/40 text-[#ff4d7d] font-bold text-[11px] uppercase transition-all duration-300 hover:bg-[#ff4444] hover:text-white hover:shadow-[0_0_12px_rgba(255,68,68,0.4)] hover:scale-[1.05] active:scale-[0.95]"
          >
            Decline
          </button>
        </div>
      </div>
    ))}
        </div>
      </div>
    </div>
  );
  // return (
  //   <div style={{
  //     padding: '32px',
  //     maxWidth: '1200px',
  //     margin: '0 auto',
  //   }}>
  //     {/* Header */}
  //     <div style={{
  //       marginBottom: '32px',
  //     }}>
  //       <h1 style={{
  //         fontSize: '36px',
  //         fontWeight: 'bold',
  //         color: 'rgba(255, 255, 255, 1)',
  //         marginBottom: '4px',
  //         fontFamily: 'system-ui, -apple-system, sans-serif',
  //       }}>
  //         Friends
  //       </h1>
  //       <p style={{
  //         fontSize: '14px',
  //         color: 'rgba(156, 163, 175, 1)',
  //         fontFamily: 'system-ui, -apple-system, sans-serif',
  //       }}>
  //         {friends ? friends.filter((f) => is_Online.get(f.id) === 'Online').length : 0} friends online
  //       </p>
  //     </div>

  //     <div style={{
  //       display: 'grid',
  //       gridTemplateColumns: '1fr 400px',
  //       gap: '32px',
  //     }}>
  //       {/* Friends List */}
  //       <div style={{
  //         display: 'grid',
  //         gridTemplateColumns: 'repeat(2, 1fr)',
  //         gap: '16px',
  //         alignContent: 'start',
  //       }}>
  //         {friends && friends.length > 0 ? (
  //           friends.map((friend) => (
  //             <div
  //               key={friend.id}
  //               style={{
  //                 background: 'rgba(30, 41, 59, 0.4)',
  //                 backdropFilter: 'blur(12px)',
  //                 border: '1px solid rgba(71, 85, 105, 0.3)',
  //                 borderRadius: '12px',
  //                 padding: '16px',
  //                 boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
  //               }}
  //             >
  //               <div style={{
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 gap: '16px',
  //               }}>
  //                 {/* Avatar with status ring */}
  //                 <div style={{ position: 'relative' }}>
  //                   <div style={{
  //                     width: '56px',
  //                     height: '56px',
  //                     borderRadius: '50%',
  //                     overflow: 'hidden',
  //                     background: 'linear-gradient(135deg, rgba(236, 72, 153, 1) 0%, rgba(139, 92, 246, 1) 100%)',
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     justifyContent: 'center',
  //                     fontSize: '18px',
  //                     fontWeight: 'bold',
  //                     color: 'rgba(255, 255, 255, 1)',
  //                     border: is_Online.get(friend.id) === 'Online' ? '2px solid rgba(34, 197, 94, 1)' : 'none',
  //                   }}>
  //                     {friend.avatarUrl ? (
  //                       <img
  //                         src={friend.avatarUrl}
  //                         alt={friend.username}
  //                         style={{
  //                           width: '100%',
  //                           height: '100%',
  //                           objectFit: 'cover',
  //                         }}
  //                       />
  //                     ) : (
  //                       getInitials(friend.username)
  //                     )}
  //                   </div>
  //                   <div style={{
  //                     position: 'absolute',
  //                     bottom: '0px',
  //                     right: '0px',
  //                     width: '16px',
  //                     height: '16px',
  //                     borderRadius: '50%',
  //                     backgroundColor: getStatusColor(is_Online.get(friend.id) || 'Offline'),
  //                     border: '2px solid rgba(15, 23, 42, 1)',
  //                   }} />
  //                 </div>

  //                 {/* Info */}
  //                 <div style={{ flex: 1, minWidth: 0 }}>
  //                   <h3 style={{
  //                     fontSize: '16px',
  //                     fontWeight: '600',
  //                     color: 'rgba(255, 255, 255, 1)',
  //                     marginBottom: '2px',
  //                     overflow: 'hidden',
  //                     textOverflow: 'ellipsis',
  //                     whiteSpace: 'nowrap',
  //                     fontFamily: 'system-ui, -apple-system, sans-serif',
  //                   }}>
  //                     {friend.username}
  //                   </h3>
  //                   <p style={{
  //                     fontSize: '12px',
  //                     color: getStatusColor(is_Online.get(friend.id) || 'Offline'),
  //                     margin: 0,
  //                     fontFamily: 'system-ui, -apple-system, sans-serif',
  //                   }}>
  //                     {is_Online.get(friend.id) === 'Online' ? 'Online' : 'Offline'}
  //                   </p>
  //                 </div>

  //                 {/* Actions */}
  //                 <div style={{
  //                   display: 'flex',
  //                   gap: '8px',
  //                 }}>
  //                   {is_Online.get(friend.id) === 'Online' && (
  //                     <button
  //                       onClick={() => sendGameInvitation(friend.username)}
  //                       style={{
  //                         padding: '8px',
  //                         borderRadius: '8px',
  //                         background: 'rgba(236, 72, 153, 0.2)',
  //                         border: 'none',
  //                         color: 'rgba(236, 72, 153, 1)',
  //                         cursor: 'pointer',
  //                         display: 'flex',
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         transition: 'all 0.2s',
  //                       }}
  //                       onMouseEnter={(e) => {
  //                         e.currentTarget.style.background = 'rgba(236, 72, 153, 0.3)';
  //                       }}
  //                       onMouseLeave={(e) => {
  //                         e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
  //                       }}
  //                     >
  //                       Invite
  //                       {/* < style={{ width: '16px', height: '16px' }} /> */}
  //                     </button>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           ))
  //         ) : (
  //           <div style={{
  //             gridColumn: '1 / -1',
  //             padding: '32px',
  //             textAlign: 'center',
  //             color: 'rgba(156, 163, 175, 1)',
  //             fontFamily: 'system-ui, -apple-system, sans-serif',
  //           }}>
  //             No friends yet.
  //           </div>
  //         )}
  //       </div>

  //       {/* Pending Requests Panel */}
  //       <div>
  //         <div style={{
  //           background: 'rgba(30, 41, 59, 0.4)',
  //           backdropFilter: 'blur(12px)',
  //           border: '1px solid rgba(71, 85, 105, 0.3)',
  //           borderRadius: '12px',
  //           padding: '20px',
  //           boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
  //         }}>
  //           <h2 style={{
  //             fontSize: '18px',
  //             fontWeight: '600',
  //             color: 'rgba(255, 255, 255, 1)',
  //             marginBottom: '16px',
  //             fontFamily: 'system-ui, -apple-system, sans-serif',
  //           }}>
  //             Game Requests
  //           </h2>
  //           <div style={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             gap: '12px',
  //           }}>
  //             {gameInvitations.length === 0 ? (
  //               <p style={{
  //                 fontSize: '14px',
  //                 color: 'rgba(156, 163, 175, 1)',
  //                 textAlign: 'center',
  //                 margin: 0,
  //                 padding: '16px 0',
  //                 fontFamily: 'system-ui, -apple-system, sans-serif',
  //               }}>
  //                 No pending game invitations
  //               </p>
  //             ) : (
  //               gameInvitations.map((invitation) => (
  //                 <div
  //                   key={invitation.invitation_id}
  //                   style={{
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                     padding: '8px 0',
  //                   }}
  //                 >
  //                   <div style={{
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                     gap: '12px',
  //                   }}>
  //                     <div style={{
  //                       width: '40px',
  //                       height: '40px',
  //                       borderRadius: '50%',
  //                       background: 'linear-gradient(135deg, rgba(236, 72, 153, 1) 0%, rgba(139, 92, 246, 1) 100%)',
  //                       overflow: 'hidden',
  //                       display: 'flex',
  //                       alignItems: 'center',
  //                       justifyContent: 'center',
  //                       fontSize: '14px',
  //                       fontWeight: 'bold',
  //                       color: 'rgba(255, 255, 255, 1)',
  //                     }}>
  //                       {invitation.avatarUrl ? (
  //                         <img
  //                           src={invitation.avatarUrl}
  //                           alt={invitation.sender_username}
  //                           style={{
  //                             width: '100%',
  //                             height: '100%',
  //                             objectFit: 'cover',
  //                           }}
  //                         />
  //                       ) : (
  //                         getInitials(invitation.sender_username)
  //                       )}
  //                     </div>
  //                     <span style={{
  //                       fontSize: '15px',
  //                       fontWeight: '500',
  //                       color: 'rgba(255, 255, 255, 1)',
  //                       fontFamily: 'system-ui, -apple-system, sans-serif',
  //                     }}>
  //                       {invitation.sender_username}
  //                     </span>
  //                   </div>
  //                   <div style={{
  //                     display: 'flex',
  //                     gap: '8px',
  //                   }}>
  //                     <button
  //                       onClick={() => acceptGameInvitation(invitation.invitation_id, invitation.sender_username)}
  //                       style={{
  //                         padding: '4px 12px',
  //                         fontSize: '12px',
  //                         borderRadius: '6px',
  //                         background: 'rgba(34, 197, 94, 0.2)',
  //                         color: 'rgba(34, 197, 94, 1)',
  //                         border: 'none',
  //                         cursor: 'pointer',
  //                         fontWeight: '500',
  //                         fontFamily: 'system-ui, -apple-system, sans-serif',
  //                         transition: 'all 0.2s',
  //                       }}
  //                       onMouseEnter={(e) => {
  //                         e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)';
  //                       }}
  //                       onMouseLeave={(e) => {
  //                         e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
  //                       }}
  //                     >
  //                       Accept
  //                     </button>
  //                     <button
  //                       onClick={() => declineGameInvitation(invitation.invitation_id)}
  //                       style={{
  //                         padding: '4px 12px',
  //                         fontSize: '12px',
  //                         borderRadius: '6px',
  //                         background: 'rgba(239, 68, 68, 0.2)',
  //                         color: 'rgba(239, 68, 68, 1)',
  //                         border: 'none',
  //                         cursor: 'pointer',
  //                         fontWeight: '500',
  //                         fontFamily: 'system-ui, -apple-system, sans-serif',
  //                         transition: 'all 0.2s',
  //                       }}
  //                       onMouseEnter={(e) => {
  //                         e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
  //                       }}
  //                       onMouseLeave={(e) => {
  //                         e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
  //                       }}
  //                     >
  //                       Decline
  //                     </button>
  //                   </div>
  //                 </div>
  //               ))
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
export default Friendlist;