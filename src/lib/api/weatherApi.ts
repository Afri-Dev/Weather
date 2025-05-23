//import axios from 'axios';
import { WeatherData, SearchResult } from '../types';

// This is a placeholder API service that will be replaced with actual API integration
// when the user provides the free API keys

const API_BASE_URL = 'https://home.openweathermap.org/'; // Placeholder URL
const API_KEY = 'cadc12bbcaed07f7605483964c4d76a5'; // Will be replaced with user's API key

export const weatherApi = {
  // Get current weather and forecast for a location
  getWeatherData: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      // This is a placeholder implementation
      // Will be replaced with actual API call when user provides API details
      console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
      
      // In a real implementation, this would be:
      // const response = await axios.get(`${API_BASE_URL}/forecast.json`, {
      //   params: {
      //     key: API_KEY,
      //     q: `${lat},${lon}`,
      //     days: 7,
      //     aqi: 'yes',
      //     alerts: 'yes'
      //   }
      // });
      // return response.data;
      
      // For now, return mock data
      return getMockWeatherData(lat, lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  },
  
  // Search for locations
  searchLocations: async (query: string): Promise<SearchResult[]> => {
    try {
      // This is a placeholder implementation
      // Will be replaced with actual API call when user provides API details
      console.log(`Searching for locations with query: ${query}`);
      
      // In a real implementation, this would be:
      // const response = await axios.get(`${API_BASE_URL}/search.json`, {
      //   params: {
      //     key: API_KEY,
      //     q: query
      //   }
      // });
      // return response.data;
      
      // For now, return mock data
      return getMockSearchResults(query);
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Failed to search locations. Please try again later.');
    }
  }
};

