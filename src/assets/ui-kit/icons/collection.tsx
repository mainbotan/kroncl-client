import React from 'react';

export default function Collection({ 
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
      <path 
        fillRule="evenodd" 
        clipRule="evenodd"
        d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1H6zM4 9.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H4zM2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zm7.25 1a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75z" 
      />
    </svg>
  );
}