import React from 'react';
import { MessageSquare, Zap, QrCode, Clock, Github, Sparkles, ArrowRight, Moon, Sun, Mail, ExternalLink, Heart, Linkedin } from 'lucide-react';
import '../styles/HomePage.css';

interface HomePageProps {
    onNavigate: (action: 'join' | 'create') => void;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, darkMode, setDarkMode }) => {
    return (
        <div className="homepage-container">
            {/* Header */}
            <header className="homepage-header">
                <div className="header-content">
                    <div className="header-brand">
                        <div className="brand-icon">
                            <MessageSquare size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="brand-name">QuickChat</h1>
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="homepage-main">
                <div className="hero-section">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Anonymous & Instant</span>
                    </div>

                    <h1 className="hero-title">
                        QuickChat - Instant Anonymous Chat Rooms
                    </h1>

                    <p className="hero-subtitle">
                        QuickChat lets you create temporary chat rooms without login.
                        Perfect for events, seminars, and quick collaboration using QR code sharing.
                    </p>

                    {/* CTA Buttons */}
                    <div className="cta-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={() => onNavigate('create')}
                        >
                            <PlusSquare size={18} />
                            Create Room
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => onNavigate('join')}
                        >
                            <ArrowRight size={18} />
                            Join Room
                        </button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <h2 className="section-title">Why QuickChat?</h2>

                    <div className="features-grid">
                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <Zap size={24} />
                            </div>
                            <h3>No Signup Required</h3>
                            <p>Start chatting instantly with a simple display name. No registration needed.</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <MessageSquare size={24} />
                            </div>
                            <h3>Real-time Messaging</h3>
                            <p>Experience instant messaging with Socket.IO for seamless communication.</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <QrCode size={24} />
                            </div>
                            <h3>QR Code Instant Join</h3>
                            <p>Share rooms via QR code for quick access at events and meetings.</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <Clock size={24} />
                            </div>
                            <h3>Session-based History</h3>
                            <p>Chat history is stored during your session. Rooms automatically expire.</p>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="how-it-works-section">
                    <h2 className="section-title">How It Works</h2>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Choose Your Action</h3>
                            <p>Create a new chat room or join an existing one with a room code.</p>
                        </div>

                        <div className="step-arrow">→</div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Enter Display Name</h3>
                            <p>Pick any anonymous name to identify yourself in the chat.</p>
                        </div>

                        <div className="step-arrow-mobile">→</div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Start Chatting</h3>
                            <p>Join your room and start communicating instantly with others.</p>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Section */}
                <div className="tech-section glass-card">
                    <h3>Built with Modern Tech</h3>
                    <div className="tech-tags">
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Socket.IO</span>
                        <span className="tech-tag">Vite</span>
                        <span className="tech-tag">WebRTC</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="homepage-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="footer-brand">
                            <div className="footer-brand-icon">
                                <MessageSquare size={20} strokeWidth={2.5} />
                            </div>
                            <span>QuickChat</span>
                        </div>
                        <p className="footer-description">
                            Instant anonymous chat rooms for events, seminars, and quick collaboration. Share rooms via QR code and start communicating immediately.
                        </p>
                        <div className="footer-divider"></div>
                        <div className="footer-links-group">
                            <h4>Technology Stack</h4>
                            <p className="footer-tagline">Built with React, TypeScript, Socket.IO, and modern web technologies.</p>
                        </div>
                    </div>

                    <div className="footer-right">
                        <div className="footer-socials">
                            <a
                                href="https://github.com/owsam22"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                title="GitHub Profile"
                                aria-label="GitHub"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://linkedin.com/in/samarpan22"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                title="LinkedIn Profile"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="mailto:samarpan.works@gmail.com"
                                className="social-icon"
                                title="Send Email"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                        <div className="footer-credit">
                            Made with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#ef4444', marginRight: '4px' }} /> by <strong>owsam22</strong>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div>
                        &copy; 2026 QuickChat. All rights reserved.
                    </div>
                    <div>
                        <a href="#privacy">Privacy Policy</a> • <a href="#terms">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Icon component for create button
function PlusSquare(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={props.strokeWidth || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    );
}

export default HomePage;
