import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    setUploadProgress(null);

    try {
      // client-side file size validation
      if (attachment && attachment.size > MAX_FILE_BYTES) {
        setErrorMessage('Attachment is too large. Maximum allowed size is 5 MB.');
        setLoading(false);
        return;
      }

      // Use XMLHttpRequest to provide upload progress
      await new Promise<void>((resolve, reject) => {
        const fd = new FormData();
        fd.append('name', formData.name || '');
        fd.append('email', formData.email || '');
        fd.append('phone', formData.phone || '');
        fd.append('company', formData.company || '');
        fd.append('service', formData.service || '');
        fd.append('message', formData.message || '');
        if (attachment) fd.append('attachment', attachment, attachment.name);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/contact');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              if (json && json.success === false) {
                reject(new Error(json.message || `Server error ${xhr.status}`));
                return;
              }
            } catch {
              // non-json success body is ok
            }
            resolve();
          } else {
            // Try to parse JSON error message
            try {
              const json = JSON.parse(xhr.responseText);
              reject(new Error(json.message || `Failed to send message (${xhr.status})`));
            } catch {
              reject(new Error(`Failed to send message (${xhr.status})`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));

        xhr.send(fd);
      });

      setIsSubmitted(true);
      setLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg || 'Unexpected error');
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['Klang, Selangor', 'Malaysia'],
      link: null
    },
    {
      icon: Phone,
      title: 'Phone Number',
      details: ['+60 3-XXXX XXXX', '+60 1X-XXX XXXX (Mobile)'],
      link: 'tel:+603XXXXXXXX'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['info@bluebirdexpress.com', 'support@bluebirdexpress.com'],
      link: 'mailto:info@bluebirdexpress.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 8:00 AM - 1:00 PM', 'Sun: Closed'],
      link: null
    }
  ];

  const services = [
    'Import/Export Customs Clearance',
    'Air Freight Services',
    'Sea Freight Services',
    'Ground Shipping',
    'Warehousing & Storage',
    'Documentation Services',
    'Other Services'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting Bluebird Express Line. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                service: '',
                message: ''
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our freight forwarding experts for customized logistics solutions 
              and competitive quotes.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help with all your freight forwarding needs. Contact us through any 
              of the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">
                      {info.link && detailIndex === 0 ? (
                        <a
                          href={info.link}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+60 X-XXXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your freight forwarding requirements..."
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment (optional)
                  </label>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                      if (file && file.size > MAX_FILE_BYTES) {
                        setErrorMessage('Attachment is too large. Maximum allowed size is 5 MB.');
                        setAttachment(null);
                        return;
                      }
                      setErrorMessage(null);
                      setAttachment(file);
                    }}
                    className="w-full"
                  />
                  {attachment && (
                    <p className="text-sm text-gray-600 mt-2">Selected file: {attachment.name} ({Math.round(attachment.size / 1024)} KB)</p>
                  )}
                  {uploadProgress !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>

                <div>
                  {errorMessage && (
                    <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-blue-700'} bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center`}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* 24/7 Support */}
              <div className="bg-blue-900 text-white p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">24/7 Customer Support</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Our dedicated support team is available around the clock to assist you with 
                  any urgent shipment inquiries or logistics emergencies.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-300" />
                    <span className="text-blue-100">Emergency Hotline: +60 1X-XXX XXXX</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-300" />
                    <span className="text-blue-100">urgent@bluebirdexpress.com</span>
                  </div>
                </div>
              </div>

              {/* Quick Quote */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Quick Quote?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  For immediate pricing information, call us directly or send us your shipment 
                  details via email. We'll respond within 2 hours during business hours.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+603XXXXXXXX"
                    className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-semibold">Call for Instant Quote</span>
                  </a>
                  <a
                    href="mailto:quotes@bluebirdexpress.com"
                    className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="font-semibold">Email Quote Request</span>
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>8:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600">
                      * Emergency support available 24/7 for urgent shipments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;