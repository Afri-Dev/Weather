import React from 'react';
import { SavedLocation } from '../../lib/types';

interface SavedLocationsProps {
  locations: SavedLocation[];
  onSelectLocation: (location: SavedLocation) => void;
  onRemoveLocation: (locationId: string) => void;
  currentLocationId?: string;
}

const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  onSelectLocation,
  onRemoveLocation,
  currentLocationId
}) => {
  if (locations.length === 0) {
    return (
      <div className="mt-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 shadow-md">
        <p className="text-center text-gray-600 dark:text-gray-300">
          No saved locations yet. Search for a location to add it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Saved Locations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div 
            key={location.id}
            className={`
              bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 shadow-md
              transition-all hover:shadow-lg
              ${currentLocationId === location.id ? 'ring-2 ring-primary' : ''}
            `}
          >
            <div className="flex justify-between items-start">
              <button
                onClick={() => onSelectLocation(location)}
                className="flex-1 text-left"
              >
                <h4 className="font-medium text-gray-800 dark:text-white">{location.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                </p>
              </button>
              
              <div className="flex items-center space-x-2">
                {location.isFavorite && (
                  <span className="text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                )}
                
                <button
                  onClick={() => onRemoveLocation(location.id)}
                  className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  aria-label={`Remove ${location.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLocations;
