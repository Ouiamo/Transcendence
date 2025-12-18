export function startTournament(players: string[]): void {
    const app = document.getElementById('app') as HTMLElement;
    
    let bracketHTML = `
        <div class="container">
            <h1>TOURNAMENT BRACKET</h1>
            <div style="margin: 20px 0;">
                <div class="bracket-match">
                    <h3>Match 1: ${players[0]} vs ${players[1]}</h3>
                </div>
    `;
    
    if (players.length > 2) {
        bracketHTML += `
            <div class="bracket-match">
                <h3>Match 2: ${players[2]} vs ${players[3] || 'BYE'}</h3>
            </div>
        `;
    }
    
    bracketHTML += `
            </div>
            <button id="match1Btn">START MATCH 1</button>
            <br><br>
            <button id="backBtn">BACK TO SETUP</button>
        </div>
    `;
    
    app.innerHTML = bracketHTML;

    document.getElementById('match1Btn')?.addEventListener('click', () => {
        renderPongGame([players[0], players[1]]);
    });

    document.getElementById('backBtn')?.addEventListener('click', () => {
        window.location.reload();
    });
}

function renderPongGame(players: string[]): void {
    const app = document.getElementById('app') as HTMLElement;
    app.innerHTML = `
        <div class="container">
            <h1>RETRO PONG</h1>
            <h3>${players[0]} vs ${players[1]}</h3>
            <div class="score">
                <span>0</span> - <span>0</span>
            </div>
            <div class="game-placeholder">
                >>> PONG GAME AREA HERE <<<
            </div>
            <div class="instructions">
                <p>Player 1 (${players[0]}): Use W/S keys</p>
                <p>Player 2 (${players[1]}): Use Up/Down arrows</p>
            </div>
            <button onclick="window.location.reload()">BACK TO TOURNAMENT</button>
        </div>
    `;
}
