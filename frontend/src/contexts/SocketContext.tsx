import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socket = io(SOCKET_URL, {
    autoConnect: false,
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribeToShipmentUpdates = (callback) => {
    socket.on('shipmentUpdate', callback);
    return () => socket.off('shipmentUpdate', callback);
  };

  const subscribeToNewShipments = (callback) => {
    socket.on('newShipment', callback);
    return () => socket.off('newShipment', callback);
  };

  return (
    <SocketContext.Provider value={{ 
      socket,
      subscribeToShipmentUpdates,
      subscribeToNewShipments
    }}>
      {children}
    </SocketContext.Provider>
  );
};