// Mock data functions for development until real API is integrated
function getMockWeatherData(lat: number, lon: number): WeatherData {
  // Generate a location name based on coordinates
  const locationName = `City at ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  
  // Current date and time
  const now = new Date();
  const localtime = now.toISOString();
  
  // Generate random temperature between 0 and 35°C
  const temp_c = Math.random() * 35;
  const temp_f = (temp_c * 9/5) + 32;
  
  // Random weather conditions
  const conditions = [
    { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png', code: 1000 },
    { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', code: 1003 },
    { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png', code: 1006 },
    { text: 'Overcast', icon: '//cdn.weatherapi.com/weather/64x64/day/122.png', code: 1009 },
    { text: 'Mist', icon: '//cdn.weatherapi.com/weather/64x64/day/143.png', code: 1030 },
    { text: 'Patchy rain possible', icon: '//cdn.weatherapi.com/weather/64x64/day/176.png', code: 1063 },
    { text: 'Patchy snow possible', icon: '//cdn.weatherapi.com/weather/64x64/day/179.png', code: 1066 },
    { text: 'Thundery outbreaks possible', icon: '//cdn.weatherapi.com/weather/64x64/day/200.png', code: 1087 }
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Generate forecast for next 7 days
  const forecastDays = [];
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date();
    forecastDate.setDate(now.getDate() + i);
    
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const maxTemp_c = temp_c + (Math.random() * 5);
    const minTemp_c = temp_c - (Math.random() * 5);
    
    // Generate hourly forecast
    const hours = [];
    for (let h = 0; h < 24; h++) {
      const hourTime = new Date(forecastDate);
      hourTime.setHours(h);
      
      const hourCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const hourTemp_c = minTemp_c + (Math.random() * (maxTemp_c - minTemp_c));
      
      hours.push({
        time_epoch: Math.floor(hourTime.getTime() / 1000),
        time: hourTime.toISOString(),
        temp_c: hourTemp_c,
        temp_f: (hourTemp_c * 9/5) + 32,
        condition: hourCondition,
        wind_mph: Math.random() * 20,
        wind_kph: Math.random() * 30,
        wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        pressure_mb: 1000 + (Math.random() * 30),
        pressure_in: 29.5 + (Math.random() * 1),
        precip_mm: Math.random() * 10,
        precip_in: Math.random() * 0.5,
        humidity: Math.floor(Math.random() * 100),
        cloud: Math.floor(Math.random() * 100),
        feelslike_c: hourTemp_c + (Math.random() * 3 - 1),
        feelslike_f: (hourTemp_c + (Math.random() * 3 - 1)) * 9/5 + 32,
        windchill_c: hourTemp_c - (Math.random() * 2),
        windchill_f: (hourTemp_c - (Math.random() * 2)) * 9/5 + 32,
        heatindex_c: hourTemp_c + (Math.random() * 2),
        heatindex_f: (hourTemp_c + (Math.random() * 2)) * 9/5 + 32,
        dewpoint_c: hourTemp_c - (Math.random() * 5),
        dewpoint_f: (hourTemp_c - (Math.random() * 5)) * 9/5 + 32,
        will_it_rain: Math.random() > 0.7 ? 1 : 0,
        chance_of_rain: Math.floor(Math.random() * 100),
        will_it_snow: Math.random() > 0.9 ? 1 : 0,
        chance_of_snow: Math.floor(Math.random() * 30),
        vis_km: 10 - (Math.random() * 5),
        vis_miles: (10 - (Math.random() * 5)) * 0.621371,
        gust_mph: Math.random() * 30,
        gust_kph: Math.random() * 50,
        uv: Math.floor(Math.random() * 11)
      });
    }
    
    forecastDays.push({
      date: forecastDate.toISOString().split('T')[0],
      date_epoch: Math.floor(forecastDate.getTime() / 1000),
      day: {
        maxtemp_c: maxTemp_c,
        maxtemp_f: (maxTemp_c * 9/5) + 32,
        mintemp_c: minTemp_c,
        mintemp_f: (minTemp_c * 9/5) + 32,
        avgtemp_c: (maxTemp_c + minTemp_c) / 2,
        avgtemp_f: ((maxTemp_c + minTemp_c) / 2 * 9/5) + 32,
        maxwind_mph: Math.random() * 20,
        maxwind_kph: Math.random() * 30,
        totalprecip_mm: Math.random() * 10,
        totalprecip_in: Math.random() * 0.5,
        totalsnow_cm: Math.random() * 5,
        avgvis_km: 10 - (Math.random() * 5),
        avgvis_miles: (10 - (Math.random() * 5)) * 0.621371,
        avghumidity: Math.floor(Math.random() * 100),
        daily_will_it_rain: Math.random() > 0.7 ? 1 : 0,
        daily_chance_of_rain: Math.floor(Math.random() * 100),
        daily_will_it_snow: Math.random() > 0.9 ? 1 : 0,
        daily_chance_of_snow: Math.floor(Math.random() * 30),
        condition: dayCondition,
        uv: Math.floor(Math.random() * 11)
      },
      astro: {
        sunrise: '06:30 AM',
        sunset: '07:30 PM',
        moonrise: '08:00 PM',
        moonset: '05:00 AM',
        moon_phase: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][Math.floor(Math.random() * 8)],
        moon_illumination: `${Math.floor(Math.random() * 100)}%`
      },
      hour: hours
    });
  }
  
  return {
    location: {
      name: locationName,
      region: 'Region',
      country: 'Country',
      lat: lat,
      lon: lon,
      localtime: localtime,
      timezone: 'UTC'
    },
    current: {
      temp_c: temp_c,
      temp_f: temp_f,
      condition: randomCondition,
      wind_mph: Math.random() * 20,
      wind_kph: Math.random() * 30,
      wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      pressure_mb: 1000 + (Math.random() * 30),
      pressure_in: 29.5 + (Math.random() * 1),
      precip_mm: Math.random() * 10,
      precip_in: Math.random() * 0.5,
      humidity: Math.floor(Math.random() * 100),
      cloud: Math.floor(Math.random() * 100),
      feelslike_c: temp_c + (Math.random() * 3 - 1),
      feelslike_f: (temp_c + (Math.random() * 3 - 1)) * 9/5 + 32,
      vis_km: 10 - (Math.random() * 5),
      vis_miles: (10 - (Math.random() * 5)) * 0.621371,
      uv: Math.floor(Math.random() * 11),
      air_quality: {
        co: Math.random() * 1000,
        no2: Math.random() * 100,
        o3: Math.random() * 100,
        so2: Math.random() * 100,
        pm2_5: Math.random() * 50,
        pm10: Math.random() * 100,
        'us-epa-index': Math.floor(Math.random() * 5) + 1,
        'gb-defra-index': Math.floor(Math.random() * 10) + 1
      }
    },
    forecast: {
      forecastday: forecastDays
    },
    alerts: {
      alert: []
    }
  } as unknown as WeatherData;
}

function getMockSearchResults(query: string): SearchResult[] {
  // Generate mock search results based on the query
  const results: SearchResult[] = [];
  
  // Create variations of the query
  const variations = [
    { suffix: 'City', region: 'Region A', country: 'Country X' },
    { suffix: 'Town', region: 'Region B', country: 'Country Y' },
    { suffix: 'Village', region: 'Region C', country: 'Country Z' },
    { suffix: 'Metropolitan', region: 'Capital Region', country: 'Country W' },
    { suffix: 'District', region: 'Coastal Region', country: 'Country V' }
  ];
  
  variations.forEach((variation, index) => {
    results.push({
      id: index + 1,
      name: `${query} ${variation.suffix}`,
      region: variation.region,
      country: variation.country,
      lat: (Math.random() * 180) - 90,
      lon: (Math.random() * 360) - 180
    });
  });
  
  return results;
}
