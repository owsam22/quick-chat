import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const QuickChatLogo: React.FC<LogoProps> = ({ size = 32, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    width={size} 
    height={size} 
    className={className}
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="qc-grad-react" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1D4ED8"/>
      </linearGradient>
    </defs>

    <rect x="32" y="32" width="448" height="448" rx="100" fill="url(#qc-grad-react)"/>
    <path d="M 136 152 C 136 138.745 146.745 128 160 128 H 336 C 349.255 128 360 138.745 360 152 V 264 C 360 277.255 349.255 288 336 288 H 230 L 170 336 V 288 H 160 C 146.745 288 136 277.255 136 264 V 152 Z" fill="#FFFFFF"/>
    <rect x="180" y="184" width="120" height="18" rx="9" fill="#2563EB"/>
    <rect x="180" y="220" width="70" height="18" rx="9" fill="#2563EB"/>
    <circle cx="330" cy="330" r="28" fill="#10B981" stroke="#FFFFFF" strokeWidth="8"/>
  </svg>
);

export default QuickChatLogo;
