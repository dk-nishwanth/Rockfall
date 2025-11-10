import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Move, 
  Zap, 
  Droplets, 
  Thermometer, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { mockSensorReadings } from '../data/mockData';

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'displacement': return Move;
    case 'strain': return Zap;
    case 'pore_pressure': return Droplets;
    case 'rainfall': return Droplets;
    case 'temperature': return Thermometer;
    case 'vibration': return Activity;
    default: return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return 'destructive';
    case 'warning': return 'secondary';
    case 'normal': return 'default';
    default: return 'default';
  }
};

const getTrendIcon = () => {
  const trends = [TrendingUp, TrendingDown, Minus];
  return trends[Math.floor(Math.random() * trends.length)];
};

const getTrendColor = (IconComponent: React.ElementType) => {
  if (IconComponent === TrendingUp) return 'text-red-500';
  if (IconComponent === TrendingDown) return 'text-green-500';
  return 'text-gray-500';
};

export function SensorPanel() {
  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live Sensor Readings
        </CardTitle>
        <CardDescription>
          Real-time data from field sensors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[400px]">
        {mockSensorReadings.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const TrendIcon = getTrendIcon();
          const trendColor = getTrendColor(TrendIcon);
          
          return (
            <div key={sensor.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium capitalize">
                    {sensor.type.replace('_', ' ')}
                  </span>
                </div>
                <Badge variant={getStatusColor(sensor.status) as any}>
                  {sensor.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold">
                    {sensor.value} {sensor.unit}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                    <span className="text-xs text-muted-foreground">
                      {sensor.location.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last update: {sensor.timestamp.toLocaleTimeString()}
              </div>
              
              {/* Progress bar for normalized values */}
              <Progress 
                value={Math.min((sensor.value / (sensor.type === 'temperature' ? 30 : sensor.type === 'rainfall' ? 50 : 300)) * 100, 100)} 
                className="h-1"
              />
            </div>
          );
        })}
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">System Health</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Data transmission: Normal</div>
            <div>Battery levels: Good</div>
            <div>Signal strength: Strong</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}