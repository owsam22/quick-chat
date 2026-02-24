import React from 'react';
import { Settings, Moon, Sun, User, Shield, Info, Menu, Github } from 'lucide-react';

interface SettingsTabProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
    onMobileMenuToggle: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ darkMode, setDarkMode, onMobileMenuToggle }) => {
    return (
        <div className="tab-view-content">
            <div className="view-header">
                <button className="mobile-toggle" onClick={onMobileMenuToggle}>
                    <Menu size={20} />
                </button>
                <Settings size={28} className="text-primary" />
                <h2>System Configuration</h2>
            </div>

            <div className="settings-grid">
                <div className="settings-section glass-card">
                    <h3>Visual Identity</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon"><Moon size={18} /></div>
                            <div>
                                <div className="setting-label">Atmosphere</div>
                                <div className="setting-desc">Switch between light and dark nebula</div>
                            </div>
                        </div>
                        <button
                            className={`theme-toggle-btn ${darkMode ? 'active' : ''}`}
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            <div className="toggle-thumb">
                                {darkMode ? <Moon size={12} /> : <Sun size={12} />}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="settings-section glass-card">
                    <h3>Security Core</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon"><Shield size={18} /></div>
                            <div>
                                <div className="setting-label">Neural Encryption</div>
                                <div className="setting-desc">Quantum-resistant RSA active</div>
                            </div>
                        </div>
                        <span className="status-badge">SECURED</span>
                    </div>
                </div>

                <div className="settings-section glass-card">
                    <h3>Intelligence</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon"><Info size={18} /></div>
                            <div>
                                <div className="setting-label">System Version</div>
                                <div className="setting-desc">v2.5.0 Premium Hub</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section glass-card">
                    <h3>Developer Network</h3>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon"><User size={18} /></div>
                            <div>
                                <div className="setting-label">Creator</div>
                                <div className="setting-desc">Sam</div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="setting-info">
                            <div className="setting-icon"><Github size={18} /></div>
                            <div>
                                <div className="setting-label">Source Node</div>
                                <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" className="github-link">
                                    github.com/owsam22
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
