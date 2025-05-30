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
  const [activeTab, setActiveTab] = useState<'casual' | 'formal' | 'gym'>('casual');
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
  
  // Determine clothing suggestions based on temperature and category
  const getClothingSuggestion = (gender: 'male' | 'female'): ClothingSuggestion => {
    // Gym outfit
    if (activeTab === 'gym') {
      if (tempC >= 25) {
        return gender === 'male'
          ? { 
              top: 'Moisture-wicking tank top or sleeveless shirt', 
              bottom: 'Athletic shorts with built-in liner', 
              footwear: 'Breathable running shoes', 
              accessories: ['Sweat-wicking headband', 'Water bottle', 'Sunscreen'] 
            }
          : { 
              top: 'Sports bra with racerback tank', 
              bottom: 'High-waisted athletic shorts or capris', 
              footwear: 'Running shoes with good arch support', 
              accessories: ['Hair tie', 'Water bottle', 'Sunscreen'] 
            };
      } else if (tempC >= 15) {
        return gender === 'male'
          ? { 
              top: 'Moisture-wicking t-shirt', 
              bottom: 'Training shorts or joggers', 
              footwear: 'Cross-training shoes', 
              accessories: ['Gym towel', 'Water bottle'] 
            }
          : { 
              top: 'Sports bra with fitted t-shirt', 
              bottom: 'Leggings or training shorts', 
              footwear: 'Cross-training shoes', 
              accessories: ['Hair tie', 'Water bottle'] 
            };
      } else {
        return gender === 'male'
          ? { 
              top: 'Moisture-wicking long-sleeve base layer', 
              bottom: 'Athletic pants with side vents', 
              footwear: 'Indoor training shoes', 
              accessories: ['Training gloves', 'Water bottle'] 
            }
          : { 
              top: 'Long-sleeve performance top with thumbholes', 
              bottom: 'Full-length leggings', 
              footwear: 'Indoor training shoes', 
              accessories: ['Headband', 'Water bottle'] 
            };
      }
    }

    // Formal outfit
    if (activeTab === 'formal') {
      if (tempC >= 25) {
        return gender === 'male'
          ? { 
              top: 'Lightweight cotton or linen dress shirt (tie optional)', 
              bottom: 'Light-colored dress pants', 
              footwear: 'Loafers or dressy sandals', 
              accessories: ['Sunglasses', 'Straw panama hat'] 
            }
          : { 
              top: 'Sleeveless silk blouse', 
              bottom: 'Linen or chiffon dress or skirt suit', 
              footwear: 'Strappy sandals or pumps', 
              accessories: ['Wide-brimmed hat', 'Sunglasses'] 
            };
      } else if (tempC >= 15) {
        return gender === 'male'
          ? { 
              top: 'Dress shirt with tie', 
              bottom: 'Wool or wool-blend suit pants', 
              footwear: 'Oxfords or derby shoes', 
              accessories: ['Dress watch', 'Leather belt', 'Light blazer'] 
            }
          : { 
              top: 'Silk blouse with statement necklace', 
              bottom: 'Pencil skirt or tailored pants', 
              footwear: 'Pumps or loafers', 
              accessories: ['Structured handbag', 'Watch'] 
            };
      } else {
        return gender === 'male'
          ? { 
              top: 'Dress shirt with wool sweater vest', 
              bottom: 'Tailored wool dress pants', 
              footwear: 'Leather dress shoes', 
              accessories: ['Topcoat', 'Wool scarf', 'Leather gloves'] 
            }
          : { 
              top: 'Silk blouse with structured blazer', 
              bottom: 'Wool trousers or midi skirt with tights', 
              footwear: 'Knee-high boots or pumps', 
              accessories: ['Wool coat', 'Cashmere wrap', 'Leather gloves'] 
            };
      }
    }

    // Casual outfit (default)
    if (tempC >= 30) {
      // Hot weather
      return gender === 'male' 
        ? { 
            top: 'Linen or cotton short-sleeve shirt', 
            bottom: 'Lightweight chino shorts', 
            footwear: 'Leather sandals or canvas sneakers', 
            accessories: ['Aviator sunglasses', 'Baseball cap', 'Water bottle'] 
          }
        : { 
            top: 'Flowy tank top or sundress', 
            bottom: 'Denim shorts or midi skirt', 
            footwear: 'Strappy sandals or wedges', 
            accessories: ['Oversized sunglasses', 'Wide-brim hat', 'Tote bag'] 
          };
    } else if (tempC >= 20) {
      // Warm weather
      return gender === 'male'
        ? { 
            top: 'Polo shirt or casual button-down', 
            bottom: 'Chinos or dark jeans', 
            footwear: 'Canvas sneakers or boat shoes', 
            accessories: ['Casual watch', 'Lightweight bomber jacket'] 
          }
        : { 
            top: 'Off-shoulder top or blouse', 
            bottom: 'Mom jeans or midi skirt', 
            footwear: 'Ballet flats or ankle boots', 
            accessories: ['Crossbody bag', 'Dainty jewelry'] 
          };
    } else if (tempC >= 10) {
      // Cool weather
      return gender === 'male'
        ? { 
            top: 'Flannel shirt over t-shirt or henley', 
            bottom: 'Dark jeans or chinos', 
            footwear: 'Leather boots or sneakers', 
            accessories: ['Denim or field jacket', 'Beanie'] 
          }
        : { 
            top: 'Turtleneck or chunky sweater', 
            bottom: 'High-waisted jeans with tights', 
            footwear: 'Ankle boots or booties', 
            accessories: ['Trench coat', 'Blanket scarf'] 
          };
    } else if (tempC >= 0) {
      // Cold weather
      return gender === 'male'
        ? { 
            top: 'Thermal henley + sweater + insulated jacket', 
            bottom: 'Thermal base layer + jeans or chinos', 
            footwear: 'Waterproof winter boots', 
            accessories: ['Puffer jacket', 'Beanie', 'Touchscreen gloves'] 
          }
        : { 
            top: 'Turtleneck + cashmere sweater', 
            bottom: 'Fleece-lined leggings + wool skirt', 
            footwear: 'Shearling-lined boots', 
            accessories: ['Puffer coat', 'Knit headband', 'Leather gloves'] 
          };
    } else {
      // Freezing weather
      return gender === 'male'
        ? { 
            top: 'Thermal base layer + flannel shirt + down vest + parka', 
            bottom: 'Thermal base layer + insulated pants', 
            footwear: 'Insulated winter boots', 
            accessories: ['Heavy parka', 'Balaclava', 'Insulated gloves'] 
          }
        : { 
            top: 'Thermal base layer + cashmere sweater + down vest', 
            bottom: 'Thermal tights + quilted skirt', 
            footwear: 'Fur-lined boots', 
            accessories: ['Down coat', 'Cashmere wrap', 'Touchscreen gloves'] 
          };
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
        
        <div className="flex space-x-2 mb-6 bg-white/10 dark:bg-gray-800/20 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('casual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'casual' ? 'bg-white text-blue-600 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
          >
            Casual
          </button>
          <button
            onClick={() => setActiveTab('formal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'formal' ? 'bg-white text-blue-600 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
          >
            Formal
          </button>
          <button
            onClick={() => setActiveTab('gym')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gym' ? 'bg-white text-blue-600 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
          >
            Gym
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
          {renderOutfitCard(maleOutfit, 'male')}
          
          {renderOutfitCard(femaleOutfit, 'female')}
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
