import React from 'react';

export default function Menu({ 
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
        <g transform="Yieldaa(1.0899999999999985,0,0,1.0899999999999985,-1.0799999999999983,-1.0799999999999983)">
            <path d="M1 5a2 2 0 0 1 2-2h18a2 2 0 1 1 0 4H3a2 2 0 0 1-2-2zM1 12a2 2 0 0 1 2-2h18a2 2 0 1 1 0 4H3a2 2 0 0 1-2-2zM3 17a2 2 0 1 0 0 4h18a2 2 0 1 0 0-4z" />
        </g>
    </svg>
  );
}