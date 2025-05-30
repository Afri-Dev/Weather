# Weather App

A modern, feature-rich weather application built with React and TypeScript, providing comprehensive weather information and forecasts for locations worldwide. The app features a clean, intuitive interface with dark/light theme support and responsive design for all devices.

## Features

### Weather Information
- Current weather conditions with temperature, humidity, wind speed, and pressure
- Detailed weather icons and descriptions
- Real-time weather updates
- Temperature units (Celsius/Fahrenheit) toggle

### Forecast Views
- 7-day weather forecast with daily summaries
- Hourly weather predictions
- Interactive weather charts and graphs
- Weather-based clothing recommendations

### Location Management
- Search for any location worldwide
- Save frequently visited locations
- Quick access to saved locations
- Geolocation support

### UI/UX Features
- Dark/Light theme toggle
- Responsive design for mobile and desktop
- Animated transitions and interactions
- Modern, clean interface
- Weather-based background colors

### Additional Features
- Weather alerts and notifications
- Weather statistics and trends
- Weather history tracking
- Multiple location comparison

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations
- **Radix UI** - Accessible UI components
- **React Icons** - Icon library
- **Sonner** - Toast notifications
- **Next-themes** - Theme switching
- **Recharts** - Weather data visualization
- **React Hook Form** - Form handling
- **Zod** - Runtime type validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript linting
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## Project Structure

```
src/
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API integrations
├── types/          # TypeScript type definitions
└── styles/         # Global styles and Tailwind configuration
```

## Screenshots

### Main Weather View
![Main Weather View](/src/images/Screenshot%202025-05-30%20233537.png)

### Forecast View
![Forecast View](/src/images/Screenshot%202025-05-30%20233555.png)

### Location Search
![Location Search](/src/images/Screenshot%202025-05-30%20233605.png)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Build and Deployment

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Deploy to Vercel
npm run vercel-build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request`
"# Weather" 
