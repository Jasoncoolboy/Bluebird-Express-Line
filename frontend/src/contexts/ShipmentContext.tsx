import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

export interface ShipmentEvent {
  id: string;
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Exception';
  service: 'Air Freight' | 'Sea Freight' | 'Ground Shipping';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  weight: string;
  dimensions: string;
  value: string;
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
}

interface ShipmentContextType {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Shipment>;
  updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<Shipment>;
  deleteShipment: (id: string) => Promise<void>;
  getShipmentByTrackingNumber: (trackingNumber: string) => Shipment | undefined;
  getShipmentById: (id: string) => Shipment | undefined;
  addEventToShipment: (shipmentId: string, event: Omit<ShipmentEvent, 'id'>) => Promise<void>;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};

export const ShipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getShipments();
      if (response.success && response.data) {
        setShipments(response.data);
      } else {
        setError('Failed to fetch shipments');
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setError('An error occurred while fetching shipments');
    } finally {
      setLoading(false);
    }
  };

  const addShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await ApiService.createShipment(shipmentData);
      if (response.success && response.data) {
        await fetchShipments(); // Refresh the list after creating
        return response.data;
      }
      throw new Error(response.error || 'Failed to create shipment');
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  };

  const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
    try {
      const response = await ApiService.updateShipment(id, shipmentData);
      if (response.success && response.data) {
        await fetchShipments(); // Refresh the list after updating
        return response.data;
      }
      throw new Error(response.error || 'Failed to update shipment');
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      const response = await ApiService.deleteShipment(id);
      if (response.success) {
        await fetchShipments(); // Refresh the list after deleting
      } else {
        throw new Error(response.error || 'Failed to delete shipment');
      }
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    }
  };

  const getShipmentByTrackingNumber = (trackingNumber: string) => {
    return shipments.find(s => s.trackingNumber === trackingNumber);
  };

  const getShipmentById = (id: string) => {
    return shipments.find(s => s.id === id);
  };

  const addEventToShipment = async (shipmentId: string, eventData: Omit<ShipmentEvent, 'id'>) => {
    try {
      const response = await ApiService.addShipmentEvent(shipmentId, eventData);
      if (response.success) {
        await fetchShipments(); // Refresh the list after adding event
      } else {
        throw new Error(response.error || 'Failed to add shipment event');
      }
    } catch (error) {
      console.error('Error adding shipment event:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        loading,
        error,
        fetchShipments,
        addShipment,
        updateShipment,
        deleteShipment,
        getShipmentByTrackingNumber,
        getShipmentById,
        addEventToShipment
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export default ShipmentProvider;