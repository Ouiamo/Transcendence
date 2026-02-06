import { useEffect, useState } from 'react';
import { Trophy, Award, Medal } from 'lucide-react';

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
    console.log("users in leaderboard ------------", users);
    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await fetch('https://localhost:3010/api/ranking', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("data is ", data);
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
        if (rank === 1) return <Trophy className="w-[20px] h-[20px] rgb(234, 179, 8)" />;
        if (rank === 2) return <Award className="w-[20px] h-[20px] text-gray-400" />;
        if (rank === 3) return <Medal className="w-[20px] h-[20px] text-orange-500" />;
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

    const getInitials = (username: string) => {
        const words = username.trim().split(/\s+/);
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return username.slice(0, 2).toUpperCase();
    };

    const getCircleStyle = (rank: number) => {
        if (rank === 1) return { 
            background: 'linear-gradient(to bottom right, rgb(219, 182, 61), rgb(153, 120, 15))',
            color: 'rgb(255, 255, 255)',
            size: '100px',
            fontSize: '36px',
            shadow: '0 0 80px rgba(168, 85, 247, 0.8)'
        };
        if (rank === 2) return { 
            background: 'linear-gradient(to bottom right, rgb(156, 163, 175), rgb(75, 85, 99))',
            color: 'rgb(255, 255, 255)',
            size: '100px',
            fontSize: '36px',
            shadow: '0 0 50px rgba(156, 163, 175, 0.5)'
        };
        if (rank === 3) return { 
            background: 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(194, 65, 12))',
            color: 'rgb(255, 255, 255)',
            size: '100px',
            fontSize: '36px',
            shadow: '0 0 50px rgba(249, 115, 22, 0.5)'
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
        <div className="min-h-screen w-full bg-[#06060d] text-white py-[48px] px-[24px]">
            <div className="max-w-[1152px] mx-auto space-y-[48px]">
                
                <div className="text-center space-y-[16px]">
                    <h1 className="text-[84px] font-extrabold tracking-wider" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                        Leaderboard
                    </h1>
                    <p className="text-[18px] text-blue-300 tracking-widest uppercase">
                        Top players ranked by total wi4
                    </p>
                </div>

                
                {users && users.length >= 3 && (
                    <div className="relative">
                        
                        <div className="flex items-end justify-center gap-[100px] mb-[4px]">

                            {[1, 0, 2].map((index) => {
                                const player = users[index];
                                const rank = index + 1;
                                const circleStyle = getCircleStyle(rank);
                                
                                return (
                                    <div key={player.user_id} className={`flex flex-col items-center ${rank === 1 ? 'mb-[10px]' : ''}`}>
                                        
                                        <div 
                                            className="rounded-full flex items-center justify-center font-extrabold relative"
                                            style={{ 
                                                width: circleStyle.size,
                                                height: circleStyle.size,
                                                background: circleStyle.background,
                                                color: circleStyle.color,
                                                fontSize: circleStyle.fontSize,
                                                boxShadow: circleStyle.shadow
                                            }}
                                        >
                                            <span>{getInitials(player.username)} </span>
                                        </div>
                                        
                                        
                                        <p className="mt-[24px] text-[20px] font-bold tracking-wide" style={{ color: 'rgb(255, 255, 255)' }}>{player.username}</p>
                                        <p className="text-[16px] mt-[8px]" style={{ color: 'rgb(156, 163, 175)' }}>{player.wins} wins</p>
                                    </div>
                                );
                            })}
                        </div>

                       
                        <div className="flex items-end justify-center gap-[10px]">
                            {[1, 0, 2].map((index) => {
                                const rank = index + 1;
                                const podiumStyle = getPodiumStyle(rank);
                                
                                return (
                                    <div 
                                        key={`podium-${rank}`}
                                        className={`${podiumStyle.order} w-[200px] border-2 rounded-t-xl flex flex-col items-center justify-center`}
                                        style={{
                                            height: podiumStyle.height,
                                            background: podiumStyle.background,
                                            borderColor: podiumStyle.borderColor
                                        }}
                                    >
                                        <span className="text-[84px] font-extrabold" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>{rank}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                
                <div className="mt-[50px] max-w-[800px] mx-auto bg-[#0a0a14] rounded-[16px] border border-gray-700/50 overflow-hidden shadow-2xl">
                    
                    <div className="grid grid-cols-4 gap-[24px] px-[48px] py-[20px] border-b border-gray-700/50 bg-[#08080f]">
                        <div className="text-[14px] font-bold text-gray-400 tracking-widest uppercase">RANK</div>
                        <div className="text-[14px] font-bold text-gray-400 tracking-widest uppercase">PLAYER</div>
                        <div className="text-[14px] font-bold text-gray-400 tracking-widest uppercase text-center">WINS</div>
                        <div className="text-[14px] font-bold text-gray-400 tracking-widest uppercase text-center">WIN RATE</div>
                    </div>
                    
                   
                    <div className="divide-y divide-gray-800/50">
                        {users && users.map((player, index) => {
                            const rank = index + 1;
                            return (
                                <div
                                    key={player.user_id}
                                    className="grid grid-cols-4 gap-[24px] px-[48px] py-[20px] hover:bg-[#b572b1] transition-colors"
                                >
                                    
                                    <div className="flex items-center gap-[16px]">
                                        {getRankIcon(rank)}
                                        <span className="ml-[10px] text-[18px] font-semibold text-white">{rank}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center gap-[10px]">
                                        <div 
                                            className="w-[48px] h-[30px] rounded-full flex items-center justify-center font-bold text-[16px]"
                                            style={{
                                                background: rank === 1 ? ' rgb(168, 85, 247)' :
                                                           rank === 2 ? 'linear-gradient(to bottom right, rgb(236, 72, 153), rgb(190, 24, 93))' :
                                                           rank === 3 ? 'linear-gradient(to bottom right, rgb(244, 114, 182), rgb(219, 39, 119))' :
                                                           'rgb(55, 65, 81)',
                                                color: rank <= 3 ? 'rgb(255, 255, 255)' : 'rgb(209, 213, 219)'
                                            }}
                                        >
                                            {getInitials(player.username)}
                                        </div>
                                        <span className="text-[18px] font-semibold text-white">{player.username}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center justify-center">
                                        <span className="text-[18px] font-bold text-white">{player.wins}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center justify-center">
                                        <span className="text-[18px] font-bold text-white">{player.win_rate}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
