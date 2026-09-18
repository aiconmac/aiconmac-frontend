"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette, Ruler, Award, Users, Lightbulb, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

import { poster } from '@/lib/api';

const CareersPage = () => {
  const t = useTranslations('CareersPage');
  const router = useRouter();
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFileName, setResumeFileName] = useState(null);

  // Form data state - NO SPECIALIZATION
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    resume: null
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

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          resume: t('errors.fileType')
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          resume: t('errors.fileSize')
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file
      }));
      setResumeFileName(file.name);
      setErrors(prev => ({
        ...prev,
        resume: ''
      }));
    }
  };

  // Validation function - NO SPECIALIZATION CHECK
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

    if (!formData.resume) {
      newErrors.resume = t('errors.resumeRequired');
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
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.message) formDataToSend.append('message', formData.message);
      if (formData.resume) formDataToSend.append('resume', formData.resume);
      // NO SPECIALIZATION/POSITION FIELD

      await poster('/careers', formDataToSend, true);
      setSubmissionStatus('success');
      setSubmissionMessage(t('messages.success'));

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        resume: null
      });
      setResumeFileName(null);
    } catch (err) {
      setSubmissionStatus('error');
      setSubmissionMessage(err.info?.message || err.message || t('messages.error'));
      console.error('Career submission error:', err);
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

  const benefits = [
    {
      icon: Palette,
      title: t('benefits.creativeMastery.title'),
      desc: t('benefits.creativeMastery.desc')
    },
    {
      icon: Ruler,
      title: t('benefits.precisionExcellence.title'),
      desc: t('benefits.precisionExcellence.desc')
    },
    {
      icon: Award,
      title: t('benefits.recognitionGrowth.title'),
      desc: t('benefits.recognitionGrowth.desc')
    },
    {
      icon: Users,
      title: t('benefits.collaborativeAtelier.title'),
      desc: t('benefits.collaborativeAtelier.desc')
    },
    {
      icon: Lightbulb,
      title: t('benefits.innovationLab.title'),
      desc: t('benefits.innovationLab.desc')
    },
    {
      icon: Heart,
      title: t('benefits.artisanCulture.title'),
      desc: t('benefits.artisanCulture.desc')
    }
  ];

  return (
    <main id="main-content" className="min-h-screen relative overflow-hidden pt-28">
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
              {t('masterCraftsmen')}
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
              <div className="text-3xl font-extralight text-amber-600">100+</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsArtisans')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extralight text-amber-600">15</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsCountries')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extralight text-amber-600">98%</div>
              <div className="text-sm uppercase tracking-wider text-gray-500">{t('statsSatisfaction')}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Why Join Us Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-5xl font-extralight text-gray-800 mb-6 tracking-tight"
          >
            {t('whyJoinTitle')}
          </motion.h2>
          <motion.div variants={fadeIn} className="w-24 h-px bg-amber-300 mx-auto mb-8" />
          <motion.p
            variants={fadeIn}
            className="text-xl text-gray-600 font-light max-w-3xl mx-auto"
          >
            {t('whyJoinDescription')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="p-8 rounded-2xl text-center group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <motion.div
                className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <benefit.icon className="w-8 h-8 text-amber-700" />
              </motion.div>
              <h3 className="text-xl font-light text-gray-800 mb-4 group-hover:text-amber-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Application Form */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Application Form */}
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
                <h2 className="text-3xl font-light text-gray-800 mb-4">{t('joinTeamTitle')}</h2>
                <div className="w-16 h-px bg-amber-300 mb-4" />
                <p className="text-gray-600 font-light">
                  {t('joinTeamDescription')}
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

                {/* NO SPECIALIZATION FIELD - REMOVED */}

                <motion.div variants={cardVariants}>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    {t('formResume')}
                  </label>
                  <motion.label
                    htmlFor="resume"
                    className="border-2 border-dashed border-gray-300/50 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-all block bg-white/30 backdrop-blur-sm group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4 group-hover:text-amber-500 transition-colors" />
                    <p className="text-gray-600 mb-2 font-light">
                      {resumeFileName ? resumeFileName : t('formResume')}
                    </p>
                    <p className="text-sm text-gray-400 font-light">{t('messages.fileHint')}</p>
                  </motion.label>
                  {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
                </motion.div>

                <motion.div variants={cardVariants}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    {t('formMessage')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t('formMessagePlaceholder')}
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all font-light resize-none"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
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
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <LoadingSpinner size="sm" color="white" />
                      <span>{t('formSubmitting')}</span>
                    </span>
                  ) : (
                    t('formSubmit')
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Studio Culture & Values */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {/* Studio Culture */}
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
                <h3 className="text-2xl font-light text-gray-800 mb-4">{t('cultureTitle')}</h3>
                <div className="w-16 h-px bg-amber-300 mb-4" />
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: t('culture.precision.title'),
                    desc: t('culture.precision.desc')
                  },
                  {
                    title: t('culture.innovation.title'),
                    desc: t('culture.innovation.desc')
                  },
                  {
                    title: t('culture.collaboration.title'),
                    desc: t('culture.collaboration.desc')
                  }
                ].map((value, index) => (
                  <div key={index} className="p-4 rounded-xl hover:bg-white/30 transition-all">
                    <h4 className="font-medium text-gray-800 mb-2">{value.title}</h4>
                    <p className="text-gray-600 font-light text-sm leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career Growth */}
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
                <h3 className="text-2xl font-light text-gray-800 mb-4">{t('growthTitle')}</h3>
                <div className="w-16 h-px bg-amber-300 mb-4" />
              </div>

              <div className="space-y-4">
                {[
                  t('growth.0'),
                  t('growth.1'),
                  t('growth.2'),
                  t('growth.3'),
                  t('growth.4')
                ].map((path, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-amber-600 w-2 h-2 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700 font-light text-sm">{path}</p>
                  </div>
                ))}
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
                {t('applyNow')}
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
                {t('studioTour')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default CareersPage;