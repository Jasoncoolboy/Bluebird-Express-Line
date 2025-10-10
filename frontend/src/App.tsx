import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
import { AuthProvider } from './contexts/AuthContext';
import { ShipmentProvider } from './contexts/ShipmentContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ShipmentProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ShipmentProvider>
    </AuthProvider>
  );
}

export default App;