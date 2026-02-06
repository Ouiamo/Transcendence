// socketService.tsx
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const OnlineUsers = new Map<number, string>();

// Simple notification system for React components
let updateCallback: (() => void) | null = null;

export const onOnlineUsersChange = (callback: () => void) => {
  updateCallback = callback;
};

const notifyUpdate = () => {
  if (updateCallback) {
    updateCallback();
  }
};

// localStorage helpers for user data
const USER_DATA_KEY = 'socket_user_data';

export const saveUserDataToStorage = (userId: number, username: string) => {
  const userData = { userId, username, timestamp: Date.now() };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserDataFromStorage = (): { userId: number; username: string } | null => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    
    const userData = JSON.parse(data);
    // Check if data is not too old (optional: expire after 24 hours)
    const isDataFresh = Date.now() - userData.timestamp < 24 * 60 * 60 * 1000;
    
    if (isDataFresh && userData.userId && userData.username) {
      return { userId: userData.userId, username: userData.username };
    }
  } catch (error) {
    console.error('Error reading user data from storage:', error);
  }
  return null;
};

export const clearUserDataFromStorage = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

export const connectSocket = (userId: number, username: string) => {
  if (socket && socket.connected) {
    console.log("✅ Socket already connected");
    return socket;
  }

  // Save user data to localStorage for future reconnections
  saveUserDataToStorage(userId, username);

  const serverUrl = "https://localhost:3010";
  socket = io(serverUrl, { 
    reconnection: true, 
    reconnectionAttempts: 5, 
    reconnectionDelay: 500,
    forceNew: false // Reuse existing connection if possible
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server", username);
    socket?.emit("user_connected", { userId, username });
    socket?.emit("hello", "Hi server!");
  });

  socket.on("online_users", (users: Array<{ userId: number; username: string }>) => {
    console.log("📋 Received online users list:", users);
    OnlineUsers.clear();
    users.forEach(user => {
      OnlineUsers.set(user.userId, user.username);
    });
    console.log("📊 OnlineUsers Map after init:", Array.from(OnlineUsers.entries()));
    
    // Tell React to update!
    notifyUpdate();
  });

  socket.on("user_status_update", (data: { userId: number; username: string; status: string }) => {
    console.log(`👤 Status update: ${data.username} (${data.userId}) is now ${data.status}`);
    
    if (data.status === "Online") {
      OnlineUsers.set(data.userId, data.username);
      console.log(`✅ Added ${data.username} to OnlineUsers`);
    } else if (data.status === "Offline") {
      OnlineUsers.delete(data.userId);
      console.log(`❌ Removed ${data.username} from OnlineUsers`);
    }
    
    console.log("📊 Current OnlineUsers Map:", Array.from(OnlineUsers.entries()));
    
    // Tell React to update!
    notifyUpdate();
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Disconnected from server:", reason);
  });

  socket.on("reconnect", () => {
    console.log("🔄 Reconnected to server");
    // Re-emit user_connected on reconnection
    socket?.emit("user_connected", { userId, username });
  });

  // Listen for private game invitations
  socket.on("private_game_start", (data: { roomId: string; player1: any; player2: any }) => {
    console.log("🎮 Private game invitation received:", data);
    
    // Check if current user is one of the players
    if (data.player1.id === userId || data.player2.id === userId) {
      console.log("🎮 You are invited to a private game!");
      
      // Store game info in localStorage for the game component to use
      localStorage.setItem('private_game_room', data.roomId);
      localStorage.setItem('private_game_data', JSON.stringify(data));
      
      console.log("🎮 Stored game data:", {
        roomId: data.roomId,
        gameData: data
      });
      
      // Join the private game room
      socket?.emit("join_private_game", {
        roomId: data.roomId,
        playerId: userId,
        playerUsername: username
      });
      
      console.log("🎮 Emitted join_private_game event");
      
      // Force navigation to game page
      console.log("🎮 Triggering navigation...");
      window.dispatchEvent(new Event('private_game_start'));
    }
  });

  return socket;
};

// New function to connect early using stored data
export const connectSocketFromStorage = (): Socket | null => {
  const userData = getUserDataFromStorage();
  if (userData) {
    console.log("🚀 Connecting socket from stored data:", userData);
    return connectSocket(userData.userId, userData.username);
  }
  return null;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // Clear stored user data when explicitly disconnecting
  clearUserDataFromStorage();
  // Clear the online users map
  OnlineUsers.clear();
  notifyUpdate();
};

export const logoutUser = (userId: number, username: string) => {
  if (socket && socket.connected) {
    console.log(`🚪 Sending logout event for ${username} (${userId})`);
    socket.emit("user_logout", { userId, username });
  }
  disconnectSocket();
};

export const getSocket = () => socket;