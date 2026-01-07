import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useFooterItems } from '@/hooks/useFooterItems';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { motion } from 'framer-motion';

export function Footer() {
  const { data: footerItems = [] } = useFooterItems();
  const { data: storeSettings } = useStoreSettings();

  const quickLinks = footerItems.filter(item => item.section === 'quick_links' && item.is_active);
  const customerService = footerItems.filter(item => item.section === 'customer_service' && item.is_active);
  const aboutLinks = footerItems.filter(item => item.section === 'about' && item.is_active);
  const legalLinks = footerItems.filter(item => item.section === 'legal' && item.is_active);

  const storeName = storeSettings?.store_name || 'Gupta Traders';
  const storeEmail = storeSettings?.store_email || 'hello@guptatraders.com';
  const storePhone = storeSettings?.store_phone || '+91 98765 43210';
  const storeAddress = storeSettings?.store_address || '123 Furniture Lane, Sector 45, Gurugram, Haryana 122001';
  const facebookUrl = storeSettings?.facebook_url || '';
  const instagramUrl = storeSettings?.instagram_url || '';
  const twitterUrl = storeSettings?.twitter_url || '';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <footer className="text-gray-100" style={{ backgroundColor: '#2A2622' }}>
      {/* Main footer content */}
      <div className="border-t border-gray-800" style={{ backgroundColor: '#2A2622' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Column */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {storeName}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Crafting beautiful spaces with quality furniture since 1961. Your trusted partner for home and office furnishing.
              </p>
              <div className="flex gap-4 pt-4">
                {instagramUrl && (
                  <motion.a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                )}
                {facebookUrl && (
                  <motion.a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.a>
                )}
                {twitterUrl && (
                  <motion.a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-600 transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <Twitter className="h-5 w-5" />
                  </motion.a>
                )}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                {quickLinks.length > 0 ? (
                  quickLinks.sort((a, b) => a.sort_order - b.sort_order).map(item => {
                    const url = item.url || '#';
                    const isExternal = url.startsWith('http://') || url.startsWith('https://');

                    if (isExternal) {
                      return (
                        <motion.a
                          key={item.id}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm"
                          whileHover={{ x: 4 }}
                        >
                          {item.title}
                        </motion.a>
                      );
                    }

                    return (
                      <motion.div key={item.id} whileHover={{ x: 4 }}>
                        <Link
                          to={url}
                          className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm"
                        >
                          {item.title}
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/products" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        All Products
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/products?category=sofas" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        Sofas
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/products?category=beds" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        Beds
                      </Link>
                    </motion.div>
                  </>
                )}
              </nav>
            </motion.div>

            {/* Customer Service */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Customer Service</h4>
              <nav className="flex flex-col gap-2">
                {customerService.length > 0 ? (
                  customerService.sort((a, b) => a.sort_order - b.sort_order).map(item => {
                    const url = item.url || '#';
                    const isExternal = url.startsWith('http://') || url.startsWith('https://');

                    if (isExternal) {
                      return (
                        <motion.a
                          key={item.id}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm"
                          whileHover={{ x: 4 }}
                        >
                          {item.title}
                        </motion.a>
                      );
                    }

                    return (
                      <motion.div key={item.id} whileHover={{ x: 4 }}>
                        <Link
                          to={url}
                          className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm"
                        >
                          {item.title}
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/profile?tab=orders" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        Track Order
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/shipping" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        Shipping & Delivery
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link to="/faq" className="text-gray-400 hover:text-orange-600 transition-colors duration-300 text-sm">
                        FAQ
                      </Link>
                    </motion.div>
                  </>
                )}
              </nav>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Contact Us</h4>
              <div className="space-y-3">
                <motion.div
                  className="flex items-start gap-3 hover:text-orange-600 transition-colors duration-300 cursor-pointer group"
                  whileHover={{ x: 4 }}
                >
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-600 group-hover:text-orange-500" />
                  <span className="text-gray-400 text-sm">{storeAddress}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 hover:text-orange-600 transition-colors duration-300 cursor-pointer group"
                  whileHover={{ x: 4 }}
                >
                  <Phone className="h-5 w-5 text-orange-600 group-hover:text-orange-500" />
                  <span className="text-gray-400 text-sm">{storePhone}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 hover:text-orange-600 transition-colors duration-300 cursor-pointer group"
                  whileHover={{ x: 4 }}
                >
                  <Mail className="h-5 w-5 text-orange-600 group-hover:text-orange-500" />
                  <span className="text-gray-400 text-sm">{storeEmail}</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="border-t border-gray-800"
        style={{ backgroundColor: '#1F1D1A' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={itemVariants}>
              © {new Date().getFullYear()} {storeName}. All rights reserved.
            </motion.p>
            <motion.div className="flex gap-6" variants={itemVariants}>
              <motion.div whileHover={{ color: '#ff6b35' }}>
                <Link to="#" className="hover:text-orange-600 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </motion.div>
              <motion.div whileHover={{ color: '#ff6b35' }}>
                <Link to="#" className="hover:text-orange-600 transition-colors duration-300">
                  Terms of Service
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
