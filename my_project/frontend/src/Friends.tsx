import React from "react";
// 
import { use, useEffect, useState } from 'react';

function Friends() {
    localStorage.setItem('page', 'FRIENDS');
    const [friends, setFriends] = useState<any[]>([]);
    const [newfriend, setnewFriends] = useState('');


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
    const addnewfriend = async () => {
        try {
            const response = await fetch('https://localhost:3010/api/friends/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendUsername: newfriend }),
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
        //addnewfriend();
    }, []);
    const handleRemoveFriend = async (id: number) => {
        try {

            const del = await fetch('https://localhost:3010/api/friends/remove', {
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

console.log(" avatr fried isssssssssss** ", friends);
    return (
        <div className="flex flex-row  w-full h-full gap-[40px] mt-[80px] ">
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
            <div className="flex flex-col justify-center items-center w-[400px] h-fit bg-[#ffffff] rounded-3xl  border border-white/5">
                <h2 className="text-[#ff99ff] ">Add Friend</h2>

                <div className="flex flex-col gap-[10px] w-[300px] h-[40px]  items-center justify-center  h-fitt border border-[#ff99ff] ">
                    <input
                        type="text" placeholder="Enter username..." value={newfriend} onChange={(e) => setnewFriends(e.target.value)}
                        className="w-[200px] bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#ff99ff] transition-all"
                    />

                    <button
                        onClick={addnewfriend}
                        className="flex w-[200px]   h-[40px] mt-[10px]  rounded-full bg-gradient-to-r from-[#ff44ff] to-[#ff99ff]   text-white  uppercase  transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98]
    "
                    >
                        Add Friend
                    </button>
                </div>
            </div>
            hiiiiii
        </div>
    )
}

export default Friends;