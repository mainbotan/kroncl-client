import React from 'react';

export default function Compass({ 
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
      <g>
        <path d="M18.53 3.128l-8.736 3.4A5.62 5.62 0 0 0 6.6 9.705l-3.469 8.817a1.809 1.809 0 0 0 2.362 2.341l8.783-3.554a5.621 5.621 0 0 0 3.109-3.122l3.481-8.7a1.809 1.809 0 0 0-2.336-2.359zM12 13.25A1.25 1.25 0 1 1 13.25 12 1.25 1.25 0 0 1 12 13.25z" />
      </g>
    </svg>
  );
}