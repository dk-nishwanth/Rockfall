import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// Removed Calendar and Popover imports - using simpler date inputs
import { Badge } from '../ui/badge';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
// Using built-in Date methods instead of date-fns
// Removed Calendar and Popover imports - using simpler date inputs
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateTimeSeriesData, mockAlerts } from '../data/mockData';
import { ErrorBoundary } from '../ui/error-boundary';

export const ReportsPage = React.memo(() => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [reportType, setReportType] = useState('overview');

  // Memoize expensive calculations
  const timeSeriesData = useMemo(() => generateTimeSeriesData(30 * 24), []); // 30 days of hourly data

  // Aggregate data for charts
  const dailyData = useMemo(() => {
    return timeSeriesData.reduce((acc: any[], curr: any, index: number) => {
      if (index % 24 === 0) { // Take every 24th hour for daily data
        const date = new Date(curr.timestamp);
        acc.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
          avgRisk: Math.round(curr.riskProbability),
          maxDisplacement: curr.displacement,
          totalRainfall: curr.rainfall * 24, // Simulate daily total
          alerts: Math.floor(Math.random() * 5)
        });
      }
      return acc;
    }, []);
  }, [timeSeriesData]);

  // Memoize alert statistics
  const alertStats = useMemo(() => ({
    total: mockAlerts.length,
    active: mockAlerts.filter(a => a.status === 'active').length,
    resolved: mockAlerts.filter(a => a.status === 'resolved').length,
    bySeverity: {
      critical: mockAlerts.filter(a => a.severity === 'critical').length,
      high: mockAlerts.filter(a => a.severity === 'high').length,
      medium: mockAlerts.filter(a => a.severity === 'medium').length,
      low: mockAlerts.filter(a => a.severity === 'low').length,
    }
  }), []);

  const pieData = useMemo(() => [
    { name: 'Critical', value: alertStats.bySeverity.critical, color: '#ef4444' },
    { name: 'High', value: alertStats.bySeverity.high, color: '#f97316' },
    { name: 'Medium', value: alertStats.bySeverity.medium, color: '#eab308' },
    { name: 'Low', value: alertStats.bySeverity.low, color: '#22c55e' },
  ], [alertStats]);

  const generateReport = useCallback((format: 'pdf' | 'csv') => {
    console.log(`Generating ${format.toUpperCase()} report for ${reportType}`);
    // In a real application, this would trigger a download
  }, [reportType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analysis of monitoring data and system performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generateReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => generateReport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Configure the time range and type of report to generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">System Overview</SelectItem>
                <SelectItem value="alerts">Alert Summary</SelectItem>
                <SelectItem value="sensors">Sensor Performance</SelectItem>
                <SelectItem value="risk">Risk Assessment</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">From</label>
                <Input
                  type="date"
                  value={dateRange.from.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: new Date(e.target.value) }))}
                  className="w-36"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">To</label>
                <Input
                  type="date"
                  value={dateRange.to.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: new Date(e.target.value) }))}
                  className="w-36"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{alertStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">99.8%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Avg Risk Level</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">Medium</div>
            <p className="text-xs text-muted-foreground">
              42% average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">95%</div>
            <p className="text-xs text-muted-foreground">
              Alerts resolved in 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Risk Trend Chart */}
        <ErrorBoundary>
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Trends</CardTitle>
              <CardDescription>
                Daily risk assessment over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Risk Level']} />
                    <Area
                      type="monotone"
                      dataKey="avgRisk"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Alert Distribution */}
        <ErrorBoundary>
          <Card>
          <CardHeader>
            <CardTitle>Alert Distribution by Severity</CardTitle>
            <CardDescription>
              Breakdown of alerts by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Sensor Performance */}
        <ErrorBoundary>
          <Card>
          <CardHeader>
            <CardTitle>Displacement Measurements</CardTitle>
            <CardDescription>
              Maximum daily displacement readings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} mm`, 'Max Displacement']} />
                  <Line
                    type="monotone"
                    dataKey="maxDisplacement"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </ErrorBoundary>

        {/* Alert Frequency */}
        <ErrorBoundary>
          <Card>
            <CardHeader>
              <CardTitle>Daily Alert Frequency</CardTitle>
              <CardDescription>
                Number of alerts generated per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'Alerts']} />
                    <Bar dataKey="alerts" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
          <CardDescription>
            Key insights and recommendations based on the analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Key Findings</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Risk levels have remained stable over the reporting period</li>
                  <li>• 95% of critical alerts were resolved within 24 hours</li>
                  <li>• All sensors maintained 99%+ operational uptime</li>
                  <li>• AI model accuracy improved by 2.1% this month</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Recommendations</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Consider additional sensors in Zone Alpha</li>
                  <li>• Implement enhanced rainfall monitoring</li>
                  <li>• Schedule preventive maintenance for Q2</li>
                  <li>• Update alert thresholds based on recent data</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Badge variant="default">Report Generated: {new Date().toLocaleDateString()}</Badge>
              <Badge variant="secondary">Data Points: 2,847</Badge>
              <Badge variant="outline">Confidence: 94.2%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ReportsPage.displayName = 'ReportsPage';