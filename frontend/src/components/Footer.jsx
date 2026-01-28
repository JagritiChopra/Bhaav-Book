import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowUp
} from 'lucide-react';
import logoLight from "../assets/logo-light.png";

function Footer() {
  // ==================== CONFIGURABLE DATA ====================
  const footerData = {
    company: {
      name: "Bhav Book",
      description: "Your personal journey companion. Capture thoughts, track emotions, and discover insights about yourself through intelligent journaling."
    },
    contact: {
      email: "jagritichopra18@gmail.com",
      phone: "+91 6375919829",
      address: {
        street: "",
        city: "Rohtak ,Haryana, India"
      }
    },
    socialLinks: {
      twitter: "https://x.com/",
      linkedin: "https://www.linkedin.com/in/",
      instagram: "https://www.instagram.com/"
    },
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Journal', href: '/journal' },
      { name: 'Insights', href: '/insights' },
      { name: 'Profile', href: '/profile' },
      // { name: 'Pricing', href: '/pricing' }
    ],
    supportLinks: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'FAQ', href: '/faq' }
    ]
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If not on home page, navigate to home
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-sky-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img
                src={logoLight}
                alt={`${footerData.company.name} Logo`}
                className="h-auto w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {footerData.company.description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href={footerData.socialLinks.twitter}
                target='_' 
                className="p-2 bg-slate-800 hover:bg-sky-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-sky-500/25"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href={footerData.socialLinks.linkedin} 
                target='_'
                className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href={footerData.socialLinks.instagram} 
                target='_'
                className="p-2 bg-slate-800 hover:bg-pink-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links - Shifted Right */}
          <div className="pl-6 lg:pl-8">
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link) => (
                <li key={link.name}>
                  {link.name === 'Home' ? (
                    <button 
                      onClick={handleHomeClick}
                      className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </button>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {footerData.supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className='relative right-10'>
            <h3 className="text-lg font-semibold mb-6 text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-sky-600 transition-colors duration-300">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                  <a 
                    href={`mailto:${footerData.contact.email}`} 
                    className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm"
                  >
                    {footerData.contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-green-600 transition-colors duration-300">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                  <a 
                    href={`tel:${footerData.contact.phone}`} 
                    className="text-gray-300 hover:text-sky-400 transition-colors duration-200 text-sm"
                  >
                    {footerData.contact.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-purple-600 transition-colors duration-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Address</p>
                  <p className="text-gray-300 text-sm">
                    {footerData.contact.address.street}<br />
                    {footerData.contact.address.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} {footerData.company.name}. Made with</span>
              <Heart size={14} className="text-red-500 animate-pulse" />
              <span> <a href="https://www.linkedin.com/in/shiva-singh-421152167/" className='hover:underline cursor-pointer text-sky-300' target='_'></a></span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="p-2 bg-slate-800 hover:bg-sky-600 rounded-lg transition-all duration-300 hover:scale-110 group"
                aria-label="Scroll to top"
              >
                <ArrowUp size={16} className="group-hover:animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
