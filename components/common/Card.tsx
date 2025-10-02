
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
