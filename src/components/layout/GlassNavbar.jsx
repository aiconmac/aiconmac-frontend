'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import CatalogueDownloadModal from '@/components/modals/CatalogueDownloadModal';

import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

const GlassNavbar = ({ isVisible }) => {
  const t = useTranslations('Navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCataloguePopup, setShowCataloguePopup] = useState(false);

  if (!isVisible) return null;

  const navItems = [
    { name: t('home'), href: "/" },
    { name: t('projects'), href: "/projects" },
    { name: t('clients'), href: "/clients" },
    { name: t('careers'), href: "/careers" },
    { name: t('contact'), href: "/contact" }
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      {/* Desktop Glass Navbar */}
      <div className="hidden lg:flex max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-between w-full px-6 py-3 rounded-full border shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/images/aicon-removebg-preview.png" alt="Aiconmac Logo" className="h-10 w-auto object-contain" />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-light tracking-wider text-black/90 hover:text-black uppercase transition-colors relative"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.5)' }}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Contact Button & Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher
              className="text-black/90 border-gray-300"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.5)' }}
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
          </div>
        </motion.div>
      </div>

      {/* Mobile Glass Navbar */}
      <div className="lg:hidden">
        <motion.div
          className="flex items-center justify-between px-4 py-3 rounded-xl border shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px) saturate(150%)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex items-center space-x-3">
            <img src="/images/aicon-removebg-preview.png" alt="Aiconmac Logo" className="h-8 w-auto object-contain" />
          </div>

          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-black/90 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-2 rounded-2xl px-6 py-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(25px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 10, scale: 1.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-3 text-lg font-light text-black/90 hover:text-black uppercase tracking-wider"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-white/20">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CatalogueDownloadModal
        isOpen={showCataloguePopup}
        onClose={() => setShowCataloguePopup(false)}
      />
    </motion.div>
  );
};

export default GlassNavbar;