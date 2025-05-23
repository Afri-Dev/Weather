import { useState, useEffect } from 'react';
import { WeatherData } from '../../lib/types/index.ts';
import { weatherApi } from "../../lib/api/weatherApi.ts";

export const useWeather = (lat: number, lon: number) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // minutes

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherApi.getWeatherData(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  // Set up refresh interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchWeatherData();
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [lat, lon, refreshInterval]);

  return {
    weatherData,
    loading,
    error,
    refreshInterval,
    setRefreshInterval,
    refreshData: fetchWeatherData
  };
};

export default useWeather;
