import React from 'react';

export default function SuccessStatus({ 
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
      viewBox="0 0 21 21"
      className={className}
      fill={color}
      fillRule="evenodd"
    >
      <g>
        <path d="M10.504 1.318a9.189 9.189 0 0 1 0 18.375 9.189 9.189 0 0 1 0-18.375zM8.596 13.49l-2.25-2.252a.986.986 0 0 1 0-1.392.988.988 0 0 1 1.393 0l1.585 1.587 3.945-3.945a.986.986 0 0 1 1.392 0 .987.987 0 0 1 0 1.392l-4.642 4.642a.987.987 0 0 1-1.423-.032z" />
      </g>
    </svg>
  );
}