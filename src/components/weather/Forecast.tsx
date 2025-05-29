import React from 'react';
import ImageLoader from '../ui/ImageLoader';
import { ForecastDay } from '../../lib/types';

interface ForecastProps {
  forecastDays: ForecastDay[];
  isLoading: boolean;
  units: 'metric' | 'imperial';
}

const Forecast: React.FC<ForecastProps> = ({ forecastDays, isLoading, units }) => {
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="h-6 bg-gray-300/30 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-md">
              <div className="h-4 bg-gray-300/30 rounded w-1/2 mb-3 mx-auto"></div>
              <div className="h-12 w-12 bg-gray-300/30 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-300/30 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-300/30 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!forecastDays || forecastDays.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {forecastDays.map((day, index) => {
          // Format the date
          const date = new Date(day.date);
          const dayName = index === 0 
            ? 'Today' 
            : index === 1 
              ? 'Tomorrow' 
              : date.toLocaleDateString(undefined, { weekday: 'short' });
          
          const formattedDate = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div 
              key={day.date} 
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 shadow-md transition-all hover:shadow-lg hover:translate-y-[-2px]"
            >
              <div className="text-center">
                <h4 className="font-medium text-gray-800 dark:text-white">{dayName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
              </div>
              
              <div className="my-3 flex justify-center">
                <div className="relative">
                  {day.day.condition?.icon ? (
                    <ImageLoader 
                      src={day.day.condition.icon.startsWith('http') ? day.day.condition.icon : `https:${day.day.condition.icon}`}
                      alt={day.day.condition.text || 'Weather icon'}
                      className="w-12 h-12 object-contain"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200/30 dark:bg-gray-700/30 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 rounded-full mix-blend-overlay"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {units === 'metric' 
                    ? `${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°` 
                    : `${Math.round(day.day.maxtemp_f)}° / ${Math.round(day.day.mintemp_f)}°`}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{day.day.condition.text}</p>
              </div>
              
              <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                <p>
                  {day.day.daily_chance_of_rain > 0 && (
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {day.day.daily_chance_of_rain}%
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
