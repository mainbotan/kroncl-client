import React from 'react';

export default function Edit({ 
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
    >
      <g>
        <g data-name="Layer 2">
          <path d="M12.64 5.42 2.35 15.71a2.38 2.38 0 0 0-.68 1.41l-.41 3.6a1.81 1.81 0 0 0 1.81 2h.21l3.6-.41a2.42 2.42 0 0 0 1.41-.67l10.29-10.3zM22.06 4.55l-2.61-2.61a2.35 2.35 0 0 0-3.33 0L13.7 4.36l5.94 5.94 2.42-2.42a2.35 2.35 0 0 0 0-3.33z" />
        </g>
      </g>
    </svg>
  );
}