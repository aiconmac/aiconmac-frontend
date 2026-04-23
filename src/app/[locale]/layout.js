// src/app/layout.js
import React from 'react';
import '../globals.css';
import Footer from '@/components/layout/Footer.jsx';
import AnimatedBackground from '@/components/ui/AnimatedBackground.jsx';
import ConditionalNavbar from '@/components/layout/ConditionalNavbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AICONMAC Models',
  url: 'https://aiconmac.com',
  logo: 'https://aiconmac.com/images/aicon-removebg-preview.png',
  description: "Dubai's premier architectural model atelier. Museum-quality miniature models for masterplans, high-rise towers, villas & interiors.",
  address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
  sameAs: [
    'https://www.linkedin.com/company/aiconmac-models/',
    'https://www.instagram.com/aiconmac_models/',
    'https://www.tiktok.com/@aiconmac3dmodels',
  ],
};

export const viewport = {
  themeColor: '#d97706',
};

export const metadata = {
  metadataBase: new URL('https://aiconmac.com'),
  title: 'AICONMAC Models — Precision Architectural Models | Dubai',
  description: "Dubai's premier architectural model atelier. Museum-quality miniature models for masterplans, high-rise towers, villas & interiors. Trusted by Emaar, Nakheel, Damac & 100+ leading developers.",
  openGraph: {
    title: 'AICONMAC Models — Precision Architectural Models | Dubai',
    description: 'Museum-quality miniature architectural models. Serving Emaar, Nakheel, Damac and leading developers since 2009.',
    url: 'https://aiconmac.com',
    siteName: 'AICONMAC Models',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'AICONMAC Architectural Models — Dubai' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AICONMAC Models — Precision Architectural Models | Dubai',
    description: 'Museum-quality architectural models from Dubai.',
    images: ['/og-image.jpg'],
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen min-w-screen relative`}>
        <NextIntlClientProvider messages={messages}>
          <ConditionalNavbar />
          <AnimatedBackground />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}