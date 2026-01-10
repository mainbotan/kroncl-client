import React from 'react';

export default function Account({ 
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
      viewBox="0 0 32 32"
      className={className}
      fill={color}
    >
      <path d="M16 17a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0-4-4z" />
      <path d="M16 31a15 15 0 0 1-11.59-5.49l-.52-.64.52-.63a15 15 0 0 1 23.18 0l.52.63-.52.64A15 15 0 0 1 16 31zm-9.49-6.12a13 13 0 0 0 19 0 13 13 0 0 0-19 0z" />
      <path d="M16 31a15 15 0 1 1 11.59-5.49A15 15 0 0 1 16 31zm0-28a13 13 0 1 0 13 13A13 13 0 0 0 16 3z" />
      <path d="M5.18 24.88S15.25 36.13 25.5 26l1.32-1.12S18.26 16 9.57 21.33z" />
      <circle cx="16" cy="11" r="5" />
    </svg>
  );
}