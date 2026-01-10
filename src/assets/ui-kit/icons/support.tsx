import React from 'react';

export default function Support({ 
  width = 24, 
  height = 24, 
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
      <path d="M31 13.5v5c0 1.379-1.121 2.5-2.5 2.5h-.68c-.957 5.666-5.885 10-11.82 10a1 1 0 1 1 0-2c5.514 0 10-4.486 10-10v-6c0-5.514-4.486-10-10-10S6 7.486 6 13v7a1 1 0 0 1-1 1H3.5A2.502 2.502 0 0 1 1 18.5v-5C1 12.121 2.121 11 3.5 11h.68C5.138 5.334 10.066 1 16 1s10.863 4.334 11.82 10h.68c1.379 0 2.5 1.121 2.5 2.5zM16 5c-4.411 0-8 3.589-8 8v5c0 4.411 3.589 8 8 8s8-3.589 8-8v-5c0-4.411-3.589-8-8-8z" />
    </svg>
  );
}