import React from 'react';
import { Settings, Moon, Sun, User, Shield, Info } from 'lucide-react';

interface SettingsTabProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ darkMode, setDarkMode }) => {
    return (
        <div className="tab-view-content">
            <div className="view-header">
                <Settings size={24} />
                <h2>Application Settings</h2>
            </div>

            <div className="settings-section glass-card">
                <h3>Appearance</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-icon"><Moon size={18} /></div>
                        <div>
                            <div className="setting-label">Dark Mode</div>
                            <div className="setting-desc">Adjust the interface to reduce eye strain</div>
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
                <h3>Privacy & Security</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-icon"><Shield size={18} /></div>
                        <div>
                            <div className="setting-label">End-to-End Encryption</div>
                            <div className="setting-desc">All messages are secured with RSA-2048</div>
                        </div>
                    </div>
                    <span className="status-badge">Active</span>
                </div>
            </div>

            <div className="settings-section glass-card">
                <h3>About</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <div className="setting-icon"><Info size={18} /></div>
                        <div>
                            <div className="setting-label">GlowChat Version</div>
                            <div className="setting-desc">v2.4.0 (Stable Build)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
