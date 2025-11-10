export interface SensorReading {
  id: string;
  type: 'displacement' | 'strain' | 'pore_pressure' | 'rainfall' | 'temperature' | 'vibration';
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface Alert {
  id: string;
  timestamp: Date;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  description: string;
  recommendedAction: string;
  status: 'active' | 'acknowledged' | 'resolved';
  sensorType: string;
}

export interface RiskZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  riskLevel: 'safe' | 'medium' | 'high';
  probability: number;
}

// Mock sensor data
export const mockSensorReadings: SensorReading[] = [
  {
    id: '1',
    type: 'displacement',
    value: 3.2,
    unit: 'mm',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: 'normal',
    location: { lat: 11.535, lng: 79.48, name: 'North Slope Sensor' }
  },
  {
    id: '2',
    type: 'strain',
    value: 180,
    unit: 'με',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    status: 'warning',
    location: { lat: 11.528, lng: 79.485, name: 'East Ridge Sensor' }
  },
  {
    id: '3',
    type: 'pore_pressure',
    value: 92.5,
    unit: 'kPa',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    status: 'normal',
    location: { lat: 11.525, lng: 79.475, name: 'South Valley Sensor' }
  },
  {
    id: '4',
    type: 'rainfall',
    value: 8.7,
    unit: 'mm/h',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'critical',
    location: { lat: 11.53, lng: 79.48, name: 'Central Monitoring Station' }
  },
  {
    id: '5',
    type: 'temperature',
    value: 28.5,
    unit: '°C',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    status: 'normal',
    location: { lat: 11.532, lng: 79.478, name: 'West Cliff Sensor' }
  },
  {
    id: '6',
    type: 'vibration',
    value: 0.035,
    unit: 'g',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: 'warning',
    location: { lat: 11.53, lng: 79.48, name: 'Central Vibration Sensor' }
  }
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    location: 'Sector A - North Face',
    severity: 'high',
    riskScore: 85,
    description: 'Elevated displacement rate detected',
    recommendedAction: 'Evacuate immediate area, monitor continuously',
    status: 'active',
    sensorType: 'displacement'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    location: 'Sector B - East Ridge',
    severity: 'medium',
    riskScore: 65,
    description: 'Increased strain measurements',
    recommendedAction: 'Enhanced monitoring, restrict access',
    status: 'acknowledged',
    sensorType: 'strain'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    location: 'Weather Station Alpha',
    severity: 'critical',
    riskScore: 95,
    description: 'Heavy rainfall threshold exceeded',
    recommendedAction: 'Immediate evacuation of all risk zones',
    status: 'active',
    sensorType: 'rainfall'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    location: 'Sector C - South Wall',
    severity: 'low',
    riskScore: 35,
    description: 'Minor vibration anomaly',
    recommendedAction: 'Continue normal monitoring',
    status: 'resolved',
    sensorType: 'vibration'
  }
];

// Mock risk zones around 11.53°N 79.48°E
export const mockRiskZones: RiskZone[] = [
  // High Risk Zone - Northern Cliff Face
  {
    id: 'high1',
    name: 'Northern Cliff Face',
    coordinates: [
      [79.475, 11.535], // SW
      [79.485, 11.535], // SE
      [79.485, 11.54],  // NE
      [79.475, 11.54]   // NW
    ],
    riskLevel: 'high',
    probability: 0.92
  },
  // Medium Risk Zone - Eastern Slope
  {
    id: 'med1',
    name: 'Eastern Slope',
    coordinates: [
      [79.482, 11.533],
      [79.49, 11.533],
      [79.49, 11.527],
      [79.482, 11.527]
    ],
    riskLevel: 'medium',
    probability: 0.65
  },
  // Safe Zone - Valley Floor
  {
    id: 'safe1',
    name: 'Valley Floor',
    coordinates: [
      [79.47, 11.525],
      [79.49, 11.525],
      [79.49, 11.53],
      [79.47, 11.53]
    ],
    riskLevel: 'safe',
    probability: 0.12
  },
  // Additional High Risk Zone - Western Cliff
  {
    id: 'high2',
    name: 'Western Cliff',
    coordinates: [
      [79.47, 11.532],
      [79.475, 11.532],
      [79.475, 11.537],
      [79.47, 11.537]
    ],
    riskLevel: 'high',
    probability: 0.88
  }
];

// Define interface for time series data point
interface TimeSeriesDataPoint {
  timestamp: string;
  displacement: number;
  strain: number;
  porePressure: number;
  rainfall: number;
  temperature: number;
  vibration: number;
  riskProbability: number;
}

// Generate time series data for charts
export function generateTimeSeriesData(hours: number = 24): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      displacement: Math.random() * 5 + 1,
      strain: Math.random() * 200 + 50,
      porePressure: Math.random() * 100 + 50,
      rainfall: Math.random() * 20,
      temperature: Math.random() * 10 + 15,
      vibration: Math.random() * 0.1,
      riskProbability: Math.random() * 100
    });
  }
  
  return data;
}