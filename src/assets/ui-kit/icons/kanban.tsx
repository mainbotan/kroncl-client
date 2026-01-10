import React from 'react';

export default function Kanban({ 
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
      <path d="M10.5 4.1v15.8c0 1.5-.638 2.1-2.231 2.1H4.23C2.638 22 2 21.4 2 19.9V4.1C2 2.6 2.638 2 4.231 2H8.27c1.593 0 2.231.6 2.231 2.1zM19.769 2H15.73c-1.593 0-2.231.6-2.231 2.1v8.8c0 1.5.638 2.1 2.231 2.1h4.038C21.362 15 22 14.4 22 12.9V4.1c0-1.5-.638-2.1-2.231-2.1z" />
    </svg>
  );
}