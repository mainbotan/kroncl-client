import React from 'react';

export default function Clients({ 
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
      <path d="M4 7a5 5 0 1 1 10 0A5 5 0 0 1 4 7zM14.65 11.132c-.256.35-.084.868.35.868a5 5 0 1 0 0-10c-.434 0-.606.517-.35.868C15.5 4.026 16 5.454 16 7s-.5 2.974-1.35 4.132zM20 22a1 1 0 0 1-1-1v-2c0-1.5-.494-2.971-1.38-4.17-.239-.324-.023-.83.38-.83a5 5 0 0 1 5 5v2a1 1 0 0 1-1 1zM2.464 15.464A5 5 0 0 1 6 14h6a5 5 0 0 1 5 5v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a5 5 0 0 1 1.464-3.535z" />
    </svg>
  );
}