import { useEffect, useState } from 'react';

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
    let mounted = true;
    const fetchFriends = async () => {
      try {
        const res = await fetch('http://localhost:3010/api/friends', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Backend returns: { success: true, friends: [...], count: ... }
        if (mounted) setFriends(data.friends || []);
      } catch (err: any) {
        console.error('Failed to load friends', err);
        if (mounted) setError(err.message || 'Failed to load friends');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFriends();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading friends…</div>;
  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;

  return (
    <div className="p-4 w-72">
      <div className="bg-[rgba(13,2,33,0.6)] rounded-2xl p-4 border border-[#ff44ff]/40 shadow-lg">
        <h3 className="text-white font-semibold mb-3">Friends</h3>
        {friends && friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                  {f.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`http://localhost:3010${f.avatarUrl}`} alt={f.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">{f.username?.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{f.username}</div>
                  <div className="text-xs text-gray-400">{f.online ? 'Online' : 'Offline'}</div>
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
