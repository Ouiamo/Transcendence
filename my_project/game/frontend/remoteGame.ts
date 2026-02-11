import { io, Socket } from "socket.io-client";


let socket: Socket | null = null;

let board: HTMLCanvasElement;

const boardWidth: number = 900; 
const boardHeight: number = 450; 
let contex : CanvasRenderingContext2D | null = null;
let winnerName: string;
// let gameMode: '1v1' | 'vAI' | 'local' | null = null;

const paddleWidth: number = 15; 
const paddleHeight: number = 80;
const paddleSpeed: number = 6; 

// let gameStart : boolean = false;
// let countDown = 3;
// let gameCountDown : boolean = false;
// let gameGO : boolean = false;

let winner : number = 0;
// const maxScore : number = 3;

const player1_X : number = 20;
const player2_X : number = boardWidth - 20 - paddleWidth;
const ballColor: string = "white";
const ballRadius : number = 15;
// const ballStepX :number= 5;
// const ballStepY :number = 5;
const  playerColor: string ="#829cbdff";
let gameEnd: boolean = false;

const score={
    x_l : boardWidth/4,         
    x_r : 3 * boardWidth/4,      
    y : boardHeight/6, 
    color: "white",
}

const net = {
    x :  boardWidth/2 - 10 /2,
    y : 5,
    width: 7,
    height : 25,
    color: "#16213e",       
};

const gameState={
    roomID : "",
    role : "",
    inGame : false,
    isCleaningUp: false,
    
    ballX : boardWidth/2,
    ballY : boardHeight/2,
    
    player1_Y :  boardHeight / 2 - paddleHeight / 2,
    player2_Y :  boardHeight / 2 - paddleHeight / 2,
    
    score1 : 0,
    score2 : 0,
    gameEnd: false,
    winner: 0,
    

    player1Username: "Player 1",
    player2Username: "Player 2",
    opponentId: null as number | null,
    opponentUsername: "",
    yourUsername: "",
}


const keys: {[key:string] : boolean}={
    'w' : false,
    's' : false,
    'W' : false,
    'S' : false,
    'ArrowUp' : false,
    'ArrowDown' : false,
}



// function drawWaitingForPlayer(
//     context: CanvasRenderingContext2D,
//     boardWidth: number,
//     boardHeight: number
// ) {
//     context.fillStyle = "rgba(0, 0, 0, 0.9)";
//     context.fillRect(0, 0, boardWidth, boardHeight);
//     context.shadowBlur = 20;
//     // context.shadowColor = "#9e58eeff";
//     context.fillStyle = "white";
//     context.font = "40px Arial";
//     context.textAlign = "center";
//     context.textBaseline = "middle";
//     context.fillText("Waiting for opponent...", boardWidth / 2, boardHeight / 2);
//     context.shadowBlur = 0;
// }

// export function getRemoteWinner()
// {

// }

function connectServer() {
    const serverUrl = `https://10.13.249.23:3010`;

    socket = io(serverUrl);

    socket?.emit("hello", "Hi server!");

    // if (contex) {
    //     drawWaitingForPlayer(contex, boardWidth, boardHeight);
    // }

    //  socket.emit("user_connected", { 
    //     userId: currentUser.id, 
    //     username: currentUser.username 
    // });
        
    socket?.emit("findGame");
    socket.on("gameStart", (data: { roomID: string, role: string }) => {        
        gameState.roomID = data.roomID;
        gameState.role = data.role;
        gameState.inGame = true; 
        startGameLoop();
    });

    socket.on("gameUpdate", (data: any) => {
      
        gameState.ballX = data.ballX;
        gameState.ballY = data.ballY;
        
       
        if (gameState.role === "player1") {
            gameState.player2_Y = data.player2_Y;
        } else if (gameState.role === "player2") {
            gameState.player1_Y = data.player1_Y; 
        }
        
        gameState.score1 = data.score1;
        gameState.score2 = data.score2;
        gameState.gameEnd = data.gameEnd;
        gameState.winner = data.winner;
    });

    // socket.on("user_stats_update", (data) => {
    //       console.log(`${data.username} is now ${data.status}`);
    //     });
    
}

