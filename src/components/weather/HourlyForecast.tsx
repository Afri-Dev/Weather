import React from 'react';
import WeatherIcon from '../ui/WeatherIcon';
import { WeatherData } from '../../lib/types';

interface HourlyForecastProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  units: 'metric' | 'imperial';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ weatherData, isLoading, units }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll left/right handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="h-6 bg-gray-300/30 rounded w-1/4 mb-4"></div>
        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse flex-shrink-0 w-[100px] bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-md">
                  <div className="h-4 bg-gray-300/30 rounded w-1/2 mb-3 mx-auto"></div>
                  <div className="h-10 w-10 bg-gray-300/30 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-300/30 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday[0]) {
    return null;
  }
  
  // Get hourly forecast for today
  const hourlyForecast = weatherData.forecast.forecastday[0].hour;
  
  // Get current hour
  const currentHour = new Date().getHours();
  
  // Filter to show only future hours from current time
  const futureHours = hourlyForecast.filter((hour) => {
    const hourTime = new Date(hour.time);
    return hourTime.getHours() >= currentHour;
  });
  
  // If we have less than 12 hours left today, add some from tomorrow
  let displayHours = futureHours;
  if (futureHours.length < 12 && weatherData.forecast.forecastday.length > 1) {
    const tomorrowHours = weatherData.forecast.forecastday[1].hour;
    const hoursNeeded = 12 - futureHours.length;
    displayHours = [...futureHours, ...tomorrowHours.slice(0, hoursNeeded)];
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Hourly Forecast</h3>
      
      <div className="relative">
        {/* Left scroll button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto hide-scrollbar pb-2 px-8"
        >
          <div className="flex space-x-4">
            {displayHours.map((hour, index) => {
              // Format the hour
              const hourTime = new Date(hour.time);
              const formattedHour = hourTime.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              
              // Check if this is the current hour
              const isCurrentHour = index === 0 && hourTime.getHours() === currentHour;
              
              return (
                <div 
                  key={hour.time_epoch}
                  className={`
                    flex-shrink-0 w-[100px] bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 shadow-md
                    transition-all hover:shadow-lg hover:translate-y-[-2px]
                    ${isCurrentHour ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  <div className="text-center">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {isCurrentHour ? 'Now' : formattedHour}
                    </p>
                  </div>
                  
                  <div className="my-3 flex justify-center">
                    <div className="relative">
                      <WeatherIcon 
                        icon={hour.condition?.icon || ''}
                        alt={hour.condition?.text || 'Weather icon'}
                        size="md"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 rounded-full mix-blend-overlay"></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {units === 'metric' ? `${Math.round(hour.temp_c)}°C` : `${Math.round(hour.temp_f)}°F`}
                    </p>
                    
                    {hour.chance_of_rain > 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        {hour.chance_of_rain}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right scroll button */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Add custom styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default HourlyForecast;
