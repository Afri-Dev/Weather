import { useState, useEffect } from 'react';
import { SearchResult } from '../../lib/types/index.ts';
import { weatherApi } from "../../lib/api/weatherApi.ts";

export const useLocation = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<SearchResult[]>([]);

  // Load saved locations from localStorage on initial render
  useEffect(() => {
    const storedLocations = localStorage.getItem('savedLocations');
    if (storedLocations) {
      try {
        setSavedLocations(JSON.parse(storedLocations));
      } catch (err) {
        console.error('Error parsing saved locations:', err);
      }
    }
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await weatherApi.searchLocations(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error searching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = (location: SearchResult) => {
    setSavedLocations(prev => {
      // Check if location already exists
      if (prev.some(loc => loc.id === location.id)) {
        return prev;
      }
      return [...prev, location];
    });
  };

  const removeLocation = (locationId: number) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    savedLocations,
    saveLocation,
    removeLocation,
    searchLocations
  };
};

export default useLocation;
