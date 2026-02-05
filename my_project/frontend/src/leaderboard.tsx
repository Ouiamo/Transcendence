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
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
        return null;
    };

    const getPodiumStyle = (rank: number) => {
        if (rank === 1) return { 
            background: 'linear-gradient(to top, rgba(113, 63, 18, 0.4), rgba(133, 77, 14, 0.2))', 
            borderColor: 'rgb(202, 138, 4)',
            height: 'h-[180px]',
            order: 'order-2'
        };
        if (rank === 2) return { 
            background: 'linear-gradient(to top, rgba(31, 41, 55, 0.4), rgba(55, 65, 81, 0.2))', 
            borderColor: 'rgb(75, 85, 99)',
            height: 'h-[140px]',
            order: 'order-1'
        };
        if (rank === 3) return { 
            background: 'linear-gradient(to top, rgba(124, 45, 18, 0.4), rgba(154, 52, 18, 0.2))', 
            borderColor: 'rgb(234, 88, 12)',
            height: 'h-[120px]',
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
            background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(126, 34, 206))',
            color: 'rgb(255, 255, 255)',
            size: 'w-40 h-40 text-5xl',
            shadow: '0 0 80px rgba(168, 85, 247, 0.8)'
        };
        if (rank === 2) return { 
            background: 'linear-gradient(to bottom right, rgb(156, 163, 175), rgb(75, 85, 99))',
            color: 'rgb(255, 255, 255)',
            size: 'w-32 h-32 text-4xl',
            shadow: '0 0 50px rgba(156, 163, 175, 0.5)'
        };
        if (rank === 3) return { 
            background: 'linear-gradient(to bottom right, rgb(249, 115, 22), rgb(194, 65, 12))',
            color: 'rgb(255, 255, 255)',
            size: 'w-32 h-32 text-4xl',
            shadow: '0 0 50px rgba(249, 115, 22, 0.5)'
        };
        return { background: '', color: '', size: '', shadow: '' };
    };

    if (loading) return (
        <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
            <div className="text-white text-xl tracking-widest">LOADING...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
            <div className="text-red-500 text-xl tracking-widest">ERROR: {error}</div>
        </div>
    );  

    return (
        <div className="min-h-screen w-full bg-[#06060d] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                
                <div className="text-center space-y-4">
                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-wider" style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                        Leaderboard
                    </h1>
                    <p className="text-base md:text-lg text-blue-300 tracking-widest uppercase">
                        Top players ranked by total wins
                    </p>
                </div>

                
                {users && users.length >= 3 && (
                    <div className="relative">
                        
                        <div className="flex items-end justify-center gap-16 mb-12">
                            {[1, 0, 2].map((index) => {
                                const player = users[index];
                                const rank = index + 1;
                                const circleStyle = getCircleStyle(rank);
                                
                                return (
                                    <div key={player.user_id} className={`flex flex-col items-center ${rank === 1 ? 'mb-12' : ''}`}>
                                        
                                        <div 
                                            className={`${circleStyle.size} rounded-full flex items-center justify-center font-extrabold relative`}
                                            style={{ 
                                                background: circleStyle.background,
                                                color: circleStyle.color,
                                                boxShadow: circleStyle.shadow
                                            }}
                                        >
                                            <span>{getInitials(player.username)}</span>
                                        </div>
                                        
                                        
                                        <p className="mt-6 text-xl font-bold tracking-wide" style={{ color: 'rgb(255, 255, 255)' }}>{player.username}</p>
                                        <p className="text-base mt-2" style={{ color: 'rgb(156, 163, 175)' }}>{player.wins} wins</p>
                                    </div>
                                );
                            })}
                        </div>

                       
                        <div className="flex items-end justify-center gap-8">
                            {[1, 0, 2].map((index) => {
                                const rank = index + 1;
                                const podiumStyle = getPodiumStyle(rank);
                                
                                return (
                                    <div 
                                        key={`podium-${rank}`}
                                        className={`${podiumStyle.order} w-[100px] ${podiumStyle.height} border-2 rounded-t-xl flex flex-col items-center justify-center`}
                                        style={{
                                            background: podiumStyle.background,
                                            borderColor: podiumStyle.borderColor
                                        }}
                                    >
                                        <span className="text-7xl font-extrabold" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>{rank}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                
                <div className="bg-[#0a0a14] rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
                    
                    <div className="grid grid-cols-4 gap-6 px-12 py-6 border-b border-gray-700/50 bg-[#08080f]">
                        <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">RANK</div>
                        <div className="text-sm font-bold text-gray-400 tracking-widest uppercase">PLAYER</div>
                        <div className="text-sm font-bold text-gray-400 tracking-widest uppercase text-center">WINS</div>
                        <div className="text-sm font-bold text-gray-400 tracking-widest uppercase text-center">WIN RATE</div>
                    </div>
                    
                   
                    <div className="divide-y divide-gray-800/50">
                        {users && users.map((player, index) => {
                            const rank = index + 1;
                            return (
                                <div
                                    key={player.user_id}
                                    className="grid grid-cols-4 gap-6 px-12 py-6 hover:bg-[#12121f] transition-colors"
                                >
                                    
                                    <div className="flex items-center gap-4">
                                        {getRankIcon(rank)}
                                        <span className="text-lg font-semibold text-white">{rank}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center gap-4">
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base"
                                            style={{
                                                background: rank === 1 ? 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(126, 34, 206))' :
                                                           rank === 2 ? 'linear-gradient(to bottom right, rgb(236, 72, 153), rgb(190, 24, 93))' :
                                                           rank === 3 ? 'linear-gradient(to bottom right, rgb(244, 114, 182), rgb(219, 39, 119))' :
                                                           'rgb(55, 65, 81)',
                                                color: rank <= 3 ? 'rgb(255, 255, 255)' : 'rgb(209, 213, 219)'
                                            }}
                                        >
                                            {getInitials(player.username)}
                                        </div>
                                        <span className="text-lg font-semibold text-white">{player.username}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center justify-center">
                                        <span className="text-lg font-bold text-white">{player.wins}</span>
                                    </div>
                                    
                                    
                                    <div className="flex items-center justify-center">
                                        <span className="text-lg font-bold text-white">{player.win_rate}%</span>
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
