const { Server: SocketIOServer } = require('socket.io');
const { io: ioClient } = require('socket.io-client');
const { dbGet, dbRun } = require('../../utils/dbHelpers');

const gameRooms = new Map();
const gameStates = new Map();
const onlineUsers = new Map(); 
const pendingOfflineUsers = new Map(); 

const boardWidth = 900; 
const boardHeight = 450; 
const paddleHeight = 80;
const ballRadius = 15;
const OFFLINE_GRACE_PERIOD = 3000; 

module.exports = async function (fastify) {
  const gameSocket = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  fastify.server.io = gameSocket;

  const pythonAIClient = ioClient("http://ai:5000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
  });

  gameSocket.on("connection", (socket) => {

    socket.on("user_connected", (data) => {
      const { userId, username } = data;
      socket.userId = userId;
      socket.username = username;

      if (pendingOfflineUsers.has(userId)) {
        clearTimeout(pendingOfflineUsers.get(userId));
        pendingOfflineUsers.delete(userId);
      }

      const wasOnline = onlineUsers.has(userId);
      onlineUsers.set(userId, socket.id);
      
  

      const onlineUsersList = Array.from(onlineUsers.entries()).map(([uid, sid]) => {
        const userSocket = gameSocket.sockets.sockets.get(sid);
        return {
          userId: uid,
          username: userSocket?.username || 'Unknown'
        };
      });
      
      socket.emit("online_users", onlineUsersList);
      if (!wasOnline) {
        socket.broadcast.emit("user_status_update", {
          userId,
          username,
          status: "Online",
        });
      }
    });

    socket.on("inviting", (data) => {
      const { idFriend } = data;


      gameSocket.to(data.idFriend).emit("invitation_received", {
        fromId: socket.userId,
        fromUsername: socket.username,
      });
    });

    socket.on("user_logout", (data) => {
      const { userId, username } = data;
     
      if (pendingOfflineUsers.has(userId)) {
        clearTimeout(pendingOfflineUsers.get(userId));
        pendingOfflineUsers.delete(userId);
      }
      onlineUsers.delete(userId);
      
      gameSocket.emit("user_status_update", {
        userId,
        username,
        status: "Offline",
      });
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

    socket.on("requestPrediction", (gameState) => {
      pythonAIClient.emit("predict", gameState);
      pythonAIClient.once("prediction", (prediction) => {
        socket.emit("aiAction", prediction);
      });
    });

    socket.on("join_private_game", async (data) => {
      const { roomId, playerId, playerUsername } = data;
      // console.log(` Player ${playerUsername} (${playerId}) joining private game room: ${roomId}`);
      
      if (socket.gameRoomId) {
        console.log(`Player ${playerUsername} leaving previous room: ${socket.gameRoomId}`);
        socket.leave(socket.gameRoomId);
        
        const oldRoom = gameRooms.get(socket.gameRoomId);
        if (oldRoom) {
          oldRoom.players = oldRoom.players.filter(p => p.socketId !== socket.id);
          if (oldRoom.players.length === 0) {
            gameRooms.delete(socket.gameRoomId);
            gameStates.delete(socket.gameRoomId);
          }
        }
      }
      
      socket.join(roomId);
      socket.gameRoomId = roomId;
      
      if (!gameRooms.has(roomId)) {
        gameRooms.set(roomId, { players: [] });
      }
      
      const room = gameRooms.get(roomId);
      const existingPlayer = room.players.find(p => p.userId === playerId);
      if (existingPlayer) {
        existingPlayer.socketId = socket.id;
      } else {
        room.players.push({
          socketId: socket.id,
          userId: playerId,
          username: playerUsername
        });
      }
    
      if (room.players.length === 2 && room.players[0].userId !== room.players[1].userId) {
        const roomParts = roomId.split('_');
        const senderId = parseInt(roomParts[1]);
        
        // Verify both players are still friends before starting the game
        const player1Id = room.players[0].userId;
        const player2Id = room.players[1].userId;
        try {
          const areFriends = await dbGet(
            `SELECT id FROM friends 
             WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
             AND status = 'accepted'`,
            [player1Id, player2Id, player2Id, player1Id]
          );
          if (!areFriends) {
            room.players.forEach(p => {
              const playerSocket = gameSocket.sockets.sockets.get(p.socketId);
              if (playerSocket) {
                playerSocket.emit('game_cancelled', { error: 'You are no longer friends. Game cancelled.' });
                playerSocket.leave(roomId);
                playerSocket.gameRoomId = undefined;
              }
            });
            gameRooms.delete(roomId);
            return;
          }
        } catch (err) {
          console.error('Error checking friendship in join_private_game:', err);
        }

        let player1, player2;
        if (room.players[0].userId === senderId) {
          player1 = room.players[0];
          player2 = room.players[1];
        } else {
          player1 = room.players[1];
          player2 = room.players[0];
        }
        

        player1.role = "player1";
        player2.role = "player2";
        room.players = [player1, player2];
        

        // if (gameStates.has(roomId)) {
        //   console.log(`Clearing existing game state for room ${roomId}`);
        // }
        
    
        const player1Socket = gameSocket.sockets.sockets.get(player1.socketId);
        const player2Socket = gameSocket.sockets.sockets.get(player2.socketId);
        

        if (player1Socket) player1Socket.gameRole = "player1";
        if (player2Socket) player2Socket.gameRole = "player2";
        
        player1Socket?.emit("gameStart", { roomID: roomId, role: "player1" });
        player2Socket?.emit("gameStart", { roomID: roomId, role: "player2" });
        
        // console.log(` Sending gameStart events to both players in room ${roomId}`);
        // console.log(` Player1 (${player1.username}, userId=${player1.userId}): role=player1`);
        // console.log(` Player2 (${player2.username}, userId=${player2.userId}): role=player2`);
        
        // Initialize fresh game state
        gameStates.set(roomId, {
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
        
        startGameLoop(roomId, gameSocket);
        // console.log(` Private game started in room ${roomId} between ${player1.username} and ${player2.username}`);
      } else if (room.players.length > 2) {
        console.error(` Room ${roomId} has too many players (${room.players.length}), cleaning up`);
        
        room.players = room.players.slice(0, 2);
      }
    });

    socket.on("player_leaving_game", (data) => {
      const { roomID } = data;
      // console.log(` Player intentionally leaving game room: ${roomID}`);
      
      const state = gameStates.get(roomID);
      if (state && !state.gameEnd) {
      
        state.gameEnd = true;
        
        const room = gameRooms.get(roomID);
        if (room && room.players) {
          const leavingPlayer = room.players.find(p => p.socketId === socket.id);
        
          if (leavingPlayer) {
            state.winner = room.players[0].socketId === socket.id ? 2 : 1;
          }

          if (!room.forfeitRecorded) {
            room.forfeitRecorded = true;
            recordForfeitScores(room, socket.id);
          }
        }
        
        
        gameSocket.to(roomID).emit("gameUpdate", state);
        gameSocket.to(roomID).emit("player_disconnected", {
          message: "Opponent left the game"
        });
        
        // console.log(` Game ended in room ${roomID} due to player leaving`);
      }
      
     
      socket.leave(roomID);
      if (socket.gameRoomId === roomID) {
        socket.gameRoomId = undefined;
      }
    });

    socket.on("disconnect", () => {
      // console.log(" Game client disconnected:", socket.id);
    
      if (socket.gameRoomId) {
        // console.log(` Cleaning up game room ${socket.gameRoomId} for disconnected player`);
        const room = gameRooms.get(socket.gameRoomId);
        if (room) {
 
          const state = gameStates.get(socket.gameRoomId);
          if (state && !state.gameEnd) {
           
            state.gameEnd = true;
            state.winner = -1; 
         
            // Record forfeit scores in DB for both players (only once)
            if (!room.forfeitRecorded) {
              room.forfeitRecorded = true;
              recordForfeitScores(room, socket.id);
            }
            gameSocket.to(socket.gameRoomId).emit("gameUpdate", state);
            gameSocket.to(socket.gameRoomId).emit("player_disconnected", {
              message: "Opponent disconnected"
            });
            // console.log(` Player disconnected mid-game in room ${socket.gameRoomId}`);
          }
          
          room.players = room.players.filter(p => p.socketId !== socket.id);
          if (room.players.length === 0) {
            gameRooms.delete(socket.gameRoomId);
            gameStates.delete(socket.gameRoomId);
            // console.log(` Deleted empty room: ${socket.gameRoomId}`);
          }
        }
      }
      
      
      if (socket.userId) {
        // console.log(`User ${socket.username} (${socket.userId}) disconnected, starting grace period...`);
        
       
        const offlineTimeout = setTimeout(() => {
          if (onlineUsers.get(socket.userId) === socket.id) {
            onlineUsers.delete(socket.userId);
            // console.log(` User ${socket.username} (${socket.userId}) is now OFFLINE (grace period expired)`);
            // console.log(` Total online users: ${onlineUsers.size}`);


            // console.log(` Broadcasting ${socket.username} is offline to all users`);
            gameSocket.emit("user_status_update", {
              userId: socket.userId,
              username: socket.username,
              status: "Offline",
            });
          }
          
          
          pendingOfflineUsers.delete(socket.userId);
        }, OFFLINE_GRACE_PERIOD);
        
       
        pendingOfflineUsers.set(socket.userId, offlineTimeout);
      }
    });
  });

  async function recordForfeitScores(room, leavingSocketId) {
    if (!room || !room.players || room.players.length < 2) return;

    const leavingPlayer = room.players.find(p => p.socketId === leavingSocketId);
    const remainingPlayer = room.players.find(p => p.socketId !== leavingSocketId);

    if (!leavingPlayer || !remainingPlayer) return;

    try {

      await dbRun(
        'INSERT INTO history (user_id, opp_username, user_score, opp_score, opp_id, match_type, isWin) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [remainingPlayer.userId, leavingPlayer.username, 11, 0, leavingPlayer.userId, 'REMOTE', true]
      );
   
      await dbRun(
        'INSERT INTO history (user_id, opp_username, user_score, opp_score, opp_id, match_type, isWin) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [leavingPlayer.userId, remainingPlayer.username, 0, 11, remainingPlayer.userId, 'REMOTE', false]
      );
      console.log(` Forfeit scores recorded: ${remainingPlayer.username} wins 11-0 over ${leavingPlayer.username}`);
    } catch (err) {
      console.error(' Error recording forfeit scores:', err);
    }
  }

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

      // Top/bottom wall bounce with position clamping
      if (state.ballY - ballRadius < 0) {
        state.ballY = ballRadius;
        state.ballStepY = Math.abs(state.ballStepY);
      } else if (state.ballY + ballRadius > boardHeight) {
        state.ballY = boardHeight - ballRadius;
        state.ballStepY = -Math.abs(state.ballStepY);
      }

      // Paddle collision - Player 1 (left)
      const player1_X = 20;
      const paddleWidth = 15;
      if (state.ballStepX < 0) {
        if (state.ballX - ballRadius <= player1_X + paddleWidth &&
            state.ballX + ballRadius >= player1_X &&
            state.ballY + ballRadius >= state.player1_Y &&
            state.ballY - ballRadius <= state.player1_Y + paddleHeight) {
          state.ballStepX = Math.abs(state.ballStepX);
          state.ballX = player1_X + paddleWidth + ballRadius;
        }
      }

      // Paddle collision - Player 2 (right)
      const player2_X = boardWidth - 20 - paddleWidth;
      if (state.ballStepX > 0) {
        if (state.ballX + ballRadius >= player2_X &&
            state.ballX - ballRadius <= player2_X + paddleWidth &&
            state.ballY + ballRadius >= state.player2_Y &&
            state.ballY - ballRadius <= state.player2_Y + paddleHeight) {
          state.ballStepX = -Math.abs(state.ballStepX);
          state.ballX = player2_X - ballRadius;
        }
      }

    
      if (state.ballX - ballRadius <= 0) {
        state.score2++;
        resetBall(state);
      } else if (state.ballX + ballRadius >= boardWidth) {
        state.score1++;
        resetBall(state);
      }

   
      const MAX_SCORE = 11;
      
      if (state.score1 === MAX_SCORE) {
        state.gameEnd = true;
        state.winner = 1;
        clearInterval(interval);
        
        
        setTimeout(() => {
          gameRooms.delete(roomID);
          gameStates.delete(roomID);
        }, 5000);
      } else if (state.score2 === MAX_SCORE) {
        state.gameEnd = true;
        state.winner = 2;
        clearInterval(interval);
        
        
        setTimeout(() => {
          gameRooms.delete(roomID);
          gameStates.delete(roomID);
        }, 5000);
      }

      io.to(roomID).emit("gameUpdate", state);
    }, 1000 / 60); 
  }

  function resetBall(state) {
    state.ballX = boardWidth / 2;
    state.ballY = boardHeight / 2;
    state.ballStepX = state.score1 > state.score2 ? 5 : -5;
    state.ballStepY = Math.random() < 0.5 ? -5 : 5;
  }

};