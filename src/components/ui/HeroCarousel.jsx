'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useTranslations } from 'next-intl';

const OverlayCarousel = () => {
  const t = useTranslations('HomePage.HeroCarousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  const services = [
    {
      title: t('masterPlanning.title'),
      category: t('masterPlanning.category'),
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop"
    },
    {
      title: t('architecturalModels.title'),
      category: t('architecturalModels.category'),
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=900&fit=crop"
    },
    {
      title: t('industrialModels.title'),
      category: t('industrialModels.category'),
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&h=900&fit=crop"
    },
    {
      title: t('commercialSpaces.title'),
      category: t('commercialSpaces.category'),
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop"
    },
    {
      title: t('residentialLiving.title'),
      category: t('residentialLiving.category'),
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % services.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlaying, services.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % services.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + services.length) % services.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full bg-black">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: '85vh', minHeight: '600px' }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Image Background with Smooth Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Gradient Overlays for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />

            <img
              src={services[currentIndex].image}
              alt={services[currentIndex].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay - Minimal Text */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
          {/* Top: Category Badge */}
          <motion.div
            key={`category-${currentIndex}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-start"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-light text-white tracking-[0.2em] uppercase">
                {services[currentIndex].category}
              </span>
            </div>
          </motion.div>

          {/* Bottom: Title and Controls */}
          <div className="space-y-8">
            {/* Title */}
            <motion.div
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-tight max-w-4xl">
                {services[currentIndex].title}
              </h2>
            </motion.div>

            {/* Navigation Controls Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-between max-w-2xl"
            >
              {/* Progress Indicators */}
              <div className="flex items-center space-x-3">
                {services.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="group relative"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`h-1 rounded-full transition-all duration-500 ${currentIndex === index
                      ? 'w-16 bg-white'
                      : 'w-8 bg-white/30 hover:bg-white/50'
                      }`}>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Counter and Arrow Buttons */}
              <div className="flex items-center space-x-4">
                {/* Counter */}
                <div className="text-white/80 text-sm font-light tracking-wider">
                  <span className="text-white font-normal">{String(currentIndex + 1).padStart(2, '0')}</span>
                  <span className="mx-2">/</span>
                  <span>{String(services.length).padStart(2, '0')}</span>
                </div>


              </div>
            </motion.div>
          </div>
        </div>

        {/* Side Navigation (Large Screens Only) */}
        <div className="hidden xl:block">
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30">
            <motion.button
              onClick={prevSlide}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30">
            <motion.button
              onClick={nextSlide}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Drag Handler for Mobile */}
        <motion.div
          className="absolute inset-0 z-15 xl:hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const threshold = 50;
            if (info.offset.x < -threshold) {
              nextSlide();
            } else if (info.offset.x > threshold) {
              prevSlide();
            }
          }}
        />
      </div>
    </div>
  );
};

export default OverlayCarousel;