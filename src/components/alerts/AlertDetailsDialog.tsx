import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Eye
} from 'lucide-react';
import { Alert } from '../data/mockData';

interface AlertDetailsDialogProps {
  alert: Alert;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}

export function AlertDetailsDialog({ 
  alert, 
  isOpen, 
  onClose, 
  onAcknowledge, 
  onResolve 
}: AlertDetailsDialogProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'acknowledged': return 'secondary';
      case 'resolved': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return AlertTriangle;
      case 'medium':
        return TrendingUp;
      case 'low':
        return Activity;
      default:
        return AlertTriangle;
    }
  };

  const SeverityIcon = getSeverityIcon(alert.severity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SeverityIcon className="h-5 w-5" />
            Alert Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about the alert
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Status and Severity */}
          <div className="flex items-center gap-4">
            <Badge variant={getSeverityColor(alert.severity) as any} className="text-sm">
              {alert.severity.toUpperCase()} SEVERITY
            </Badge>
            <Badge variant={getStatusColor(alert.status) as any} className="text-sm">
              {alert.status.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Risk Score: {alert.riskScore}%
            </div>
          </div>

          <Separator />

          {/* Location and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {alert.location}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Timestamp</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {alert.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Alert Description */}
          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">
              {alert.description}
            </p>
          </div>

          {/* Sensor Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Sensor Information</h3>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Sensor Type: {alert.sensorType}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Contributing to risk assessment and alert generation
              </p>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="space-y-2">
            <h3 className="font-medium">Recommended Action</h3>
            <div className={`p-3 rounded-lg border-l-4 ${
              alert.severity === 'critical' || alert.severity === 'high' 
                ? 'bg-red-50 border-red-500 dark:bg-red-950/20' 
                : alert.severity === 'medium'
                ? 'bg-orange-50 border-orange-500 dark:bg-orange-950/20'
                : 'bg-blue-50 border-blue-500 dark:bg-blue-950/20'
            }`}>
              <p className="text-sm">{alert.recommendedAction}</p>
            </div>
          </div>

          {/* Alert Timeline (Mock) */}
          <div className="space-y-2">
            <h3 className="font-medium">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{alert.timestamp.toLocaleString()} - Alert generated</span>
              </div>
              {alert.status === 'acknowledged' && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Alert acknowledged by operator</span>
                </div>
              )}
              {alert.status === 'resolved' && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Alert resolved</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {alert.status === 'active' && (
              <Button 
                variant="secondary"
                onClick={() => {
                  onAcknowledge(alert.id);
                  onClose();
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            {(alert.status === 'active' || alert.status === 'acknowledged') && (
              <Button 
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}