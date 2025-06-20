import React from 'react';
import { MapPin, Phone, Mail, Clock, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/bluebirdlogo.png" alt="Bluebird Logo" className="h-12 w-12 object-contain" />
              <div>
                <h3 className="text-xl font-bold">BLUEBIRD</h3>
                <p className="text-sm text-blue-400">EXPRESS LINE</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              A reliable freight forwarding company in Malaysia, specializing in customs clearing, 
              shipping, and comprehensive logistics solutions.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Klang, Selangor<br />
                  Malaysia
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+60 3-XXXX XXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@bluebirdexpress.com</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Import/Export Customs Clearance</li>
              <li>Air Freight Services</li>
              <li>Sea Freight Services</li>
              <li>Ground Shipping</li>
              <li>Warehousing & Storage</li>
              <li>Documentation Services</li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Business Hours</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>24/7 Support Available</span>
              </div>
              <div className="mt-3">
                <p className="font-medium text-white">Office Hours:</p>
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 8:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Bluebird Express Line. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Reliable freight forwarding since establishment
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;