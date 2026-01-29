import React from 'react';

export default function CollapseRight({ 
  width = 40, 
  height = 40, 
  color = "currentColor",
  className = ""
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className={className}
      fill={color}
      style={{transform: 'rotate(180deg)'}}
    >
      <g>
        <path 
          d="M22 12c0 .5-.5 1-1 1H8.4l1.8 1.8c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3s-.5-.1-.7-.3l-3.5-3.5c-.4-.4-.4-1 0-1.4l3.5-3.5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L8.4 11H21c.5 0 1 .5 1 1zM3 21c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1s1 .4 1 1v16c0 .6-.4 1-1 1z" 
          opacity="1"
        />
      </g>
    </svg>
  );
}