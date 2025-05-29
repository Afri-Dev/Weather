import React from 'react';
import ImageLoader from '../ui/ImageLoader';
import { WeatherData } from '../../lib/types';

interface CurrentWeatherProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  units: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weatherData,
  isLoading,
  error,
  onRefresh,
  units
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
        <div className="h-8 bg-gray-300/30 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-300/30 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300/30 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300/30 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-lg text-red-800 dark:text-red-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Error Loading Weather</h3>
        <p>{error}</p>
        <button 
          onClick={onRefresh}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { location, current } = weatherData;
  
  // Format date and time
  const date = new Date(location.localtime);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-lg rounded-xl p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {location.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {location.region}, {location.country}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formattedDate} • {formattedTime}
          </p>
        </div>
        <button 
          onClick={onRefresh} 
          className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          aria-label="Refresh weather data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="mt-6 flex items-center">
        <div className="relative">
          <ImageLoader 
            src={`https:${current.condition.icon}`} 
            alt={current.condition.text}
            className="w-24 h-24 object-contain"
            width={96}
            height={96}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10 rounded-full mix-blend-overlay"></div>
        </div>
        <div className="ml-4">
          <div className="text-5xl font-bold text-gray-800 dark:text-white">
            {units === 'metric' ? `${Math.round(current.temp_c)}°C` : `${Math.round(current.temp_f)}°F`}
          </div>
          <div className="text-gray-600 dark:text-gray-300 mt-1">
            {current.condition.text}
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Feels Like</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {units === 'metric' ? `${Math.round(current.feelslike_c)}°C` : `${Math.round(current.feelslike_f)}°F`}
          </span>
        </div>
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Humidity</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{current.humidity}%</span>
        </div>
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Wind</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {units === 'metric' ? `${Math.round(current.wind_kph)} km/h` : `${Math.round(current.wind_mph)} mph`}
          </span>
        </div>
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">UV Index</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{current.uv}</span>
        </div>
      </div>
      
      {current.air_quality && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Air Quality</h3>
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Air Quality Index</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {current.air_quality['us-epa-index']} (US EPA)
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getAirQualityColor(current.air_quality['us-epa-index'])}`}
                style={{ width: `${Math.min(current.air_quality['us-epa-index'] / 5 * 100, 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">PM2.5</span>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{Math.round(current.air_quality.pm2_5)}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">PM10</span>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{Math.round(current.air_quality.pm10)}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">O3</span>
                <div className="text-sm font-medium text-gray-800 dark:text-white">{Math.round(current.air_quality.o3)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on air quality index
function getAirQualityColor(index: number): string {
  switch (index) {
    case 1: return 'bg-green-500';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-orange-500';
    case 4: return 'bg-red-500';
    case 5: return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

export default CurrentWeather;
