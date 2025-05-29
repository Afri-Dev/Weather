import axios from 'axios';
import { WeatherData, SearchResult } from '../types';

// OpenWeather API configuration
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = 'cadc12bbcaed07f7605483964c4d76a5';

export const weatherApi = {
  // Get current weather and forecast for a location
  getWeatherData: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
      
      // Get current weather data
      const currentResponse = await axios.get(`${API_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',  // Use metric units
          lang: 'en'        // Use English language
        }
      });
      
      // Get forecast data (5 days / 3 hour intervals)
      const forecastResponse = await axios.get(`${API_BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'en'
        }
      });
      
      // Get air quality data if available
      let airQualityData = null;
      try {
        const airQualityResponse = await axios.get(`${API_BASE_URL}/air_pollution`, {
          params: {
            lat,
            lon,
            appid: API_KEY
          }
        });
        airQualityData = airQualityResponse.data;
      } catch (e) {
        console.warn('Air quality data not available:', e);
      }
      
      // Transform the OpenWeather API responses to match our app's data structure
      return transformWeatherData(currentResponse.data, forecastResponse.data, airQualityData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  },
  
  // Search for locations using OpenWeather Geocoding API
  searchLocations: async (query: string): Promise<SearchResult[]> => {
    try {
      console.log(`Searching for locations with query: ${query}`);
      
      const response = await axios.get(`${GEO_API_BASE_URL}/direct`, {
        params: {
          q: query,
          limit: 5,  // Limit results to 5 locations
          appid: API_KEY
        }
      });
      
      // Transform the OpenWeather Geocoding API response to match our app's data structure
      return response.data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        region: item.state || '',
        country: item.country,
        lat: item.lat,
        lon: item.lon
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Failed to search locations. Please try again later.');
    }
  }
};

