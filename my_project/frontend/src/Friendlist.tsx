import { useEffect, useState } from 'react';
import { OnlineUsers, onOnlineUsersChange } from './socketService.tsx';
// import { MessageSquare, Gamepad2 } from 'lucide-react';

interface Friend {
  id: number;
  username: string;
  avatarUrl?: string;
  online?: boolean;
}

interface FriendlistProps {
  onGameStart?: () => void;
}

export function Friendlist({ onGameStart }: FriendlistProps) {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is_Online, setIsOnline] = useState<Map<number, string>>(new Map());
  const [gameInvitations, setGameInvitations] = useState<any[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch('https://localhost:3010/api/friends', {
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

    console.log("🔍 Checking online status for friends...");
    console.log("📊 Current OnlineUsers map:", Array.from(OnlineUsers.entries()));

    friends.forEach(friend => {
      if (OnlineUsers.has(friend.id)) {
        console.log(`✅ ${friend.username} (ID: ${friend.id}) is ONLINE`);
        onlineStatus.set(friend.id, 'Online');
      } else {
        console.log(`❌ ${friend.username} (ID: ${friend.id}) is OFFLINE`);
        onlineStatus.set(friend.id, 'Offline');
      }
    });

    setIsOnline(onlineStatus);
  };

  useEffect(() => {
    onOnlineUsersChange(() => {
      console.log("🔔 OnlineUsers changed! Updating UI...");
      updateOnlineStatus();
    });
  }, [friends]);

  useEffect(() => {
    updateOnlineStatus();
  }, [friends]);

  const fetchGameInvitations = async () => {
    try {
      const res = await fetch('https://localhost:3010/api/game/invitations', {
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
      const res = await fetch('https://localhost:3010/api/game/invitation', {
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
      const res = await fetch('https://localhost:3010/api/game/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
        credentials: 'include',
      });

      if (res.ok) {
        await res.json();
        console.log(`🎮 Game invitation accepted from ${senderUsername}`);

        setGameInvitations(prev => prev.filter(inv => inv.invitation_id !== invitationId));

        setTimeout(() => {
          console.log("🎮 Checking for private game room...");
          const privateRoom = localStorage.getItem('private_game_room');
          console.log("🎮 Private room found:", privateRoom);

          if (onGameStart) {
            console.log("🎮 Calling onGameStart callback");
            onGameStart();
          }
        }, 1000);

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
      const res = await fetch(`https://localhost:3010/api/game/invitation/${invitationId}`, {
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
    <div style={{
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 1)',
          marginBottom: '4px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          Friends
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(156, 163, 175, 1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {friends ? friends.filter((f) => is_Online.get(f.id) === 'Online').length : 0} friends online
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
      }}>
        {/* Friends List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          alignContent: 'start',
        }}>
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  {/* Avatar with status ring */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 1) 0%, rgba(139, 92, 246, 1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'rgba(255, 255, 255, 1)',
                      border: is_Online.get(friend.id) === 'Online' ? '2px solid rgba(34, 197, 94, 1)' : 'none',
                    }}>
                      {friend.avatarUrl ? (
                        <img
                          src={friend.avatarUrl}
                          alt={friend.username}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        getInitials(friend.username)
                      )}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(is_Online.get(friend.id) || 'Offline'),
                      border: '2px solid rgba(15, 23, 42, 1)',
                    }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 1)',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}>
                      {friend.username}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: getStatusColor(is_Online.get(friend.id) || 'Offline'),
                      margin: 0,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}>
                      {is_Online.get(friend.id) === 'Online' ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    {is_Online.get(friend.id) === 'Online' && (
                      <button
                        onClick={() => sendGameInvitation(friend.username)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'rgba(236, 72, 153, 0.2)',
                          border: 'none',
                          color: 'rgba(236, 72, 153, 1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(236, 72, 153, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                        }}
                      >
                        Invite
                        {/* < style={{ width: '16px', height: '16px' }} /> */}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              padding: '32px',
              textAlign: 'center',
              color: 'rgba(156, 163, 175, 1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              No friends yet.
            </div>
          )}
        </div>

        {/* Pending Requests Panel */}
        <div>
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 1)',
              marginBottom: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              Game Requests
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {gameInvitations.length === 0 ? (
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(156, 163, 175, 1)',
                  textAlign: 'center',
                  margin: 0,
                  padding: '16px 0',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  No pending game invitations
                </p>
              ) : (
                gameInvitations.map((invitation) => (
                  <div
                    key={invitation.invitation_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 1) 0%, rgba(139, 92, 246, 1) 100%)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: 'rgba(255, 255, 255, 1)',
                      }}>
                        {invitation.avatarUrl ? (
                          <img
                            src={invitation.avatarUrl}
                            alt={invitation.sender_username}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          getInitials(invitation.sender_username)
                        )}
                      </div>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 1)',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}>
                        {invitation.sender_username}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => acceptGameInvitation(invitation.invitation_id, invitation.sender_username)}
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: 'rgba(34, 197, 94, 1)',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineGameInvitation(invitation.invitation_id)}
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: 'rgba(239, 68, 68, 1)',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friendlist;