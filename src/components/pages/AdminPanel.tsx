import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Settings, 
  Radio, 
  Upload, 
  Users, 
  Activity,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Download,
  FileImage,
  Database,
  Bell,
  Shield
} from 'lucide-react';
import { mockSensorReadings } from '../data/mockData';
import { useAuth } from '../auth/AuthContext';

interface Sensor {
  id: string;
  name: string;
  type: string;
  location: { lat: number; lng: number; name: string };
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  lastUpdate: Date;
}

interface AlertThreshold {
  id: string;
  parameter: string;
  warning: number;
  critical: number;
  unit: string;
}

const mockSensors: Sensor[] = mockSensorReadings.map(reading => ({
  id: reading.id,
  name: reading.location.name,
  type: reading.type,
  location: reading.location,
  status: reading.status === 'normal' ? 'online' : reading.status === 'warning' ? 'online' : 'offline',
  batteryLevel: Math.floor(Math.random() * 40) + 60,
  lastUpdate: reading.timestamp
}));

const defaultThresholds: AlertThreshold[] = [
  { id: '1', parameter: 'Displacement Rate', warning: 5, critical: 10, unit: 'mm/day' },
  { id: '2', parameter: 'Strain', warning: 200, critical: 500, unit: 'με' },
  { id: '3', parameter: 'Pore Pressure', warning: 100, critical: 150, unit: 'kPa' },
  { id: '4', parameter: 'Rainfall Rate', warning: 20, critical: 50, unit: 'mm/h' },
  { id: '5', parameter: 'Vibration', warning: 0.05, critical: 0.1, unit: 'g' },
];

export const AdminPanel = React.memo(() => {
  const { user } = useAuth();
  const [sensors, setSensors] = useState(mockSensors);
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [newSensorName, setNewSensorName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const addSensor = useCallback(() => {
    if (!newSensorName.trim()) return;
    
    const newSensor: Sensor = {
      id: `sensor-${Date.now()}`,
      name: newSensorName,
      type: 'displacement',
      location: { lat: 46.5197, lng: 6.6323, name: newSensorName },
      status: 'online',
      batteryLevel: 95,
      lastUpdate: new Date()
    };
    
    setSensors(prev => [...prev, newSensor]);
    setNewSensorName('');
  }, [newSensorName]);

  const removeSensor = useCallback((sensorId: string) => {
    setSensors(prev => prev.filter(s => s.id !== sensorId));
  }, []);

  const updateThreshold = useCallback((id: string, field: 'warning' | 'critical', value: number) => {
    setThresholds(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'maintenance': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Admin Panel</h1>
        <p className="text-muted-foreground">System configuration and management</p>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
          <TabsTrigger value="uploads">File Uploads</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        {/* Sensor Management */}
        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Sensor Management
              </CardTitle>
              <CardDescription>
                Add, remove, and configure monitoring sensors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Sensor */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="sensor-name">Add New Sensor</Label>
                  <Input
                    id="sensor-name"
                    placeholder="Sensor name"
                    value={newSensorName}
                    onChange={(e) => setNewSensorName(e.target.value)}
                  />
                </div>
                <Button onClick={addSensor} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sensor
                </Button>
              </div>

              <Separator />

              {/* Sensor List */}
              <div className="space-y-4">
                <h3>Active Sensors ({sensors.length})</h3>
                <div className="grid gap-4">
                  {sensors.map((sensor) => (
                    <div key={sensor.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{sensor.name}</h4>
                            <Badge variant={getStatusColor(sensor.status) as any}>
                              {sensor.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Type: {sensor.type}</p>
                            <p>Location: {sensor.location.name}</p>
                            <p>Battery: {sensor.batteryLevel}%</p>
                            <p>Last Update: {sensor.lastUpdate.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeSensor(sensor.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Thresholds */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Thresholds
              </CardTitle>
              <CardDescription>
                Configure warning and critical alert thresholds for each parameter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {thresholds.map((threshold) => (
                <div key={threshold.id} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">{threshold.parameter}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Warning Threshold</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[threshold.warning]}
                          onValueChange={(value) => updateThreshold(threshold.id, 'warning', value[0])}
                          max={threshold.critical * 2}
                          step={0.1}
                          className="flex-1"
                        />
                        <span className="text-sm w-20">
                          {threshold.warning} {threshold.unit}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Critical Threshold</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[threshold.critical]}
                          onValueChange={(value) => updateThreshold(threshold.id, 'critical', value[0])}
                          max={threshold.critical * 3}
                          step={0.1}
                          className="flex-1"
                        />
                        <span className="text-sm w-20">
                          {threshold.critical} {threshold.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">
                Save Threshold Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Uploads */}
        <TabsContent value="uploads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  DEM Upload
                </CardTitle>
                <CardDescription>
                  Upload Digital Elevation Model files for terrain analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop DEM files here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".tif,.dem,.asc"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="dem-upload"
                  />
                  <Label htmlFor="dem-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose Files</span>
                    </Button>
                  </Label>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Drone Imagery
                </CardTitle>
                <CardDescription>
                  Upload drone survey images for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop image files here
                  </p>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.tiff"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="drone-upload"
                  />
                  <Label htmlFor="drone-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose Images</span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">terrain_survey_2024.tif</span>
                  <Badge variant="default">Processed</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">drone_images_batch_01.zip</span>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">elevation_model_v2.dem</span>
                  <Badge variant="default">Processed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                General system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable continuous sensor data collection
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alert notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send critical alerts via SMS
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically archive old data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">AI Model Settings</h3>
                
                <div className="space-y-2">
                  <Label>Prediction Confidence Threshold</Label>
                  <Slider defaultValue={[85]} max={100} step={1} />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for generating predictions (85%)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Model Update Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

AdminPanel.displayName = 'AdminPanel';