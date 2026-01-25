import React from 'react';

interface CloseProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function Close({ 
  width = 24, 
  height = 24, 
  color = "currentColor",
  className = ""
}: CloseProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
