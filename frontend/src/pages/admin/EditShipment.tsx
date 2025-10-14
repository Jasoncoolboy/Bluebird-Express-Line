import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Package, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { AdminHeader } from '../../components';
import { useShipments, Shipment, ShipmentEvent } from '../../contexts/ShipmentContext';

const EditShipment = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getShipmentById, updateShipment, addEventToShipment } = useShipments();
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'events'>('details');
  
  // New event form
  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    location: '',
    status: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      const foundShipment = getShipmentById(id);
      if (foundShipment) {
        setShipment(foundShipment);
      } else {
        navigate('/admin/shipments');
      }
    }
  }, [id, getShipmentById, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!shipment) return;
    
    const { name, value } = e.target;
    setShipment(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    
    setIsSubmitting(true);

    try {
      updateShipment(shipment.id, shipment);
      navigate('/admin/shipments');
    } catch (error) {
      console.error('Error updating shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment || !newEvent.location || !newEvent.status || !newEvent.description) return;

    addEventToShipment(shipment.id, newEvent);
    
    // Update local state
    const updatedShipment = getShipmentById(shipment.id);
    if (updatedShipment) {
      setShipment(updatedShipment);
    }

    // Reset form
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      location: '',
      status: '',
      description: ''
    });
  };

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

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/shipments')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Shipment</h1>
            <p className="text-gray-600">Tracking Number: {shipment.trackingNumber}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Shipment Details
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="h-5 w-5 inline mr-2" />
                Tracking Events ({shipment.events.length})
              </button>
            </nav>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
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
                    value={shipment.trackingNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={shipment.service}
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
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={shipment.status}
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
                    value={shipment.estimatedDelivery}
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
                      value={shipment.origin}
                      onChange={handleInputChange}
                      required
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
                      value={shipment.destination}
                      onChange={handleInputChange}
                      required
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
                    value={shipment.currentLocation}
                    onChange={handleInputChange}
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
                      value={shipment.customerName}
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
                      value={shipment.customerEmail}
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
                    value={shipment.customerPhone}
                    onChange={handleInputChange}
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
                      value={shipment.weight}
                      onChange={handleInputChange}
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
                      value={shipment.dimensions}
                      onChange={handleInputChange}
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
                      value={shipment.value}
                      onChange={handleInputChange}
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
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="p-6">
              {/* Add New Event */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tracking Event</h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        id="eventTime"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        id="eventLocation"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        required
                        placeholder="e.g., KLIA Cargo Terminal"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="eventStatus" className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <input
                        type="text"
                        id="eventStatus"
                        value={newEvent.status}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value }))}
                        required
                        placeholder="e.g., In Transit"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      id="eventDescription"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      required
                      placeholder="e.g., Package departed for destination"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Event</span>
                  </button>
                </form>
              </div>

              {/* Events Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
                <div className="space-y-6">
                  {shipment.events
                    .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())
                    .map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          event.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{event.status}</h5>
                          <span className="text-sm text-gray-500">{event.date} at {event.time}</span>
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditShipment;