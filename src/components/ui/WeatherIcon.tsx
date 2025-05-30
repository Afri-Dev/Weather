import React from 'react';
import ImageLoader from './ImageLoader';

interface WeatherIconProps {
  icon: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 24, height: 24, className: 'w-6 h-6' },
  md: { width: 40, height: 40, className: 'w-10 h-10' },
  lg: { width: 96, height: 96, className: 'w-24 h-24' },
};

const WeatherIcon: React.FC<WeatherIconProps> = ({
  icon,
  alt = 'Weather icon',
  size = 'md',
  className = '',
}) => {
  const dimensions = sizeMap[size];
  
  // Check if the icon URL needs https prefix
  const iconUrl = icon.startsWith('http') ? icon : `https:${icon}`;
  
  // Add a version parameter to force refresh the icon
  const versionedIconUrl = `${iconUrl}${iconUrl.includes('?') ? '&' : '?'}v=2`;
  
  return (
    <div className={`relative inline-block ${dimensions.className} ${className}`}>
      {/* Main weather icon with improved contrast */}
      <div className="relative w-full h-full">
        <ImageLoader 
          src={versionedIconUrl}
          alt={alt}
          className={`w-full h-full object-contain ${size === 'lg' ? 'dark:brightness-125' : 'dark:brightness-110'}`}
          width={dimensions.width}
          height={dimensions.height}
        />
        
        {/* Subtle gradient overlay for better visibility */}
        <div className={`
          absolute inset-0 rounded-full 
          bg-gradient-to-br from-transparent to-primary/10 
          dark:to-primary/20 mix-blend-overlay
        `}></div>
        
        {/* Glow effect for better visibility in dark mode */}
        <div className={`
          absolute inset-0 rounded-full 
          bg-primary/5 dark:bg-white/10 
          mix-blend-overlay
          ${size === 'lg' ? 'blur-sm' : 'blur-[1px]'}
        `}></div>
      </div>
      
      {/* Subtle outer glow */}
      <div className={`
        absolute inset-0 rounded-full 
        bg-primary/5 dark:bg-white/5 
        ${size === 'lg' ? 'blur-md' : 'blur-sm'} -z-10
        scale-110
      `}></div>
    </div>
  );
};

export default WeatherIcon;
