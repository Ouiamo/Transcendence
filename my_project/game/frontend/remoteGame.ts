import { Socket } from "socket.io-client";

let socket: Socket | null = null;

let board: HTMLCanvasElement;

const boardWidth: number = 900;
const boardHeight: number = 450;
let contex: CanvasRenderingContext2D | null = null;



const paddleWidth: number = 15;
const paddleHeight: number = 80;
const paddleSpeed: number = 6;

let winner: number = 0;

const player1_X: number = 20;
const player2_X: number = boardWidth - 20 - paddleWidth;
const ballColor: string = "white";
const ballRadius: number = 15;
const playerColor: string = "#829cbdff";
let gameEnd: boolean = false;
const net = {
    x: boardWidth / 2 - 10 / 2,
    y: 5,
    width: 7,
    height: 25,
    color: "#c44cff33",
};

const gameState = {
    roomID: "",
    role: "",
    inGame: false,
    isCleaningUp: false,

    ballX: boardWidth / 2,
    ballY: boardHeight / 2,

    player1_Y: boardHeight / 2 - paddleHeight / 2,
    player2_Y: boardHeight / 2 - paddleHeight / 2,

    score1: 0,
    score2: 0,
    gameEnd: false,
    winner: 0,

    player1Username: "Player 1",
    player2Username: "Player 2",
}


const keys: { [key: string]: boolean } = {
    'w': false,
    's': false,
    'W': false,
    'S': false,
    'ArrowUp': false,
    'ArrowDown': false,
}
let winnerName: string | null = null;
let opponent_id: number;
let forfeit: boolean = false;

export function getRemoteGameState() {

    return {
        player1Username: gameState.player1Username,
        player2Username: gameState.player2Username,
        score1: gameState.score1,
        score2: gameState.score2,
        opp_id: opponent_id,
        inGame: gameState.inGame,
        gameEnd: gameState.gameEnd,
        winner: winnerName,
        forfeit: forfeit,
    };
}

export function cleanupGame() {

    if (gameState.inGame && socket && gameState.roomID) {
        // console.log("Notifying server of game cleanup");
        socket.emit("player_leaving_game", { roomID: gameState.roomID });
    }


    socket?.off("gameStart");
    socket?.off("gameUpdate");
    socket?.off("player_disconnected");


    gameState.inGame = false;
    gameState.gameEnd = false;
    gameState.winner = 0;
    gameState.score1 = 0;
    gameState.score2 = 0;
    gameState.roomID = "";
    gameState.role = "";
    gameState.isCleaningUp = false;
    gameState.player1Username = "Player 1";
    gameState.player2Username = "Player 2";
    gameState.ballX = boardWidth / 2;
    gameState.ballY = boardHeight / 2;
    gameState.player1_Y = boardHeight / 2 - paddleHeight / 2;
    gameState.player2_Y = boardHeight / 2 - paddleHeight / 2;

    winnerName = null;
    forfeit = false;

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);

    if (contex) {
        contex.clearRect(0, 0, boardWidth, boardHeight);
    }

}

function setupPrivateGame(gameData: any, currentUser: any) {
    if (currentUser?.id == gameData.player1?.id) {
        gameState.role = "player1";
    } else {
        gameState.role = "player2";
    }
    socket?.on("gameStart", (data: { roomID: string, role: string }) => {

        if (gameState.inGame) {
            return;
        }

        gameState.roomID = data.roomID;
        if (data.role !== gameState.role) {
            console.warn(`Server role (${data.role}) differs from determined role (${gameState.role}), using server role`);
            gameState.role = data.role;
        }
        gameState.inGame = true;
        startGameLoop();
    });

    socket?.on("gameUpdate", (data: any) => {
        gameState.ballX = data.ballX;
        gameState.ballY = data.ballY;

        if (gameState.role === "player1") {
            gameState.player2_Y = data.player2_Y;
        } else if (gameState.role === "player2") {
            gameState.player1_Y = data.player1_Y;
        }

        gameState.score1 = data.score1;
        gameState.score2 = data.score2;


        if (data.gameEnd && data.winner && !gameState.isCleaningUp) {
            if (data.score1 >= 11 || data.score2 >= 11) {
                gameState.gameEnd = true;
                gameState.winner = data.winner;
                gameState.isCleaningUp = true;
                gameState.inGame = false;

                if (data.winner === 1) {
                    winnerName = gameState.player1Username;
                } else if (data.winner === 2) {
                    winnerName = gameState.player2Username;
                } else {
                    winnerName = 'GAME OVER!';
                }

                setTimeout(() => {
                    // console.log("Cleaning up finished game...");
                    window.dispatchEvent(new CustomEvent('game_ended', {
                        detail: { winner: data.winner }
                    }));
                }, 3000);
            }
        }
    });


    socket?.on("player_disconnected", (data: any) => {
        console.log("Opponent disconnected:", data.message);

        if (!gameState.isCleaningUp) {
            gameState.isCleaningUp = true;
            gameState.inGame = false;
            gameState.gameEnd = true;
            forfeit = true;

            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('game_ended', {
                    detail: { winner: gameState.role === "player1" ? 1 : 2 }
                }));
            }, 2000);
        }
    });

    socket?.on("game_cancelled", (data: any) => {
        alert(data.error || "Game has been cancelled.");
        window.dispatchEvent(new CustomEvent('game_ended', {
            detail: { winner: 0, cancelled: true }
        }));
    });

    socket?.emit("join_private_game", {
        roomId: gameData.roomId,
        playerId: currentUser.id,
        playerUsername: currentUser.username,
    });
}

