import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Clock, CheckCircle, Plus, Eye, BarChart3, AlertCircle } from 'lucide-react';
import AdminHeader from '../../components/AdminHeader';
import { useShipments } from '../../contexts/ShipmentContext';
import { useSocket } from '../../contexts/SocketContext';
import ShipmentChart from '../../components/ShipmentChart';

const AdminDashboard = () => {
  const { shipments, loading, error } = useShipments();
  const [chartData, setChartData] = useState(null);
  const [changePercentages, setChangePercentages] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    processing: 0
  });

  const stats = [
    {
      title: 'Total Shipments',
      value: shipments.length,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'In Transit',
      value: shipments.filter(s => s.status === 'In Transit').length,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      change: '+5%'
    },
    {
      title: 'Delivered',
      value: shipments.filter(s => s.status === 'Delivered').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Processing',
      value: shipments.filter(s => s.status === 'Processing').length,
      icon: Clock,
      color: 'bg-orange-500',
      change: '+3%'
    }
  ];

  const recentShipments = shipments
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Exception':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your shipment operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/shipments/create"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Shipment</h3>
                <p className="text-gray-600">Add a new shipment to track</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/shipments"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View All Shipments</h3>
                <p className="text-gray-600">Manage existing shipments</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Shipments</h2>
              <Link
                to="/admin/shipments"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{shipment.trackingNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.customerName}</div>
                      <div className="text-sm text-gray-500">{shipment.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shipment.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;