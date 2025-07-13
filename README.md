# Google Flights & Hotels App

## Overview
This application provides a comprehensive travel planning experience with flight search, hotel booking, and location-based services. The app uses dynamic user geolocation and browser locale settings to provide personalized results based on the user's current location, language, and currency preferences.

[**Live Demo: https://google-flights-khaki.vercel.app/**](https://google-flights-khaki.vercel.app/)

## Features

### Flight Search
- Search for flights between destinations
- View detailed flight information including prices, departure/arrival times
- Filter results by price, airlines, and other criteria
- Interactive flight details page with layover information

### Hotel Search
- Find hotels based on location and travel dates
- Advanced filtering by price, amenities, and guest preferences
- Interactive map integration with nearby points of interest
- View hotel details with photos, amenities, and pricing

### Location Services
- Dynamic geolocation integration that adapts to the user's current position
- Browser locale detection for language and currency customization
- Fallback mechanisms when geolocation is unavailable
- Map-based selection for exploring destinations

## Technology Stack

### Frontend
- **React**: Core framework for building the user interface
- **TypeScript**: Type safety and improved developer experience
- **Material UI**: Component library for consistent design
- **React Router**: Navigation and routing between views
- **React Hook Form**: Form handling with validation
- **i18next**: Internationalization support
- **Leaflet/react-leaflet**: Interactive maps with location markers

### API Integration
- **Sky Scrapper API**: Flight and hotel data provider
- **Geolocation API**: Browser-based user location detection
- **OpenStreetMap**: Map tiles and visualization

### State Management
- **React Context API**: Application state management
- **Custom hooks**: Encapsulated logic for reusable functionality

### Build Tools
- **Vite**: Fast build and development server
- **TypeScript**: Static typing system
- **ESLint/Prettier**: Code quality and formatting

### Deployment
- **Vercel**: Hosting and continuous deployment

## Key Features Highlight

### Dynamic User Location
The app detects and uses the user's current location to provide relevant search results. When permission is granted, all API calls use the actual user location for better accuracy.

### Interactive Maps
Users can interact with maps to select locations, view nearby attractions, and discover transportation options in their chosen destination.

### Browser Settings Integration
The app automatically adapts to the user's language and currency preferences based on browser settings, providing a seamless localized experience.

### Graceful Fallbacks
When geolocation permission is denied or unavailable, the app provides clear user feedback and continues to function with default settings.

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/google-flights.git
cd google-flights

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the project root and add:
```
VITE_RAPIDAPI_KEY=your_api_key_here
VITE_RAPIDAPI_HOST=sky-scrapper.p.rapidapi.com
```

## Usage
1. Grant location permission when prompted for personalized results
2. Search for flights or hotels using the form inputs
3. Use filters to narrow down results
4. Interact with the map to explore destinations
5. View details for specific flights or hotels

## Deployed Version
Visit the live application at [https://google-flights-khaki.vercel.app/](https://google-flights-khaki.vercel.app/)
