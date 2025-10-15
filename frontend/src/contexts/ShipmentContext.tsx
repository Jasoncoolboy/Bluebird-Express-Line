import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { useAuth } from './AuthContext';

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
  refreshShipments: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchShipments = async () => {
    // Only fetch shipments if user is authenticated
    if (!isAuthenticated) {
      console.log('Skipping shipment fetch - user not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getShipments();
      console.debug('getShipments response:', response);
      // Normalize response payload to an array of frontend Shipment objects
      let payloadArray: any[] = [];
      if (response.success) {
        if (Array.isArray(response.data)) {
          payloadArray = response.data as any[];
        } else if (response.data && Array.isArray((response.data as any).data)) {
          // handle nested wrapping (defensive)
          payloadArray = (response.data as any).data;
        }
      }

      if (Array.isArray(payloadArray)) {
        const normalized: Shipment[] = payloadArray.map((r: any) => ({
          id: r.id != null ? String(r.id) : '',
          trackingNumber: r.tracking_number ?? r.trackingNumber ?? '',
          status: r.status ?? 'Processing',
          service: r.service ?? '',
          origin: r.origin ?? '',
          destination: r.destination ?? '',
          estimatedDelivery: r.estimated_delivery ? String(r.estimated_delivery) : (r.estimatedDelivery ?? ''),
          currentLocation: r.current_location ?? r.currentLocation ?? '',
          customerName: r.customer_name ?? r.customerName ?? '',
          customerEmail: r.customer_email ?? r.customerEmail ?? '',
          customerPhone: r.customer_phone ?? r.customerPhone ?? '',
          weight: r.weight ?? '',
          dimensions: r.dimensions ?? '',
          value: r.value != null ? String(r.value) : (r.value ?? ''),
          events: Array.isArray(r.events) ? r.events.map((e: any) => ({
            id: e.id != null ? String(e.id) : '',
            date: e.date ?? e.date,
            time: e.time ?? e.time,
            location: e.location ?? '',
            status: e.status ?? '',
            description: e.description ?? ''
          })) : [],
          createdAt: r.created_at ?? r.createdAt ?? '',
          updatedAt: r.updated_at ?? r.updatedAt ?? ''
        }));

        setShipments(normalized);
      } else {
        setShipments([]);
        setError('Failed to fetch shipments');
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      setShipments([]);
      setError('An error occurred while fetching shipments');
    } finally {
      setLoading(false);
    }
  };

  const addShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shipment> => {
    try {
      const response = await ApiService.createShipment(shipmentData);
      if (response.success && response.data) {
        await fetchShipments(); // Refresh the list after creating
        return response.data as Shipment;
      }
      throw new Error(response.error || 'Failed to create shipment');
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  };

  const updateShipment = async (id: string, shipmentData: Partial<Shipment>): Promise<Shipment> => {
    try {
      const response = await ApiService.updateShipment(id, shipmentData);
      if (response.success && response.data) {
        await fetchShipments(); // Refresh the list after updating
        return response.data as Shipment;
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

  // Manual refresh function for admin pages
  const refreshShipments = async () => {
    await fetchShipments();
  };

  // Only fetch shipments when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchShipments();
    } else {
      // Clear shipments when user logs out
      setShipments([]);
      setError(null);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        loading,
        error,
        fetchShipments,
        refreshShipments,
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