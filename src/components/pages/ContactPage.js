"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Award, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

import { poster } from '@/lib/api';

const ContactPage = () => {
  const t = useTranslations('ContactPage');
  const router = useRouter();
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectCategory: '',
    projectVision: ''
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('errors.fullName');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.projectCategory) {
      newErrors.projectCategory = t('errors.commissionType');
    }

    if (!formData.projectVision.trim()) {
      newErrors.projectVision = t('errors.projectVision');
    } else if (formData.projectVision.trim().length < 10) {
      newErrors.projectVision = t('errors.projectVisionLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('loading');
    setSubmissionMessage('');

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.projectCategory,
        message: formData.projectVision,
      };

      await poster('/contact', payload);
      setSubmissionStatus('success');
      setSubmissionMessage(t('messages.success'));

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        projectCategory: '',
        projectVision: ''
      });
    } catch (err) {
      setSubmissionStatus('error');
      setSubmissionMessage(err.info?.message || err.message || t('messages.error'));
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-28">
      {/* Museum lighting effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gray-200/30 rounded-full blur-2xl opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-50/30 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center px-6 py-3 mb-8 rounded-full border border-amber-200 bg-amber-50/80 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-light uppercase tracking-wider text-amber-700">
              {t('architecturalAtelier')}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl font-extralight text-gray-800 mb-6 tracking-tight"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-12"
          >
            {t('heroDescription')}
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-extralight text-amber-600">500+</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsCommissions')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extralight text-amber-600">24hr</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsResponse')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extralight text-amber-600">15+</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsCountries')}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Project Inquiry Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <div
              className="p-10 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-light text-gray-800 mb-4">{t('commissionRequestTitle')}</h2>
                <div className="w-16 h-px bg-amber-300 mb-4" />
                <p className="text-gray-600 font-light">
                  {t('commissionRequestDescription')}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div variants={cardVariants}>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      {t('formFullName')}
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </motion.div>

                  <motion.div variants={cardVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                      {t('formEmail')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </motion.div>
                </div>

                <motion.div variants={cardVariants}>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    {t('formPhone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </motion.div>

                <motion.div variants={cardVariants}>
                  <label htmlFor="projectCategory" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    {t('formCommissionType')}
                  </label>
                  <select
                    id="projectCategory"
                    name="projectCategory"
                    value={formData.projectCategory}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <option value="">{t('formCommissionType')}</option>
                    <option value="Masterplan">{t('commissionTypes.masterplan')}</option>
                    <option value="High and Midrise Building">{t('commissionTypes.high_midrise')}</option>
                    <option value="Villa Model">{t('commissionTypes.villa')}</option>
                    <option value="Interior Model">{t('commissionTypes.interior')}</option>
                    <option value="Mechanical Effect Model">{t('commissionTypes.mechanical')}</option>
                    <option value="Conceptual Model">{t('commissionTypes.conceptual')}</option>
                    <option value="Industrial Model">{t('commissionTypes.industrial')}</option>
                    <option value="Gift Model">{t('commissionTypes.gifts')}</option>
                  </select>
                  {errors.projectCategory && <p className="mt-1 text-sm text-red-600">{errors.projectCategory}</p>}
                </motion.div>

                <motion.div variants={cardVariants}>
                  <label htmlFor="projectVision" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    {t('formProjectVision')}
                  </label>
                  <textarea
                    id="projectVision"
                    name="projectVision"
                    placeholder={t('formProjectVision')}
                    rows={6}
                    value={formData.projectVision}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light resize-none"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                  {errors.projectVision && <p className="mt-1 text-sm text-red-600">{errors.projectVision}</p>}
                </motion.div>

                {submissionStatus === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-center text-lg">
                    {submissionMessage}
                  </motion.p>
                )}
                {submissionStatus === 'error' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-center text-lg">
                    {submissionMessage}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-xl text-white font-medium tracking-wider uppercase text-sm shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #f06123 0%, #d97706 100%)',
                    boxShadow: '0 10px 30px rgba(240, 97, 35, 0.3)'
                  }}
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.02,
                    boxShadow: isSubmitting ? '0 10px 30px rgba(240, 97, 35, 0.3)' : '0 15px 40px rgba(240, 97, 35, 0.4)'
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  variants={cardVariants}
                >
                  {isSubmitting ? t('formSubmitting') : t('formSubmit')}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Studio Information */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {/* Contact Information */}
            <motion.div
              variants={cardVariants}
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-light text-gray-800 mb-4">{t('atelierDetailsTitle')}</h3>
                <div className="w-16 h-px bg-amber-300 mb-4" />
              </div>

              <div className="space-y-6">
                {[
                  { icon: Phone, label: t('contactDetails.directLine'), value: '+971 50 279 2040', subValue: t('contactDetails.available') },
                  { icon: Phone, label: t('contactDetails.officeLine'), value: '+971 6 535 7585', subValue: t('contactDetails.available') },
                  { icon: Mail, label: t('contactDetails.studioEmail'), value: 'marketing@aiconmac.com', subValue: t('contactDetails.response') },
                  { icon: MapPin, label: t('contactDetails.designStudio'), value: t('contactDetails.addressLine1'), subValue: t('contactDetails.addressLine2') },
                  { icon: Clock, label: t('contactDetails.studioHours'), value: t('contactDetails.weekdays'), subValue: t('contactDetails.saturday') }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/30 transition-all cursor-pointer group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-amber-100 p-3 rounded-full group-hover:bg-amber-200 transition-colors">
                      <contact.icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-1">
                        {contact.label}
                      </div>
                      <div className="text-gray-800 font-light" dir={contact.icon === Phone || contact.icon === Mail ? 'ltr' : undefined}>{contact.value}</div>
                      <div className="text-sm text-gray-500 font-light">{contact.subValue}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Studio Credentials */}
            <motion.div
              variants={cardVariants}
              className="p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-light text-gray-800 mb-4">{t('studioExcellenceTitle')}</h3>
                <div className="w-16 h-px bg-amber-300 mb-4" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Award, title: t('credentials.awardWinning.title'), desc: t('credentials.awardWinning.desc') },
                  { icon: Globe, title: t('credentials.globalClientele.title'), desc: t('credentials.globalClientele.desc') },
                  { icon: Clock, title: t('credentials.timelessQuality.title'), desc: t('credentials.timelessQuality.desc') }
                ].map((credential, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4">
                    <div className="bg-amber-600 p-2 rounded-lg">
                      <credential.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{credential.title}</h4>
                      <p className="text-sm text-gray-600 font-light">{credential.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location Map Placeholder */}
            <motion.div
              variants={cardVariants}
              className="rounded-2xl h-64 flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30" />
              <div className="relative text-center">
                <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <span className="text-amber-700 font-light">{t('map.title')}</span>
                <p className="text-sm text-amber-600/70 mt-2">{t('map.hint')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="p-12 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-gray-800 mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
              {t('ctaDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full text-white font-medium tracking-wider uppercase text-sm shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #f06123 0%, #d97706 100%)',
                  boxShadow: '0 10px 30px rgba(240, 97, 35, 0.3)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 15px 40px rgba(240, 97, 35, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {t('scheduleConsultation')}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  router.push('/projects');
                }}
                className="px-8 py-4 rounded-full font-medium tracking-wider uppercase text-sm border border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('viewPortfolio')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;