interface PrivacyPolicyProps {
  gotohome: () => void;
}

export default function PrivacyPolicy({ gotohome }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#0d0221] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={gotohome}
          className="mb-6 text-purple-400 hover:text-purple-300 underline"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p>To provide the PONG multiplayer experience, we collect:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Email address and username for account creation</li>
            <li>Game statistics (wins, losses, scores)</li>
            <li>Match history and rankings</li>
            <li>Friend list and friend requests</li>
            <li>Profile picture (optional)</li>
          </ul>

          <h2 className="text-lg font-semibold">2. How We Use Information</h2>
          <p>Your data is used for:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Creating and managing your game account</li>
            <li>Enabling multiplayer matches (local, remote, vs AI)</li>
            <li>Calculating and displaying leaderboard rankings</li>
            <li>Managing friend connections and game invitations</li>
            <li>Improving game matchmaking and balance</li>
          </ul>

          <h2 className="text-lg font-semibold">3. Data Security</h2>
          <p>We protect your data with:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Password hashing</li>
            <li>HTTPS encryption for all connections</li>
            <li>Secure database storage</li>
          </ul>

          <h2 className="text-lg font-semibold">4. Contact</h2>
          <p>Questions? Email: privacy@pong_game.com</p>
        </div>
      </div>
    </div>
  );
}