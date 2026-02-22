import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

// Import Components
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ChatArea from './components/ChatArea';
import QRModal from './components/QRModal';
import SearchTab from './components/SearchTab';
import NewRoomTab from './components/NewRoomTab';
import SettingsTab from './components/SettingsTab';

const socket = io('http://localhost:5000');

function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'search', 'newRoom', 'settings'
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('glowchat-theme') === 'dark';
    });

    const bottomRef = useRef<HTMLDivElement>(null);

    // Apply Theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        localStorage.setItem('glowchat-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const joinRoom = () => {
        if (username !== '' && room !== '') {
            socket.emit('join_room', { room, username });
            setShowChat(true);
        }
    };

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes().toString().padStart(2, '0'),
            };

            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(room);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        const handleReceiveMessage = (data: any) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    if (!showChat) {
        return (
            <Login
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                joinRoom={joinRoom}
            />
        );
    }

    return (
        <div className="chat-window-container glass-card">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                room={room}
            />

            {activeTab === 'chat' && (
                <ChatArea
                    room={room}
                    username={username}
                    messageList={messageList}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    sendMessage={sendMessage}
                    onMobileMenuToggle={() => setSidebarOpen(true)}
                    onCopyRoomId={copyToClipboard}
                    onShowQR={() => setShowQR(true)}
                    copied={copied}
                    bottomRef={bottomRef}
                />
            )}

            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'newRoom' && <NewRoomTab />}
            {activeTab === 'settings' && <SettingsTab darkMode={darkMode} setDarkMode={setDarkMode} />}

            {showQR && <QRModal room={room} onClose={() => setShowQR(false)} />}
        </div>
    );
}

export default App;
