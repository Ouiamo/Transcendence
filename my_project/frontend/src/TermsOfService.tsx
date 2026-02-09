interface TermsOfServiceProps {
  gotohome: () => void;
}

export default function TermsOfService({ gotohome }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-[#0d0221] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={gotohome}
          className="mb-6 text-purple-400 hover:text-purple-300 underline"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. Account Rules</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>One account per person</li>
            <li>Keep your password secure</li>
            <li>Provide accurate registration information</li>
          </ul>
          
          <h2 className="text-lg font-semibold">2. Fair Play</h2>
          <p>Prohibited actions:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Cheating or using game exploits</li>
            <li>Intentionally losing matches</li>
            <li>Harassing other players</li>
            <li>Using bots or automated scripts</li>
          </ul>
          
          <h2 className="text-lg font-semibold">3. Game Features</h2>
          <p>Our PONG provides:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Local multiplayer (same device)</li>
            <li>Remote multiplayer (different devices)</li>
            <li>AI opponent matches</li>
            <li>Leaderboard rankings</li>
            <li>Friend system for match invitations</li>
          </ul>
          
          <h2 className="text-lg font-semibold">4. Account Suspension</h2>
          <p>We may suspend accounts for:</p>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Cheating or exploiting bugs</li>
            <li>Multiple accounts creation</li>
          </ul>
          
          <h2 className="text-lg font-semibold">5. Contact</h2>
          <p>Questions? Email: terms@pong_game.com</p>
        </div>
      </div>
    </div>
  );
}