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

const sendRoomCount = (room) => {
    const count = io.sockets.adapter.rooms.get(room)?.size || 0;
    io.in(room).emit('room_count', { count });
};

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

        // Send updated count to room
        sendRoomCount(room);

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

    socket.on('disconnecting', () => {
        // Send updated count to all rooms this socket was in before it leaves
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                // We need to wait a tick or manually subtract 1 because the socket is still in the room
                const count = (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
                io.in(room).emit('room_count', { count: Math.max(0, count) });
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
