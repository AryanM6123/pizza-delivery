import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                (+91) 9112916962
              </p>
              <p className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                pizzaking@pizzahub.com
              </p>
              <p className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Kalbhairav Mandir , Narhe Road, Pune 411016
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Hours</h3>
            <div className="space-y-2">
              <p>Monday - Friday: 06pm - 10pm</p>
              <p>Saturday- Sunday : 05pm - 11pm</p>
              
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-500">Facebook</a>
              <a href="#" className="hover:text-red-500">Instagram</a>
              <a href="#" className="hover:text-red-500">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2025 Pizza Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;