import React from 'react';

export default function Cross({ 
  width = 165, 
  height = 165, 
  color = "currentColor",
  className = "",
  rotate = 0
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width}
      height={height}
      viewBox="0 0 165 165"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
    >
      <path 
        d="M82.0008 0V165" 
        stroke={color}
      />
      <path 
        d="M0.000823975 83.2736L165.001 83" 
        stroke={color}
      />
    </svg>
  );
}