let opp_id : number;
export function getSocket() {
  return socket;
}

export function getRemoteGameState() {
  return {
    player1Username: gameState.player1Username,
    player2Username: gameState.player2Username,
    oppid: opp_id,
    score1: gameState.score1,
    score2: gameState.score2,
    inGame: gameState.inGame,
    gameEnd: gameState.gameEnd,
    winner: winnerName,
  };
}

export function cleanupGame() {
    console.log("Cleaning up remote game...");
    
   
    if (gameState.inGame && socket && gameState.roomID) {
        console.log("Notifying server of game cleanup");
        socket.emit("player_leaving_game", { roomID: gameState.roomID });
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
    

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    
   
    if (contex) {
        contex.clearRect(0, 0, boardWidth, boardHeight);
    }
}

function setupPrivateGame(gameData: any) {
    console.log("Setting up private game with data:", gameData);
    

    if (gameData.player1 && gameData.player2) {
        gameState.player1Username = gameData.player1.username || "Player 1";
        gameState.player2Username = gameData.player2.username || "Player 2";
        console.log(`Players: ${gameState.player1Username} vs ${gameState.player2Username}`);
    }
    
    
    socket?.on("gameStart", (data: { roomID: string, role: string }) => {        
        console.log("Private game starting:", data);
        gameState.roomID = data.roomID;
        gameState.role = data.role;
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
        gameState.gameEnd = data.gameEnd;
        gameState.winner = data.winner;
        
    
        if (data.gameEnd && data.winner && !gameState.isCleaningUp) {
            console.log(` Game ended! Winner: Player ${data.winner}`);
            gameState.isCleaningUp = true;
            gameState.inGame = false;
            
            setTimeout(() => {
                console.log(" Cleaning up finished game...");
                localStorage.removeItem('private_game_room');
                localStorage.removeItem('private_game_data');
                
                
                window.dispatchEvent(new CustomEvent('game_ended', { 
                    detail: { winner: data.winner } 
                }));
            }, 3000);
        }
    });
    

    socket?.on("player_disconnected", (data: any) => {
        console.log("Opponent disconnected:", data.message);
        
        if (!gameState.isCleaningUp) {
            gameState.isCleaningUp = true;
            gameState.inGame = false;
            gameState.gameEnd = true;
            
            
            alert("Opponent disconnected. You win!");
            
            setTimeout(() => {
                console.log("Cleaning up after opponent disconnect...");
                localStorage.removeItem('private_game_room');
                localStorage.removeItem('private_game_data');
          
                window.dispatchEvent(new CustomEvent('game_ended', { 
                    detail: { winner: gameState.role === "player1" ? 1 : 2 } 
                }));
            }, 1000);
        }
    });
    

    const roomId = localStorage.getItem('private_game_room');
    if (roomId && socket) {
        console.log("Joining private game room:", roomId);
    }
}



export function initGame_remot(canvas: HTMLCanvasElement, existingSocket?: Socket, roomData?: any) {
   board = canvas;
   console.log("Initializing remote game...");
   console.log("Room data:", roomData.player2.id);
   console.log("Existing socket:", !!existingSocket);

   if (roomData)
   {
       opp_id = roomData.player2.id;
   }

   gameState.inGame = false;
   gameState.gameEnd = false;
   gameState.winner = 0;
   gameState.score1 = 0;
   gameState.score2 = 0;
   gameState.roomID = "";
   gameState.role = "";
   gameState.isCleaningUp = false;
   gameState.player1Username = "player1";
   gameState.player2Username = "player2";
   
   board.width = 900;
   board.height = 450;
   contex = board.getContext("2d");

   
   document.removeEventListener("keydown", handleKeyDown);
   document.removeEventListener("keyup", handleKeyUp);
   document.addEventListener("keydown", handleKeyDown);
   document.addEventListener("keyup", handleKeyUp);
   
   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
       if (gameState.inGame && socket && gameState.roomID) {
           console.log(" Player leaving game (refresh/close)");
           socket.emit("player_leaving_game", { roomID: gameState.roomID });
       }
   };
   window.addEventListener("beforeunload", handleBeforeUnload);

  
   const privateRoom = localStorage.getItem('private_game_room');
   const privateGameData = localStorage.getItem('private_game_data');
   
   if (privateRoom && privateGameData && existingSocket) {
       console.log("Setting up private game with existing socket");
       socket = existingSocket;
       const gameData = JSON.parse(privateGameData);
       setupPrivateGame(gameData);
   } else {
       console.log("Setting up regular matchmaking");
       connectServer();
   }
};

