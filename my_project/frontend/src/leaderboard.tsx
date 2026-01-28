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
        if (rank === 1) return "border-[rgb(234,179,8)] bg-[rgba(234,179,8,0.1)] text-[rgb(234,179,8)]";
        if (rank === 2) return "border-[rgb(156,163,175)] bg-[rgba(156,163,175,0.1)] text-[rgb(156,163,175)]";
        if (rank === 3) return "border-[rgb(249,115,22)] bg-[rgba(249,115,22,0.1)] text-[rgb(249,115,22)]";
        return "border-[rgba(168,85,247,0.5)] bg-[rgba(168,85,247,0.1)] text-[rgb(192,132,252)]";
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-6 h-6" style={{ color: 'rgb(234,179,8)' }} />;
        if (rank === 2) return <Trophy className="w-5 h-5" style={{ color: 'rgb(156,163,175)' }} />;
        if (rank === 3) return <Trophy className="w-5 h-5" style={{ color: 'rgb(249,115,22)' }} />;
        return null;
    };


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(88,28,135)] via-black to-[rgb(88,28,135)]">
            <div className="text-[rgb(192,132,252)] text-xl">Loading leaderboard...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(88,28,135)] via-black to-[rgb(88,28,135)]">
            <div className="text-[rgb(248,113,113)] text-xl">Error: {error}</div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(88,28,135)] via-black to-[rgb(88,28,135)] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
                    <p className="text-[rgb(216,180,254)]">
                        Top players ranked by points
                    </p>
                </div>

                {users && users.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {users.slice(0, 3).map((player, index) => {
                            const rank = index + 1;

                            return (
                                <div
                                    key={player.user_id}
                                    className={`${index === 0
                                            ? "order-2 border-[rgba(234,179,8,0.5)] bg-[rgba(234,179,8,0.05)]"
                                            : index === 1
                                                ? "order-1 border-[rgba(156,163,175,0.5)] bg-[rgba(156,163,175,0.05)]"
                                                : "order-3 border-[rgba(249,115,22,0.5)] bg-[rgba(249,115,22,0.05)]"
                                        } border-2 rounded-lg p-6 backdrop-blur-sm`}
                                >
                                    <div className="text-center">
                                        <div className="flex justify-center mb-4">
                                            {getRankIcon(rank)}
                                        </div>
                                        <div className=" w-[50px] h-[50px] rounded-full bg-[rgba(168,85,247,0.2)] flex items-center justify-center border-2 border-[rgb(192,132,252)] overflow-hidden">
                                            {player.avatar_url ? (
                                                <img
                                                    src={player.avatar_url}
                                                    alt={player.username}
                                                    className="shrink-img"
                                                />
                                            ) : (
                                                <span className="text-2xl font-bold text-[rgb(216,180,254)]">
                                                    {player.username.slice(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-xl text-white mb-2">{player.username}</h3>
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRankStyle(rank)}`}>
                                                #{rank}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-2xl font-bold text-[rgb(192,132,252)]">{player.points}</p>
                                                <p className="text-[rgba(216,180,254,0.7)]">Points</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[rgb(74,222,128)]">{player.wins}</p>
                                                <p className="text-[rgba(216,180,254,0.7)]">Wins</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[rgb(192,132,252)]">{player.win_rate}</p>
                                                <p className="text-[rgba(216,180,254,0.7)]">Win Rate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border border-[rgba(168,85,247,0.3)] rounded-lg">
                    <div className="p-6 border-b border-[rgba(168,85,247,0.3)]">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6" style={{ color: 'rgb(192,132,252)' }} />
                            Rankings
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2">
                            {users && users.map((player, index) => {
                                const rank = index + 1;
                                return (
                                    <div
                                        key={player.user_id}
                                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${rank <= 3
                                                ? "bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.2)]"
                                                : "bg-[rgba(168,85,247,0.05)] hover:bg-[rgba(168,85,247,0.1)]"
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${getRankStyle(rank)}`} >
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
                                                <p className="font-medium text-white truncate">{player.username}</p>
                                                {getRankIcon(rank)}
                                            </div>
                                            <p className="text-sm text-[rgba(216,180,254,0.7)]">
                                                {player.points.toLocaleString()} Points
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="font-bold text-[rgb(74,222,128)]">{player.wins}</p>
                                                <p className="text-xs text-[rgba(216,180,254,0.7)]">Wins</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-[rgb(248,113,113)]">{player.loss}</p>
                                                <p className="text-xs text-[rgba(216,180,254,0.7)]">Losses</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-[rgb(192,132,252)]">{player.win_rate}</p>
                                                <p className="text-xs text-[rgba(216,180,254,0.7)]">Win Rate</p>
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