import React from 'react';
import { WeatherData } from '../../lib/types';

interface WeatherMapProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ weatherData, isLoading }) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!weatherData || isLoading || !mapRef.current) return;
    
    // This is a placeholder for the actual map implementation
    // In a real implementation, this would initialize a map library like Leaflet or Google Maps
    
    const initMap = () => {
      const mapContainer = mapRef.current;
      if (!mapContainer) return;
      
      // Clear any existing content
      mapContainer.innerHTML = '';
      
      // Create a mock map with CSS
      mapContainer.style.position = 'relative';
      mapContainer.style.overflow = 'hidden';
      mapContainer.style.borderRadius = '0.75rem';
      
      // Create map background
      const mapBackground = document.createElement('div');
      mapBackground.style.position = 'absolute';
      mapBackground.style.inset = '0';
      mapBackground.style.backgroundImage = 'url("https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/' + 
        weatherData.location.lon + ',' + weatherData.location.lat + 
        ',5,0/600x400?access_token=placeholder")';
      mapBackground.style.backgroundSize = 'cover';
      mapBackground.style.backgroundPosition = 'center';
      mapBackground.style.filter = 'saturate(0.8) brightness(0.9)';
      mapContainer.appendChild(mapBackground);
      
      // Create location marker
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.top = '50%';
      marker.style.left = '50%';
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.width = '20px';
      marker.style.height = '20px';
      marker.style.borderRadius = '50%';
      marker.style.backgroundColor = 'var(--color-primary, #3b82f6)';
      marker.style.border = '3px solid white';
      marker.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
      mapContainer.appendChild(marker);
      
      // Create pulse animation
      const pulse = document.createElement('div');
      pulse.style.position = 'absolute';
      pulse.style.top = '50%';
      pulse.style.left = '50%';
      pulse.style.transform = 'translate(-50%, -50%)';
      pulse.style.width = '50px';
      pulse.style.height = '50px';
      pulse.style.borderRadius = '50%';
      pulse.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
      pulse.style.animation = 'pulse 2s infinite';
      mapContainer.appendChild(pulse);
      
      // Add animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Add overlay with weather info
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.bottom = '20px';
      overlay.style.left = '20px';
      overlay.style.padding = '10px 15px';
      overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      overlay.style.backdropFilter = 'blur(4px)';
      overlay.style.borderRadius = '8px';
      overlay.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      overlay.style.color = '#1f2937';
      overlay.style.fontWeight = '500';
      overlay.innerHTML = `
        <div>${weatherData.location.name}, ${weatherData.location.country}</div>
        <div style="font-size: 0.875rem; opacity: 0.7;">${weatherData.current.condition.text}</div>
      `;
      mapContainer.appendChild(overlay);
      
      // Add note about placeholder
      const note = document.createElement('div');
      note.style.position = 'absolute';
      note.style.top = '10px';
      note.style.right = '10px';
      note.style.padding = '5px 10px';
      note.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      note.style.color = 'white';
      note.style.borderRadius = '4px';
      note.style.fontSize = '0.75rem';
      note.textContent = 'Map placeholder - will use real API';
      mapContainer.appendChild(note);
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [weatherData, isLoading]);
  
  if (isLoading) {
    return (
      <div className="mt-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg">
        <div className="animate-pulse bg-gray-300/30 h-[400px] w-full"></div>
      </div>
    );
  }
  
  if (!weatherData) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Weather Map</h3>
      <div 
        ref={mapRef} 
        className="h-[400px] w-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg"
      >
        <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Loading map...</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
