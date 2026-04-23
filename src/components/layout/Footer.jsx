import React from 'react';
import { Link } from '@/i18n/routing';

import { Linkedin, Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-100 text-[#464646] relative z-30 p-4">
      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

          {/* Column 1: Branding & Logo */}
          <div className="md:col-span-4">
            <Link href="/" className="mb-4 inline-block">
              <img
                src="/images/aicon-removebg-preview.png"
                alt="Aiconmac Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 pr-4">{t('tagline')}</p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{t('navigate')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-amber-600 transition-colors">{t('home')}</Link></li>
              <li><Link href="/projects" className="hover:text-amber-600 transition-colors">{t('projects')}</Link></li>
              <li><Link href="/clients" className="hover:text-amber-600 transition-colors">{t('clients')}</Link></li>
              <li><Link href="/careers" className="hover:text-amber-600 transition-colors">{t('careers')}</Link></li>
              <li><Link href="/contact" className="hover:text-amber-600 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">{t('getInTouch')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:info@aiconmac.com" className="hover:text-amber-600 transition-colors">info@aiconmac.com</a></li>
              <li><a href="tel:+971502792040" className="hover:text-amber-600 transition-colors">+971 50 279 2040</a></li>
              <li>{t('address')}</li>
            </ul>
          </div>

          {/* Column 4: Call to Action */}
          <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">{t('projectInMind')}</h3>
            <p className="text-gray-400 mb-4 text-sm">{t('partnersText')}</p>
            <Link href="/contact" className="bg-amber-600 text-white font-bold py-2 px-4 rounded-md inline-block hover:bg-amber-700 transition-all">
              {t('startConversation')}
            </Link>
          </div>

        </div>

        {/* Bottom bar: Copyright & Socials */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} {t('rightsReserved')}
          </p>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/company/aiconmac-models/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600 transition-colors"><Linkedin size={20} /></a>
            <a href="https://www.tiktok.com/@aiconmac3dmodels" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600 transition-colors">
              {/* TikTok Icon using an SVG for better representation */}
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                className="transition-colors"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/aiconmac_models/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-600 transition-colors"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;