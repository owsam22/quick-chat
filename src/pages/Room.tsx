import { useState, useEffect, useRef } from 'react';
import { roomManager, ChatMessage, RoomData } from '../lib/roomManager';

interface RoomProps {
  roomCode: string;
  username: string;
  onLeave: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-coral to-coral-dark',
    'from-teal to-teal-dark',
    'from-sage to-sage-dark',
    'from-golden to-clay',
    'from-sand to-clay',
    'from-bark-light to-bark',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-cyan-400 to-cyan-600',
    'from-amber-400 to-amber-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function Room({ roomCode, username, onLeave }: RoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load initial room data
  useEffect(() => {
    const room = roomManager.getRoom(roomCode);
    if (room) {
      setMessages([...room.messages]);
      setUsers([...room.users]);
    }
  }, [roomCode]);

  // Listen for broadcast events
  useEffect(() => {
    const handleJoin = (event: { roomCode: string; payload: Record<string, unknown> }) => {
      if (event.roomCode !== roomCode) return;
      const msg = event.payload.message as ChatMessage;
      const user = event.payload.username as string;
      setMessages(prev => [...prev, msg]);
      setUsers(prev => prev.includes(user) ? prev : [...prev, user]);
    };

    const handleLeave = (event: { roomCode: string; payload: Record<string, unknown> }) => {
      if (event.roomCode !== roomCode) return;
      const msg = event.payload.message as ChatMessage;
      const user = event.payload.username as string;
      setMessages(prev => [...prev, msg]);
      setUsers(prev => prev.filter(u => u !== user));
    };

    const handleMessage = (event: { roomCode: string; payload: Record<string, unknown> }) => {
      if (event.roomCode !== roomCode) return;
      const msg = event.payload.message as ChatMessage;
      setMessages(prev => [...prev, msg]);
    };

    const handleDeleted = (event: { roomCode: string }) => {
      if (event.roomCode !== roomCode) return;
      onLeave();
    };

    roomManager.on('user-joined', handleJoin);
    roomManager.on('user-left', handleLeave);
    roomManager.on('new-message', handleMessage);
    roomManager.on('room-deleted', handleDeleted);

    return () => {
      roomManager.off('user-joined', handleJoin);
      roomManager.off('user-left', handleLeave);
      roomManager.off('new-message', handleMessage);
      roomManager.off('room-deleted', handleDeleted);
    };
  }, [roomCode, onLeave]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount / leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      roomManager.leaveRoom(roomCode, username);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomCode, username]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const msg = roomManager.sendMessage(roomCode, username, trimmed);
    if (msg) {
      setMessages(prev => [...prev, msg]);
    }
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeave = () => {
    roomManager.leaveRoom(roomCode, username);
    onLeave();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = roomCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const refreshRoom = () => {
    const room: RoomData | null = roomManager.getRoom(roomCode);
    if (room) {
      setMessages([...room.messages]);
      setUsers([...room.users]);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-warmwhite border-b border-sand-light/60 shadow-sm relative z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral to-golden flex items-center justify-center shadow-sm">
              <span className="text-lg">🏕️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="group flex items-center gap-1.5 bg-cream hover:bg-coral-light/50 rounded-lg px-2.5 py-1 transition-colors"
                  title="Click to copy room code"
                >
                  <span className="font-mono font-bold text-sm text-bark tracking-widest">{roomCode}</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {showCopied ? '✅' : '📋'}
                  </span>
                </button>
                {showCopied && (
                  <span className="text-xs text-sage-dark font-medium animate-fade-in">Copied!</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User count */}
            <button
              onClick={() => { refreshRoom(); setShowUsers(!showUsers); }}
              className="flex items-center gap-1.5 bg-sage-light hover:bg-sage-light/80 rounded-xl px-3 py-1.5 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
              </span>
              <span className="text-xs font-semibold text-sage-dark">{users.length}</span>
              <span className="text-xs text-sage-dark hidden sm:inline">online</span>
            </button>

            {/* Sync button */}
            <button
              onClick={refreshRoom}
              className="w-8 h-8 rounded-xl bg-cream hover:bg-sand-light flex items-center justify-center transition-colors text-sm"
              title="Sync messages"
            >
              🔄
            </button>

            {/* Leave button */}
            <button
              onClick={handleLeave}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <span>Leave</span>
              <span>👋</span>
            </button>
          </div>
        </div>

        {/* Users dropdown */}
        {showUsers && (
          <div className="absolute right-4 top-full mt-1 bg-warmwhite border border-sand-light rounded-2xl shadow-xl p-3 min-w-48 animate-slide-down z-30">
            <p className="text-xs font-semibold text-bark-light uppercase tracking-wider mb-2 px-1">
              In this room
            </p>
            <div className="space-y-1.5">
              {users.map(user => (
                <div key={user} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-cream transition-colors">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getAvatarColor(user)} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{getInitial(user)}</span>
                  </div>
                  <span className="text-sm text-bark font-medium">
                    {user}{user === username ? ' (you)' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close users panel */}
      {showUsers && (
        <div className="fixed inset-0 z-10" onClick={() => setShowUsers(false)} />
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        onClick={() => setShowUsers(false)}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Welcome message */}
          <div className="text-center py-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-golden-light/60 rounded-2xl px-4 py-2">
              <span className="text-sm">🏕️</span>
              <span className="text-xs font-medium text-clay">
                Welcome to campfire <span className="font-mono font-bold">{roomCode}</span> — share the code to invite friends!
              </span>
            </div>
          </div>

          {messages.map((msg, index) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center msg-bubble" style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}>
                  <div className="inline-flex items-center gap-1.5 bg-sand-light/60 rounded-full px-4 py-1.5">
                    <span className="text-xs text-bark-light font-medium">{msg.text}</span>
                    <span className="text-[10px] text-sand">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            }

            const isOwn = msg.username === username;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} msg-bubble`}
                style={{ animationDelay: `${Math.min(index * 0.03, 0.3)}s` }}
              >
                <div className={`flex gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  {!isOwn && (
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(msg.username)} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}>
                      <span className="text-white text-xs font-bold">{getInitial(msg.username)}</span>
                    </div>
                  )}

                  <div className={`${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Username */}
                    {!isOwn && (
                      <span className="text-[11px] font-semibold text-bark-light ml-1 mb-0.5">{msg.username}</span>
                    )}

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                        isOwn
                          ? 'bg-gradient-to-br from-coral to-coral-dark text-white rounded-br-md'
                          : 'bg-warmwhite border border-sand-light/50 text-bark rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>

                    {/* Time */}
                    <span className={`text-[10px] text-sand mt-0.5 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-warmwhite border-t border-sand-light/60 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                maxLength={1000}
                className="w-full px-4 py-3 rounded-2xl bg-cream border-2 border-sand-light/50 focus:border-coral/50 focus:ring-0 outline-none text-bark placeholder-sand text-sm transition-colors"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                input.trim()
                  ? 'bg-gradient-to-br from-coral to-coral-dark text-white shadow-lg shadow-coral/25 hover:shadow-coral/40 hover:scale-105 active:scale-95'
                  : 'bg-sand-light text-sand cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-sand">
              Chatting as <span className="font-semibold text-bark-light">{username}</span>
            </span>
            <span className="text-[10px] text-sand">
              Press Enter to send
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
