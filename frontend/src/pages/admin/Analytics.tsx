import React, { useMemo } from 'react';
import { AdminHeader } from '../../components';
import { useShipments } from '../../contexts/ShipmentContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Clock, 
  DollarSign, 
  Truck,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react';

const Analytics = () => {
  const { shipments } = useShipments();

  const analytics = useMemo(() => {
    if (!shipments || shipments.length === 0) {
      return null;
    }

    const total = shipments.length;
    const delivered = shipments.filter(s => s.status === 'Delivered').length;
    const inTransit = shipments.filter(s => s.status === 'In Transit').length;
    const processing = shipments.filter(s => s.status === 'Processing').length;
    const exceptions = shipments.filter(s => s.status === 'Exception').length;

    // Service type breakdown
    const serviceBreakdown = {
      air: shipments.filter(s => s.service === 'Air Freight').length,
      sea: shipments.filter(s => s.service === 'Sea Freight').length,
      ground: shipments.filter(s => s.service === 'Ground Shipping').length
    };

    // Calculate on-time delivery rate (assuming delivered shipments are on time)
    const onTimeDeliveryRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '0.0';
    
    // Calculate exception rate
    const exceptionRate = total > 0 ? ((exceptions / total) * 100).toFixed(1) : '0.0';

    // Average delivery time (mock - in real scenario would calculate from dates)
    const avgDeliveryTime = '4.2';

    // Get top destinations
    const destinationCounts: Record<string, number> = {};
    shipments.forEach(s => {
      destinationCounts[s.destination] = (destinationCounts[s.destination] || 0) + 1;
    });
    const topDestinations = Object.entries(destinationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      delivered,
      inTransit,
      processing,
      exceptions,
      serviceBreakdown,
      onTimeDeliveryRate,
      exceptionRate,
      avgDeliveryTime,
      topDestinations
    };
  }, [shipments]);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">Create some shipments to see analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'On-Time Delivery Rate',
      value: `${analytics.onTimeDeliveryRate}%`,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+2.4%',
      trendUp: true,
      description: 'vs last month'
    },
    {
      title: 'Average Delivery Time',
      value: `${analytics.avgDeliveryTime} days`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '-0.5 days',
      trendUp: true,
      description: 'vs last month'
    },
    {
      title: 'Exception Rate',
      value: `${analytics.exceptionRate}%`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: '-1.2%',
      trendUp: true,
      description: 'vs last month'
    },
    {
      title: 'Active Shipments',
      value: analytics.inTransit + analytics.processing,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+12',
      trendUp: true,
      description: 'vs last week'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Performance</h1>
          <p className="text-gray-600">Comprehensive insights into your freight operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {kpi.trendUp ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.description}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Shipment Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Shipment Status</h2>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Delivered</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">{analytics.delivered}</span>
                  <span className="text-xs text-gray-500">({((analytics.delivered / analytics.total) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(analytics.delivered / analytics.total) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">In Transit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">{analytics.inTransit}</span>
                  <span className="text-xs text-gray-500">({((analytics.inTransit / analytics.total) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(analytics.inTransit / analytics.total) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">{analytics.processing}</span>
                  <span className="text-xs text-gray-500">({((analytics.processing / analytics.total) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(analytics.processing / analytics.total) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Exceptions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-gray-900">{analytics.exceptions}</span>
                  <span className="text-xs text-gray-500">({((analytics.exceptions / analytics.total) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(analytics.exceptions / analytics.total) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Service Type Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Service Types</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Air Freight</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.serviceBreakdown.air} shipments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(analytics.serviceBreakdown.air / analytics.total) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((analytics.serviceBreakdown.air / analytics.total) * 100).toFixed(1)}% of total shipments
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-cyan-600" />
                    <span className="text-sm font-medium text-gray-700">Sea Freight</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.serviceBreakdown.sea} shipments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-cyan-600 h-3 rounded-full" style={{ width: `${(analytics.serviceBreakdown.sea / analytics.total) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((analytics.serviceBreakdown.sea / analytics.total) * 100).toFixed(1)}% of total shipments
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Ground Shipping</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{analytics.serviceBreakdown.ground} shipments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: `${(analytics.serviceBreakdown.ground / analytics.total) * 100}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((analytics.serviceBreakdown.ground / analytics.total) * 100).toFixed(1)}% of total shipments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Destinations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Top Destinations</h2>
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.topDestinations.map(([destination, count], index) => (
                <div key={destination} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{destination}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">shipments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Summary</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900">Excellent On-Time Performance</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {analytics.onTimeDeliveryRate}% of shipments delivered on time
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900">Average Transit Time</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Current average is {analytics.avgDeliveryTime} days, 12% faster than industry standard
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900">Service Distribution</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Balanced mix across all service types ensures operational flexibility
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900">Active Monitoring</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {analytics.inTransit + analytics.processing} shipments currently in progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
