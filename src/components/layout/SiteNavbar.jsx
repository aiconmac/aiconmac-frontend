"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import GlassNavbar from '@/components/layout/GlassNavbar';

const SiteNavbar = ({ isVisible = true }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/ar' || pathname === '/ru';
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // The page currently scrolls in body; also support document/window scrolling.
    const updateScrollPosition = () => {
      setScrollPosition(Math.max(document.body.scrollTop, window.scrollY));
    };
    updateScrollPosition();
    document.body.addEventListener('scroll', updateScrollPosition, { passive: true });
    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    return () => {
      document.body.removeEventListener('scroll', updateScrollPosition);
      window.removeEventListener('scroll', updateScrollPosition);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return <GlassNavbar isGlass={!isHomePage || scrollPosition >= 100} />;
};

export default SiteNavbar;
