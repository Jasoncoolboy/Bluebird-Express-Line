import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import { useSocket } from './SocketContext';

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
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateShipment: (id: string, shipment: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  getShipmentByTrackingNumber: (trackingNumber: string) => Shipment | undefined;
  getShipmentById: (id: string) => Shipment | undefined;
  addEventToShipment: (shipmentId: string, event: Omit<ShipmentEvent, 'id'>) => void;
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

  useEffect(() => {
    // Load initial mock data
    const mockShipments: Shipment[] = [
      {
        id: '1',
        trackingNumber: 'BB123456789',
        status: 'In Transit',
        service: 'Air Freight',
        origin: 'Klang, Selangor, Malaysia',
        destination: 'Singapore',
        estimatedDelivery: '2025-01-15',
        currentLocation: 'KLIA Cargo Terminal',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '+65 9123 4567',
        weight: '25 kg',
        dimensions: '50x40x30 cm',
        value: 'RM 2,500',
        events: [
          {
            id: '1',
            date: '2025-01-10',
            time: '14:30',
            location: 'Klang, Selangor',
            status: 'Package Picked Up',
            description: 'Package collected from sender'
          },
          {
            id: '2',
            date: '2025-01-10',
            time: '16:45',
            location: 'Bluebird Express Facility',
            status: 'Processing',
            description: 'Package processed and documentation completed'
          },
          {
            id: '3',
            date: '2025-01-11',
            time: '09:15',
            location: 'KLIA Cargo Terminal',
            status: 'In Transit',
            description: 'Package departed for destination'
          }
        ],
        createdAt: '2025-01-10T14:30:00Z',
        updatedAt: '2025-01-11T09:15:00Z'
      },
      {
        id: '2',
        trackingNumber: 'BB987654321',
        status: 'Delivered',
        service: 'Ground Shipping',
        origin: 'Kuala Lumpur, Malaysia',
        destination: 'Johor Bahru, Malaysia',
        estimatedDelivery: '2025-01-08',
        currentLocation: 'Delivered',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        customerPhone: '+60 12-345 6789',
        weight: '15 kg',
        dimensions: '40x30x20 cm',
        value: 'RM 1,200',
        events: [
          {
            id: '4',
            date: '2025-01-05',
            time: '10:00',
            location: 'Kuala Lumpur',
            status: 'Package Picked Up',
            description: 'Package collected from sender'
          },
          {
            id: '5',
            date: '2025-01-06',
            time: '08:30',
            location: 'Distribution Center',
            status: 'In Transit',
            description: 'Package in transit to destination'
          },
          {
            id: '6',
            date: '2025-01-08',
            time: '14:20',
            location: 'Johor Bahru',
            status: 'Delivered',
            description: 'Package delivered successfully'
          }
        ],
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: '2025-01-08T14:20:00Z'
      }
    ];

    // Load from localStorage or use mock data
    const storedShipments = localStorage.getItem('bluebird_shipments');
    if (storedShipments) {
      setShipments(JSON.parse(storedShipments));
    } else {
      setShipments(mockShipments);
      localStorage.setItem('bluebird_shipments', JSON.stringify(mockShipments));
    }
  }, []);

  const saveToStorage = (updatedShipments: Shipment[]) => {
    localStorage.setItem('bluebird_shipments', JSON.stringify(updatedShipments));
  };

  const addShipment = (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedShipments = [...shipments, newShipment];
    setShipments(updatedShipments);
    saveToStorage(updatedShipments);
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    const updatedShipments = shipments.map(shipment =>
      shipment.id === id
        ? { ...shipment, ...updates, updatedAt: new Date().toISOString() }
        : shipment
    );
    setShipments(updatedShipments);
    saveToStorage(updatedShipments);
  };

  const deleteShipment = (id: string) => {
    const updatedShipments = shipments.filter(shipment => shipment.id !== id);
    setShipments(updatedShipments);
    saveToStorage(updatedShipments);
  };

  const getShipmentByTrackingNumber = (trackingNumber: string) => {
    return shipments.find(shipment => shipment.trackingNumber === trackingNumber);
  };

  const getShipmentById = (id: string) => {
    return shipments.find(shipment => shipment.id === id);
  };

  const addEventToShipment = (shipmentId: string, eventData: Omit<ShipmentEvent, 'id'>) => {
    const newEvent: ShipmentEvent = {
      ...eventData,
      id: Date.now().toString()
    };

    const updatedShipments = shipments.map(shipment =>
      shipment.id === shipmentId
        ? {
            ...shipment,
            events: [...shipment.events, newEvent],
            updatedAt: new Date().toISOString()
          }
        : shipment
    );
    
    setShipments(updatedShipments);
    saveToStorage(updatedShipments);
  };

  const value = {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    getShipmentByTrackingNumber,
    getShipmentById,
    addEventToShipment
  };

  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
};