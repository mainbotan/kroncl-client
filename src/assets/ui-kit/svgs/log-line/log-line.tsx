import React from 'react';

export default function LogLine({ 
  width = 105, 
  height = 168, 
  strokeColor = "currentColor",
  strokeWidth = 1,
  className = ""
}) {
  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 105 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M0.499969 0.00558472C2.09997 143.206 70.5 171.006 104.5 167.006" 
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}