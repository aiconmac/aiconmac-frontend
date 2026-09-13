'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import CatalogueDownloadModal from '@/components/modals/CatalogueDownloadModal';

import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

const GlassNavbar = ({ isGlass = true }) => {
  const t = useTranslations('Navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCataloguePopup, setShowCataloguePopup] = useState(false);

  const pathname = usePathname();
  const menuButtonRef = useRef(null);

  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const navItems = [
    { name: t('home'), href: "/" },
    { name: t('projects'), href: "/projects" },
    { name: t('clients'), href: "/clients" },
    { name: t('careers'), href: "/careers" },
    { name: t('contact'), href: "/contact" }
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-4 left-4 right-4 z-50"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div
        className="grid grid-cols-[auto_1fr] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 xl:gap-4 items-center max-w-6xl mx-auto px-3 sm:px-6 py-3 rounded-full border shadow-xl"
        style={{
          background: isGlass
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px) saturate(150%)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      >
          <Link href="/" className="flex shrink-0 items-center justify-self-start">
            <img src="/images/aicon-removebg-preview.png" alt="Aiconmac Logo" width="160" height="40" className="w-32 sm:w-40 h-auto shrink-0 object-contain" />
          </Link>

          {/* Navigation Items */}
          <div className="hidden xl:flex items-center gap-1 whitespace-nowrap">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-light tracking-wider text-black/90 hover:text-black uppercase transition-colors relative"
                  style={{ textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(255,255,255,0.5)' }}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 justify-self-end whitespace-nowrap">
            <LanguageSwitcher compactOnMobile className="text-black/90 border-gray-300" />
            <motion.button
              onClick={() => setShowCataloguePopup(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">{t('catalogue')}</span>
            </motion.button>
            <motion.button
              ref={menuButtonRef}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls={isMobileMenuOpen ? "glass-mobile-menu" : undefined}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden flex h-10 w-10 shrink-0 items-center justify-center p-2 text-black/90 rounded-full"
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
          </div>
      </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="glass-mobile-menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="xl:hidden absolute top-full inset-x-0 max-w-6xl mx-auto mt-2 rounded-2xl px-6 py-6 shadow-2xl"
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
      <CatalogueDownloadModal
        isOpen={showCataloguePopup}
        onClose={() => setShowCataloguePopup(false)}
      />
    </nav>
  );
};

export default GlassNavbar;