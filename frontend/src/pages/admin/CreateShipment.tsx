import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Package } from 'lucide-react';
import { AdminHeader } from '../../components';
import { useShipments, Shipment } from '../../contexts/ShipmentContext';

const CreateShipment = () => {
  const navigate = useNavigate();
  const { addShipment } = useShipments();
  
  const [formData, setFormData] = useState({
    trackingNumber: '',
    service: 'Air Freight' as Shipment['service'],
    status: 'Processing' as Shipment['status'],
    origin: '',
    destination: '',
    estimatedDelivery: '',
    currentLocation: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    weight: '',
    dimensions: '',
    value: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTrackingNumber = () => {
    const prefix = 'BB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trackingNumber = formData.trackingNumber || generateTrackingNumber();
      
      const newShipment = {
        ...formData,
        trackingNumber,
        currentLocation: formData.currentLocation || formData.origin,
        events: [
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            location: formData.origin,
            status: 'Package Created',
            description: 'Shipment created and ready for pickup'
          }
        ]
      };

      addShipment(newShipment);
      navigate('/admin/shipments');
    } catch (error) {
      console.error('Error creating shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/shipments')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Shipment</h1>
            <p className="text-gray-600">Add a new shipment to the tracking system</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Shipment Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  placeholder="Leave empty to auto-generate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate a tracking number</p>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Air Freight">Air Freight</option>
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Ground Shipping">Ground Shipping</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Exception">Exception</option>
                </select>
              </div>

              <div>
                <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Date *
                </label>
                <input
                  type="date"
                  id="estimatedDelivery"
                  name="estimatedDelivery"
                  value={formData.estimatedDelivery}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                    Origin *
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Klang, Selangor, Malaysia"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Singapore"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <input
                  type="text"
                  id="currentLocation"
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleInputChange}
                  placeholder="Current location (defaults to origin if empty)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+60 12-345 6789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Package Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 25 kg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 50x40x30 cm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                    Declared Value
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="e.g., RM 2,500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/shipments')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? 'Creating...' : 'Create Shipment'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;