
import { useEffect, useState } from 'react';

function Friends() {
    localStorage.setItem('page', 'FRIENDS');
    const [friends, setFriends] = useState<any[]>([]);
    const [newfriend, setnewFriends] = useState('');
    const [searchfriend, setsearchFriends] = useState('');
    const [datafriend, setdatafriend] = useState<any[]>([]);
    const [is_append, setappendfriend] = useState<any[]>([]);
    const accept_invitation = async (requestId: any) => {

        try {
            const accept = await fetch("https://localhost:3010/api/friends/accept", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId: requestId }),
                credentials: 'include'
            })
            if (accept.ok) {
                const acc = await accept.json();
                console.log(" append fe accept is result is  _____>>", acc);
                setappendfriend((prev) => prev.filter((item) => item.request_id !== requestId));
                alert("Friend accepted! 🎉");
            }
            else {
                console.log("error a khoyii f accpt", accept);
            }
        }
        catch (err) {
            console.log("catsh erro in accepet ")
        }
        fetchFriends();
    }

    const appending_f = async () => {
        try {
            const app = await fetch("https://localhost:3010/api/friends/requests", {
                method: 'GET',
                credentials: 'include',
            })
            if (app.ok) {
                const append = await app.json();
                setappendfriend(append.incoming);
                console.log(" append result is  _____>>", append);
            }
            else {
                console.log("error a khoyii ", app);
            }
        }
        catch (err) {
            console.log("catch errrrorr in append ");
        }
    }
    const serch = async (searchfriend: any) => {
        try {
            const ser = await fetch(`https://localhost:3010/api/users/search/${searchfriend}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (ser.ok) {
                const serc = await ser.json();
                setdatafriend(serc.users);
            }
            else {
                console.log("error a khoyii ", ser);
            }
        }
        catch (err) {
            console.log("catsh eroror ");
        }
        console.log("data dyl friend issssssss ", datafriend);
        console.log("data dyl frien issssssss ", newfriend);

        // check_is_friend(searchfriend);
    }

    const fetchFriends = async () => {


        try {
            const response = await fetch('https://localhost:3010/api/friends', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Success! Friends data:", data);
                setFriends(data.friends);
                ;
            } else {
                console.log("Server error:", response.status);
            }
        } catch (error) {
            console.log("Network error (is the backend running?):", error);
        }
    };
    const addnewfriend = async (new_f : any) => {
        try {
            const response = await fetch('https://localhost:3010/api/friends/invitation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendUsername: new_f}),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(" add Success! Friends data:", data);

                setnewFriends("");
                fetchFriends();
                ;
            } else {
                const data = await response.json();

                console.log("feild to adddd ", data, searchfriend)
                alert("field to add  ");
            }
        } catch (error) {
            console.log("Network error (is the backend running?):", error);
        }
    };
    useEffect(() => {
        fetchFriends();
        appending_f();
    }, []);

    const handleRemoveFriend = async (id: number) => {
        try {
            console.log(" id liwsal is ", id);
            const del = await fetch('https://localhost:3010/api/friends/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId: id }),
                credentials: 'include'
            });
            if (del.ok) {
                console.log("sucess remodeddddddddd");
                appending_f();
                fetchFriends();
            }
        }
        catch (err) {
            console.log("error removedddddddddddd");

        }
    };
    console.log("firend isssssss herrrrrrrrr ", datafriend);


    console.log("incoming isssssssssss ", is_append);
    return (
        <div className="flex  w-full h-full gap-[40px] mt-[80px] ">
            <div>
                <div className=" flex flex-col w-[500px] h-fitt bg-[#ffff]">
                    <h2 className="text-[#ff99ff] text-[19px]">My Friends ({friends.length})</h2>
                    {friends.length === 0 ? (
                        <div className="flex flex-col items-center justify-center opacity-30 mt-10">
                            <p className=" text-[#ff99ff] ">No friends yet. Start adding some!</p>
                            <p className="w-[20px] h-[20px]">🎮</p>
                        </div>
                    ) :

                        friends.map((f) => (
                            <div className="flex  gap-[40px]  ">
                                <div className="flex w-full flex-row items-center justify-between gap-[40px] mt-[10px]">
                                    <div className="flex flex-row gap-[20px]">
                                        <img src={`${f.avatarUrl}   `} alt="avatar"
                                            className=" w-[60px] h-[60px] rounded-full" ></img>
                                        <div className="flex flex-col w-[100px] h-[50px] mt-[20px] ">
                                            <p className="flex text-[#ff99ff] font-extrabold  text-[16px] font-bold  m-[0px] p-[0px] " style={{ fontWeight: 900 }}> {f.username}</p>
                                            <p className="flex text-[#ff99ff] text-[16px] font-medium italic m-[0px] p-[0px] leading-none ">on ligne</p>

                                        </div>

                                    </div>
                                    <button className=" items-center justify-center  flex h-[30px] w-[80px] " onClick={() => handleRemoveFriend(f.id)}>remove</button>

                                </div>
                            </div>

                        ))
                    }
                </div>

            </div>
            <div className=" w-[700px] h-fit gap-[20px]  grid dgrid-cols-2 gap-[80px] ">


                <div className="flex flex-col  w-[700px] h-fit bg-[#ffffff] ">
                    <div className="flex justify-center ">

                        <h2 className="text-[#ff99ff] mb-[50px]">Add Friend</h2>
                    </div>

                    <div className="flex flex-col gap-[10px] w-[600px] h-fit   border border-[#ff99ff] ">
                        <div className="flex flex-row gap-[10px]   ">
                            <input
                                type="text" placeholder="Enter friend ..." value={searchfriend} onChange={(e) => setsearchFriends(e.target.value)}
                                className="w-[300px] h-[40px] bg-black/20 border border-white/10 rounded-full  text-white outline-none focus:border-[#ff99ff] transition-all"
                            />
                            <button
                                onClick={() => serch(searchfriend)}
                                className="flex w-fit  items-center h-[40px]   rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white  uppercase  transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
                        " >
                                serch Friend
                            </button>

                        </div>
                        <div className="flex ">
                            {datafriend && datafriend.length > 0 ? (
                                
                                <div className="flex flex-col gap-[4px] w-full ">
                                    {datafriend.map((user) => (
                                        <div key={user.id} className="flex flex-row justify-between items-center border border-[#ff99ff] p-[2px] rounded-lg bg-[#1a1a1a]">

                                           
                                            <div className="flex items-center gap-[10px]">
                                                <img
                                                    className="w-[50px] h-[50px] rounded-full object-cover border border-[#ff99ff]"
                                                    src={user.avatar_url || '/default-avatar.png'}
                                                    alt={user.username}
                                                />
                                                <p className="text-[#ff99ff] font-medium">{user.username}</p>
                                            </div>
                                            <div className="flex">
                                                {!user.is_friend ? (
                                                    <button
                                                        onClick={() => addnewfriend(user.username)}
                                                        className="flex items-center justify-center w-[120px] h-[35px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white uppercase text-xs font-bold transition-all hover:scale-105"
                                                    >
                                                        Add
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRemoveFriend(user.id)}
                                                        className="flex items-center justify-center w-[120px] h-[35px] rounded-full border border-[#ff99ff] text-[#ff99ff] uppercase text-xs font-bold hover:bg-[#ff99ff] hover:text-black transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500">No users found</div>
                            )}

                        </div>
                    </div>
                </div>
                <div className="w-[700px] h-fit border-[2px] border-[#ff99ff] text-[#ff99ff] p-4">
                    <h2 className="mb-[4px]  text-xl">Friend Requests</h2>

                    <div className="flex flex-col gap-[20px]">
                        {is_append.length === 0 ? (
                            <div className="text-gray-400 text-center">No pending invitations</div>
                        ) : (

                            is_append.map((f) => (
                                <div key={f.request_id} className=" mt-[20px] flex w-full flex-row items-center justify-between gap-[40px] bg-[#2a2a2a]  rounded-full">


                                    <div className="flex items-center gap-[4px]">
                                        <img
                                            src={f.avatarUrl || '/default-avatar.png'}
                                            alt="avatar"
                                            className="w-[50px] h-[50px] rounded-full object-cover border border-[#ff99ff]"
                                        />
                                        <span className="text-white font-semibold">{f.username}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => accept_invitation(f.request_id)} className="bg-[#ff99ff] text-black px-[4px] py-[1px] rounded-md font-bold hover:bg-white transition-all">
                                            Accept
                                        </button>
                                        <button onClick={() => handleRemoveFriend(f.user_id)} className="border border-red-500 text-red-500 px-[4px] py-[1px] rounded-md hover:bg-red-500 hover:text-white transition-all">
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Friends;
