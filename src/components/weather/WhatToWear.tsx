import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherData } from '../../lib/types';
import { FiSun, FiDroplet, FiThermometer, FiWind } from 'react-icons/fi';

// Interfaces
export interface ClothingSuggestion {
  top: string;
  bottom: string;
  footwear: string;
  accessories?: string[];
}

// WhatToWear component props
export interface WhatToWearProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
}

// Weather icon component removed as it's not being used

// Animation variants for framer-motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: { opacity: 0, y: -20 }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.3
    }
  })
};

const WhatToWear: React.FC<WhatToWearProps> = ({ weatherData, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'casual' | 'formal'>('casual');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  if (isLoading || !weatherData) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        <div className="h-8 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <motion.div 
              key={i} 
              variants={cardVariants}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 overflow-hidden"
            >
              <div className="h-7 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-32 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <div className="h-4 w-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-full"></div>
                    <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-3/4"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  const { current } = weatherData;
  const tempC = current.temp_c;
  
  // Determine clothing suggestions based on temperature
  const getClothingSuggestion = (gender: 'male' | 'female'): ClothingSuggestion => {
    if (tempC >= 30) {
      // Hot weather
      return gender === 'male' 
        ? { top: 'Light t-shirt or tank top', bottom: 'Shorts', footwear: 'Sandals', accessories: ['Sunglasses', 'Sun hat'] }
        : { top: 'Tank top or sundress', bottom: 'Shorts or skirt', footwear: 'Sandals', accessories: ['Sunglasses', 'Sun hat'] };
    } else if (tempC >= 20) {
      // Warm weather
      return gender === 'male'
        ? { top: 'T-shirt or polo', bottom: 'Chinos or jeans', footwear: 'Sneakers', accessories: ['Sunglasses'] }
        : { top: 'Blouse or t-shirt', bottom: 'Jeans or skirt', footwear: 'Sandals or sneakers', accessories: ['Sunglasses'] };
    } else if (tempC >= 10) {
      // Cool weather
      return gender === 'male'
        ? { top: 'Long-sleeve shirt', bottom: 'Jeans or chinos', footwear: 'Sneakers or boots', accessories: ['Light jacket'] }
        : { top: 'Sweater or long-sleeve top', bottom: 'Jeans or pants', footwear: 'Boots or sneakers', accessories: ['Light jacket'] };
    } else if (tempC >= 0) {
      // Cold weather
      return gender === 'male'
        ? { top: 'Thermal top + sweater', bottom: 'Thermal leggings + jeans', footwear: 'Boots', accessories: ['Winter coat', 'Gloves', 'Beanie'] }
        : { top: 'Thermal top + sweater', bottom: 'Thermal leggings + pants', footwear: 'Boots', accessories: ['Winter coat', 'Gloves', 'Beanie'] };
    } else {
      // Freezing weather
      return gender === 'male'
        ? { top: 'Thermal top + sweater + heavy coat', bottom: 'Thermal leggings + insulated pants', footwear: 'Insulated boots', accessories: ['Heavy winter coat', 'Gloves', 'Scarf', 'Winter hat'] }
        : { top: 'Thermal top + sweater + heavy coat', bottom: 'Thermal leggings + insulated pants', footwear: 'Insulated boots', accessories: ['Heavy winter coat', 'Gloves', 'Scarf', 'Winter hat'] };
    }
  };

  const maleOutfit = getClothingSuggestion('male');
  const femaleOutfit = getClothingSuggestion('female');

  // Get weather condition icon based on temperature
  const getWeatherIcon = () => {
    if (tempC >= 30) return <FiSun className="text-yellow-400" />;
    if (tempC >= 20) return <FiSun className="text-yellow-300" />;
    if (tempC >= 10) return <FiDroplet className="text-blue-300" />;
    if (tempC >= 0) return <FiThermometer className="text-blue-400" />;
    return <FiThermometer className="text-blue-600" />;
  };

  const renderOutfitCard = (outfit: ClothingSuggestion, gender: 'male' | 'female') => {
    const genderConfig = {
      male: { icon: '👔', title: "Men's Outfit" },
      female: { icon: '👗', title: "Women's Outfit" }
    };

    return (
      <motion.div
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={cardVariants}
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-400/10 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-2xl mr-2">{genderConfig[gender].icon}</span>
              <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent inline-block">
                {genderConfig[gender].title}
              </h4>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 dark:bg-gray-700/50 px-3 py-1 rounded-full">
              {getWeatherIcon()}
              <span className="text-sm font-medium">{Math.round(tempC)}°C</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.div 
              custom={0}
              variants={itemVariants}
              className="flex items-center p-3 bg-white/5 dark:bg-white/5 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                <FiSun className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Top</p>
                <p className="font-medium text-gray-800 dark:text-white">{outfit.top}</p>
              </div>
            </motion.div>
            
            <motion.div 
              custom={1}
              variants={itemVariants}
              className="flex items-center p-3 bg-white/5 dark:bg-white/5 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-3">
                <FiWind className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bottom</p>
                <p className="font-medium text-gray-800 dark:text-white">{outfit.bottom}</p>
              </div>
            </motion.div>
            
            <motion.div 
              custom={2}
              variants={itemVariants}
              className="flex items-center p-3 bg-white/5 dark:bg-white/5 rounded-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mr-3">
                <FiDroplet className="text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Footwear</p>
                <p className="font-medium text-gray-800 dark:text-white">{outfit.footwear}</p>
              </div>
            </motion.div>
            
            {outfit.accessories && outfit.accessories.length > 0 && (
              <motion.div 
                custom={3}
                variants={itemVariants}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommended Accessories</p>
                <div className="flex flex-wrap gap-2">
                  {outfit.accessories.map((item, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 dark:bg-white/10 text-gray-800 dark:text-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            What to Wear
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Outfit suggestions based on current weather conditions
          </p>
        </div>
        
        <div className="flex space-x-2 bg-white/10 dark:bg-gray-700/20 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('casual')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'casual' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Casual
          </button>
          <button
            onClick={() => setActiveTab('formal')}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'formal' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Formal
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {renderOutfitCard(activeTab === 'casual' ? maleOutfit : {
            ...maleOutfit,
            top: `Formal ${maleOutfit.top.includes('shirt') ? 'shirt' : maleOutfit.top}`,
            bottom: maleOutfit.bottom.includes('pants') ? 'Dress pants' : 'Skirt or dress pants',
            footwear: 'Dress shoes',
            accessories: [...(maleOutfit.accessories || []), 'Watch', 'Belt']
          }, 'male')}
          
          {renderOutfitCard(activeTab === 'casual' ? femaleOutfit : {
            ...femaleOutfit,
            top: `Blouse or ${femaleOutfit.top}`,
            bottom: femaleOutfit.bottom.includes('pants') ? 'Dress pants or skirt' : 'Dress or skirt',
            footwear: 'Heels or dress shoes',
            accessories: [...(femaleOutfit.accessories || []), 'Jewelry', 'Clutch']
          }, 'female')}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Suggestions are based on the current temperature of {Math.round(tempC)}°C
        </p>
      </div>
    </motion.div>
  );
};

export default WhatToWear;
