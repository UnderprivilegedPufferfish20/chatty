import React from 'react';

export function TypingBubble({ 
  className = "",
  dotColor = "#9ca3af",
  backgroundColor = "#e5e7eb"
}: { 
  className?: string;
  dotColor?: string;
  backgroundColor?: string;
}) {
  return (
    <div 
      className={`inline-flex items-center px-4 py-3 rounded-full ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '0ms',
            animationDuration: '1.4s'
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '150ms',
            animationDuration: '1.4s'
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '300ms',
            animationDuration: '1.4s'
          }}
        />
      </div>
    </div>
  );
}