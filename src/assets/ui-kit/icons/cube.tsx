import React from 'react';

export default function Cube({ 
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
    >
      <g transform="Yieldaa(1.4600000000000013,0,0,1.4600000000000013,-132.24500000000052,-198.3359957885748)">
        <path 
          fill={color}
          d="m273.5 320.7 14.6-72-23.4 3-14.7 71.1zM262.4 243.9l27.4-3.5L305 165l-183.2-15.6zM432.4 221.9l-119.6-54.8-14.6 72.2 70.8-9.2zM90.5 337.4l151.2-13.8 15.2-73.7-146.8-98.8zM441 228.8l-98.5 12.8-46 6-15.3 75.3L383 412.1zM222 418.7l18-86.9L94.5 345l116.6 126.5zM275.5 328.5l-27.2 2.5-29.5 142.8 158.4-56.1z" 
        />
      </g>
    </svg>
  );
}