// Helper function to transform OpenWeather API data to our app's data structure
function transformWeatherData(currentData: any, forecastData: any, airQualityData: any): WeatherData {
  // Format the current date and time based on location timezone
  const now = new Date();
  const localtime = now.toISOString();
  
  // Process forecast data - organize by day and extract hourly data
  const forecastDayMap = new Map();
  
  forecastData.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!forecastDayMap.has(date)) {
      forecastDayMap.set(date, {
        date,
        date_epoch: new Date(date).getTime() / 1000,
        day: {
          maxtemp_c: -Infinity,
          maxtemp_f: -Infinity,
          mintemp_c: Infinity,
          mintemp_f: Infinity,
          avgtemp_c: 0,
          avgtemp_f: 0,
          maxwind_kph: 0,
          maxwind_mph: 0,
          totalprecip_mm: 0,
          totalprecip_in: 0,
          totalsnow_cm: 0,
          avgvis_km: 0,
          avgvis_miles: 0,
          avghumidity: 0,
          daily_will_it_rain: 0,
          daily_chance_of_rain: 0,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: { text: '', icon: '', code: 0 },
          uv: 0
        },
        astro: {
          sunrise: '',
          sunset: '',
          moonrise: '',
          moonset: '',
          moon_phase: '',
          moon_illumination: ''
        },
        hour: []
      });
    }
    
    const dayData = forecastDayMap.get(date);
    const temp_c = item.main.temp;
    const temp_f = (temp_c * 9/5) + 32;
    
    // Update max/min temperatures
    if (temp_c > dayData.day.maxtemp_c) {
      dayData.day.maxtemp_c = temp_c;
      dayData.day.maxtemp_f = temp_f;
    }
    if (temp_c < dayData.day.mintemp_c) {
      dayData.day.mintemp_c = temp_c;
      dayData.day.mintemp_f = temp_f;
    }
    
    // Add hourly data
    dayData.hour.push({
      time: item.dt_txt,
      time_epoch: item.dt,
      temp_c: temp_c,
      temp_f: temp_f,
      condition: {
        text: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        code: item.weather[0].id
      },
      wind_mph: item.wind.speed * 2.23694,
      wind_kph: item.wind.speed * 3.6,
      wind_degree: item.wind.deg,
      wind_dir: getWindDirection(item.wind.deg),
      pressure_mb: item.main.pressure,
      pressure_in: item.main.pressure * 0.02953,
      precip_mm: item.rain ? item.rain['3h'] || 0 : 0,
      precip_in: (item.rain ? item.rain['3h'] || 0 : 0) * 0.0393701,
      humidity: item.main.humidity,
      cloud: item.clouds.all,
      feelslike_c: item.main.feels_like,
      feelslike_f: (item.main.feels_like * 9/5) + 32,
      windchill_c: item.main.feels_like,
      windchill_f: (item.main.feels_like * 9/5) + 32,
      heatindex_c: item.main.feels_like,
      heatindex_f: (item.main.feels_like * 9/5) + 32,
      dewpoint_c: calculateDewPoint(temp_c, item.main.humidity),
      dewpoint_f: (calculateDewPoint(temp_c, item.main.humidity) * 9/5) + 32,
      will_it_rain: item.pop > 0.3 ? 1 : 0,
      chance_of_rain: Math.round(item.pop * 100),
      will_it_snow: item.snow ? 1 : 0,
      chance_of_snow: item.snow ? Math.round(item.pop * 100) : 0,
      vis_km: item.visibility / 1000,
      vis_miles: item.visibility / 1609.34,
      gust_mph: item.wind.gust ? item.wind.gust * 2.23694 : 0,
      gust_kph: item.wind.gust ? item.wind.gust * 3.6 : 0,
      uv: 0 // OpenWeather doesn't provide UV index in the forecast
    });
  });
  
  // Calculate averages and set other fields for each day
  forecastDayMap.forEach(dayData => {
    if (dayData.hour.length > 0) {
      // Calculate averages
      let totalTemp = 0;
      let totalHumidity = 0;
      let totalVis = 0;
      let totalPrecip = 0;
      let totalWind = 0;
      
      dayData.hour.forEach((hour: any) => {
        totalTemp += hour.temp_c;
        totalHumidity += hour.humidity;
        totalVis += hour.vis_km;
        totalPrecip += hour.precip_mm;
        totalWind = Math.max(totalWind, hour.wind_kph);
      });
      
      const len = dayData.hour.length;
      dayData.day.avgtemp_c = totalTemp / len;
      dayData.day.avgtemp_f = (dayData.day.avgtemp_c * 9/5) + 32;
      dayData.day.avghumidity = Math.round(totalHumidity / len);
      dayData.day.avgvis_km = totalVis / len;
      dayData.day.avgvis_miles = dayData.day.avgvis_km * 0.621371;
      dayData.day.totalprecip_mm = totalPrecip;
      dayData.day.totalprecip_in = totalPrecip * 0.0393701;
      dayData.day.maxwind_kph = totalWind;
      dayData.day.maxwind_mph = totalWind * 0.621371;
      
      // Use the noon condition as the day's condition
      const noonHour = dayData.hour.find((h: any) => h.time.includes('12:00')) || dayData.hour[0];
      dayData.day.condition = noonHour.condition;
      
      // Set rain/snow probability
      const maxRainChance = Math.max(...dayData.hour.map((h: any) => h.chance_of_rain));
      const maxSnowChance = Math.max(...dayData.hour.map((h: any) => h.chance_of_snow));
      dayData.day.daily_chance_of_rain = maxRainChance;
      dayData.day.daily_will_it_rain = maxRainChance > 50 ? 1 : 0;
      dayData.day.daily_chance_of_snow = maxSnowChance;
      dayData.day.daily_will_it_snow = maxSnowChance > 50 ? 1 : 0;
    }
    
    // Mock astro data (OpenWeather doesn't provide this in the free tier)
    dayData.astro = {
      sunrise: formatTime(currentData.sys.sunrise * 1000),
      sunset: formatTime(currentData.sys.sunset * 1000),
      moonrise: '00:00 AM',
      moonset: '00:00 AM',
      moon_phase: 'First Quarter',
      moon_illumination: '50%'
    };
  });
  
  // Convert the map to an array and sort by date
  const forecastDays = Array.from(forecastDayMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Process air quality data if available
  let airQuality = null;
  if (airQualityData && airQualityData.list && airQualityData.list.length > 0) {
    const aq = airQualityData.list[0].components;
    airQuality = {
      co: aq.co,
      no2: aq.no2,
      o3: aq.o3,
      so2: aq.so2,
      pm2_5: aq.pm2_5,
      pm10: aq.pm10,
      'us-epa-index': airQualityData.list[0].main.aqi,
      'gb-defra-index': airQualityData.list[0].main.aqi
    };
  }
  
  // Construct and return the complete weather data object
  return {
    location: {
      name: currentData.name,
      region: '',
      country: currentData.sys.country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon,
      localtime: localtime,
      timezone: currentData.timezone.toString()
    },
    current: {
      temp_c: currentData.main.temp,
      temp_f: (currentData.main.temp * 9/5) + 32,
      condition: {
        text: currentData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        code: currentData.weather[0].id
      },
      wind_mph: currentData.wind.speed * 2.23694,
      wind_kph: currentData.wind.speed * 3.6,
      wind_dir: getWindDirection(currentData.wind.deg),
      pressure_mb: currentData.main.pressure,
      pressure_in: currentData.main.pressure * 0.02953,
      precip_mm: currentData.rain ? currentData.rain['1h'] || 0 : 0,
      precip_in: (currentData.rain ? currentData.rain['1h'] || 0 : 0) * 0.0393701,
      humidity: currentData.main.humidity,
      cloud: currentData.clouds.all,
      feelslike_c: currentData.main.feels_like,
      feelslike_f: (currentData.main.feels_like * 9/5) + 32,
      vis_km: currentData.visibility / 1000,
      vis_miles: currentData.visibility / 1609.34,
      uv: 0, // OpenWeather doesn't provide UV index in the free tier
      air_quality: airQuality || {
        co: 0,
        no2: 0,
        o3: 0,
        so2: 0,
        pm2_5: 0,
        pm10: 0,
        'us-epa-index': 0,
        'gb-defra-index': 0
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

// Helper function to get wind direction from degrees
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Helper function to calculate dew point
function calculateDewPoint(temp_c: number, humidity: number): number {
  return temp_c - (100 - humidity) / 5;
}

// Helper function to format time from timestamp
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
}
