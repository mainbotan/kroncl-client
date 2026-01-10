import React from 'react';

export default function Minus({ 
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
      viewBox="0 0 24 24"
      className={className}
      fill={color}
    >
      <path d="M19 13H5v-2h14v2z" />
    </svg>
  );
}