import React from 'react';

export default function Keyhole({ 
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
      <path d="M40.569 32.292a15.432 15.432 0 0 0 6.877-12.845C47.446 10.929 40.517 4 31.999 4s-15.447 6.929-15.447 15.447c0 5.164 2.571 9.965 6.877 12.845a1 1 0 0 1 .43 1.002l-4.63 26.707h25.54l-4.63-26.707a1 1 0 0 1 .43-1.002z" />
    </svg>
  );
}