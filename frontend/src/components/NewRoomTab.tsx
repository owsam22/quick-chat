import React, { useState } from 'react';
import { PlusCircle, Menu } from 'lucide-react';

interface NewRoomTabProps {
    onMobileMenuToggle: () => void;
}

const NewRoomTab: React.FC<NewRoomTabProps> = ({ onMobileMenuToggle }) => {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreate = () => {
        if (!newRoomName) return;
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        alert(`Room "${newRoomName}" initialized. Logic to transition would go here. Code: ${code}`);
        setNewRoomName('');
    };

    return (
        <div className="tab-view-content">
            <div className="view-header">
                <button className="mobile-toggle" onClick={onMobileMenuToggle}>
                    <Menu size={20} />
                </button>
                <PlusCircle size={28} className="text-primary" />
                <h2>Initialize Space</h2>
            </div>

            <div className="form-card glass-card">
                <div className="input-group">
                    <label>Identity of Space</label>
                    <div className="input-field-wrapper">
                        <PlusCircle size={18} />
                        <input
                            type="text"
                            placeholder="e.g. Project Andromeda"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                        />
                    </div>
                </div>

                <p className="form-helper">
                    Creating a new space will generate a unique security signature for invited participants.
                </p>

                <button
                    className="btn-primary"
                    onClick={handleCreate}
                    disabled={!newRoomName}
                    style={{ marginTop: '12px' }}
                >
                    Create Secure Channel
                </button>
            </div>
        </div>
    );
};

export default NewRoomTab;
