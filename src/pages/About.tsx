import React from 'react';
import { MapPin, Users, Award, Clock, CheckCircle, Target, Eye, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '15+', label: 'Years Experience', icon: Clock },
    { number: '1000+', label: 'Happy Clients', icon: Users },
    { number: '50000+', label: 'Shipments Delivered', icon: Award },
    { number: '24/7', label: 'Customer Support', icon: Clock },
  ];

  const values = [
    {
      icon: Target,
      title: 'Reliability',
      description: 'We ensure every shipment reaches its destination on time and in perfect condition.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Complete visibility into your shipment status with real-time tracking and updates.'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Your success is our priority. We adapt our services to meet your unique needs.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Continuous improvement and innovation in freight forwarding services.'
    }
  ];

  const capabilities = [
    'Extensive experience in goods forwarding',
    'Well-qualified and trained staff',
    'Full computerized documentation',
    'Latest communication technology',
    'Custom house broker services',
    'Online paper billing systems',
    'Custom EDI solutions',
    'Regulatory compliance expertise'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Bluebird Express Line
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted freight forwarding partner in Malaysia, delivering excellence 
              in logistics solutions since our establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Leading Freight Forwarding in Malaysia
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                BLUEBIRD EXPRESS LINE is a reliable freight forwarding company located in the 
                capital city of Klang, Selangor. We specialize in freight forwarding, customs 
                clearing, and shipping services with extensive experience in the goods forwarding area.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our organization has the capability to adapt to clients' individual needs, providing 
                hassle-free and speedy services for all consignments, from document collection to 
                delivery to buyers.
              </p>
              <div className="flex items-center space-x-3 text-blue-600">
                <MapPin className="h-6 w-6" />
                <span className="text-lg font-semibold">Strategically located in Klang, Selangor</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Freight forwarding operations"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Track Record
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-blue-800/50 p-8 rounded-xl hover:bg-blue-800/70 transition-colors duration-300"
              >
                <stat.icon className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our operations and define our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Capabilities & Expertise
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We are equipped with well-qualified, experienced, and trained staff supported by 
                full computerized documentation and armed with the newest communication tools to 
                assure you the best services in this industry.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                As a custom house broker, we provide access to features such as online paper billing 
                and custom EDI, ensuring efficient and streamlined operations for all our clients.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Service Range
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We provide a comprehensive range of customs clearing services for both export and import operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-800/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Customs Clearance</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Import Customs Clearance</li>
                <li>• Export Customs Clearance</li>
                <li>• Consignments Customs Clearance</li>
                <li>• International Forwarding Clearance</li>
              </ul>
            </div>
            <div className="bg-blue-800/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Transportation</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Air Freight Services</li>
                <li>• Sea Freight Services</li>
                <li>• Ground Shipping</li>
                <li>• Multimodal Transportation</li>
              </ul>
            </div>
            <div className="bg-blue-800/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Support Services</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Warehousing & Storage</li>
                <li>• Documentation Services</li>
                <li>• Regulatory Liaison</li>
                <li>• Certificate Procurement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Strategically Located
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our location in Klang, Selangor provides strategic access to Malaysia's major ports 
              and transportation networks.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Klang, Selangor?</h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Close proximity to Port Klang, Malaysia's largest port</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Easy access to Kuala Lumpur International Airport (KLIA)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Strategic location for regional distribution</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Well-connected transportation infrastructure</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Our Location</h4>
                  <p className="text-gray-600">
                    Klang, Selangor<br />
                    Malaysia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;