function handleKeyDown(event: KeyboardEvent) {
    if(event.key in keys) {
        keys[event.key] = true;
        event.preventDefault();
    }
}

function handleKeyUp(event: KeyboardEvent) {
    if(event.key in keys) {
        keys[event.key] = false;
    }
}

function movePlayer() {
    if (!gameState.inGame || !socket) return;

    let myPaddleY = gameState.role === "player1" ? gameState.player1_Y : gameState.player2_Y;
    let moved = false;

    if (gameState.role === "player1") {
        if ((keys['w'] || keys['W']) && myPaddleY > 0) {
            myPaddleY -= paddleSpeed;
            moved = true;
        } else if ((keys['s'] || keys['S']) && myPaddleY < boardHeight - paddleHeight) {
            myPaddleY += paddleSpeed;
            moved = true;
        }
        
        if (moved) {
            gameState.player1_Y = myPaddleY;
        }
    } else if (gameState.role === "player2") {
        if (keys['ArrowUp'] && myPaddleY > 0) {
            myPaddleY -= paddleSpeed;
            moved = true;
        } else if (keys['ArrowDown'] && myPaddleY < boardHeight - paddleHeight) {
            myPaddleY += paddleSpeed;
            moved = true;
        }
        
        if (moved) {
            gameState.player2_Y = myPaddleY;
        }
    }
    
    if (moved) {
        socket.emit("paddleMove", {
            roomID: gameState.roomID,
            role: gameState.role,
            y: myPaddleY
        });
    }
}

function startGameLoop()
{
    const menu = document.getElementById("game-menu");
    menu?.classList.add("hidden");
    if (board) board.style.display = "block";
    
    requestAnimationFrame(draw);
}

function drawWinner()
{
    if (!contex || gameEnd === false) return;
    
    
    if (winner === 1) {
        winnerName = gameState.player1Username ;
    } else if (winner === 2) {
        winnerName = gameState.player2Username ;
    } else {
        winnerName = 'GAME OVER!';
    }
    
    contex.fillStyle = "rgba(0, 0, 0, 0.85)";
    contex.fillRect(0, 0, boardWidth, boardHeight);

 
    contex.fillStyle = "white";
    contex.font = "bold 60px Arial"; 
    contex.textAlign = "center"; 
    contex.textBaseline = "middle";
    contex.fillText(winnerName + ' WINS!', boardWidth/2, boardHeight/2 - 50);
    
    contex.fillStyle = "white";
    contex.font = "40px Arial";
    contex.fillText(`${gameState.score1} - ${gameState.score2}`, boardWidth / 2, boardHeight / 2 + 30);
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
    // drawScore(score.x_l, score.y, gameState.score1, score.color);
    // drawScore(score.x_r, score.y, gameState.score2, score.color);
    // drawUsernames();
    movePlayer();
    drawWinner();
    if (gameEnd === false)
        requestAnimationFrame(draw);
}

function drawBoard(x: number, y: number, w:number, h:number)
{
    if (!contex) return;
    // contex.fillStyle = "#490f5eff";
    contex.fillStyle = "#15152bff";
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}

function drawRect(x: number, y: number, w:number, h:number, color:string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.beginPath();
    contex.fillRect(x, y, w, h);
}


function drawNet(){
    for(let i: number = 0; i <= boardHeight; i += 35)
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
}


