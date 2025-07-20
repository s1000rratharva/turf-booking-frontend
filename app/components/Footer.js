const Footer = () => {
  return (
   <footer className="bg-gray-800 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* TurfBook Info */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="text-xl font-bold">TurfBook</span>
        </div>
        <p className="text-gray-400">Book premium turf fields with ease and confidence.</p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-gray-400">
          <li><button className="hover:text-white transition">Home</button></li>
          <li><button className="hover:text-white transition">Turf Locations</button></li>
          <li><button className="hover:text-white transition">FAQs</button></li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="text-lg font-bold mb-4">Contact</h4>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +1 (555) 123-4567
          </li>
          <li className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@turfbook.com
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
      <p>© 2023 TurfBook. All rights reserved.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
