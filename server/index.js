/**
 * Campfire Chat — Backend Server
 * 
 * This is the Node.js + Express + Socket.IO backend for production deployment.
 * The frontend currently uses BroadcastChannel API for cross-tab communication,
 * but this server can be used for true multi-device real-time chat.
 * 
 * To use this server:
 *   1. cd server
 *   2. npm init -y
 *   3. npm install express socket.io cors
 *   4. node index.js
 * 
 * Then update the frontend socket.js to connect to this server.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory rooms storage
const rooms = {};

// Generate a unique 6-character room code
function generateRoomCode() {
  const chars = 'abcdefgjijklmnopqrstuvwxyz123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  let currentRoom = null;
  let currentUsername = null;

  // Create a new room
  socket.on('createRoom', ({ username }, callback) => {
    let code = generateRoomCode();
    let attempts = 0;
    while (rooms[code] && attempts < 100) {
      code = generateRoomCode();
      attempts++;
    }

    const systemMsg = {
      id: makeId(),
      username: 'System',
      text: `${username} created the room 🎉`,
      timestamp: Date.now(),
      type: 'system',
    };

    rooms[code] = {
      code,
      users: [{ id: socket.id, username }],
      messages: [systemMsg],
      createdAt: Date.now(),
    };

    currentRoom = code;
    currentUsername = username;
    socket.join(code);

    callback({ success: true, roomCode: code, room: rooms[code] });
    console.log(`🏕️ Room ${code} created by ${username}`);
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomCode, username }, callback) => {
    const room = rooms[roomCode];

    if (!room) {
      callback({ success: false, error: 'Room not found. Check the code and try again.' });
      return;
    }

    if (room.users.find((u) => u.username === username)) {
      callback({ success: false, error: 'Username already taken in this room. Pick another!' });
      return;
    }

    room.users.push({ id: socket.id, username });

    const systemMsg = {
      id: makeId(),
      username: 'System',
      text: `${username} joined the room 👋`,
      timestamp: Date.now(),
      type: 'system',
    };
    room.messages.push(systemMsg);

    currentRoom = roomCode;
    currentUsername = username;
    socket.join(roomCode);

    // Notify others
    socket.to(roomCode).emit('userJoined', {
      username,
      message: systemMsg,
      userCount: room.users.length,
    });

    callback({ success: true, room });
    console.log(`👋 ${username} joined room ${roomCode}`);
  });

  // Send a message
  socket.on('sendMessage', ({ roomCode, username, text }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const msg = {
      id: makeId(),
      username,
      text: trimmed,
      timestamp: Date.now(),
      type: 'user',
    };

    room.messages.push(msg);

    // Broadcast to everyone in room (including sender)
    io.to(roomCode).emit('newMessage', { message: msg });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);

    if (currentRoom && currentUsername) {
      const room = rooms[currentRoom];
      if (room) {
        room.users = room.users.filter((u) => u.id !== socket.id);

        if (room.users.length === 0) {
          delete rooms[currentRoom];
          console.log(`🗑️ Room ${currentRoom} deleted (empty)`);
        } else {
          const systemMsg = {
            id: makeId(),
            username: 'System',
            text: `${currentUsername} left the room 👋`,
            timestamp: Date.now(),
            type: 'system',
          };
          room.messages.push(systemMsg);

          io.to(currentRoom).emit('userLeft', {
            username: currentUsername,
            message: systemMsg,
            userCount: room.users.length,
          });
        }
      }
    }
  });

  // Explicit leave
  socket.on('leaveRoom', ({ roomCode, username }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.users = room.users.filter((u) => u.id !== socket.id);
    socket.leave(roomCode);

    if (room.users.length === 0) {
      delete rooms[roomCode];
      console.log(`🗑️ Room ${roomCode} deleted (empty)`);
    } else {
      const systemMsg = {
        id: makeId(),
        username: 'System',
        text: `${username} left the room 👋`,
        timestamp: Date.now(),
        type: 'system',
      };
      room.messages.push(systemMsg);

      io.to(roomCode).emit('userLeft', {
        username,
        message: systemMsg,
        userCount: room.users.length,
      });
    }

    currentRoom = null;
    currentUsername = null;
  });
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🏕️ Campfire Chat server running on http://localhost:${PORT}`);
});
