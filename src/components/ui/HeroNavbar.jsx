'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import CatalogueDownloadModal from '@/components/modals/CatalogueDownloadModal';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

const HeroNavbar = () => {
  const t = useTranslations('Navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCataloguePopup, setShowCataloguePopup] = useState(false);

  const navItems = [
    { name: t('home'), href: "/" },
    { name: t('projects'), href: "/projects" },
    { name: t('clients'), href: "/clients" },
    { name: t('careers'), href: "/careers" },
    { name: t('contact'), href: "/contact" }
  ];

  return (
    <>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed z-50 top-4 left-0 right-0 px-4 transition-all duration-300"
      >
        <div
          className="mx-auto transition-all duration-300 max-w-6xl px-6 py-3 rounded-full border shadow-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="h-10 w-auto flex items-center justify-center overflow-hidden">
                <img src="/images/aicon-removebg-preview.png" alt="Aiconmac Logo" className="w-full h-full object-contain" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="text-md transition-colors font-light tracking-wide text-gray-900 hover:text-gray-600"
                    style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)' }}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Catalogue Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher
                className="text-gray-900 border-gray-300"
                style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)' }}
              />

              <motion.button
                onClick={() => setShowCataloguePopup(true)}
                className="hidden sm:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">{t('catalogue')}</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 transition-colors duration-300 text-gray-700 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Positioned absolutely relative to the container */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 text-gray-700 hover:text-gray-900 font-light"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setShowCataloguePopup(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm rounded-lg mt-4"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('downloadCatalogue')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Catalogue Download Popup */}
      <CatalogueDownloadModal
        isOpen={showCataloguePopup}
        onClose={() => setShowCataloguePopup(false)}
      />


    </>
  );
};

export default HeroNavbar;