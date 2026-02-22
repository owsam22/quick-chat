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

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        const { room, username } = data;
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
