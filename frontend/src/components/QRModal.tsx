import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Share2 } from 'lucide-react';

interface QRModalProps {
    room: string;
    onClose: () => void;
    onShare: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ room, onClose, onShare }) => {
    return (
        <div className="qr-overlay" onClick={onClose}>
            <div className="qr-card glass-card" onClick={e => e.stopPropagation()}>
                <button className="qr-close" onClick={onClose}><X size={18} /></button>
                <h3>Scan to Join</h3>
                <p>Scan this QR to join room #{room} directly.</p>
                <div className="qr-wrapper">
                    <QRCodeCanvas
                        value={`${window.location.origin}${window.location.pathname}?room=${room}`}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                <div className="room-code-display">{room}</div>

                <div style={{ marginTop: '24px' }}>
                    <button
                        className="btn-primary"
                        onClick={onShare}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <Share2 size={18} /> Share Room Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRModal;
