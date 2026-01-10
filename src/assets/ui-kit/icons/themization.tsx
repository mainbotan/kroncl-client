import React from 'react';

export default function Themization({ 
  width = 32, 
  height = 32, 
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
      <path d="M20 1H8a3 3 0 0 0-3 3v11.416A4.983 4.983 0 0 1 7 15h18c.711 0 1.387.148 2 .416V4a3 3 0 0 0-3-3h-2v5a1 1 0 1 1-2 0zM7 17a3 3 0 1 0 0 6h6v5a3 3 0 1 0 6 0v-5h6a3 3 0 1 0 0-6z" />
    </svg>
  );
}