const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Track active rooms
const activeRooms = new Set();

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Verify if room exists
    socket.on('check_room', (room, callback) => {
        const exists = activeRooms.has(room);
        callback({ exists });
    });

    socket.on('create_room', (room) => {
        activeRooms.add(room);
        console.log(`Room Created: ${room}`);
    });

    socket.on('join_room', (data) => {
        const { room, username } = data;

        // Ensure room is marked as active when joined (fallback)
        activeRooms.add(room);

        socket.join(room);
        console.log(`User ${username} with ID: ${socket.id} joined room: ${room}`);

        // Notify others in the room
        socket.to(room).emit('receive_message', {
            author: 'System',
            message: `${username} has joined the conversation`,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes().toString().padStart(2, '0'),
            isSystem: true
        });
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
