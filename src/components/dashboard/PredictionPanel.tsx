import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface Prediction {
  id: string;
  zone: string;
  probability: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  recommendation: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    zone: 'Zone Alpha',
    probability: 85,
    timeframe: '24 hours',
    confidence: 92,
    factors: ['Heavy rainfall', 'Increased displacement', 'Temperature variation'],
    recommendation: 'Immediate evacuation recommended',
    trend: 'increasing'
  },
  {
    id: '2',
    zone: 'Zone Beta',
    probability: 45,
    timeframe: '48 hours',
    confidence: 78,
    factors: ['Minor strain increase', 'Normal weather conditions'],
    recommendation: 'Enhanced monitoring',
    trend: 'stable'
  },
  {
    id: '3',
    zone: 'Zone Gamma',
    probability: 15,
    timeframe: '7 days',
    confidence: 88,
    factors: ['Stable conditions', 'Low sensor readings'],
    recommendation: 'Continue normal operations',
    trend: 'decreasing'
  }
];

const getProbabilityColor = (probability: number) => {
  if (probability >= 70) return 'text-red-500';
  if (probability >= 40) return 'text-orange-500';
  return 'text-green-500';
};

const getProbabilityVariant = (probability: number) => {
  if (probability >= 70) return 'destructive';
  if (probability >= 40) return 'secondary';
  return 'default';
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing': return TrendingUp;
    case 'decreasing': return CheckCircle;
    case 'stable': return Activity;
    default: return Activity;
  }
};

export function PredictionPanel() {
  const highRiskPredictions = mockPredictions.filter(p => p.probability >= 70);

  return (
    <div className="space-y-4">
      {/* AI Model Status */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">AI Model Status</span>
        </div>
        <Badge variant="default">Active</Badge>
      </div>

      {/* High Risk Alert */}
      {highRiskPredictions.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High rockfall probability detected in {highRiskPredictions.length} zone(s)
          </AlertDescription>
        </Alert>
      )}

      {/* Predictions List */}
      <div className="space-y-3">
        {mockPredictions.map((prediction) => {
          const TrendIcon = getTrendIcon(prediction.trend);
          
          return (
            <Card key={prediction.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{prediction.zone}</h4>
                  <Badge variant={getProbabilityVariant(prediction.probability) as any}>
                    {prediction.probability}% risk
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Probability</span>
                    <span className={`font-medium ${getProbabilityColor(prediction.probability)}`}>
                      {prediction.probability}%
                    </span>
                  </div>
                  <Progress value={prediction.probability} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{prediction.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon className="h-3 w-3" />
                    <span>Confidence: {prediction.confidence}%</span>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Key Factors:</p>
                  <ul className="text-muted-foreground text-xs space-y-1">
                    {prediction.factors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Recommendation:</p>
                  <p className="text-muted-foreground text-xs">{prediction.recommendation}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Model Performance */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Model Performance</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Accuracy (30 days)</span>
            <span className="font-medium">94.2%</span>
          </div>
          <Progress value={94.2} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span>Precision</span>
            <span className="font-medium">91.8%</span>
          </div>
          <Progress value={91.8} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span>Recall</span>
            <span className="font-medium">96.5%</span>
          </div>
          <Progress value={96.5} className="h-2" />
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          Last model update: 2 hours ago
        </p>
      </Card>
    </div>
  );
}