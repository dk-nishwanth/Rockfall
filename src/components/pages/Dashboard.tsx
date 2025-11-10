import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Move, 
  Zap,
  MapPin,
  TrendingUp,
  Mountain,
  Layers,
  Pickaxe
} from 'lucide-react';
import { GoogleRiskMap } from '../dashboard/GoogleRiskMap';
import { SensorPanel } from '../dashboard/SensorPanel';
import { TimeSeriesChart } from '../dashboard/TimeSeriesChart';
import { PredictionPanel } from '../dashboard/PredictionPanel';
import { mockAlerts } from '../data/mockData';

// Mock material data
const materialData = {
  rock: {
    type: 'Sedimentary Rock',
    composition: 'Limestone & Sandstone',
    stability: 72,
    riskLevel: 'Medium',
    lastAnalysis: '2 hours ago'
  },
  soil: {
    type: 'Clay-Rich Soil',
    moisture: 45,
    density: 1.8,
    riskLevel: 'High',
    lastAnalysis: '1 hour ago'
  },
  slope: {
    angle: 35,
    vegetation: 'Sparse',
    erosionRate: 'Moderate',
    riskLevel: 'Medium',
    lastAnalysis: '30 minutes ago'
  }
};

export const Dashboard = React.memo(() => {
  const { activeAlerts, criticalAlerts } = useMemo(() => {
    const active = mockAlerts.filter(alert => alert.status === 'active');
    const critical = active.filter(alert => alert.severity === 'critical' || alert.severity === 'high');
    return { activeAlerts: active, criticalAlerts: critical };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with key metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Rockfall Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and AI-powered risk assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm">System Online</span>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Risk Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">Medium</div>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Sensors Online</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">24/24</div>
            <p className="text-xs text-muted-foreground">
              100% operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Risk Assessment Map
              </CardTitle>
              <CardDescription>
                Real-time visualization of risk zones and sensor locations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <GoogleRiskMap />
            </CardContent>
          </Card>
        </div>

        {/* Sensor Panel - Takes up 1/3 on large screens */}
        <div>
          <SensorPanel />
        </div>
      </div>

      {/* Charts and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Data Trends</CardTitle>
              <CardDescription>
                24-hour history of key sensor measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart />
            </CardContent>
          </Card>

          {/* Material Classification Section */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Geological Material Analysis
              </CardTitle>
              <CardDescription>
                Real-time analysis of rock, soil, and slope conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {/* Rock Analysis */}
                <div className="border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Mountain className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium">Rock Formation</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{materialData.rock.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stability:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={materialData.rock.stability} className="h-2 flex-1" />
                        <span className="font-bold text-xs">{materialData.rock.stability}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{materialData.rock.composition}</span>
                    <Badge className={materialData.rock.riskLevel === 'High' ? 'bg-red-500' : materialData.rock.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {materialData.rock.riskLevel}
                    </Badge>
                  </div>
                </div>

                {/* Soil Analysis */}
                <div className="border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-amber-600" />
                    <h4 className="font-medium">Soil Composition</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{materialData.soil.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Moisture:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={materialData.soil.moisture} className="h-2 flex-1" />
                        <span className="font-bold text-xs">{materialData.soil.moisture}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Density: {materialData.soil.density} g/cm³</span>
                    <Badge className={materialData.soil.riskLevel === 'High' ? 'bg-red-500' : materialData.soil.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {materialData.soil.riskLevel}
                    </Badge>
                  </div>
                </div>

                {/* Slope Analysis */}
                <div className="border rounded-lg p-4 bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Pickaxe className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium">Slope Conditions</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Angle:</span>
                      <p className="font-medium">{materialData.slope.angle}°</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Erosion:</span>
                      <p className="font-medium">{materialData.slope.erosionRate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Vegetation: {materialData.slope.vegetation}</span>
                    <Badge className={materialData.slope.riskLevel === 'High' ? 'bg-red-500' : materialData.slope.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {materialData.slope.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Risk Predictions</CardTitle>
            <CardDescription>
              Machine learning based rockfall probability assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PredictionPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';