import React from 'react';
import { ArrowRight, Clock, Globe, Headphones, Truck, Plane, Ship, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Ensuring on-time, seamless, and efficient freight delivery—every shipment, every time.',
    },
    {
      icon: Globe,
      title: 'Global Delivery',
      description: 'Seamless and reliable global freight delivery—connecting businesses worldwide.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Reliable 24/7 support—keeping your freight moving anytime, anywhere.',
    },
  ];

  const services = [
    {
      icon: Truck,
      title: 'Ground Shipping',
      description: 'Efficient and cost-effective ground shipping—delivering seamlessly, every mile.',
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Plane,
      title: 'Air Shipping',
      description: 'Fast and reliable air shipping—delivering worldwide, on time.',
      image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      icon: Ship,
      title: 'Sea Delivery',
      description: 'Reliable and cost-effective sea delivery—connecting global trade seamlessly.',
      image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const capabilities = [
    'Import/Export Customs Clearance',
    'International Forwarding',
    'Air Freight Customs Clearance',
    'Sea Freight Customs Clearance',
    'Warehousing & Storage',
    'Documentation Services',
    'Regulatory Compliance',
    'EDI & Online Billing',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Reliable Freight Forwarding
              <span className="block text-blue-300">Solutions in Malaysia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Specializing in customs clearing, shipping, and comprehensive logistics solutions 
              from our strategic location in Klang, Selangor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Our Services
              </Link>
              <Link
                to="/tracking"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Track Shipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bluebird Express Line?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With extensive experience and cutting-edge technology, we deliver exceptional 
              freight forwarding services tailored to your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Shipping Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions covering all modes of transportation 
              to meet your specific requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Import/Export Services
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                We specialize in Import/Export Customs Clearance services and assist clients 
                from small, mid-sized and large businesses manage their international shipments.
              </p>
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center"
              >
                Get Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-blue-800/50 p-4 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-blue-300 flex-shrink-0" />
                  <span className="text-sm font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Streamline Your Logistics?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Contact us today for a customized freight forwarding solution that meets your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Contact Us Today
            </Link>
            <Link
              to="/tracking"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Track Your Shipment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;