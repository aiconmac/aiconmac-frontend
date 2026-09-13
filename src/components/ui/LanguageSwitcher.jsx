'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { startTransition } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Check } from 'lucide-react';

export default function LanguageSwitcher({ className = "", style = {}, compactOnMobile = false }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский' }
    ];

    const currentLanguage = languages.find(l => l.code === locale) || languages[0];

    const handleLanguageChange = (code) => {
        setIsOpen(false);
        startTransition(() => {
            router.replace(pathname, { locale: code });
        });
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative shrink-0" ref={dropdownRef}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    setIsOpen(false);
                    dropdownRef.current?.querySelector('button')?.focus();
                }
            }}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`${currentLanguage.name} (${currentLanguage.nativeName})`}
                aria-expanded={isOpen}
                className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg border bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 ${className}`}
                style={style}
            >
                <Globe className={`w-4 h-4 ${compactOnMobile ? "hidden sm:block" : ""}`} />
                <span className={`text-sm font-medium ${compactOnMobile ? "hidden sm:inline" : ""}`}>{currentLanguage.nativeName}</span>
                {compactOnMobile && <span aria-hidden="true" className="text-sm font-medium sm:hidden">{currentLanguage.code.toUpperCase()}</span>}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute end-0 mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-2xl border border-white/20"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="py-2">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language.code)}
                                    className={`w-full px-4 py-2.5 text-start text-sm flex items-center justify-between hover:bg-amber-500/10 transition-colors duration-200
                                        ${locale === language.code ? 'text-amber-600 font-medium bg-amber-50' : 'text-gray-700'}
                                    `}
                                >
                                    <span className="flex items-center space-x-3">
                                        <span>{language.nativeName}</span>
                                    </span>
                                    {locale === language.code && (
                                        <Check className="w-4 h-4 text-amber-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
