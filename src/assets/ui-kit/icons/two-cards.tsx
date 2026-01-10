import React from 'react';

export default function TwoCards({ 
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
      viewBox="0 0 64 64"
      className={className}
      fill={color}
    >
      <path d="M61.345 9.369 55.97 50.252c-.366 2.78-2.926 4.718-5.687 4.352l-2.87-.384-5.357-40.7c-.458-3.42-3.383-5.998-6.839-5.998-.292 0-.603.018-.896.055L23.15 9.04l.603-4.626A5.068 5.068 0 0 1 29.44.044l27.536 3.639a5.068 5.068 0 0 1 4.37 5.686zM45.622 54.645l-5.38-40.883a5.07 5.07 0 0 0-5.688-4.366L7.02 13.02a5.07 5.07 0 0 0-4.365 5.688L8.034 59.59a5.07 5.07 0 0 0 5.688 4.366l27.534-3.623a5.07 5.07 0 0 0 4.366-5.688z" />
    </svg>
  );
}