import React from 'react';
import { Menu, Zap, User, Copy, QrCode, PlusCircle, Send, CheckCircle2, Hash, Share2, X } from 'lucide-react';

interface Message {
    author: string;
    message: string;
    time: string;
    isSystem?: boolean;
}

interface ChatAreaProps {
    room: string;
    username: string;
    messageList: Message[];
    currentMessage: string;
    setCurrentMessage: (msg: string) => void;
    sendMessage: () => void;
    onMobileMenuToggle: () => void;
    onCopyRoomId: () => void;
    onShowQR: () => void;
    onShare: () => void;
    copied: boolean;
    bottomRef: React.RefObject<HTMLDivElement>;
    participantCount: number;
    roomUsers: string[];
}

const ChatArea: React.FC<ChatAreaProps> = ({
    room,
    username,
    messageList,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    onMobileMenuToggle,
    onCopyRoomId,
    onShowQR,
    onShare,
    copied,
    bottomRef,
    participantCount,
    roomUsers
}) => {
    const [showMembers, setShowMembers] = React.useState(false);

    return (
        <div className="chat-main">
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="mobile-toggle" onClick={onMobileMenuToggle}>
                        <Menu size={20} />
                    </button>
                    <div className="chat-room-info" onClick={() => setShowMembers(!showMembers)}>
                        <h3>#{room}</h3>
                        <div className="room-badge">
                            <Zap size={14} color='#00d000ff' className="text-primary" /> {participantCount} Online
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    <div className="room-id-chip" onClick={onCopyRoomId} title="Click to Copy Share Link">
                        <Hash size={16} className="text-primary" />
                        <span>{room}</span>
                        {copied ? <CheckCircle2 size={16} className="text-primary" /> : <Copy size={16} />}
                    </div>

                    <button className="icon-btn share-btn desktop-only" title="Share Room" onClick={onShare}>
                        <Share2 size={18} />
                    </button>

                    <button className="icon-btn" title="Join QR" onClick={onShowQR}>
                        <QrCode size={18} />
                    </button>

                    <div className="user-profile">
                        <span className="desktop-only" style={{ fontWeight: 600 }}>{username}</span>
                        <div className="avatar-circle">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {showMembers && (
                <div className="members-overlay">
                    <div className="members-header">
                        <span style={{ fontWeight: 700 }}>Active Members ({participantCount})</span>
                        <button className="icon-btn" onClick={() => setShowMembers(false)}><X size={16} /></button>
                    </div>
                    <div className="members-list">
                        {roomUsers.map((user, idx) => (
                            <div key={idx} className="member-item">
                                <div className="member-status-dot"></div>
                                <span>{user} {user === username ? '(You)' : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="message-container">
                {messageList.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-wrapper ${msg.isSystem ? 'system' : msg.author === username ? 'sent' : 'received'}`}
                    >
                        <div className="message-bubble">
                            {msg.message}
                        </div>
                        {!msg.isSystem && (
                            <div className="message-meta">
                                <span>{msg.author}</span>
                                <span>•</span>
                                <span>{msg.time}</span>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="message-input-area">
                <div className="input-container">
                    <PlusCircle size={20} className="action-btn" />
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Ask or type something..."
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="action-btn send-btn">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
