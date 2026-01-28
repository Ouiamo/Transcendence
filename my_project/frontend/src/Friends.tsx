// import React from "react";
// 
import {  useEffect, useState } from 'react';

function Friends() {
    localStorage.setItem('page', 'FRIENDS');
    const [friends, setFriends] = useState<any[]>([]);
    const [newfriend, setnewFriends] = useState('');
    const [searchfriend, setsearchFriends] = useState('');
    const [datafriend, setdatafriend] = useState<any[] | null>(null);
    const [is_friend, setisfriend] = useState(false);

    const serch = async (searchfriend: any) => {
        try {
            const ser = await fetch(`https://localhost:3010/api/users/search/${searchfriend}`, { // kant backend
                method: 'GET',
                credentials: 'include',
            });
            if (ser.ok) {
                const serc = await ser.json();
                setdatafriend(serc.users);
                if (serc.users && serc.users.length > 0) {
                    const check = await fetch(`https://localhost:3010/api/friends/check_friendship/${searchfriend}`, { //kant backend
                        method: 'GET', 
                        credentials: 'include',
                    });
                    
                    if (check.ok) {
                        const checkResult = await check.json();
                        setisfriend(checkResult.areFriends);
                        console.log("Status with this user********:", checkResult.areFriends);
                    }
                    const friendId = serc.users[0].id; 
                console.log("The ID of the user is:", friendId);
                }
                else {
                    console.log("error a khoyii ", ser);
                }
            }
        }
        catch (err) {
            console.log("catsh eroror ");
        }
        console.log("data dyl frien issssssss ", datafriend);
        console.log("data dyl frien issssssss ", newfriend);

        // check_is_friend(searchfriend);
    }

    const fetchFriends = async () => {


        try {
            const response = await fetch('https://localhost:3010/api/friends', { // kant backend
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
    const addnewfriend = async () => {
        try {
            const response = await fetch('https://localhost:3010/api/friends/add', { //kant backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendUsername: searchfriend }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(" add Success! Friends data:", data);
                setnewFriends("");
                fetchFriends();
                ;
            } else {
                alert("field to add  ");
            }
        } catch (error) {
            console.log("Network error (is the backend running?):", error);
        }
    };
    useEffect(() => {
        fetchFriends();
    }, []);

    const handleRemoveFriend = async (id: number) => {
        try {

            const del = await fetch('https://localhost:3010/api/friends/remove', { //kant backend
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId: id }),
                credentials: 'include'
            });
            if (del.ok) {
                alert("sucess remodeddddddddd");
            }
            fetchFriends();
        }
        catch (err) {
            console.log("error removedddddddddddd");

        }
    };
    console.log("firend isssssss herrrrrrrrr ", datafriend);


    // console.log(" avatr fried isssssssssss** ", friends);
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
            <div className="flex   w-[700px] h-fit ">


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
                            {
                                datafriend && datafriend.length > 0 ?
                                    (
                                        
                                        <div className=" flex-1 flex flex-row  justify-between  border border-[#ff99ff]">
                                            <div className="flex  gap-[10px]">
                                                <img className="flex w-[50px] h-[50px] rounded-full " src={`${datafriend?.[0]?.avatar_url}`}></img>
                                                <p className="flex text-[#ff99ff]">{datafriend?.[0]?.username}</p>
                                            </div>
                                            <div className=" flex ">
                                                {!is_friend ? (

                                                    <button
                                                        onClick={addnewfriend}
                                                        className="flex w-[200px]   h-[40px] mt-[10px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white  uppercase  transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
        "
                                                    >add</button>
                                                ) : (
                                                    <button
                                                        onClick={()=>handleRemoveFriend(datafriend[0].id)}
                                                        className="flex items-center justify-center w-[200px] h-[40px] mt-[10px] rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff] text-white uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:scale-[1.02]"
                                                    >
                                                        remov
                                                    </button>
                                                )}

                                            </div>

                                        </div>
                                    ) :
                                    datafriend && datafriend.length === 0 ? (
                                        <div className=" flex-1 flex  h-[50px] items-center">
                                            <div className="flex ">

                                                <span className="text-[#ff99ff] px-[20px]">user not found </span>
                                            </div>

                                        </div>

                                    ) : (

                                        null
                                    )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friends;
