import React from 'react';

export default function Cloud({ 
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
      viewBox="0 0 512 512"
      className={className}
      fill={color}
    >
      <path d="M434.931 227.069C428.207 184.032 390.897 151 346 151c-16.89 0-33.12 4.673-47.197 13.389C277.387 128.397 238.832 106 196 106c-66.167 0-120 53.833-120 120 0 .41 0 .835.015 1.245C33.49 234.408 0 271.483 0 316c0 49.629 41.371 90 91 90h330c49.629 0 91-40.371 91-90 0-44.897-34.032-82.207-77.069-88.931z" />
    </svg>
  );
}