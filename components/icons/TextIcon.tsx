
import React from 'react';

export const TextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M17 6.1H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.1a1 1 0 0 0-1-1Z"/>
        <path d="M12 12.1h4"/>
        <path d="M12 8.1h4"/>
        <path d="M8 12.1h.01"/>
        <path d="M8 8.1h.01"/>
        <path d="M8 16.1h8"/>
    </svg>
);
