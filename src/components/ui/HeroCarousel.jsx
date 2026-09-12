'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProjectImage from './ProjectImage';

export default function HeroCarousel({ slides = [], emptyMessage }) {
  const t = useTranslations('HomePage.projectMedia');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const paused = hovered || focused || manuallyPaused;
  const index = currentIndex % (slides.length || 1);
  const slide = slides[index];

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setCurrentIndex(previous => (previous + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const select = next => {
    setCurrentIndex((next + slides.length) % (slides.length || 1));
    setManuallyPaused(true);
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-900 text-white h-[85vh] min-h-[480px] sm:min-h-[600px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setManuallyPaused(false); }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setManuallyPaused(false);
        }
      }}>
      <AnimatePresence mode="wait">
        <motion.div key={slide ? `${slide.id}-${slide.title}` : 'empty'} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onTouchStart={event => { event.currentTarget.dataset.touchX = event.touches[0].clientX; }}
          onTouchEnd={event => {
            const distance = event.changedTouches[0].clientX - Number(event.currentTarget.dataset.touchX);
            if (slides.length > 1 && Math.abs(distance) > 50) select(index + (distance < 0 ? 1 : -1));
          }}>
          <ProjectImage src={slide?.image} alt={slide?.title || ''} fallback={slide ? t('unavailable') : emptyMessage}
            loading="eager" className="w-full h-full object-cover" />
          {slide && <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16 pb-28 sm:pb-32 lg:pb-32">
              <div><span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase">{slide.category}</span></div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight max-w-4xl">{slide.title}</h2>
            </div>
          </>}
        </motion.div>
      </AnimatePresence>
      {slides.length > 1 && <div className="absolute bottom-8 sm:bottom-12 inset-x-8 sm:inset-x-12 lg:inset-x-16 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">{slides.map((item, itemIndex) => (
          <button key={item.categoryId} type="button" onClick={() => select(itemIndex)} aria-label={item.title}
            aria-current={index === itemIndex ? 'true' : undefined} className="py-3">
            <span className={`block h-1 rounded-full ${index === itemIndex ? 'w-12 bg-white' : 'w-6 bg-white/40'}`} />
          </button>
        ))}</div>
        <div className="flex items-center gap-4">
          <button type="button" aria-label={t('previous')} onClick={() => select(index - 1)} className="p-2"><ChevronLeft /></button>
          <span>{index + 1} / {slides.length}</span>
          <button type="button" aria-label={t('next')} onClick={() => select(index + 1)} className="p-2"><ChevronRight /></button>
        </div>
      </div>}
    </div>
  );
}
