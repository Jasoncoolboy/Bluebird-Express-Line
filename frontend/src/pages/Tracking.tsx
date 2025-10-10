import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, Plane, Ship } from 'lucide-react';
import { useShipments } from '../contexts/ShipmentContext';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getShipmentByTrackingNumber } = useShipments();

  const handleTrack = () => {
    if (!trackingNumber.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = getShipmentByTrackingNumber(trackingNumber);
      setTrackingResult(result || null);
      setIsLoading(false);
    }, 1500);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Air Freight':
        return Plane;
      case 'Sea Freight':
        return Ship;
      case 'Ground Shipping':
        return Truck;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Package Picked Up':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Shipment
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get real-time updates on your package location and delivery status with our 
              advanced tracking system.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Enter Your Tracking Number
              </h2>
              <p className="text-gray-600">
                Enter your tracking number below to get the latest status of your shipment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., BB123456789)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={isLoading || !trackingNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Track
                  </>
                )}
              </button>
            </div>

            {/* Sample Tracking Numbers */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Try these sample tracking numbers:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setTrackingNumber('BB123456789')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                >
                  BB123456789
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setTrackingNumber('BB987654321')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                >
                  BB987654321
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Tracking Details</h3>
                    <p className="text-blue-100">Tracking Number: {trackingResult.trackingNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingResult.status)}`}>
                      {trackingResult.status === 'Delivered' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {trackingResult.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getServiceIcon(trackingResult.service), {
                      className: "h-8 w-8 text-blue-600"
                    })}
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-semibold text-gray-900">{trackingResult.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Current Location</p>
                      <p className="font-semibold text-gray-900">{trackingResult.currentLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-semibold text-gray-900">{trackingResult.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Route</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <p className="text-sm text-gray-600 mt-2">{trackingResult.origin}</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <p className="text-sm text-gray-600 mt-2">{trackingResult.destination}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h4>
                <div className="space-y-6">
                  {trackingResult.events
                    .sort((a: any, b: any) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())
                    .map((event: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">{event.status}</h5>
                          <span className="text-sm text-gray-500">{event.date} at {event.time}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{event.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {trackingNumber && !trackingResult && !isLoading && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tracking Number Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any shipment with tracking number "{trackingNumber}". 
                Please check the number and try again.
              </p>
              <button
                onClick={() => {
                  setTrackingNumber('');
                  setTrackingResult(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help with Tracking?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Our customer support team is available 24/7 to assist you with any tracking inquiries 
              or shipment concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+603XXXXXXXX"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Call Support
              </a>
              <a
                href="mailto:support@bluebirdexpress.com"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;