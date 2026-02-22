import { useState } from 'react';
import { roomManager } from '../lib/roomManager';

interface HomeProps {
  onJoinRoom: (roomCode: string, username: string) => void;
}

export function Home({ onJoinRoom }: HomeProps) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreate = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter your name first!');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    const result = roomManager.createRoom(trimmed);
    if (result.success && result.roomCode) {
      onJoinRoom(result.roomCode, trimmed);
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  const handleJoin = () => {
    const trimmedName = username.trim();
    const trimmedCode = roomCode.trim().toUpperCase();
    if (!trimmedName) {
      setError('Please enter your name first!');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!trimmedCode) {
      setError('Please enter a room code.');
      return;
    }
    if (trimmedCode.length !== 6) {
      setError('Room code should be 6 characters.');
      return;
    }
    const result = roomManager.joinRoom(trimmedCode, trimmedName);
    if (result.success) {
      onJoinRoom(trimmedCode, trimmedName);
    } else {
      setError(result.error || 'Could not join room.');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-12 left-12 w-20 h-20 bg-coral-light rounded-full opacity-60 animate-float" />
      <div className="absolute top-32 right-20 w-14 h-14 bg-sage-light rounded-full opacity-50 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-24 w-16 h-16 bg-golden-light rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-32 right-32 w-24 h-24 bg-teal-light rounded-full opacity-40 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-8 w-10 h-10 bg-sand-light rounded-full opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-coral to-golden shadow-lg shadow-coral/20 mb-4 animate-float">
            <span className="text-4xl" role="img" aria-label="campfire">🏕️</span>
          </div>
          <h1 className="text-3xl font-bold text-bark tracking-tight">
            Campfire Chat
          </h1>
          <p className="text-bark-light mt-1.5 text-sm">
            Gather around. Start a conversation.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-warmwhite rounded-3xl shadow-xl shadow-sand/15 border border-sand-light/80 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          {/* Username Input */}
          <div className="p-6 pb-4">
            <label className="block text-xs font-semibold text-bark-light uppercase tracking-wider mb-2">
              Your Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🧑</span>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="What should we call you?"
                maxLength={20}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border-2 border-sand-light/60 focus:border-coral focus:ring-0 outline-none text-bark placeholder-sand transition-colors text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <div className="flex bg-cream rounded-xl p-1 gap-1">
              <button
                onClick={() => { setActiveTab('create'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'create'
                    ? 'bg-warmwhite text-coral shadow-sm'
                    : 'text-bark-light hover:text-bark'
                }`}
              >
                ✨ Create Room
              </button>
              <button
                onClick={() => { setActiveTab('join'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'join'
                    ? 'bg-warmwhite text-teal-dark shadow-sm'
                    : 'text-bark-light hover:text-bark'
                }`}
              >
                🚪 Join Room
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 pt-5">
            {activeTab === 'create' ? (
              <div className="animate-fade-in">
                <div className="bg-coral-light/50 rounded-2xl p-5 mb-4 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="text-sm text-bark-light leading-relaxed">
                    Start a new campfire and invite friends with a unique room code.
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-coral to-coral-dark text-white font-semibold text-sm shadow-lg shadow-coral/25 hover:shadow-coral/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Light the Campfire 🏕️
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-bark-light uppercase tracking-wider mb-2">
                  Room Code
                </label>
                <div className="relative mb-4">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🔑</span>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError(''); }}
                    placeholder="Enter 6-character code"
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream border-2 border-sand-light/60 focus:border-teal focus:ring-0 outline-none text-bark placeholder-sand transition-colors text-sm font-mono tracking-widest uppercase"
                  />
                </div>
                <button
                  onClick={handleJoin}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal to-teal-dark text-white font-semibold text-sm shadow-lg shadow-teal/25 hover:shadow-teal/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Join the Circle 🤝
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 pb-5 animate-slide-down">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <span className="text-sm">⚠️</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-sand mt-5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          💡 Open multiple tabs to chat with yourself!
        </p>
      </div>
    </div>
  );
}
