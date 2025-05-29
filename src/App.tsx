import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import CurrentWeather from './components/weather/CurrentWeather';
import Forecast from './components/weather/Forecast';
import HourlyForecast from './components/weather/HourlyForecast';
import WhatToWear from './components/weather/WhatToWear';
import LocationSearch from './components/search/LocationSearch';
import SavedLocations from './components/search/SavedLocations';
import useWeather from './hooks/useWeather';
import useLocation from './hooks/useLocation';
import useTheme from './hooks/useTheme';
import { SavedLocation, SearchResult } from './lib/types';
import './App.css';

function App() {
  // State for selected location
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lon: number} | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  // Custom hooks
  const { themeConfig, setThemeMode } = useTheme();
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults,
    savedLocations,
    removeLocation
  } = useLocation();

  // Get weather data for selected location
  const { 
    weatherData, 
    loading: weatherLoading, 
    error: weatherError, 
    refreshData 
  } = useWeather(
    selectedLocation?.lat || 0, 
    selectedLocation?.lon || 0
  );

  // Initialize with default location or geolocation
  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation && !selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // Fallback to default location if geolocation fails
          setSelectedLocation({ lat: 40.7128, lon: -74.0060 }); // New York
        }
      );
    } else if (!selectedLocation) {
      // Fallback if geolocation is not available
      setSelectedLocation({ lat: 40.7128, lon: -74.0060 }); // New York
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setThemeMode(themeConfig.mode === 'dark' ? 'light' : 'dark');
  };

  // Toggle units
  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  // Handle location selection
  const handleSelectLocation = (location: SearchResult | SavedLocation) => {
    setSelectedLocation({
      lat: location.lat,
      lon: location.lon
    });
    setIsSearchOpen(false);
    
    // Location selection handled by the hook automatically
  };

  // Handle saved location removal
  const handleRemoveLocation = (locationId: string | number) => {
    if (typeof locationId === 'string') {
      removeLocation(parseInt(locationId));
    } else {
      removeLocation(locationId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header 
        themeConfig={themeConfig} 
        onToggleTheme={toggleTheme} 
        onOpenSearch={() => setIsSearchOpen(true)} 
      />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {isSearchOpen ? (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Search Locations</h2>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                aria-label="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <LocationSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              isLoading={false}
              error={null}
              onSelectLocation={handleSelectLocation}
            />
            
            <SavedLocations 
              locations={savedLocations.map(loc => ({
                id: loc.id.toString(),
                name: loc.name,
                lat: loc.lat,
                lon: loc.lon,
                isFavorite: false
              }))}
              onSelectLocation={handleSelectLocation}
              onRemoveLocation={handleRemoveLocation}
              currentLocationId={weatherData?.location?.name === selectedLocation?.lat.toString() ? selectedLocation?.lat.toString() : undefined}
            />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-end">
              <button
                onClick={toggleUnits}
                className="px-3 py-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors text-sm font-medium"
              >
                {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              </button>
            </div>
            
            <CurrentWeather 
              weatherData={weatherData}
              isLoading={weatherLoading}
              error={weatherError}
              onRefresh={refreshData}
              units={units}
            />
            
            <HourlyForecast 
              weatherData={weatherData}
              isLoading={weatherLoading}
              units={units}
            />
            
            <Forecast 
              forecastDays={weatherData?.forecast?.forecastday || []}
              isLoading={weatherLoading}
              units={units}
            />
            
            <WhatToWear 
              weatherData={weatherData}
              isLoading={weatherLoading}
            />
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 py-3">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} WeatherVue - Real-time Weather Dashboard</p>
          <p className="text-xs mt-1">Powered by WeatherAPI | Built with React & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
