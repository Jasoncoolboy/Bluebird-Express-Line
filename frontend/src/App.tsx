import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer, ProtectedRoute } from './components';
import Home from './pages/Home';
import Services from './pages/Services';
import Tracking from './pages/Tracking';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import CreateShipment from './pages/admin/CreateShipment';
import EditShipment from './pages/admin/EditShipment';
import Analytics from './pages/admin/Analytics';
import { AuthProvider } from './contexts/AuthContext';
import { ShipmentProvider } from './contexts/ShipmentContext';

function AppContent() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-white">
      {!isAdminSection && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipments" element={
            <ProtectedRoute>
              <ShipmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipments/create" element={
            <ProtectedRoute>
              <CreateShipment />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipments/edit/:id" element={
            <ProtectedRoute>
              <EditShipment />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdminSection && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <Router future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }}>
          <AppContent />
        </Router>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;