function drawBall(x: number, y: number, radius: number, color:string)
{
    if (!contex) return;

    contex.shadowBlur = 10;
    contex.shadowColor = "#ff3b94";

    contex.fillStyle = color;
    contex.beginPath();
    contex.arc(x, y, radius, 0, 2* Math.PI);
    contex.fill();

    contex.shadowBlur = 0;
}



function drawScore(x: number, y:number, score: number, color: string)
{
    if (!contex) return;
    contex.fillStyle = color;
    contex.font = "48px Arial";
    contex.textAlign = "center"; 
    contex.fillText(score.toString(), x, y);
}

function drawUsernames()
{
    if (!contex) return;
    contex.fillStyle = "white";
    contex.font = "20px Arial";
    contex.textAlign = "center";
    
   
    contex.fillText(gameState.player1Username, score.x_l, score.y - 60);
    

    contex.fillText(gameState.player2Username, score.x_r, score.y - 60);
}

// function drawCountDown()
// {
//     if(countDown)
//     {
//         if (!contex) return;
//         contex.fillStyle = "rgba(0, 0, 0, 0.7)";
//         contex.fillRect(0, 0, boardWidth, boardHeight);
//         contex.fillStyle = "white";
//         contex.font = "bold 150px Arial";
//         contex.textAlign = "center"; 
//         contex.textBaseline = "middle";
//         contex.fillText(countDown.toString(), boardWidth/2, boardHeight/2);
           
//         contex.shadowBlur = 15;
//         contex.fillStyle = "white";
//         contex.font = "30px Arial";
//         contex.fillText("GET READY", boardWidth / 2, boardHeight / 2 - 100);
       
//         contex.shadowBlur = 0;
//     }
//     if(gameGO)
//     {
//         if (!contex) return;
//         contex.fillStyle = "rgba(0, 0, 0, 0.7)";
//         contex.fillRect(0, 0, boardWidth, boardHeight);
//         contex.shadowBlur = 40;
//         contex.shadowColor = "#8f37f3ff";
//         contex.font = "bold 180px Arial";
//         contex.fillStyle = "white";
//         contex.textAlign = "center";
//         contex.textBaseline = "middle";
//         contex.fillText("GO!", boardWidth / 2, boardHeight / 2);
        
//         contex.shadowBlur = 0;
//     }
// }


// function drawWinner()
// {
    
//     if (!contex || !winner) return;
//     contex.fillStyle = "rgba(0, 0, 0, 0.85)";
//     contex.fillRect(0, 0, boardWidth, boardHeight);

//     contex.shadowBlur = 20;
//     contex.shadowColor = "#0244bdff";
//     contex.fillStyle = "white";
//     contex.font = "bold 70px Arial";
//     contex.textAlign = "center"; 
//     contex.textBaseline = "middle";
//     contex.fillText(`${winner} WINS!`, boardWidth/2, boardHeight/2 - 50);
        
//     contex.shadowBlur = 15;
//     contex.fillStyle = "white";
//     contex.font = "40px Arial";
//     contex.fillText(`${player1.score} - ${player2.score}`, boardWidth / 2, boardHeight / 2 + 30);

//     contex.shadowBlur = 10;
//     contex.fillStyle = "white";
//     contex.font = "25px Arial";
//     contex.fillText("Press SPACE to play again", boardWidth / 2, boardHeight / 2 + 100);
    
//     contex.shadowBlur = 0;
// }

// function drawStart()
// {
//     if (!contex) return;
//     contex.fillStyle = "rgba(0, 0, 0, 1)";
//     contex.fillRect(0, 0, boardWidth, boardHeight);
//     contex.shadowBlur = 20;
//     contex.shadowColor = "#9e58eeff";
//     contex.fillStyle = "white";
//     contex.font = "40px Arial";
//     contex.textAlign = "center";
//     contex.textBaseline = "middle";
//     contex.fillText("Press SPACE to Start ", boardWidth / 2, boardHeight / 2);

//     contex.font = "20px Arial";
//     contex.fillStyle = "white";
//     contex.fillText("Player 1: W/S | Player 2: ↑/↓", boardWidth / 2, boardHeight / 2 + 50);
    
//     contex.shadowBlur = 0;
// }