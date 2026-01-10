import React from 'react';

export default function Dev({ 
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
      viewBox="0 0 24 24"
      className={className}
      fill={color}
      fillRule="evenodd"
    >
      <g>
        <path d="M22.75 6A4.75 4.75 0 0 0 18 1.25H6A4.75 4.75 0 0 0 1.25 6v12A4.75 4.75 0 0 0 6 22.75h12A4.75 4.75 0 0 0 22.75 18zM12.488 8.163l-2.4 7.2a.751.751 0 0 0 1.424.474l2.4-7.2a.751.751 0 0 0-1.424-.474zm2.582 1.967L16.939 12l-1.869 1.87a.749.749 0 1 0 1.06 1.06l2.4-2.4a.749.749 0 0 0 0-1.06l-2.4-2.4a.749.749 0 1 0-1.06 1.06zm-7.2-1.06-2.4 2.4a.749.749 0 0 0 0 1.06l2.4 2.4a.749.749 0 1 0 1.06-1.06L7.061 12l1.869-1.87a.749.749 0 1 0-1.06-1.06z" />
      </g>
    </svg>
  );
}