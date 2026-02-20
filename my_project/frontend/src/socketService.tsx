import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { API_URL } from "./Api.tsx";

let socket: Socket | null = null;
export const OnlineUsers = new Map<number, string>();

let updateCallback: (() => void) | null = null;
const USER_DATA_KEY = 'socket_user_data';
export const onOnlineUsersChange = (callback: () => void) => {
  updateCallback = callback;
};

const notifyUpdate = () => {
  if (updateCallback) {
    updateCallback();
  }
};



export const saveUserDataToStorage = (userId: number, username: string) => {
  const userData = { userId, username, timestamp: Date.now() };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};


export const clearUserDataFromStorage = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

export const connectSocket = (userId: number, username: string) => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }
  saveUserDataToStorage(userId, username);

  const serverUrl = `${API_URL}`;
  socket = io(serverUrl, { 
    reconnection: true, 
    reconnectionAttempts: Infinity, 
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket', 'polling'],
    forceNew: false 
  });

  socket.on("connect", () => {
    console.log(" Connected to server", username);
    socket?.emit("user_connected", { userId, username });
    socket?.emit("hello", "Hi server!");
  });

  socket.on("online_users", (users: Array<{ userId: number; username: string }>) => {
    console.log(" Received online users list:", users);
    OnlineUsers.clear();
    users.forEach(user => {
      OnlineUsers.set(user.userId, user.username);
    });
    console.log(" OnlineUsers Map after init:", Array.from(OnlineUsers.entries()));
    

    notifyUpdate();
  });

  socket.on("user_status_update", (data: { userId: number; username: string; status: string }) => {
    console.log(`👤 Status update: ${data.username} (${data.userId}) is now ${data.status}`);
    
    if (data.status === "Online") {
      OnlineUsers.set(data.userId, data.username);
      console.log(`Added ${data.username} to OnlineUsers`);
    } else if (data.status === "Offline") {
      OnlineUsers.delete(data.userId);
      console.log(` Removed ${data.username} from OnlineUsers`);
    }
    
    console.log(" Current OnlineUsers Map:", Array.from(OnlineUsers.entries()));
    
 
    notifyUpdate();
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Disconnected from server:", reason);
  });

  socket.on("reconnect", () => {
    console.log(" Reconnected to server");
    socket?.emit("user_connected", { userId, username });
  });

  socket.on("private_game_start", (data: { roomId: string; player1: any; player2: any }) => {
    console.log(" Private game invitation received:", data);
    
    if (data.player1.id === userId || data.player2.id === userId) {
      console.log(" You are invited to a private game!");
      
      console.log(" Stored game data:", {
        roomId: data.roomId,
        gameData: data
      });

      console.log("🎮 Triggering callback navigation...");
      if (privateGameCallback) {
        privateGameCallback(data);
      }
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  clearUserDataFromStorage();
  OnlineUsers.clear();
  notifyUpdate();
};

export const logoutUser = (userId: number, username: string) => {
  if (socket && socket.connected) {
    console.log(` Sending logout event for ${username} (${userId})`);
    socket.emit("user_logout", { userId, username });
  }
  disconnectSocket();
};

export const getSocket = () => socket;

let privateGameCallback: ((data: any) => void) | null = null;

export const onPrivateGameInvite = (callback: (data: any) => void) => {
  privateGameCallback = callback;
};