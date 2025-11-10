# Google Maps API Setup Guide

## Overview
The Risk Assessment Map now uses Google Maps API for real-world geographical visualization with satellite imagery, terrain data, and precise location mapping.

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for location search)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Add API Key to Project
1. Open `src/components/dashboard/GoogleRiskMap.tsx`
2. Find line with `YOUR_API_KEY_HERE`
3. Replace with your actual API key:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap`;
   ```

### 3. Configure Real Coordinates
Update the `mockCoordinates` object with your actual location coordinates:

```typescript
const mockCoordinates = {
  center: { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }, // Your area center
  sensors: [
    { lat: SENSOR1_LAT, lng: SENSOR1_LNG },
    { lat: SENSOR2_LAT, lng: SENSOR2_LNG },
    // Add more sensor coordinates
  ],
  riskZones: [
    { lat: ZONE1_LAT, lng: ZONE1_LNG, radius: 200 },
    { lat: ZONE2_LAT, lng: ZONE2_LNG, radius: 150 },
    // Add more risk zone coordinates
  ]
};
```

## Features Included

### 🗺️ **Map Types**
- **Terrain**: Shows topographical features (default for rockfall monitoring)
- **Satellite**: High-resolution satellite imagery
- **Roadmap**: Standard road map view

### 📍 **Interactive Elements**
- **Sensor Markers**: Color-coded by status (normal/warning/critical)
- **Risk Zones**: Circular overlays showing probability areas
- **Info Windows**: Click markers for detailed sensor information
- **Legend**: Visual guide for understanding map elements

### 🎛️ **Controls**
- **Map Type Switcher**: Toggle between terrain, satellite, and road views
- **Zoom Controls**: Built-in Google Maps zoom functionality
- **Pan & Drag**: Standard Google Maps navigation

## Security Best Practices

### API Key Restrictions
1. **HTTP Referrers**: Restrict to your domain
   ```
   https://yourdomain.com/*
   https://localhost:3000/* (for development)
   ```

2. **API Restrictions**: Limit to required APIs only
   - Maps JavaScript API
   - Places API (if using search features)

### Environment Variables (Recommended)
Instead of hardcoding the API key, use environment variables:

1. Create `.env.local` file:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. Update the component:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
   ```

## Fallback Behavior
If Google Maps fails to load:
- Shows error message with troubleshooting info
- Provides fallback to original SVG-based map
- Displays loading spinner during initialization

## Cost Considerations
- Google Maps API has usage-based pricing
- Free tier includes significant monthly usage
- Monitor usage in Google Cloud Console
- Consider implementing usage limits if needed

## Troubleshooting

### Common Issues
1. **"Map Loading Error"**: Check API key and network connection
2. **Blank Map**: Verify API key restrictions and enabled APIs
3. **Markers Not Showing**: Check coordinate format (lat/lng objects)

### Debug Mode
Enable console logging by adding to the component:
```typescript
console.log('Google Maps loaded:', !!window.google);
console.log('Map initialized:', !!map);
```

## Next Steps
1. Add your Google Maps API key
2. Update coordinates with real sensor/zone locations
3. Test different map types for best visualization
4. Consider adding additional features like:
   - Real-time sensor data updates
   - Historical incident markers
   - Weather overlay integration
   - Evacuation route planning
