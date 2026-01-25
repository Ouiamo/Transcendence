import { useEffect, useState } from 'react';
import {getSocket} from '../../game/frontend/remoteGame'

interface Friend {
  id: number;
  username: string;
  avatarUrl?: string;
  online?: boolean;
}

export function Friendlist() {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch('https://localhost:3010/api/friends', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok){
          const data = await res.json();
          console.log("data is ", data);
          setFriends(data.friends)
        };
      } catch (err) {
        setError("errooooooooor");
        console.error('Failed to load friends', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  if (loading) return <div className="p-4">Loading friends…</div>;
  if (error) return <div className="p-4 text-red-400">Errorrrrrrr: {error}</div>;


  function inviteHandler(idFriend:number , username: string) {
    const socket = getSocket() ;
    console.log('INVITEEEEEEEEEE');
    console.log(idFriend);
    console.log(username);

    alert("Invation is send to "+ username);
    // 
    socket?.emit("inviting", {idFriend, username});

  //  socket?.on("invitation_received", (data) => {
  //   console.log("Invitation received:", data);
  //   alert(`Game invitation from ${data.fromUsername}`);
  // });

  }

  return (
    <div className="p-4 w-72">
      <div className="bg-[#6F1065] rounded-2xl p-4 border w-[600px] border-[#ff44ff] ">
        <h3 className="ml-[20px] text-white font-semibold mb-3">Friends</h3>
        {friends && friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                  {/* {f.avatarUrl ? ( */}
                    {/* // eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${f.avatarUrl}`} className="shrink-img"/>
                  {/* ) : (
                    <div className="mt-[10px]">{f.username}</div>
                 )} */}
                 </div>
                <div className="flex-1">
                   <div className="mt-[45px] ml-[20px] text-sm text-white">{f.username}</div>
                   {/* <div className="text-xs text-gray-400">{f.online ? 'Online' : 'Offline'}</div> */}
                <button className="mt-[15px] ml-[20px] w-[150px] h-[30px] py-3 px-6  rounded-full bg-[#F96FEB] text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 outline-none border-none shadow-[0_0_15px_rgba(255,68,255,0.4)] hover:shadow-[0_0_25px_rgba(255,68,255,0.7)] hover:scale-[1.02] active:scale-[0.98] " onClick={() => inviteHandler(f.id, f.username)} >Invite to play</button>
                </div>
                <div className={`w-3 h-3 rounded-full ${f.online ? 'bg-green-400' : 'bg-gray-600'}`} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-400">No friends yet.</div>
        )}
      </div>
    </div>
  );
}

export default Friendlist;
