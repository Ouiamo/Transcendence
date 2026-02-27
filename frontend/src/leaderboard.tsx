import { useEffect, useState } from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import { API_URL } from "./Api.tsx";

interface User {
  user_id: number;
  username: string;
  avatar_url: string;
  points: number;
  wins: number;
  loss: number;
  win_rate: number;
}

export function Leaderboard() {
  const [users, setRanking] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ranking`, {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setRanking(data);
        }
      } catch (err) {
        setError("Failed to load leaderboard");
        console.error('Failed to load users ranking', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className=" text-[#FFD700] w-[35px] h-[35px] rgb(234, 179, 8)" />;
    if (rank === 2) return <Award className=" text-[#C0C0C0]/80 w-[35px] h-[35px] text-gray-400" />;
    if (rank === 3) return <Medal className="text-[#CD7F32]/80 w-[35px] h-[35px] text-orange-500" />;
    return null;
  };

  const getPodiumStyle = (rank: number) => {
    if (rank === 1) return {
      background: 'linear-gradient(to top, rgba(113, 63, 18, 0.4), rgba(133, 77, 14, 0.2))',
      borderColor: 'rgb(202, 138, 4)',
      height: '150px',
      order: 'order-2'
    };
    if (rank === 2) return {
      background: 'linear-gradient(to top, rgba(31, 41, 55, 0.4), rgba(55, 65, 81, 0.2))',
      borderColor: 'rgb(75, 85, 99)',
      height: '130px',
      order: 'order-1'
    };
    if (rank === 3) return {
      background: 'linear-gradient(to top, rgba(124, 45, 18, 0.4), rgba(154, 52, 18, 0.2))',
      borderColor: 'rgb(234, 88, 12)',
      height: '100px',
      order: 'order-3'
    };
    return { background: '', borderColor: '', height: '', order: '' };
  };

  const getCircleStyle = (rank: number) => {
    if (rank === 1) return {
      background: 'linear-gradient(to bottom right, rgb(219, 182, 61), rgb(153, 120, 15))',
      color: 'rgb(255, 255, 255)',
      size: '100px',
      fontSize: '36px',

    };
    if (rank === 2) return {
      background: 'linear-gradient(to bottom right, rgb(156, 163, 175), rgb(75, 85, 99))',
      color: 'rgb(255, 255, 255)',
      size: '100px',
      fontSize: '36px',

    };
    if (rank === 3) return {
      background: 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(194, 65, 12))',
      color: 'rgb(255, 255, 255)',
      size: '100px',
      fontSize: '36px',

    };
    return { background: '', color: '', size: '', fontSize: '', shadow: '' };
  };

  if (loading) return (
    <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
      <div className="text-white text-[20px] tracking-widest">LOADING...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
      <div className="text-red-500 text-[20px] tracking-widest">ERROR: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0d0221] via-[#1a043a] to-[#0d0221] text-white">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2 md:space-y-[3px]">
          <h1 className=" md:text-6xl font-black tracking-wider uppercase glow-text">
            Leaderboard
          </h1>
          <p className=" md:text-sm text-[#8F929E] tracking-widest uppercase">
            Top players ranked by total points
          </p>
        </div>

        {/* PODIUM */}
        {users && users.length >= 3 && (
          <div className="relative">

            <div className="flex items-end justify-center gap-[6px] md:gap-[45px] mb-[2px]">

              {[1, 0, 2].map((index) => {
                const player = users[index];
                const rank = index + 1;
                const circleStyle = getCircleStyle(rank);

                return (
                  <div key={player.user_id}
                    className={`flex flex-col items-center gap-[10px] ${rank === 1 ? 'mb-[2px]' : ''}`}>

                    <div
                      className="rounded-full flex items-center justify-center font-extrabold relative border border-[#c44cff]/30 shadow-[0_0_20px_rgba(196,76,255,0.4)]"
                      style={{
                        width: window.innerWidth < 640 ? "80px" : circleStyle.size,
                        height: window.innerWidth < 640 ? "80px" : circleStyle.size,
                        background: circleStyle.background,
                        color: circleStyle.color,
                        fontSize: circleStyle.fontSize,
                      }}
                    >
                      <img
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        src={player.avatar_url}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <p className="mt-[3px] text-sm md:text-lg font-bold text-white">
                      {player.username}
                    </p>

                    <p className="text-xs md:text-sm text-[#8F929E]">
                      {player.points} points
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-end justify-center gap-[20px] md:gap-[4px]">
              {[1, 0, 2].map((index) => {
                const rank = index + 1;
                const podiumStyle = getPodiumStyle(rank);

                return (
                  <div
                    key={`podium-${rank}`}
                    className={`${podiumStyle.order} w-[150px] sm:w-[150px] md:w-[200px] border rounded-t-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(196,76,255,0.3)]`}
                    style={{
                      height: podiumStyle.height,
                      background: podiumStyle.background,
                      borderColor: podiumStyle.borderColor
                    }}
                  >
                    <span className="text-3xl md:text-6xl font-extrabold text-white/20">
                      {rank}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="flex p-[20px] w-full ">
          <div className="mt-[40px] md:mt-[10px]  mx-auto  
          bg-gradient-to-br from-[#120d1d]/70 via-[#0b0618]/80 to-[#120d1d]/70
          rounded-2xl border-[2px] border-[#c44cff]/60 overflow-hidden shadow-[0_0_30px_rgba(196,76,255,0.15)]">

            {/* HEADER */}
            <div className="grid grid-cols-4 gap-[4px] md:gap-6 px-[12px] md:px-[10px] py-[13px] md:py-[4px] border-b-[2px] border-[#c44cff]/60 bg-[#0b0618]/60">
              <div className="text-[15px] md:text-xs font-bold text-[#8F929E] tracking-widest">RANK</div>
              <div className="text-[15px] md:text-xs font-bold text-[#8F929E] tracking-widest">PLAYER</div>
              <div className="text-[15px] md:text-xs font-bold text-[#8F929E] tracking-widest text-center">POINTS</div>
              <div className="text-[15px] md:text-xs font-bold text-[#8F929E] tracking-widest text-center">WIN RATE</div>
            </div>

            {/* ROWS */}
            <div className="divide-y-[8px] divide-[#c44cff]/10">
              {users && users.map((player, index) => {
                const rank = index + 1;

                return (
                  <div
                    key={player.user_id}
                    className="grid grid-cols-4 gap-[12px] md:gap-6 px-4 md:px-10 p-[12px] md:py-[4px] 
                         hover:bg-[#c44cff]/10 transition-colors"
                  >

                    {/* RANK */}
                    <div className="flex items-center gap-[4px] md:gap-[3px]">
                      {getRankIcon(rank)}
                      <span className="text-sm md:text-base font-semibold text-white">
                        {rank}
                      </span>
                    </div>

                    {/* PLAYER */}
                    <div className="flex items-center gap-[8px] md:gap-[3px]">
                      <div className="w-[40px] md:w-[40px] h-[40px] md:h-[40px] rounded-full overflow-hidden border border-[#c44cff]/20">
                        <img
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          src={player.avatar_url}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-sm md:text-base font-semibold text-white truncate">
                        {player.username}
                      </span>
                    </div>

                    {/* POINTS */}
                    <div className="flex items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-white">
                        {player.points}
                      </span>
                    </div>

                    {/* WIN RATE */}
                    <div className="flex items-center justify-center">
                      <span className="text-sm md:text-base font-bold text-white">
                        {player.win_rate}%
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );

}

export default Leaderboard;