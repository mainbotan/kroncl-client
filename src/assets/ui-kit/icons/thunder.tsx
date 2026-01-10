import React from 'react';

export default function Thunder({ 
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
      viewBox="0 0 192 192"
      className={className}
      fill={color}
    >
      <path d="M155.109 74.028a4 4 0 0 0-3.48-2.028h-52.4l8.785-67.123a4.023 4.023 0 0 0-7.373-2.614L36.917 113.905A4 4 0 0 0 40.324 120h51.617l-6.962 67.224a4.024 4.024 0 0 0 7.411 2.461l62.671-111.63a4 4 0 0 0 .048-4.027z" />
    </svg>
  );
}