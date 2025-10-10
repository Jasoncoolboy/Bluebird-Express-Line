import React from 'react';
import { Truck, Plane, Ship, FileText, Warehouse, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const mainServices = [
    {
      icon: FileText,
      title: 'Import/Export Customs Clearance',
      description: 'Complete customs clearance services for both import and export operations with full regulatory compliance.',
      features: [
        'Import Customs Clearance',
        'Export Customs Clearance',
        'Consignments Customs Clearance',
        'International Forwarding Clearance',
        'Regulatory Compliance',
        'Documentation Processing'
      ],
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Truck,
      title: 'Ground Shipping',
      description: 'Efficient and cost-effective ground shipping solutions for domestic and regional deliveries.',
      features: [
        'Domestic Transportation',
        'Regional Distribution',
        'Last-Mile Delivery',
        'Express Ground Services',
        'Scheduled Deliveries',
        'Real-time Tracking'
      ],
      image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Plane,
      title: 'Air Freight Services',
      description: 'Fast and reliable air shipping for time-sensitive cargo with global reach and express delivery options.',
      features: [
        'Express Air Freight',
        'Standard Air Cargo',
        'Door-to-Door Service',
        'Dangerous Goods Handling',
        'Temperature Controlled',
        'Air Freight Customs Clearance'
      ],
      image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Ship,
      title: 'Sea Freight Services',
      description: 'Cost-effective sea freight solutions for large volume shipments with comprehensive port-to-port services.',
      features: [
        'Full Container Load (FCL)',
        'Less Container Load (LCL)',
        'Port-to-Port Service',
        'Door-to-Door Service',
        'Project Cargo Handling',
        'Sea Freight Customs Clearance'
      ],
      image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Warehouse,
      title: 'Warehousing & Storage',
      description: 'Secure warehousing solutions with inventory management and distribution services.',
      features: [
        'Secure Storage Facilities',
        'Inventory Management',
        'Pick & Pack Services',
        'Cross-Docking',
        'Distribution Services',
        'Climate Controlled Storage'
      ],
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Globe,
      title: 'International Forwarding',
      description: 'Comprehensive international freight forwarding with global network coverage and multimodal solutions.',
      features: [
        'Multimodal Transportation',
        'Global Network Coverage',
        'Trade Documentation',
        'Insurance Services',
        'Supply Chain Consulting',
        'EDI & Online Billing'
      ],
      image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const additionalServices = [
    'Liaison with regulatory agents and councils',
    'Advice on all modes of transportation',
    'Storage arrangement during clearance',
    'Coordination between warehouse and shipping lines',
    'Quick customs formalities completion',
    'Certificate procurement services',
    'Online paper billing systems',
    'Custom EDI solutions'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Logistics Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              From customs clearance to global shipping, we provide end-to-end freight forwarding 
              solutions tailored to your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive freight forwarding solutions backed by experienced professionals 
              and cutting-edge technology.
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <service.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Additional Support Services
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive support services to ensure smooth operations and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-blue-800/50 p-6 rounded-lg hover:bg-blue-800/70 transition-colors duration-300"
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-100 font-medium leading-relaxed">{service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Advanced Technology & Expertise
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We are equipped with well-qualified, experienced, and trained staff supported by 
                full computerized documentation and armed with the newest communication tools.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700 font-medium">Fully computerized documentation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700 font-medium">Latest communication technology</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700 font-medium">Online paper billing systems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700 font-medium">Custom EDI solutions</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Services?</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Extensive experience in goods forwarding</span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Adaptation to clients' individual needs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Hassle-free and speedy services</span>
                </li>
                <li className="flex items-start space-x-3">
                  <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>End-to-end service from collection to delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Need a Custom Logistics Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Contact our experienced team to discuss your specific freight forwarding requirements 
            and get a tailored solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Custom Quote
            </Link>
            <Link
              to="/tracking"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Track Shipment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;