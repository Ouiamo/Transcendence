const { Server: SocketIOServer } = require('socket.io');

const waitingPlayers = [];
const gameRooms = new Map();
const gameStates = new Map();
const onlineUsers = new Map(); // Map of userId -> socket.id
const pendingOfflineUsers = new Map(); // Map of userId -> timeout for grace period

const boardWidth = 900; // Match frontend dimensions
const boardHeight = 450; // Match frontend dimensions
const paddleHeight = 80;
const ballRadius = 15;
const OFFLINE_GRACE_PERIOD = 3000; // 3 seconds grace period

module.exports = async function (fastify) {
  const gameSocket = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store the Socket.IO instance on the fastify server for access from other routes
  fastify.server.io = gameSocket;

  function generateRoomID() {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  gameSocket.on("connection", (socket) => {
    console.log("🎮 New client connected:", socket.id);

    socket.on("hello", (msg) => {
      console.log("!!!!!!!! Received from front:", msg);
    });

    socket.on("user_connected", (data) => {
      const { userId, username } = data;
      socket.userId = userId;
      socket.username = username;

      // Cancel any pending offline timeout for this user
      if (pendingOfflineUsers.has(userId)) {
        console.log(`🔄 Cancelling offline timeout for ${username} (reconnection)`);
        clearTimeout(pendingOfflineUsers.get(userId));
        pendingOfflineUsers.delete(userId);
      }

      // Store in onlineUsers map
      const wasOnline = onlineUsers.has(userId);
      onlineUsers.set(userId, socket.id);
      
      if (wasOnline) {
        console.log(`🔄 User ${username} (${userId}) RECONNECTED`);
      } else {
        console.log(`✅ User ${username} (${userId}) is now ONLINE`);
      }
      console.log(`📊 Total online users: ${onlineUsers.size}`);

      // Send lALL currently online users to the newly connected user
      const onlineUsersList = Array.from(onlineUsers.entries()).map(([uid, sid]) => {
        const userSocket = gameSocket.sockets.sockets.get(sid);
        return {
          userId: uid,
          username: userSocket?.username || 'Unknown'
        };
      });
      
      console.log(`📋 Sending online users list to ${username}:`, onlineUsersList);
      socket.emit("online_users", onlineUsersList);

      //  Broadcast to ALL OTHER users that this user is now online (only if they weren't already online)
      if (!wasOnline) {
        console.log(`📢 Broadcasting ${username} is online to all other users`);
        socket.broadcast.emit("user_status_update", {
          userId,
          username,
          status: "Online",
        });
      }
    });

    socket.on("inviting", (data) => {
      console.log("+++++++ invite msg Received :", data.id, data.username);
      const { idFriend } = data;

      console.log("📨 Invitation from", socket.username, "to friend :", data.username);

      gameSocket.to(data.idFriend).emit("invitation_received", {
        fromId: socket.userId,
        fromUsername: socket.username,
      });
      console.log("✅ Invitation sent to socket:", data.idFriend);
    });

    socket.on("user_logout", (data) => {
      const { userId, username } = data;
      
      console.log(`🚪 User ${username} (${userId}) explicitly logged out`);
      
     
      if (pendingOfflineUsers.has(userId)) {
        clearTimeout(pendingOfflineUsers.get(userId));
        pendingOfflineUsers.delete(userId);
      }
      
    
      onlineUsers.delete(userId);
      
      console.log(`❌ User ${username} (${userId}) is now OFFLINE (logout)`);
      console.log(`📊 Total online users: ${onlineUsers.size}`);
      
      // Broadcast to ALL users that this user logged out
      gameSocket.emit("user_status_update", {
        userId,
        username,
        status: "Offline",
      });
    });

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

    
    socket.on("join_private_game", (data) => {
      const { roomId, playerId, playerUsername } = data;
      console.log(`🎮 Player ${playerUsername} (${playerId}) joining private game room: ${roomId}`);
      
     
      if (socket.gameRoomId) {
        console.log(`🎮 Player ${playerUsername} leaving previous room: ${socket.gameRoomId}`);
        socket.leave(socket.gameRoomId);
        
        // Clean up previous room if it exists
        const oldRoom = gameRooms.get(socket.gameRoomId);
        if (oldRoom) {
          oldRoom.players = oldRoom.players.filter(p => p.socketId !== socket.id);
          if (oldRoom.players.length === 0) {
            gameRooms.delete(socket.gameRoomId);
            gameStates.delete(socket.gameRoomId);
            console.log(`🧹 Cleaned up empty room: ${socket.gameRoomId}`);
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
        console.log(`🎮 Player ${playerUsername} already in room, updating socket`);
        existingPlayer.socketId = socket.id;
      } else {
        room.players.push({
          socketId: socket.id,
          userId: playerId,
          username: playerUsername
        });
      }
      
      console.log(`🎮 Room ${roomId} now has ${room.players.length} players`);
      
    
      if (room.players.length === 2 && room.players[0].userId !== room.players[1].userId) {
        const player1 = room.players[0];
        const player2 = room.players[1];
        
        // Clear any existing game state for this room first
        if (gameStates.has(roomId)) {
          console.log(`🧹 Clearing existing game state for room ${roomId}`);
        }
        
    
        const player1Socket = gameSocket.sockets.sockets.get(player1.socketId);
        const player2Socket = gameSocket.sockets.sockets.get(player2.socketId);
        
        player1Socket?.emit("gameStart", { roomID: roomId, role: "player1" });
        player2Socket?.emit("gameStart", { roomID: roomId, role: "player2" });
        
        console.log(`🎮 Sending gameStart events to both players in room ${roomId}`);
        console.log(`📤 Player1 (${player1.username}): role=player1`);
        console.log(`📤 Player2 (${player2.username}): role=player2`);
        
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
        console.log(`🎮 Private game started in room ${roomId} between ${player1.username} and ${player2.username}`);
      } else if (room.players.length > 2) {
        console.error(`⚠️ Room ${roomId} has too many players (${room.players.length}), cleaning up`);
        
        room.players = room.players.slice(0, 2);
      }
    });

    socket.on("player_leaving_game", (data) => {
      const { roomID } = data;
      console.log(`⚠️ Player intentionally leaving game room: ${roomID}`);
      
      const state = gameStates.get(roomID);
      if (state && !state.gameEnd) {
      
        state.gameEnd = true;
        
        // Determine winner based on who left
        const room = gameRooms.get(roomID);
        if (room && room.players) {
          const leavingPlayer = room.players.find(p => p.socketId === socket.id);
        
          if (leavingPlayer) {
            state.winner = room.players[0].socketId === socket.id ? 2 : 1;
          }
        }
        
        
        gameSocket.to(roomID).emit("gameUpdate", state);
        gameSocket.to(roomID).emit("player_disconnected", {
          message: "Opponent left the game"
        });
        
        console.log(`🏆 Game ended in room ${roomID} due to player leaving`);
      }
      
     
      socket.leave(roomID);
      if (socket.gameRoomId === roomID) {
        socket.gameRoomId = undefined;
      }
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Game client disconnected:", socket.id);
     
      const index = waitingPlayers.indexOf(socket.id);
      if (index > -1) {
        waitingPlayers.splice(index, 1);
      }
      
    
      if (socket.gameRoomId) {
        console.log(`🧹 Cleaning up game room ${socket.gameRoomId} for disconnected player`);
        const room = gameRooms.get(socket.gameRoomId);
        if (room) {
          // Check if game is still active
          const state = gameStates.get(socket.gameRoomId);
          if (state && !state.gameEnd) {
           
            state.gameEnd = true;
            state.winner = -1; 
            gameSocket.to(socket.gameRoomId).emit("gameUpdate", state);
            gameSocket.to(socket.gameRoomId).emit("player_disconnected", {
              message: "Opponent disconnected"
            });
            console.log(`⚠️ Player disconnected mid-game in room ${socket.gameRoomId}`);
          }
          
          room.players = room.players.filter(p => p.socketId !== socket.id);
          if (room.players.length === 0) {
            gameRooms.delete(socket.gameRoomId);
            gameStates.delete(socket.gameRoomId);
            console.log(`🧹 Deleted empty room: ${socket.gameRoomId}`);
          }
        }
      }
      
      
      if (socket.userId) {
        console.log(`⏳ User ${socket.username} (${socket.userId}) disconnected, starting grace period...`);
        
       
        const offlineTimeout = setTimeout(() => {
          // Only mark offline if user hasn't reconnected
          if (onlineUsers.get(socket.userId) === socket.id) {
            onlineUsers.delete(socket.userId);
            console.log(`❌ User ${socket.username} (${socket.userId}) is now OFFLINE (grace period expired)`);
            console.log(`📊 Total online users: ${onlineUsers.size}`);

            // Broadcast to ALL users that this user went offline
            console.log(`📢 Broadcasting ${socket.username} is offline to all users`);
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

    
      if (state.ballY + ballRadius > boardHeight || state.ballY - ballRadius < 0) {
        state.ballStepY = -state.ballStepY;
      }

    
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

   
      const MAX_SCORE = 11;
      
      if (state.score1 === MAX_SCORE) {
        state.gameEnd = true;
        state.winner = 1;
        clearInterval(interval);
        console.log(`🏆 Game ended in room ${roomID}: Player 1 wins!`);
        
        
        setTimeout(() => {
          gameRooms.delete(roomID);
          gameStates.delete(roomID);
          console.log(`🧹 Cleaned up finished game room: ${roomID}`);
        }, 5000);
      } else if (state.score2 === MAX_SCORE) {
        state.gameEnd = true;
        state.winner = 2;
        clearInterval(interval);
        console.log(`🏆 Game ended in room ${roomID}: Player 2 wins!`);
        
        
        setTimeout(() => {
          gameRooms.delete(roomID);
          gameStates.delete(roomID);
          console.log(`🧹 Cleaned up finished game room: ${roomID}`);
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

  console.log("✅ Game Socket.IO initialized on main server");
};