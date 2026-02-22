import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRModalProps {
    room: string;
    onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ room, onClose }) => {
    return (
        <div className="qr-overlay" onClick={onClose}>
            <div className="qr-card glass-card" onClick={e => e.stopPropagation()}>
                <button className="qr-close" onClick={onClose}><X size={18} /></button>
                <h3>Scan to Join</h3>
                <p>Scan this QR to join room #{room} directly.</p>
                <div className="qr-wrapper">
                    <QRCodeCanvas
                        value={JSON.stringify({ room, type: 'chat-join' })}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                <div className="room-code-display">{room}</div>
            </div>
        </div>
    );
};

export default QRModal;
