'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { downloadBrochure } from '@/lib/api';

const CatalogueDownloadModal = ({ isOpen, onClose }) => {
    const t = useTranslations('Navigation');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCatalogueDownload = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setErrorMessage(t('emailInvalid') || 'Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            await downloadBrochure(email);
            setSubmitStatus('success');

            // Trigger File Download
            const link = document.createElement('a');
            link.href = '/assets/Aiconmac_Catalogue.pdf';
            link.download = 'Aiconmac_Catalogue.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Close after 3 seconds
            setTimeout(() => {
                onClose();
                setEmail('');
                setSubmitStatus('');
            }, 3000);
        } catch (error) {
            console.error("Failed to download brochure:", error);
            setErrorMessage(t('error') || 'Failed to process request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => !isSubmitting && onClose()}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => !isSubmitting && onClose()}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isSubmitting}
                            >
                                <X size={20} />
                            </button>

                            {submitStatus === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-light text-gray-900 mb-2">{t('success')}</h3>
                                    <p className="text-gray-600">{t('downloadingMessage')}</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Download className="w-8 h-8 text-amber-600" />
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-light text-center text-gray-900 mb-2">
                                        {t('downloadCatalogue')}
                                    </h2>
                                    <p className="text-center text-gray-600 mb-8 text-sm">
                                        {t('emailPrompt')}
                                    </p>

                                    {/* Form */}
                                    <form onSubmit={handleCatalogueDownload} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('emailAddress')}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    required
                                                    disabled={isSubmitting}
                                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        {errorMessage && (
                                            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>{t('processing')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-5 h-5" />
                                                    <span>{t('downloadCatalogue')}</span>
                                                </>
                                            )}
                                        </button>

                                        <p className="text-xs text-center text-gray-500">
                                            {t('consent')}
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CatalogueDownloadModal;
