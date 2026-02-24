
import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  idSuffix?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32, className = "", idSuffix = "default" }) => {
  const gradientId = `gold-metallic-${idSuffix}`;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2AD" />
          <stop offset="50%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#4A3B22" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#glow)">
        {/* Outer Hexagon - The Architectural Frame */}
        <path 
          d="M50 5L89 27.5V72.5L50 95L11 72.5V27.5L50 5Z" 
          stroke={`url(#${gradientId})`} 
          strokeWidth="4" 
          strokeLinejoin="miter"
        />
        {/* The Stylized 'G' - The Core Protocol */}
        <path 
          d="M74 36.5L50 22L26 36.5V63.5L50 78L74 63.5V48H50V55H66V61L50 70L34 61V39L50 30L66 39" 
          fill={`url(#${gradientId})`} 
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
};
