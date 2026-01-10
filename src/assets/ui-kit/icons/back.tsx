import React from 'react';

export default function Back({ 
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
      viewBox="0 0 16.933 16.933"
      className={className}
      fill={color}
    >
      <path d="M4.213 2.107a1.058 1.058 0 0 0-.728.32L1.369 4.542a1.058 1.058 0 0 0 0 1.498l2.116 2.117c.998 1.004 2.501-.499 1.498-1.498l-.311-.31h5.912c1.777 0 3.174 1.398 3.174 3.176S12.36 12.7 10.584 12.7H8.467c-1.47 0-1.47 2.115 0 2.115h2.117c2.913 0 5.291-2.377 5.291-5.29s-2.378-5.291-5.291-5.291H4.672l.31-.311c.692-.673.196-1.845-.77-1.816z" />
    </svg>
  );
}