import { useEffect, useState } from 'react';
import { OnlineUsers, onOnlineUsersChange } from './socketService.tsx';
import { API_URL } from "./Api.tsx";

function Friends() {
    localStorage.setItem('page', 'FRIENDS');
    const [friends, setFriends] = useState<any[]>([]);
    const [searchfriend, setsearchFriends] = useState('');
    const [datafriend, setdatafriend] = useState<any[]>([]);
    const [is_append, setappendfriend] = useState<any[]>([]);
    const [is_Online, setIsOnline] = useState<Map<number, string>>(new Map());
    const [searchLoading, setSearchLoading] = useState(false);

    const updateOnlineStatus = () => {
        if (friends.length === 0) return;

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

    const accept_invitation = async (requestId: any) => {
        try {
            const accept = await fetch(`${API_URL}/api/friends/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: requestId }),
                credentials: 'include'
            });
            if (accept.ok) {
                // const acc = await accept.json();
                setappendfriend((prev) => prev.filter((item) => item.request_id !== requestId));
                alert("Friend accepted! 🎉");
                fetchFriends();
            } else {
                console.error("Error accepting friend:", accept.status);
            }
        } catch (err) {
            console.error("Catch error in accept:", err);
        }
    };

    const appending_f = async () => {
        try {
            const app = await fetch(`${API_URL}/api/friends/requests`, {
                method: 'GET',
                credentials: 'include',
            });
            if (app.ok) {
                const append = await app.json();
                setappendfriend(append.incoming);
            } else {
                console.error("Error fetching friend requests:", app.status);
            }
        } catch (err) {
            console.error("Catch error in appending_f:", err);
        }
    };

    const serch = async (searchText: string) => {
        if (!searchText.trim()) {
            setdatafriend([]);
            return;
        }

        setSearchLoading(true);
        console.log("🔍 Starting search for:", searchText);
        
        try {
            const response = await fetch(`${API_URL}/api/users/search/${encodeURIComponent(searchText)}`, {
                method: 'GET',
                credentials: 'include',
            });
            
            console.log("📡 Search response status:", response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log("✅ Search results:", result);
                setdatafriend(result.users || []);
            } else {
                const errorText = await response.text();
                console.error("❌ Search error:", errorText);
                setdatafriend([]);
                alert("Search failed. Please check console.");
            }
        } catch (err) {
            console.error("❌ Network error in search:", err);
            setdatafriend([]);
            alert("Network error. Is the backend running?");
        } finally {
            setSearchLoading(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await fetch(`${API_URL}/api/friends`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setFriends(data.friends || []);
            } else {
                console.error("Error fetching friends:", response.status);
            }
        } catch (error) {
            console.error("Network error fetching friends:", error);
        }
    };

    const addnewfriend = async (new_f: any) => {
        if (!new_f.trim()) {
            alert("Please enter a username");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/friends/invitation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendUsername: new_f }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setsearchFriends("");
                setdatafriend([]);
                fetchFriends();
                alert(data.message || "Friend invitation sent!");
            } else {
                const data = await response.json();
                alert(data.error || "Failed to add friend");
            }
        } catch (error) {
            console.error("Network error adding friend:", error);
            alert("Network error. Is the backend running?");
        }
    };

    useEffect(() => {
        fetchFriends();
        appending_f();
    }, []);

    const handleRemoveFriend = async (id: number) => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        
        try {
            const del = await fetch(`${API_URL}/api/friends/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId: id }),
                credentials: 'include'
            });
            if (del.ok) {
                console.log("Friend removed successfully");
                appending_f();
                fetchFriends();
            } else {
                console.error("Error removing friend:", del.status);
            }
        } catch (err) {
            console.error("Error in handleRemoveFriend:", err);
        }
    };

    // const handleKeyPress = (e: React.KeyboardEvent) => {
    //     if (e.key === 'Enter') {
    //         serch(searchfriend);
    //     }
    // };

        return (
        <div className=" bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221] p-[100px] overflow-auto">
            {/* Main Header */}
            <div className="flex items-center justify-between w-full mb-[40px]">
                <div className="flex flex-col">
                    <h1 className="text-[40px] font-[900]  glow-text">
                        Friends Hub
                    </h1>
                    <p className="text-[#ff99ff]/80 text-[14px]">Connect, play, and manage your gaming companions</p>
                </div>
                {/* <div className="flex items-center gap-[10px] bg-[#0d0221]/70 border border-[#ff44ff]/30 rounded-full px-[20px] py-[10px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-white text-[12px]">Live Status</span>
                </div> */}
            </div>

                <div className="lg:w-3/5 flex flex-col gap-[30px]">
                    {/* Search Section */}
                    <div className="flex flex-col w-full h-fit bg-[#0d0221]/80 border-[2px] border-[#ff44ff]/30 rounded-[30px] p-[25px] shadow-[0_0_30px_rgba(255,68,255,0.3)]">
                        <div className="flex items-center justify-between mb-[25px]">
                            <h2 className="text-[24px] font-[900] text-white">Add New Friend</h2>
                        </div>
                        <div className="flex  md:flex-row gap-[111px] mb-[25px]">
                            <div className="relative flex-1">
                                <input
                                spellCheck="false"
                                style={{ WebkitTextFillColor: 'white' }}
                                    type="text"
                                    placeholder="Enter username to search..."
                                    value={searchfriend}
                                    onChange={(e) => setsearchFriends(e.target.value)}
                                    className=" caret-[#ff44ff]  w-full h-[45px] bg-[#1a043a]/70 border-[2px] border-[#ff44ff]/40 rounded-full text-white px-[20px] pl-[45px] outline-none focus:border-[#ff44ff] focus:shadow-[0_0_15px_rgba(255,68,255,0.5)] transition-all duration-300 placeholder-[#ff99ff]/40"
                                />
                                <div className="absolute left-[15px] top-1/2 transform -translate-y-1/2 text-[#ff44ff] text-[18px]">🔍</div>
                            </div>
                            <button
                                onClick={() => serch(searchfriend)}
                                className="h-[45px] px-[30px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white font-bold text-[14px] uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] border-none outline-none"
                            >
                                Search
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="space-y-[10px] max-h-[300px] pr-[10px] custom-scrollbar">
                            {datafriend && datafriend.length > 0 ? (
                                datafriend.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between w-full p-[10px] rounded-[15px] bg-gradient-to-r from-[#1a043a]/60 to-[#0d0221]/60 border border-[#ff44ff]/30 hover:border-[#ff44ff]/60 transition-all duration-300 shadow-[0_0_30px_rgba(255,68,255,0.3)]" /*added the shadow*/>
                                        <div className="flex items-center gap-[15px]">
                                            <img
                                                className="w-[45px] h-[45px] rounded-full object-cover border-[2px] border-[#ff44ff]"
                                                src={user.avatar_url || '/default-avatar.png'}
                                                alt={user.username}
                                            />
                                            <div>
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-[12px] text-[#ff99ff]/80">
                                                    {user.is_friend ? 'Already Friends' : 'Not Connected'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-[10px]">
                                            {!user.is_friend ? (
                                                <button
                                                    onClick={() => addnewfriend(user.username)}
                                                    className=" border-none outline-none w-[110px] h-[40px] rounded-full bg-gradient-to-r from-[#09a043]/60 to-[#09ff00]/60 text-[#098000] font-bold text-[17px] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:scale-[1.05] active:scale-[0.95]"
                                                >
                                                    Add
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleRemoveFriend(user.id)}
                                                    className="w-[100px] h-[35px] rounded-full bg-gradient-to-r from-[#ff0000]/80 to-[#ff4444]/80 text-white font-bold text-[12px] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:scale-[1.05] active:scale-[0.95] border-none outline-none"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (searchfriend && (searchLoading || true)) ? (
                                <div className="flex flex-col items-center justify-center py-[30px]">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-[#1a043a] to-[#0d0221] flex items-center justify-center mb-[15px]">
                                        <span className="text-[30px]">😕</span>
                                    </div>
                                    <p className="text-[#ff99ff]/70">No users found</p>
                                    <p className="text-[12px] text-[#ff99ff]/40 mt-[5px]">Try a different username</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-[30px] text-[#ff99ff]/50">
                                    <p>Search for players to add as friends</p>
                                </div>
                            )}
                        </div>
                    </div>

            <div className="flex flex-col lg:flex-row w-full gap-[30px]">
                {/*My Friends List */}
                <div className="lg:w-2/5">
                    <div className="flex flex-col w-full h-fit bg-[#0d0221]/80 border-[2px] border-[#ff44ff]/30 rounded-[30px] p-[25px] shadow-[0_0_30px_rgba(255,68,255,0.3)]">
                        <div className="flex items-center justify-between mb-[25px]">
                            <h2 className="text-[24px] font-[900] text-white">My Friends</h2>
                            <div className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]">
                                <span className="text-white font-bold">{friends.length}</span>
                            </div>
                        </div>

                        {friends.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-[50px] opacity-70">
                                <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#ff44ff]/20 to-[#ff99ff]/20 flex items-center justify-center mb-[20px]">
                                    <span className="text-[40px]">👤</span>
                                </div>
                                <p className="text-[#ff99ff] text-center">No friends yet</p>
                                <p className="text-[12px] text-[#ff99ff]/60 mt-[5px]">Search for players to add as friends</p>
                            </div>
                        ) : (
                            <div className="space-y-[15px] max-h-[500px] pr-[20px] custom-scrollbar"/**here the side */>
                                {friends.map((f) => (
                                    <div 
                                        key={f.id}
                                        className="flex items-center justify-between w-full p-[10px] rounded-[20px] bg-gradient-to-r from-[#1a043a]/50 to-[#0d0221]/50 border border-[#ff44ff]/20 hover:border-[#ff44ff]/50 transition-all duration-300 shadow-[0_0_30px_rgba(255,68,255,0.3)]"
                                    >
                                        <div className="flex items-center gap-[15px]">
                                            <div className="relative">
                                                <div className={`absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full border-[2px] border-[#ffffff] ${is_Online.get(f.id) === 'Online' ? 'bg-[#00ff00]' : 'bg-[#505050]'}`} />
                                                <img
                                                    src={`${f.avatarUrl}`}
                                                    alt="avatar"
                                                    className="w-[55px] h-[55px] rounded-full border-[2px] border-[#ff44ff] object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-white font-bold text-[16px]">{f.username}</p>
                                                <p className="text-[12px] flex items-center gap-[5px]">
                                                    {is_Online.get(f.id) === 'Online' ? (
                                                        <>
                                                            <span className="w-[8px] h-[8px] rounded-full bg-green-500 animate-pulse"></span>
                                                            <span className="text-green-400">Online</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="w-[8px] h-[8px] rounded-full bg-gray-500"></span>
                                                            <span className="text-[#fffff]">Offline</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFriend(f.id)}
                                            className=" border-none outline-none w-[80px] h-[35px] rounded-full bg-gradient-to-r from-[#da043a]/60 to-[#da043a]/60 text-[#ac0000] font-bold text-[12px] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:scale-[1.05] active:scale-[0.95]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                    {/* Friend Requests Section */}
                    <div className="flex flex-col w-full h-fit bg-[#0d0221]/80 border-[2px] border-[#ff44ff]/30 rounded-[30px] p-[25px] shadow-[0_0_30px_rgba(255,68,255,0.3)]">
                        <div className="flex items-center justify-between mb-[25px]">
                            <h2 className="text-[24px] font-[900] text-white">Friend Requests</h2>
                            <div className="relative">
                                {is_append.length > 0 && (
                                    <div className="flex items-center justify-center w-[25px] h-[25px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]">
                                        {is_append.length}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-[15px] max-h-[500px] pr-[20px] custom-scrollbar">
                            {is_append.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-[40px]">
                                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-[#1a043a] to-[#0d0221] flex items-center justify-center mb-[15px] ">
                                        <span className="text-[30px]">📬</span>
                                    </div>
                                    <p className="text-[#ff99ff]/70">No pending invitations</p>
                                </div>
                            ) : (
                                is_append.map((f) => (
                                    <div
                                        key={f.request_id}
                                        className="flex items-center justify-between w-full p-[10px] rounded-[20px] bg-gradient-to-r from-[#1a043a]/50 to-[#0d0221]/50 border border-[#ff44ff]/20 hover:border-[#ff44ff]/50 transition-all duration-300 shadow-[0_0_30px_rgba(255,68,255,0.3)]">
                                        <div className="flex items-center gap-[15px] mb-[15px] md:mb-0">
                                            <img
                                                src={f.avatarUrl || '/default-avatar.png'}
                                                alt="avatar"
                                                className="w-[50px] h-[50px] rounded-full object-cover border-[2px] border-[#ff44ff]"
                                            />
                                            <div>
                                                <p className="font-bold text-white">{f.username}</p>
                                                <p className="text-[12px] text-[#ff99ff]/80">Wants to be your friend!</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-[10px]">
                                            <button
                                                onClick={() => accept_invitation(f.request_id)}
                                                className="w-[80px] h-[35px] rounded-full bg-gradient-to-r from-[#09a043]/60 to-[#09ff00]/60 text-[#098000] font-bold text-[13px] uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:scale-[1.05] active:scale-[0.95]"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFriend(f.user_id)}
                                                className="w-[80px] h-[35px] rounded-full border-[2px] bg-gradient-to-r from-[#da043a]/60 to-[#da043a]/60 text-[#ac0000] uppercase transition-all duration-300 hover:bg-[#ff4444] hover:text-white hover:shadow-[0_0_15px_rgba(255,68,68,0.5)] hover:scale-[1.05] active:scale-[0.95]"
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

export default Friends;