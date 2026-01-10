import React from 'react';

export default function Copy({
  color = "currentColor",
  className = ""
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={color}
    >
      <path d="M18.548 2H9.452A3.456 3.456 0 0 0 6 5.452V6h-.548A3.456 3.456 0 0 0 2 9.452v9.096A3.456 3.456 0 0 0 5.452 22h9.096c1.748 0 3.182-1.312 3.406-3h.594A3.456 3.456 0 0 0 22 15.548V5.452A3.456 3.456 0 0 0 18.548 2zM20 15.548c0 .8-.651 1.452-1.452 1.452H18V9.452A3.456 3.456 0 0 0 14.548 6H8v-.548C8 4.652 8.651 4 9.452 4h9.096c.8 0 1.452.651 1.452 1.452z" />
    </svg>
  );
}