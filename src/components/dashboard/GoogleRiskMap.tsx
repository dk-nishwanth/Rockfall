import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Layers,
  Satellite
} from 'lucide-react';
import { mockRiskZones, mockSensorReadings } from '../data/mockData';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'normal': return '#10b981';
    default: return '#6b7280';
  }
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'safe': return '#10b981';
    default: return '#6b7280';
  }
};

// Coordinates for rockfall monitoring
// 11.53°N 79.48°E
const mapCenter = { lat: 11.532, lng: 79.48 }; // Slightly adjusted center for better view

// Define sensor locations around the monitoring zone
const sensorLocations = [
  { lat: 11.535, lng: 79.48, name: 'North Slope Sensor' },
  { lat: 11.528, lng: 79.485, name: 'East Ridge Sensor' },
  { lat: 11.525, lng: 79.475, name: 'South Valley Sensor' },
  { lat: 11.53, lng: 79.48, name: 'Central Monitoring Station' },
  { lat: 11.532, lng: 79.478, name: 'West Cliff Sensor' }
];

// Convert mockRiskZones to the format expected by the map
const riskZones = mockRiskZones.map(zone => ({
  center: { 
    lat: zone.coordinates.reduce((sum, coord) => sum + coord[1], 0) / zone.coordinates.length,
    lng: zone.coordinates.reduce((sum, coord) => sum + coord[0], 0) / zone.coordinates.length
  },
  radius: 200, // Fixed radius for all zones
  riskLevel: zone.riskLevel
}));

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  minZoom: 13,
  maxZoom: 18,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "simplified" }]
    }
  ]
};

export function GoogleRiskMap() {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('terrain');

  const onLoad = useCallback((map: any) => {
    console.log('Map loaded successfully');
  }, []);

  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
  }, []);

  // Change map type
  const changeMapType = (type: 'roadmap' | 'satellite' | 'terrain') => {
    setMapType(type);
  };
  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative">
      <LoadScript
        googleMapsApiKey="AIzaSyB1x_fcwh8r0jHxMMG_fV9Pe98-ycL7bOY"
        libraries={['geometry']}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          mapTypeId={mapType}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Risk Zone Circles */}
          {riskZones.map((zone, index) => (
            <Circle
              key={`risk-zone-${index}`}
              center={zone.center}
              radius={zone.radius}
              options={{
                strokeColor: getRiskColor(zone.riskLevel),
                strokeOpacity: zone.riskLevel === 'high' ? 1 : 0.8,
                strokeWeight: zone.riskLevel === 'high' ? 3 : 2,
                fillColor: getRiskColor(zone.riskLevel),
                fillOpacity: zone.riskLevel === 'high' ? 0.5 : 0.3,
                zIndex: zone.riskLevel === 'high' ? 3 : zone.riskLevel === 'medium' ? 2 : 1,
                clickable: true
              }}
            />
          ))}

          {/* Sensor Markers */}
          {mockSensorReadings.map((sensor, index) => (
            <Marker
              key={sensor.id}
              position={sensorLocations[index] || mapCenter}
              title={sensor.location.name}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                fillColor: getStatusColor(sensor.status),
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8
              }}
              onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
            >
              {selectedSensor === sensor.id && (
                <InfoWindow onCloseClick={() => setSelectedSensor(null)}>
                  <div className="p-3 min-w-48">
                    <h4 className="font-semibold text-sm">{sensor.location.name}</h4>
                    <p className="text-xs text-gray-600">Type: {sensor.type}</p>
                    <p className="text-xs text-gray-600">Value: {sensor.value} {sensor.unit}</p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        sensor.status === 'normal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sensor.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{sensor.timestamp.toLocaleTimeString()}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>

      {/* Map Type Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          <Button
            variant={mapType === 'terrain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeMapType('terrain')}
            className="text-xs"
          >
            <Layers className="h-3 w-3 mr-1" />
            Terrain
          </Button>
          <Button
            variant={mapType === 'satellite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeMapType('satellite')}
            className="text-xs"
          >
            <Satellite className="h-3 w-3 mr-1" />
            Satellite
          </Button>
          <Button
            variant={mapType === 'roadmap' ? 'default' : 'outline'}
            size="sm"
            onClick={() => changeMapType('roadmap')}
            className="text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Road
          </Button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border max-w-48">
        <h4 className="font-medium text-sm mb-2">Risk Zones</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Safe Zone</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t">
          <h4 className="font-medium text-sm mb-1">Sensors</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
              <span className="text-xs">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full border border-white"></div>
              <span className="text-xs">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              <span className="text-xs">Normal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="absolute top-4 left-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-3 max-w-64">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-green-800 dark:text-green-200">Tamil Nadu Region</p>
            <p className="text-xs text-green-600 dark:text-green-300 mt-1">
              11°21'30"N 77°49'54"E - Rockfall Monitoring Zone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
