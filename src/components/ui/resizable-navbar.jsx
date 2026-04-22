'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";
import logo from "@/images/logo.jpg";
import Image from 'next/image';

// Navbar wrapper component with enhanced glass effect
export const Navbar = ({ children, className }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", className)}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">{children}</div>
    </motion.div>
  );
};

// Enhanced NavBody with ultra-premium glass effect
export const NavBody = ({ children, className, scrolled = false }) => (
  <motion.div 
    className={cn(
      "relative mx-auto hidden max-w-7xl flex-row items-center justify-between self-start rounded-full px-6 py-3 shadow-2xl lg:flex border transition-all duration-500",
      className
    )}
    style={{
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, ${scrolled ? '0.15' : '0.08'}) 0%, 
        rgba(255, 255, 255, ${scrolled ? '0.05' : '0.02'}) 100%)`,
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      borderColor: `rgba(255, 255, 255, ${scrolled ? '0.3' : '0.2'})`,
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 1px 0 rgba(255, 255, 255, 0.1)
      `
    }}
    whileHover={{
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.2) 0%, 
        rgba(255, 255, 255, 0.08) 100%)`,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transition: { duration: 0.3 }
    }}
  >
    {children}
  </motion.div>
);

// Enhanced NavItems with museum-style hover effects
export const NavItems = ({ items }) => {
  const [hovered, setHovered] = useState(null);
  
  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 font-medium lg:flex"
    >
      {items.map((item, idx) => (
        <Link
          key={`link-${idx}`}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          className="relative px-4 py-2 text-base text-black/90 hover:text-black transition-all duration-300 font-light tracking-wide"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered-backdrop"
              className="absolute inset-0 z-0 h-full w-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 uppercase tracking-wider text-sm">
            {item.name}
          </span>
        </Link>
      ))}
    </motion.div>
  );
};

// Enhanced NavbarLogo with glass backdrop
export const NavbarLogo = () => (
  <Link href="/" className="relative z-20 flex items-center group">
    <motion.div 
      className="relative p-2 rounded-full transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      whileHover={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        scale: 1.05
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Image 
        src={logo} 
        alt="Aiconmac Logo" 
        className="h-8 w-auto transition-all duration-300 group-hover:brightness-110" 
        width={120}
        height={32}
      />
    </motion.div>
  </Link>
);

// Enhanced NavbarButton with premium glass effect
export const NavbarButton = ({ children, to, onClick, className }) => {
  const buttonContent = (
    <motion.div
      className={cn(
        "relative z-20 rounded-full px-6 py-3 text-sm font-medium text-black transition-all duration-300 overflow-hidden group cursor-pointer",
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(15px) saturate(150%)',
        WebkitBackdropFilter: 'blur(15px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
      whileHover={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        scale: 1.05,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
      
      <span className="relative z-10 uppercase tracking-wider">
        {children}
      </span>
    </motion.div>
  );

  if (to) {
    return (
      <Link href={to} className="relative">
        {buttonContent}
      </Link>
    );
  }
  
  return buttonContent;
};

// Enhanced Mobile Navigation with glass effect
export const MobileNav = ({ children, className }) => (
  <motion.div 
    className={cn(
      "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-4 py-4 shadow-xl lg:hidden",
      className
    )}
    style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({ children }) => (
  <div className="flex w-full flex-row items-center justify-between">
    {children}
  </div>
);

export const MobileNavToggle = ({ isOpen, onClick }) => (
  <motion.button 
    onClick={onClick} 
    className="relative z-50 text-black/90 hover:text-black p-2 rounded-full"
    style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
    whileHover={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      scale: 1.05
    }}
    whileTap={{ scale: 0.95 }}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={isOpen ? 'close' : 'menu'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </motion.div>
    </AnimatePresence>
  </motion.button>
);

export const MobileNavMenu = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-x-0 top-full mt-2 mx-4 flex w-auto flex-col items-start gap-4 rounded-2xl px-6 py-6 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(25px) saturate(150%)',
          WebkitBackdropFilter: 'blur(25px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);