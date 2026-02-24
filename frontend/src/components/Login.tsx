import React, { useState } from 'react';
import { User, Hash, Zap, ShieldCheck, Bot, PlusSquare, ArrowRight, Github, AlertCircle, Lock } from 'lucide-react';

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
    const displayError = externalError || localError;

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
            joinRoom(true);
            return;
        }

        // For join mode: validate room exists first
        setIsChecking(true);
        setLocalError('');
        socket.emit('check_room', room, (response: { exists: boolean }) => {
            setIsChecking(false);
            if (response.exists) {
                joinRoom(false);
            } else {
                setLocalError('This room does not exist or has expired. Try creating a new one!');
                setIsCreating(false);
            }
        });
    };

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

                {/* Mode Toggle — hidden if room was pre-filled from URL */}
                {!roomFromUrl && (
                    <div className="mode-toggle-row">
                        <button
                            className={`mode-toggle-btn ${!isCreating ? 'active' : ''}`}
                            onClick={handleSwitchToJoin}
                        >
                            <ArrowRight size={15} /> Join Room
                        </button>
                        <button
                            className={`mode-toggle-btn ${isCreating ? 'active' : ''}`}
                            onClick={handleSwitchToCreate}
                        >
                            <PlusSquare size={15} /> Create Room
                        </button>
                    </div>
                )}

                {/* Inputs */}
                <div className="login-form">
                    <div className="input-group">
                        <label>Display Name</label>
                        <div className={`input-field-wrapper ${!username && displayError ? 'error-ring' : ''}`}>
                            <User size={18} />
                            <input
                                type="text"
                                placeholder="Enter your name..."
                                value={username}
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
                                readOnly={isCreating || roomFromUrl}
                                onChange={(e) => { if (!isCreating && !roomFromUrl) { setRoom(e.target.value.toUpperCase()); clearError(); } }}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                style={(isCreating || roomFromUrl) ? { fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary)' } : {}}
                            />
                            {isCreating && !roomFromUrl && (
                                <button className="auto-gen-btn" title="Regenerate Code" onClick={handleSwitchToCreate}>
                                    <Zap size={14} />
                                </button>
                            )}
                            {roomFromUrl && (
                                <div className="lock-icon-badge" title="Room from invite link — cannot be changed">
                                    <Lock size={14} />
                                </div>
                            )}
                        </div>
                        {isCreating && <p className="helper-text">Share this code with people you want to invite.</p>}
                        {roomFromUrl && <p className="helper-text" style={{ color: 'var(--primary)' }}>Joined via invite link. Room ID is locked.</p>}
                    </div>

                    {displayError && (
                        <div className="custom-error-container">
                            <AlertCircle size={16} />
                            <span>{displayError}</span>
                            {localError.includes('does not exist') && (
                                <button
                                    className="error-action-btn"
                                    onClick={handleSwitchToCreate}
                                >
                                    Create Instead
                                </button>
                            )}
                        </div>
                    )}

                    <button className="btn-primary" style={{ marginTop: '4px' }} onClick={handleSubmit} disabled={isChecking}>
                        {isChecking
                            ? <><span className="btn-spinner" /> Checking...</>
                            : isCreating
                                ? <>Create & Enter <Zap size={18} /></>
                                : <>Join Room <ArrowRight size={18} /></>
                        }
                    </button>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <div className="security-tag">
                        <ShieldCheck size={14} /> Quantum-ready Encryption
                    </div>
                </div>
            </div>

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
