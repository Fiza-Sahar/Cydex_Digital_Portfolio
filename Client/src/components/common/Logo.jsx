import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'default', showWordmark = true, to = '/', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 sm:h-7',
    default: 'h-7 sm:h-8',
    large: 'h-9 sm:h-10',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.default;

  const Content = (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/cydex-logo.png"
        alt="CYDEX DIGITAL"
        width="180"
        height="40"
        className={`${selectedSize} w-auto object-contain transition-opacity duration-200 hover:opacity-90`}
        loading="eager"
      />
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#0AE3DA] rounded-sm"
        aria-label="CYDEX DIGITAL Home"
      >
        {Content}
      </Link>
    );
  }

  return Content;
};

export default Logo;
