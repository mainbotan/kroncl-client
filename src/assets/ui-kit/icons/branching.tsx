import React from 'react';

export default function Branching({ 
  width = 40, 
  height = 40, 
  color = "currentColor",
  className = ""
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
      fill={color}
    >
      <path d="M30 21.91v4.18A1.92 1.92 0 0 1 28.09 28h-8.18A1.92 1.92 0 0 1 18 26.09v-4.18A1.92 1.92 0 0 1 19.91 20H23v-3H9v3h3.09A1.92 1.92 0 0 1 14 21.91v4.18A1.92 1.92 0 0 1 12.09 28H3.91A1.92 1.92 0 0 1 2 26.09v-4.18A1.92 1.92 0 0 1 3.91 20H7v-3a2 2 0 0 1 2-2h6v-3h-3.09A1.92 1.92 0 0 1 10 10.09V5.91A1.92 1.92 0 0 1 11.91 4h8.18A1.92 1.92 0 0 1 22 5.91v4.18A1.92 1.92 0 0 1 20.09 12H17v3h6a2 2 0 0 1 2 2v3h3.09A1.92 1.92 0 0 1 30 21.91z" />
    </svg>
  );
}