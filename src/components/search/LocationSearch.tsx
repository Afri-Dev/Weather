import React from 'react';
import { SearchResult } from '../../lib/types';

interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  onSelectLocation: (location: SearchResult) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isLoading,
  error,
  onSelectLocation
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-3 pl-10 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Searching...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchResults.map((result) => (
              <li key={result.id}>
                <button
                  onClick={() => onSelectLocation(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-white font-medium">{result.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.region}, {result.country}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.lat.toFixed(2)}, {result.lon.toFixed(2)}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
