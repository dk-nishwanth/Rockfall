import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  ZoomIn,
  ZoomOut
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'critical': return AlertTriangle;
    case 'warning': return AlertTriangle;
    case 'normal': return CheckCircle;
    default: return Activity;
  }
};

export function RiskMap() {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      {/* Map Container */}
      <div 
        className="relative w-full h-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {/* Terrain Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Mountain silhouettes */}
            <path d="M0,250 L50,180 L120,200 L180,120 L250,140 L320,80 L400,100 L400,300 L0,300 Z" fill="#8b7355" opacity="0.3" />
            <path d="M0,280 L80,220 L150,240 L220,180 L280,200 L350,160 L400,180 L400,300 L0,300 Z" fill="#6b5b47" opacity="0.4" />
            <path d="M0,300 L60,260 L140,280 L200,240 L260,260 L320,220 L400,240 L400,300 Z" fill="#5a4a3a" opacity="0.5" />
          </svg>
        </div>

        {/* Risk Zones */}
        {mockRiskZones.map((zone, index) => (
          <div
            key={zone.id}
            className="absolute rounded-lg border-2 border-dashed opacity-60"
            style={{
              backgroundColor: getRiskColor(zone.riskLevel),
              borderColor: getRiskColor(zone.riskLevel),
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`,
              width: `${25 + index * 5}%`,
              height: `${20 + index * 5}%`,
            }}
          >
            <div className="absolute -top-6 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium shadow-sm">
              {zone.name}
            </div>
            <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
              {(zone.probability * 100).toFixed(0)}%
            </div>
          </div>
        ))}

        {/* Sensor Markers */}
        {mockSensorReadings.map((sensor, index) => {
          const StatusIcon = getStatusIcon(sensor.status);
          return (
            <div
              key={sensor.id}
              className={`absolute cursor-pointer transition-all duration-200 ${
                selectedSensor === sensor.id ? 'scale-110 z-20' : 'z-10'
              }`}
              style={{
                left: `${25 + index * 15}%`,
                top: `${40 + index * 12}%`,
              }}
              onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
            >
              <div className="relative">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: getStatusColor(sensor.status) }}
                >
                  <StatusIcon className="h-3 w-3 text-white" />
                </div>
                
                {selectedSensor === sensor.id && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border min-w-48 z-30">
                    <h4 className="font-medium text-sm">{sensor.location.name}</h4>
                    <p className="text-xs text-muted-foreground">Type: {sensor.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Value: {sensor.value} {sensor.unit}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge 
                        variant={sensor.status === 'normal' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {sensor.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sensor.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <h4 className="font-medium text-sm mb-2">Risk Zones</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-xs">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Safe</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t">
          <h4 className="font-medium text-sm mb-1">Sensors</h4>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3" />
            <span>Click to view details</span>
          </div>
        </div>
      </div>
    </div>
  );
}