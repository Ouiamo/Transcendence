import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

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

    const getRankStyle = (rank: number) => {
        if (rank === 1) return "border-[#d86bff] bg-[#d86bff]/10 text-[#d86bff]";
        if (rank === 2) return "border-[#c84cff]/70 bg-[#c84cff]/10 text-[#c84cff]";
        if (rank === 3) return "border-[#d86bff]/50 bg-[#d86bff]/10 text-[#d86bff]/80";
        return "border-[#d86bff]/30 bg-[#d86bff]/5 text-gray-400";
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6" style={{ color: '#d86bff' }} />;
        if (rank === 2) return <Trophy className="w-5 h-5" style={{ color: '#c84cff' }} />;
        if (rank === 3) return <Trophy className="w-5 h-5" style={{ color: '#d86bff' }} />;
        return null;
    };

    if (loading) return (
        <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
            <div className="text-[#d86bff] text-xl tracking-widest">LOADING...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen w-full bg-[#06060d] flex items-center justify-center">
            <div className="text-red-500 text-xl tracking-widest">ERROR: {error}</div>
        </div>
    );

    return (
        <div className="h-screen w-full bg-[#06060d] text-white p-6 overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-8">
               
                <div className="text-center">
                    <h1 className="pong-title text-[60px] font-extrabold  leading-none">
                        LEADERBOARD
                    </h1>
                    <p className="mt-4 text-sm tracking-widest uppercase text-gray-400">
                        Top Players
                    </p>
                </div>
                {users && users.length > 0 && (
                    <div className="grid grid-cols-3 gap-[35px] mt-12">
                        {users.slice(0, 3).map((player, index) => {
                            const rank = index + 1;
                            return (
                                <div
                                    key={player.user_id}
                                    className={`${
                                        index === 0
                                            ? "order-2 border-[#d86bff]"
                                            : index === 1
                                            ? "order-1 border-[#c84cff]/70"
                                            : "order-3 border-[#d86bff]/50 "
                                    } border rounded-xl p-6 bg-[#0a0a14]/80 backdrop-blur-sm hover:scale-105 transition-transform`}
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            {getRankIcon(rank)}
                                        </div>
                                        <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#d86bff] overflow-hidden ">
                                            {player.avatar_url ? (
                                                <img
                                                    src={player.avatar_url}
                                                    alt={player.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#d86bff]/20 flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-[#d86bff]">
                                                        {player.username.slice(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-xl text-white mt-4 mb-2 tracking-wide">
                                            {player.username}
                                        </h3>
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getRankStyle(rank)}`}>
                                                #{rank}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <p className="text-2xl font-bold text-[#d86bff]">{player.points}</p>
                                                <p className="text-gray-500 text-xs uppercase tracking-wider">Points</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#d86bff]">{player.wins}</p>
                                                <p className="text-gray-500 text-xs uppercase tracking-wider">Wins</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#d86bff]">{player.win_rate}%</p>
                                                <p className="text-gray-500 text-xs uppercase tracking-wider">Rate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="bg-[#0a0a14]/60 backdrop-blur-sm border border-[#d86bff]/30 rounded-xl mt-12">
                    <div className="p-6 border-b border-[#d86bff]/20">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-wider">
                            <Trophy className="w-6 h-6" style={{ color: '#d86bff' }} />
                            FULL RANKINGS
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {users && users.map((player, index) => {
                                const rank = index + 1;
                                return (
                                    <div
                                        key={player.user_id}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-all border ${
                                            rank <= 3
                                                ? "bg-[#d86bff]/5 border-[#d86bff]/20 hover:bg-[#d86bff]/10 hover:border-[#d86bff]/40"
                                                : "bg-transparent border-transparent hover:bg-[#d86bff]/5 hover:border-[#d86bff]/10"
                                        }`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${getRankStyle(rank)}`}
                                        >
                                            {rank}
                                        </div>
                                        <div className="w-[80px] h-[50px] rounded-full bg-[rgba(168,85,247,0.2)] flex items-center justify-center border-2 border-[rgb(192,132,252)] overflow-hidden">
                                            {player.avatar_url ? (
                                                <img
                                                    src={player.avatar_url}
                                                    alt={player.username}
                                                    className="w-[50px] h-[50px] rounded-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-bold text-[rgb(216,180,254)]">
                                                    {player.username.slice(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white truncate tracking-wide">{player.username}</p>
                                                {getRankIcon(rank)}
                                            </div>
                                            <p className="text-sm text-gray-500 tracking-wider">
                                                {player.points.toLocaleString()} POINTS
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-8 text-sm">
                                            <div className="text-center">
                                                <p className="font-bold text-[#d86bff]">{player.wins}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Wins</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-gray-400">{player.loss}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Losses</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-[#d86bff]">{player.win_rate}%</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Rate</p>
                                            </div>
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