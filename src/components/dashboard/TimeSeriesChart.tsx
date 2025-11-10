import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { generateTimeSeriesData } from '../data/mockData';

export function TimeSeriesChart() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetrics, setSelectedMetrics] = useState(['displacement', 'strain']);
  
  const data = generateTimeSeriesData(timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720);

  const metrics = [
    { key: 'displacement', label: 'Displacement (mm)', color: '#ef4444' },
    { key: 'strain', label: 'Strain (με)', color: '#f59e0b' },
    { key: 'porePressure', label: 'Pore Pressure (kPa)', color: '#3b82f6' },
    { key: 'rainfall', label: 'Rainfall (mm/h)', color: '#06b6d4' },
    { key: 'temperature', label: 'Temperature (°C)', color: '#10b981' },
    { key: 'vibration', label: 'Vibration (g)', color: '#8b5cf6' }
  ];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeRange === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7d') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <Button
              key={metric.key}
              variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleMetric(metric.key)}
              className="text-xs"
            >
              <div 
                className="w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: metric.color }}
              />
              {metric.label.split(' ')[0]}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxisLabel}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: any, name: string) => {
                const metric = metrics.find(m => m.key === name);
                return [
                  `${Number(value).toFixed(2)}`, 
                  metric?.label || name
                ];
              }}
            />
            <Legend />
            
            {selectedMetrics.map((metricKey) => {
              const metric = metrics.find(m => m.key === metricKey);
              return (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric?.color}
                  strokeWidth={2}
                  dot={false}
                  name={metric?.label}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}