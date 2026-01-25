import React from 'react';

interface MenuProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function Menu({ 
  width = 20, 
  height = 20, 
  color = "currentColor",
  className = ""
}: MenuProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h14M3 13h14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
