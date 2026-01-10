import React from 'react';

export default function Entry({ 
  width = 24, 
  height = 24, 
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
      <path d="M21.822.015C21.797.013 21.776 0 21.75 0H11C9.346 0 8 1.346 8 3v1a1 1 0 0 0 2 0V3c0-.551.449-1 1-1h4.659l-.305.102A2.01 2.01 0 0 0 14 4v15h-3c-.551 0-1-.449-1-1v-2a1 1 0 0 0-2 0v2c0 1.654 1.346 3 3 3h3v1c0 1.103.897 2 2 2 .214 0 .417-.031.637-.099l6.008-2.003A2.01 2.01 0 0 0 24 20V2C24 .834 22.995-.08 21.822.015z" />
      <path d="m10.707 9.293-4-4A1 1 0 0 0 5 6v3H1a1 1 0 0 0 0 2h4v3a1.002 1.002 0 0 0 1.707.707l4-4a.999.999 0 0 0 0-1.414z" />
    </svg>
  );
}