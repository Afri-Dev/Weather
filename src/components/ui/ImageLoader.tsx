import React, { useState, useEffect, useMemo } from 'react';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

// Cache for preloaded images
const imageCache = new Map<string, boolean>();

/**
 * Optimized image loader component with caching, lazy loading, and error handling
 */
const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = <div className="animate-pulse bg-gray-300/30 rounded w-full h-full"></div>,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
  const [error, setError] = useState(false);
  
  // Check if we need to use WebP format instead of PNG or JPG
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    // Handle cases where src might already be a full URL or just the icon code
    try {
      // If it's already a full URL
      if (src.startsWith('http')) {
        // Process OpenWeatherMap URLs
        if (src.includes('openweathermap.org')) {
          // Extract the icon code from the URL
          const match = src.match(/\/wn\/([a-zA-Z0-9]+)(@[0-9]x)?/);
          if (match && match[1]) {
            const iconCode = match[1];
            // Use WebP format with @2x for better quality on retina displays
            return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          }
        }
        // Process WeatherAPI URLs
        else if (src.includes('weatherapi.com')) {
          return src.replace('.png', '.webp');
        }
        return src;
      } 
      // If it's just an icon code (e.g., '01d' or '01n')
      else if (/^[0-9][0-9][d|n]$/.test(src)) {
        return `https://openweathermap.org/img/wn/${src}@2x.png`;
      }
      
      return src;
    } catch (error) {
      console.error('Error processing image source:', error);
      return src || '';
    }
  }, [src]);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    // Reset states if src changes
    setIsLoaded(imageCache.has(optimizedSrc));
    setError(false);

    if (imageCache.has(optimizedSrc)) {
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      imageCache.set(optimizedSrc, true);
      if (onLoad) onLoad();
    };
    
    img.onerror = () => {
      setError(true);
      if (onError) onError();
      
      // If WebP format failed, try the original format
      if (optimizedSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setIsLoaded(true);
          imageCache.set(src, true);
          if (onLoad) onLoad();
        };
        fallbackImg.onerror = () => {
          setError(true);
          if (onError) onError();
        };
        fallbackImg.src = src;
      }
    };
    
    img.src = optimizedSrc;
  }, [optimizedSrc, src, onLoad, onError]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200/20 dark:bg-gray-800/20 rounded ${className}`}
        style={{ width: width || '100%', height: height || '100%' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  return (
    <>
      {!isLoaded && placeholder}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading="lazy"
        style={{ display: isLoaded ? 'block' : 'none' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
};

// Preload common weather icons to improve user experience
export const preloadCommonWeatherIcons = () => {
  const commonIcons = [
    'https://openweathermap.org/img/wn/01d@2x.webp', // clear sky day
    'https://openweathermap.org/img/wn/01n@2x.webp', // clear sky night
    'https://openweathermap.org/img/wn/02d@2x.webp', // few clouds day
    'https://openweathermap.org/img/wn/02n@2x.webp', // few clouds night
    'https://openweathermap.org/img/wn/03d@2x.webp', // scattered clouds
    'https://openweathermap.org/img/wn/04d@2x.webp', // broken clouds
    'https://openweathermap.org/img/wn/10d@2x.webp', // rain day
  ];

  commonIcons.forEach(src => {
    if (!imageCache.has(src)) {
      const img = new Image();
      img.onload = () => imageCache.set(src, true);
      img.src = src;
    }
  });
};

export default ImageLoader;
