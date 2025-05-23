import { useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig } from '../../lib/types/index.ts';

const defaultLightTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#3b82f6', // blue-500
  secondaryColor: '#10b981', // emerald-500
  accentColor: '#f59e0b', // amber-500
};

const defaultDarkTheme: ThemeConfig = {
  mode: 'dark',
  primaryColor: '#60a5fa', // blue-400
  secondaryColor: '#34d399', // emerald-400
  accentColor: '#fbbf24', // amber-400
};

export const useTheme = () => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    // Try to load from localStorage
    const storedTheme = localStorage.getItem('themeConfig');
    if (storedTheme) {
      try {
        return JSON.parse(storedTheme);
      } catch (err) {
        console.error('Error parsing theme config:', err);
      }
    }
    
    // Default to system preference, or light if not available
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? defaultDarkTheme : defaultLightTheme;
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS variables
    root.style.setProperty('--color-primary', themeConfig.primaryColor);
    root.style.setProperty('--color-secondary', themeConfig.secondaryColor);
    root.style.setProperty('--color-accent', themeConfig.accentColor);
    
    // Apply dark/light mode
    if (themeConfig.mode === 'dark' || 
        (themeConfig.mode === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply background image if available
    if (themeConfig.backgroundImage) {
      document.body.style.backgroundImage = `url(${themeConfig.backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = 'none';
    }
    
    // Save to localStorage
    localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
  }, [themeConfig]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (themeConfig.mode === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeConfig.mode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeConfig(prev => ({ ...prev, mode }));
  };

  const setColors = (primary?: string, secondary?: string, accent?: string) => {
    setThemeConfig(prev => ({
      ...prev,
      primaryColor: primary || prev.primaryColor,
      secondaryColor: secondary || prev.secondaryColor,
      accentColor: accent || prev.accentColor,
    }));
  };

  const setBackgroundImage = (imageUrl?: string) => {
    setThemeConfig(prev => ({
      ...prev,
      backgroundImage: imageUrl,
    }));
  };

  return {
    themeConfig,
    setThemeMode,
    setColors,
    setBackgroundImage,
  };
};

export default useTheme;
