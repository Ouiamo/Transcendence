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
          setFriends(data.friends);
        }
      } catch (err) {
        setError("erroooor");
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
    friends.forEach(friend => {
      if (OnlineUsers.has(friend.id)) {
        onlineStatus.set(friend.id, 'Online');
      } else {
        onlineStatus.set(friend.id, 'Offline');
      }
    });

    setIsOnline(onlineStatus);
  };

  useEffect(() => {
    onOnlineUsersChange(() => {
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

  const acceptGameInvitation = async (invitationId: number) => {
    try {
      const res = await fetch('/api/game/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
        credentials: 'include',
      });

      if (res.ok) {
        await res.json();
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
                  onClick={() => acceptGameInvitation(inv.invitation_id)}
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
}
export default Friendlist;