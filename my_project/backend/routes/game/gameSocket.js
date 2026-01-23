const { Server: SocketIOServer } = require('socket.io');

const waitingPlayers = [];
const gameRooms = new Map();
const gameStates = new Map();

const boardWidth = 900;
const boardHeight = 450;
const paddleHeight = 80;
const ballRadius = 15;

module.exports = async function (fastify) {
  const gameSocket = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  function generateRoomID() {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  gameSocket.on("connection", (socket) => {
    socket.on("hello", (msg) => {
      console.log("!!!!!!!! Received from front:", msg);
    });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     socket.on("inviting", (data) => {
      console.log("+++++++ invite msg Received :", data.id, data.username);
      const { idFriend } = data;

      // socket.id = data.idFriend;

    console.log("📨 Invitation from", socket.username, "to friend :", data.username);

    gameSocket.to(data.idFriend).emit("invitation_received", {
    fromId: socket.userId,
    fromUsername: socket.username,
    });
    console.log("✅ Invitation sent to socket:", data.idFriend);

      
    });
    ///////////////////////////////////////
     

    console.log("🎮 New game client:", socket.id);
    waitingPlayers.push(socket.id);
    
    socket.on("findGame", () => {
      if (waitingPlayers.length >= 2 && waitingPlayers[0] && waitingPlayers[1]) {
        let newRoomID = generateRoomID();
        while (gameRooms.has(newRoomID)) {
          newRoomID = generateRoomID();
        }
        
        console.log("new ROOM_ID ::::", newRoomID);
        gameRooms.set(newRoomID, {
          player1: waitingPlayers[0],
          player2: waitingPlayers[1]
        });

        const player1Socket = gameSocket.sockets.sockets.get(waitingPlayers[0]);
        const player2Socket = gameSocket.sockets.sockets.get(waitingPlayers[1]);

        player1Socket?.join(newRoomID);
        player2Socket?.join(newRoomID);

        player1Socket?.emit("gameStart", { roomID: newRoomID, role: "player1" });
        player2Socket?.emit("gameStart", { roomID: newRoomID, role: "player2" });
        
        gameStates.set(newRoomID, {
          ballX: boardWidth / 2,
          ballY: boardHeight / 2,
          ballStepX: 5,
          ballStepY: 5,
          player1_Y: boardHeight / 2 - paddleHeight / 2,
          player2_Y: boardHeight / 2 - paddleHeight / 2,
          score1: 0,
          score2: 0,
          gameEnd: false,
          winner: 0,
        });
        
        startGameLoop(newRoomID, gameSocket);
        console.log("Game started");
        waitingPlayers.splice(0, 2);
      }
    });

    socket.on("paddleMove", (data) => {
      const state = gameStates.get(data.roomID);
      if (state) {
        if (data.role === "player1") {
          state.player1_Y = data.y;
        } else if (data.role === "player2") {
          state.player2_Y = data.y;
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Game client disconnected:", socket.id);
      const index = waitingPlayers.indexOf(socket.id);
      if (index > -1) {
        waitingPlayers.splice(index, 1);
      }
    });
  });

  function startGameLoop(roomID, io) {
    const interval = setInterval(() => {
      const state = gameStates.get(roomID);
      const room = gameRooms.get(roomID);

      if (!state || !room) {
        clearInterval(interval);
        return;
      }

      state.ballX += state.ballStepX;
      state.ballY += state.ballStepY;

      // Ball collision with top/bottom walls
      if (state.ballY + ballRadius > boardHeight || state.ballY - ballRadius < 0) {
        state.ballStepY = -state.ballStepY;
      }

      // Player 1 paddle collision
      const player1_X = 20;
      const paddleWidth = 15;
      if (state.ballStepX < 0) {
        if (state.ballX - ballRadius <= player1_X + paddleWidth &&
            state.ballX - ballRadius > player1_X &&
            state.ballY + ballRadius >= state.player1_Y &&
            state.ballY - ballRadius <= state.player1_Y + paddleHeight) {
          state.ballStepX = Math.abs(state.ballStepX);
          state.ballX = ballRadius + player1_X + paddleWidth;
        }
      }

      // Player 2 paddle collision
      const player2_X = boardWidth - 20 - paddleWidth;
      if (state.ballStepX > 0) {
        if (state.ballX + ballRadius >= player2_X &&
            state.ballX + ballRadius < player2_X + paddleWidth &&
            state.ballY + ballRadius >= state.player2_Y &&
            state.ballY - ballRadius <= state.player2_Y + paddleHeight) {
          state.ballStepX = -Math.abs(state.ballStepX);
          state.ballX = player2_X - ballRadius;
        }
      }

      // Scoring
      if (state.ballX - ballRadius <= 0) {
        state.score2++;
        resetBall(state);
      } else if (state.ballX + ballRadius >= boardWidth) {
        state.score1++;
        resetBall(state);
      }

      // Win condition
      if (state.score1 === 3) {
        state.gameEnd = true;
        state.winner = 1;
      } else if (state.score2 === 3) {
        state.gameEnd = true;
        state.winner = 2;
      }

      io.to(roomID).emit("gameUpdate", state);
    }, 1000 / 60); // 60 FPS
  }

  function resetBall(state) {
    state.ballX = boardWidth / 2;
    state.ballY = boardHeight / 2;
    state.ballStepX = state.score1 > state.score2 ? 5 : -5;
    state.ballStepY = Math.random() < 0.5 ? -5 : 5;
  }

  console.log("✅ Game Socket.IO initialized on main server");
};
