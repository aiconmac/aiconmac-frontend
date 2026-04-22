// src/app/layout.js
import React from 'react';
import '../globals.css';
import Footer from '@/components/layout/Footer.jsx';
import AnimatedBackground from '@/components/ui/AnimatedBackground.jsx';
import ConditionalNavbar from '@/components/layout/ConditionalNavbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const runtime = 'edge';

export const metadata = {
  title: 'AICON MAC MODELS - Precision in Miniature',
  description: 'Crafting intricate architectural models with unparalleled detail and artistic excellence.',
  icons: {
    icon: '/images/loader-logo.jpg',
    shortcut: '/images/loader-logo.jpg',
    apple: '/images/loader-logo.jpg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/loader-logo.jpg',
    },
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-[Inter] min-h-screen min-w-screen relative">
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