import React from 'react';

export function AnonymousUserIcon({ 
  size = 24, 
  className = "", 
  color = "#000000" 
}: { 
  size?: number; 
  className?: string; 
  color?: string; 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle background */}
      <circle
        cx="12"
        cy="12"
        r="12"
        fill={color}
      />
      
      {/* Head (white circle) */}
      <circle
        cx="12"
        cy="9"
        r="3"
        fill="white"
      />
      
      {/* Body (white oval/ellipse) */}
      <ellipse
        cx="12"
        cy="19"
        rx="5"
        ry="3"
        fill="white"
      />
    </svg>
  );
}