export function initGame_remot(canvas: HTMLCanvasElement, existingSocket: Socket, gameData: any, currentUser: any) {
    board = canvas;

    if (!existingSocket) {
        console.error(" No socket provided to initGame_remot!");
        return;
    }
    if (!gameData) {
        console.error(" No gameData provided to initGame_remot!");
        return;
    }


    gameState.inGame = false;
    gameState.gameEnd = false;
    gameState.winner = 0;
    gameState.score1 = 0;
    gameState.score2 = 0;
    gameState.roomID = "";
    gameState.role = "";
    gameState.isCleaningUp = false;
    gameState.player1Username = "Player 1";
    gameState.player2Username = "Player 2";
    gameState.ballX = boardWidth / 2;
    gameState.ballY = boardHeight / 2;
    gameState.player1_Y = boardHeight / 2 - paddleHeight / 2;
    gameState.player2_Y = boardHeight / 2 - paddleHeight / 2;
    winnerName = null;
    forfeit = false;


    gameState.player1Username = gameData.player1.username;
    gameState.player2Username = gameData.player2.username;

    if (currentUser.id === gameData.player1.id) {
        opponent_id = gameData.player2.id;
    } else {
        opponent_id = gameData.player1.id;
    }

    board.width = 900;
    board.height = 450;
    contex = board.getContext("2d");

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);


    const handleBeforeUnload = () => {
        if (gameState.inGame && socket && gameState.roomID) {
            socket.emit("player_leaving_game", { roomID: gameState.roomID });
        }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);


    socket = existingSocket;


    socket.off("gameStart");
    socket.off("gameUpdate");
    socket.off("player_disconnected");

    setupPrivateGame(gameData, currentUser);
};

function handleKeyDown(event: KeyboardEvent) {
    if (event.key in keys) {
        keys[event.key] = true;
        event.preventDefault();
    }
}

function handleKeyUp(event: KeyboardEvent) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
}

function movePlayer() {
    if (!gameState.inGame || !socket) return;

    let myPaddleY = gameState.role === "player1" ? gameState.player1_Y : gameState.player2_Y;
    let moved = false;


    let upPressed = false;
    let downPressed = false;

    if (gameState.role === "player1") {
        upPressed = keys['w'] || keys['W'];
        downPressed = keys['s'] || keys['S'];
    } else if (gameState.role === "player2") {
        upPressed = keys['ArrowUp'];
        downPressed = keys['ArrowDown'];
    }

    if (upPressed && myPaddleY > 0) {
        myPaddleY -= paddleSpeed;
        moved = true;
    } else if (downPressed && myPaddleY < boardHeight - paddleHeight) {
        myPaddleY += paddleSpeed;
        moved = true;
    }

    if (moved) {
        if (gameState.role === "player1") {
            gameState.player1_Y = myPaddleY;
        } else {
            gameState.player2_Y = myPaddleY;
        }

        socket.emit("paddleMove", {
            roomID: gameState.roomID,
            role: gameState.role,
            y: myPaddleY
        });
    }
}

function startGameLoop() {
    const menu = document.getElementById("game-menu");
    menu?.classList.add("hidden");
    if (board) board.style.display = "block";

    requestAnimationFrame(draw);
}

function drawWinner() {
    if (!contex || gameEnd === false) return;

    if (winner === 1) {
        winnerName = gameState.player1Username;
    } else if (winner === 2) {
        winnerName = gameState.player2Username;
    } else {
        winnerName = 'GAME OVER!';
    }

    contex.fillStyle = "rgba(13, 2, 33, 0.9)";
    contex.fillRect(0, 0, boardWidth, boardHeight);

    contex.shadowBlur = 25;
    contex.shadowColor = "#c44cff";
    contex.fillStyle = "white";
    contex.font = "bold 60px Orbitron, Arial";
    contex.textAlign = "center";
    contex.textBaseline = "middle";
    contex.fillText(winnerName + "WON!", boardWidth / 2, boardHeight / 2 - 50);

    contex.shadowBlur = 15;
    contex.shadowColor = "#d86bff";
    contex.fillStyle = "#d86bff";
    contex.font = "40px Orbitron, Arial";
    contex.fillText(`${gameState.score1} - ${gameState.score2}`, boardWidth / 2, boardHeight / 2 + 30);
    contex.shadowBlur = 0;
}

function draw() {

    if (!contex) return;

    gameEnd = gameState.gameEnd;
    winner = gameState.winner;
    drawBoard(0, 0, board.width, board.height);
    drawRect(player1_X, gameState.player1_Y, paddleWidth, paddleHeight, playerColor);
    drawRect(player2_X, gameState.player2_Y, paddleWidth, paddleHeight, playerColor);
    drawNet();
    drawBall(gameState.ballX, gameState.ballY, ballRadius, ballColor);

    movePlayer();
    drawWinner();
    if (gameEnd === false)
        requestAnimationFrame(draw);
}

function drawBoard(x: number, y: number, w: number, h: number) {
    if (!contex) return;
    contex.fillStyle = "#0d0221";
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}

function drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (!contex) return;
    contex.fillStyle = color;
    contex.beginPath();
    contex.roundRect(x, y, w, h, 6);
    contex.fill();
}


function drawNet() {
    for (let i: number = 0; i <= boardHeight; i += 35)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
}


function drawBall(x: number, y: number, radius: number, color: string) {
    if (!contex) return;

    contex.shadowBlur = 20;
    contex.shadowColor = "#d86bff";

    contex.fillStyle = color;
    contex.beginPath();
    contex.arc(x, y, radius, 0, 2 * Math.PI);
    contex.fill();

    contex.shadowBlur = 0;
}


