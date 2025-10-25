import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <svg 
        aria-label="EC Group Datasoft company logo"
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-10 w-10"
      >
        <rect 
          x="5" 
          y="5" 
          width="90" 
          height="90" 
          fill="white" 
          stroke="#38a169" // Corresponds to Tailwind's green-500
          strokeWidth="10"
        />
        <text 
          x="50" 
          y="50" 
          fontFamily="Verdana, Geneva, sans-serif" 
          fontSize="48" 
          dy=".3em"
          textAnchor="middle" 
          fill="#2c5282" // Corresponds to Tailwind's blue-800
        >
          ec
        </text>
      </svg>
      <span className="text-2xl font-bold text-teal-600">EC Kudos</span>
    </div>
  );
};

export default Logo;
