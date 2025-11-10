import React, { useState, memo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertTriangle, Send, Users, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface AlertData {
  title: string;
  message: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetUsers: string[];
  incidentType: 'rockfall' | 'landslide' | 'erosion' | 'inspection' | 'maintenance';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john@rockguard.com', role: 'Field Inspector', location: 'Sector 1-3' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@rockguard.com', role: 'Geologist', location: 'Sector 4-6' },
  { id: '3', name: 'Mike Chen', email: 'mike@rockguard.com', role: 'Safety Officer', location: 'All Sectors' },
  { id: '4', name: 'Emily Davis', email: 'emily@rockguard.com', role: 'Field Inspector', location: 'Sector 7-9' },
];

export const AlertManagement = memo(() => {
  const { addNotification } = useNotifications();
  const [alertData, setAlertData] = useState<AlertData>({
    title: '',
    message: '',
    location: '',
    severity: 'medium',
    targetUsers: [],
    incidentType: 'rockfall'
  });

  const [sentAlerts, setSentAlerts] = useState<Array<AlertData & { id: string; timestamp: Date; status: string }>>([]);

  const handleSendAlert = () => {
    if (!alertData.title || !alertData.message || !alertData.location || alertData.targetUsers.length === 0) {
      alert('Please fill in all required fields and select at least one user.');
      return;
    }

    // Create notification for each selected user
    alertData.targetUsers.forEach(userId => {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        addNotification({
          type: alertData.severity === 'critical' ? 'alert' : 'warning',
          title: alertData.title,
          message: `${alertData.message}\n\nLocation: ${alertData.location}\nAssigned to: ${user.name}`,
          location: alertData.location,
          severity: alertData.severity
        });
      }
    });

    // Add to sent alerts history
    const newAlert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'sent'
    };
    setSentAlerts(prev => [newAlert, ...prev]);

    // Reset form
    setAlertData({
      title: '',
      message: '',
      location: '',
      severity: 'medium',
      targetUsers: [],
      incidentType: 'rockfall'
    });

    alert(`Alert sent successfully to ${alertData.targetUsers.length} user(s)!`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'rockfall': return '🪨';
      case 'landslide': return '⛰️';
      case 'erosion': return '🌊';
      case 'inspection': return '🔍';
      case 'maintenance': return '🔧';
      default: return '⚠️';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Alert Management</h1>
        <p className="text-muted-foreground">Send targeted notifications to field personnel about incidents and inspections</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send Alert
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Field Personnel
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Alert History
          </TabsTrigger>
        </TabsList>

        {/* Send Alert Tab */}
        <TabsContent value="send">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Create New Alert
              </CardTitle>
              <CardDescription>
                Send notifications to field personnel about incidents or inspection requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="incident-type">Incident Type</Label>
                    <Select 
                      value={alertData.incidentType} 
                      onValueChange={(value: any) => setAlertData(prev => ({ ...prev, incidentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rockfall">🪨 Rockfall Detected</SelectItem>
                        <SelectItem value="landslide">⛰️ Landslide Risk</SelectItem>
                        <SelectItem value="erosion">🌊 Erosion Alert</SelectItem>
                        <SelectItem value="inspection">🔍 Inspection Required</SelectItem>
                        <SelectItem value="maintenance">🔧 Maintenance Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select 
                      value={alertData.severity} 
                      onValueChange={(value: any) => setAlertData(prev => ({ ...prev, severity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="high">🟠 High Priority</SelectItem>
                        <SelectItem value="critical">🔴 Critical - Immediate Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Sector 7, Mountain Ridge Trail"
                      value={alertData.location}
                      onChange={(e) => setAlertData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Alert Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Urgent: Rockfall Activity Detected"
                      value={alertData.title}
                      onChange={(e) => setAlertData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Detailed Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide detailed instructions for the field personnel..."
                      className="min-h-[100px]"
                      value={alertData.message}
                      onChange={(e) => setAlertData(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Select Field Personnel</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {mockUsers.map(user => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        alertData.targetUsers.includes(user.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setAlertData(prev => ({
                          ...prev,
                          targetUsers: prev.targetUsers.includes(user.id)
                            ? prev.targetUsers.filter(id => id !== user.id)
                            : [...prev.targetUsers, user.id]
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </p>
                        </div>
                        {alertData.targetUsers.includes(user.id) && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSendAlert}
                className="w-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Alert to {alertData.targetUsers.length} Personnel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Personnel Tab */}
        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockUsers.map(user => (
              <Card key={user.id} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {user.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alert History Tab */}
        <TabsContent value="history">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>History of sent alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {sentAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No alerts sent yet</p>
              ) : (
                <div className="space-y-4">
                  {sentAlerts.map(alert => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getIncidentIcon(alert.incidentType)}</span>
                          <h3 className="font-medium">{alert.title}</h3>
                          <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {alert.targetUsers.length} personnel notified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

AlertManagement.displayName = 'AlertManagement';
