import '../style.css';
import { startTournament } from './tournament';

const app = document.getElementById('app') as HTMLElement;

async function savePlayerToBackend(playerName: string): Promise<void> {
    try {
        const response = await fetch('http://localhost:3010/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playerName })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`Saved player: ${playerName} (ID: ${result.playerId})`);
        
    } catch (error) {
        console.log(`Note: Player "${playerName}" not saved to backend`);
    }
}

function renderSetupScreen(): void {
    app.innerHTML = `
        <div class="container">
            <h1>PONG</h1>
            <div>
                <h2>Enter Player Names</h2>
                <p style="color: #ffccff;">At least 2 players required</p>
            </div>
            <div class="player-input">
                <input type="text" id="player1" placeholder="Player 1">
            </div>
            <div class="player-input">
                <input type="text" id="player2" placeholder="Player 2">
            </div>
            <div class="player-input">
                <input type="text" id="player3" placeholder="Player 3 (optional)">
            </div>
            <div class="player-input">
                <input type="text" id="player4" placeholder="Player 4 (optional)">
            </div>
            <button id="startBtn">START TOURNAMENT</button>
        </div>
    `;
    
    document.getElementById('startBtn')?.addEventListener('click', () => {
        const players = [
            (document.getElementById('player1') as HTMLInputElement).value.trim(),
            (document.getElementById('player2') as HTMLInputElement).value.trim(),
            (document.getElementById('player3') as HTMLInputElement).value.trim(),
            (document.getElementById('player4') as HTMLInputElement).value.trim()
        ].filter(name => name !== '');
        if (players.length < 2) {
            alert('Please enter at least 2 player names!');
            return;
        }

        players.forEach(player => savePlayerToBackend(player));

        startTournament(players);
    });
}

renderSetupScreen();