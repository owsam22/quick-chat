import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const NewRoomTab = () => {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreate = () => {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        alert(`Created room: ${newRoomName} with ID: ${code}`);
    };

    return (
        <div className="tab-view-content">
            <div className="view-header">
                <PlusCircle size={24} />
                <h2>Create New Space</h2>
            </div>
            <div className="new-room-form">
                <div className="input-group">
                    <label>Room Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Project Alpha"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                </div>
                <button className="btn-primary" style={{ marginTop: '20px' }} onClick={handleCreate}>
                    Initialize New Room
                </button>
            </div>
        </div>
    );
};

export default NewRoomTab;
