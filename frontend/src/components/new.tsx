import React, { useState, useEffect } from 'react';
import { User, Hash, Zap, ShieldCheck, Bot, PlusSquare, ArrowRight, Github, AlertCircle, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
    username: string;
    setUsername: (name: string) => void;
    room: string;
    setRoom: (room: string) => void;
    joinRoom: (isCreating?: boolean) => void;
    error?: string;
    roomFromUrl?: boolean;
    socket: any;
}

const Login: React.FC<LoginProps> = ({ username, setUsername, room, setRoom, joinRoom, error: externalError, roomFromUrl, socket }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [localError, setLocalError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isJoining, setIsJoining] = useState(false); // New state for final transition

    const displayError = externalError || localError;

    // Reset loading state if an external error (from backend) arrives
    useEffect(() => {
        if (externalError) {
            setIsJoining(false);
        }
    }, [externalError]);

    const clearError = () => { if (localError) setLocalError(''); };

    const handleSwitchToCreate = () => {
        setLocalError('');
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        setRoom(code);
        setIsCreating(true);
    };

    const handleSwitchToJoin = () => {
        setLocalError('');
        setRoom('');
        setIsCreating(false);
    };

    const handleSubmit = () => {
        if (!username.trim()) {
            setLocalError('Please enter your display name first.');
            return;
        }
        if (!room.trim()) {
            setLocalError('Please enter a room code.');
            return;
        }

        if (isCreating) {
            setLocalError('');
            setIsJoining(true); // Start loading animation
            joinRoom(true);
            return;
        }

        // For join mode: validate room exists first
        setIsChecking(true);
        setLocalError('');
        socket.emit('check_room', room, (response: { exists: boolean }) => {
            setIsChecking(false);
            if (response.exists) {
                setIsJoining(true); // Start loading animation
                joinRoom(false);
            } else {
                setLocalError('This room does not exist or has expired. Try creating a new one!');
                setIsCreating(false);
            }
        });
    };

    // Helper to determine button state
    const isLoading = isChecking || isJoining;

    return (
        <div className="login-wrapper">
            <div className="login-container glass-card">
                {/* Header */}
                <div className="login-header">
                    <div className="logo-container">
                        <Bot size={40} strokeWidth={2.5} className="text-primary" />
                    </div>
                    <h1>QuickChat <span>{isCreating ? 'Create' : 'Join'}</span></h1>
                    <p>{isCreating ? 'Generate a new room and share the code' : 'Enter a room code to connect'}</p>
                </div>

                {!roomFromUrl && (
                    <div className="mode-toggle-row">
                        <button
                            disabled={isLoading}
                            className={`mode-toggle-btn ${!isCreating ? 'active' : ''}`}
                            onClick={handleSwitchToJoin}
                        >
                            <ArrowRight size={15} /> Join Room
                        </button>
                        <button
                            disabled={isLoading}
                            className={`mode-toggle-btn ${isCreating ? 'active' : ''}`}
                            onClick={handleSwitchToCreate}
                        >
                            <PlusSquare size={15} /> Create Room
                        </button>
                    </div>
                )}

                <div className="login-form">
                    <div className="input-group">
                        <label>Display Name</label>
                        <div className={`input-field-wrapper ${!username && displayError ? 'error-ring' : ''}`}>
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                value={username}
                                disabled={isLoading}
                                onChange={(e) => { setUsername(e.target.value); clearError(); }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            Room ID
                            {roomFromUrl && (
                                <span className="room-locked-badge">
                                    <Lock size={11} /> Invite Link
                                </span>
                            )}
                        </label>
                        <div className={`input-field-wrapper ${!room && displayError ? 'error-ring' : ''} ${roomFromUrl || isCreating ? 'field-locked' : ''}`}>
                            <Hash size={18} />
                            <input
                                type="text"
                                placeholder={isCreating ? 'Auto-generated code' : 'Paste room code...'}
                                value={room}
                                readOnly={isCreating || roomFromUrl || isLoading}
                                onChange={(e) => { if (!isCreating && !roomFromUrl) { setRoom(e.target.value.toUpperCase()); clearError(); } }}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                                style={(isCreating || roomFromUrl) ? { fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary)' } : {}}
                            />
                        </div>
                    </div>

                    {displayError && (
                        <div className="custom-error-container">
                            <AlertCircle size={16} />
                            <span>{displayError}</span>
                        </div>
                    )}

                    <button
                        className={`btn-primary ${isLoading ? 'btn-loading' : ''}`}
                        style={{ marginTop: '4px' }}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isChecking && (
                            <><Loader2 className="spinner-icon" size={18} /> Checking Room...</>
                        )}
                        {isJoining && (
                            <><Loader2 className="spinner-icon" size={18} /> Entering Room...</>
                        )}
                        {!isChecking && !isJoining && (
                            isCreating
                                ? <>Create & Enter <Zap size={18} /></>
                                : <>Join Room <ArrowRight size={18} /></>
                        )}
                    </button>
                </div>

                <div className="login-footer">
                    <div className="security-tag">
                        <ShieldCheck size={14} /> Quantum-ready Encryption
                    </div>
                </div>
            </div>
            {/* ... Developer Watermark ... */}
            <div className="dev-watermark">
                <div className="watermark-main">
                    Developed by <span>Sam</span>
                </div>
                <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="watermark-link">
                    <Github size={14} /> github.com/owsam22
                </a>
            </div>
        </div>
    );
};

export default Login;