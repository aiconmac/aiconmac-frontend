"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedContent } from '@/lib/i18n-utils';
import { motion } from 'framer-motion';
import ClientsGrid from '@/components/clients/ClientsGrid';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { fetcher } from '@/lib/api';
import {normalizeClients} from '@/lib/portfolio.mjs';

export default function ClientsPage() {
    const t = useTranslations('ClientsPage');
    const locale = useLocale();
    const tCommon = useTranslations('Common');
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetcher('/clients');
                if (normalizeClients(data)) {
                    const localizedClients = data.map(client => ({
                        ...client,
                        name: getLocalizedContent(client, 'name', locale)
                    }));
                    setClients(localizedClients);
                }
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                // Show the actual error instead of falling back silently
                setError(err.info?.message || err.message || t('error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <main id="main-content" className="min-h-screen bg-white text-gray-900 font-sans selection:bg-amber-100 selection:text-amber-900">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber-50/50 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="mb-8">
                            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />
                            <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                                {t('partnerships')}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-[#464646] mb-8 leading-tight">
                            {t('trustedBy')} <span className="font-light text-amber-600">{t('industryLeaders')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                            {t('description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <LoadingScreen fullScreen={false} message={t('loadingClients') || "Loading clients..."} />
                    ) : error ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-light text-gray-800 mb-2">{t('failedToLoad')}</h3>
                                <p className="text-red-600 font-light mb-4">{error}</p>
                                <div className="text-sm text-gray-600 font-light space-y-2">
                                    <p>{t('checkBackend')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors font-light"
                            >
                                {t('retry')}
                            </button>
                        </div>
                    ) : (
                        <ClientsGrid clients={clients} />
                    )}
                </div>
            </section>
        </main>
    );
}
