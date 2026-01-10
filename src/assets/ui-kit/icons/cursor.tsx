import React from 'react';

export default function Cursor({ 
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
      <path d="m9.448 3.487 10.887 8.989a1.82 1.82 0 0 1-1.168 3.224h-3.91a3.67 3.67 0 0 0-2.927 1.454l-2.356 3.117a1.83 1.83 0 0 1-3.288-1.007L6 5.2a2.1 2.1 0 0 1 3.448-1.713z" />
    </svg>
  );
}