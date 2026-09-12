"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedContent } from '@/lib/i18n-utils';
import { Link as IntlLink } from '@/i18n/routing';

import ProjectImage from '@/components/ui/ProjectImage';
import { homepageProjects, categoryRepresentatives } from '@/lib/homepage-projects.mjs';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Import the navbar components
import HeroNavbar from '@/components/ui/HeroNavbar';

// Import the new carousel
import EnhancedCarousel from '@/components/ui/HeroCarousel';
import MuseumBackground from '@/components/ui/AnimatedBackground';
import { LampContainer } from '@/components/ui/lamp';
import TextType from '@/components/ui/typing-animation';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { InfiniteMovingLogos } from '@/components/ui/infinite-moving-logos';
import { CardSpotlight } from '@/components/ui/card-spotlight';

import { fetcher } from '@/lib/api';
import CountUp from '@/components/ui/CountUp';

const Homepage = () => {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  // Fallback data for testimonials and services if API calls fail
  const testimonialsInitial = [
    {
      quote: "We've known Aicon Mac since their very early days and been witness to their continued pursuit of excellence through hard work and dedication to their clients' high expectations. We congratulate them for their success and wish them continued growth.",
      name: "Abbas Sanei",
      title: t('googleReview')
    },
    {
      quote: "Great company with outstanding and very high quality of productions and models. I totally recommend you guys to go for it.",
      name: "Wafa Al Kindi",
      title: t('googleReview')
    },
    {
      quote: "Their creations are stunning and superb — highly recommended for anyone searching for amazing scale model work.",
      name: "Christian Cruz",
      title: t('googleReview')
    }
  ];

  // Feature cards data - Museum themed
  const features = [
    {
      title: t('features.museumQuality.title'),
      description: t('features.museumQuality.description'),
      items: [
        t('features.museumQuality.items.0'),
        t('features.museumQuality.items.1'),
        t('features.museumQuality.items.2'),
        t('features.museumQuality.items.3')
      ]
    },
    {
      title: t('features.precisionEngineering.title'),
      description: t('features.precisionEngineering.description'),
      items: [
        t('features.precisionEngineering.items.0'),
        t('features.precisionEngineering.items.1'),
        t('features.precisionEngineering.items.2'),
        t('features.precisionEngineering.items.3')
      ]
    },
    {
      title: t('features.curatedExperience.title'),
      description: t('features.curatedExperience.description'),
      items: [
        t('features.curatedExperience.items.0'),
        t('features.curatedExperience.items.1'),
        t('features.curatedExperience.items.2'),
        t('features.curatedExperience.items.3')
      ]
    },
    {
      title: t('features.legacyCollection.title'),
      description: t('features.legacyCollection.description'),
      items: [
        t('features.legacyCollection.items.0'),
        t('features.legacyCollection.items.1'),
        t('features.legacyCollection.items.2'),
        t('features.legacyCollection.items.3')
      ]
    }
  ];

  const tCategories = useTranslations('Categories');
  const [projectsData, setProjectsData] = useState([]);
  const [projectStatus, setProjectStatus] = useState('loading');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const projects = homepageProjects(projectsData, locale, id => {
    const key = typeof id === 'string' ? id.replace(/-/g, '_') : '';
    return key && tCategories.has(key) ? tCategories(key) : (id || '');
  });
  const services = categoryRepresentatives(projects);
  const activeService = services.find(service => service.categoryId === selectedCategory) || services[0];
  const featuredProjectsData = projects.slice(0, 3);
  const aboutProject = projects[0];
  const neutralMessage = t(`projectMedia.${projectStatus === 'loading' ? 'loading' : projectStatus === 'error' ? 'error' : 'empty'}`);
  const [scrollY] = useState(0);
  const [testimonialsData, setTestimonialsData] = useState(testimonialsInitial);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    let active = true;
    fetcher('/projects?isPublished=true').then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid project response');
      if (active) { setProjectsData(data); setProjectStatus('ready'); }
    }).catch(() => {
      if (active) { setProjectsData([]); setProjectStatus('error'); }
    });
    return () => { active = false; };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  // CheckIcon component
  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-amber-600 mt-1 shrink-0">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l-.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0" />
    </svg>
  );

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch Testimonials
    fetcher('/testimonials?isApproved=true')
      .then(data => {
        const mappedTestimonials = data.map(t => ({
          quote: getLocalizedContent(t, 'quote', locale),
          name: getLocalizedContent(t, 'author', locale) || t.author, // Fallback to raw author if needed, though helper handles default field
          title: getLocalizedContent(t, 'title', locale) ? `${getLocalizedContent(t, 'title', locale)}, ${getLocalizedContent(t, 'company', locale)}` : getLocalizedContent(t, 'company', locale) || t('fallback.client'),
        }));
        setTestimonialsData(mappedTestimonials.length > 0 ? mappedTestimonials : testimonialsInitial);
      })
      .catch(err => {
        console.error("Failed to fetch testimonials:", err);
        setTestimonialsData(testimonialsInitial);
      });

    // Fetch Clients
    fetcher('/clients')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const localizedClients = data.map(client => ({
            ...client,
            name: getLocalizedContent(client, 'name', locale)
          }));
          setClientsData(localizedClients);
        } else {
          // Fallback if empty array
          setClientsData([
            { id: '1', name: t('fallback.clients.emaar'), logo: '' },
            { id: '2', name: t('fallback.clients.nakheel'), logo: '' },
            { id: '3', name: t('fallback.clients.dp'), logo: '' },
            { id: '4', name: t('fallback.clients.damac'), logo: '' },
          ]);
        }
      })
      .catch(err => {
        console.warn("Failed to fetch clients for homepage:", err.message);
        // Fallback mock data
        setClientsData([
          { id: '1', name: t('fallback.clients.emaar'), logo: '' },
          { id: '2', name: t('fallback.clients.nakheel'), logo: '' },
          { id: '3', name: t('fallback.clients.dp'), logo: '' },
          { id: '4', name: t('fallback.clients.damac'), logo: '' },
          { id: '5', name: t('fallback.clients.aldar'), logo: '' },
        ]);
      });

  }, []);

  // Feature item component
  const FeatureItem = ({ title }) => (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-gray-700 text-sm font-light">{title}</p>
    </li>
  );

  return (
    <div className="w-full relative">
      <HeroNavbar />
      {/* Museum Background */}
      <MuseumBackground scrollY={scrollY} />
      <div className="relative w-full pt-25">
        <EnhancedCarousel slides={services} emptyMessage={neutralMessage} />
      </div>

      {/* Lamp Animation Section - Museum Gallery Style */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-10 w-full"
      >
        <LampContainer>
          <div className="max-w-6xl mx-auto text-center px-2 sm:px-4 lg:px-6">
            {/* Museum-style section header */}
            <div className="mb-8">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mb-6" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                {t('masterCraftsmanship')}
              </span>
            </div>

            <TextType
              text={[
                t('title'),
                t('visionArt'),
                t('excellence')
              ]}
              as="h2"
              className="bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-transparent mb-8"
              typingSpeed={80}
              pauseDuration={3000}
              deletingSpeed={50}
              textColors={['#4a5568', '#2d3748', '#1a202c']}
              showCursor={true}
              cursorCharacter="_"
              cursorClassName="text-amber-600"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto text-gray-600 mb-12 sm:mb-16 leading-relaxed font-light"
            >
              {t('description')}
            </motion.p>

            {/* Museum-style stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-20"
            >
              <div className="text-center relative">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extralight text-amber-600 mb-3">
                  <CountUp
                    from={0}
                    to={500}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />+</div>
                <div className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.2em] font-light">{t('statsMasterpieces')}</div>
                <div className="w-12 h-0.5 bg-amber-400/50 mx-auto mt-3" />
              </div>
              <div className="text-center relative">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extralight text-amber-600 mb-3">
                  <CountUp
                    from={0}
                    to={100}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />+</div>
                <div className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.2em] font-light">{t('statsArtisans')}</div>
                <div className="w-12 h-0.5 bg-amber-400/50 mx-auto mt-3" />
              </div>
              <div className="text-center relative">
                <div className="text-4xl sm:text-5xl md:text-6xl font-extralight text-amber-600 mb-3">
                  <CountUp
                    from={0}
                    to={15}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />+</div>
                <div className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.2em] font-light">{t('statsYears')}</div>
                <div className="w-12 h-0.5 bg-amber-400/50 mx-auto mt-3" />
              </div>
            </motion.div>

            {/* Museum-quality features with CardSpotlight */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + (index * 0.1), duration: 0.6 }}
                >
                  <CardSpotlight className="h-auto min-h-[320px] w-full p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                    <div className="mb-4">
                      <div className="w-8 h-0.5 bg-amber-400 mb-3" />
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                        {t('premiumService')}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl font-light relative z-20 mt-2 text-gray-800 mb-3">
                      {feature.title}
                    </p>
                    <p className="text-gray-600 relative z-20 text-sm mb-6 font-light leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="text-gray-600 relative z-20">
                      <ul className="list-none mt-2 space-y-3">
                        {feature.items.map((item, itemIndex) => (
                          <FeatureItem key={itemIndex} title={item} />
                        ))}
                      </ul>
                    </div>
                  </CardSpotlight>
                </motion.div>
              ))}
            </motion.div>

            {/* Museum-style call to action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <IntlLink
                href="/projects"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-light py-4 px-8 rounded-none transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-amber-500/25 text-sm sm:text-base uppercase tracking-wider"
              >
                {t('exploreCollection')}
              </IntlLink>
              <IntlLink
                href="/contact"
                className="border border-gray-300 hover:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-amber-600 font-light py-4 px-8 rounded-none transition-all duration-300 transform hover:scale-105 text-sm sm:text-base uppercase tracking-wider"
              >
                {t('commissionArtwork')}
              </IntlLink>
            </motion.div>
          </div>
        </LampContainer>
      </motion.section>

      {/* All Other Sections with Museum Theme */}
      <div className="bg-transparent backdrop-blur-sm relative z-20 w-full">
        {/* About Us Section - Museum Style */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 md:py-32 bg-transparent backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <div className="grid md:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center">
              <div className="md:pr-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {/* Museum-style section header */}
                  <div className="mb-8">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                      {t('aboutAtelier')}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-[#464646] mb-8 leading-tight">
                    Aiconmac<br />
                    <span className="font-light text-gray-600">{t('architecturalGallery')}</span>
                  </h2>

                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed mb-6 font-light">
                      {t('aboutText1')}
                    </p>
                    <p className="text-gray-500 text-base leading-relaxed font-light">
                      {t('aboutText2')}
                    </p>
                  </div>

                  {/* Museum-style stats */}
                  <div className="mt-12 grid grid-cols-3 gap-8">
                    {[
                      { phrase: t('vastCollection'), label: t('curatedWorks') },
                      { phrase: t('awardWinningExperts'), label: t('statsArtisans') },
                      { phrase: t('overDecade'), label: t('statsYears') }
                    ].map((stat) => (
                      <div key={stat.label} className="text-center relative">
                        <div className="text-xl md:text-2xl font-light text-amber-600 mb-2 min-h-[3.5rem] flex items-center justify-center text-center">{stat.phrase}</div>
                        <div className="text-xs uppercase tracking-[0.15em] text-gray-500 font-light">{stat.label}</div>
                        <div className="w-8 h-0.5 bg-amber-400/50 mx-auto mt-2" />
                      </div>
                    ))}
                  </div>

                </motion.div>
              </div>

              <motion.div
                className="relative w-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Museum-style exhibition frame */}
                <div className="relative bg-transparent p-6 shadow-2xl border border-gray-100">
                  <div className="absolute -inset-6 bg-gradient-to-br from-amber-50 via-white to-gray-50 -z-10" />
                  <ProjectImage
                    src={aboutProject?.image}
                    alt={aboutProject?.title || ''}
                    fallback={aboutProject ? t('projectMedia.unavailable') : neutralMessage}
                    width={700}
                    height={500}
                    className="w-full aspect-[7/5] object-cover grayscale-[10%] contrast-110 transform hover:scale-105 transition-transform duration-700"
                  />

                  {/* Museum exhibition label */}
                  <div className="mt-6 px-2 border-t border-gray-100 pt-4">
                    <div className="text-sm font-light text-gray-800 mb-1">{aboutProject?.title}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                      {aboutProject?.category}
                    </div>
                    <div className="text-xs text-gray-400 mt-2 font-light">
                      {t('collectionLocation')}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section - Gallery Exhibition Style */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          className="py-20 md:py-32 bg-gray-50/80 backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            {/* Gallery-style header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  {t('collectionOverview')}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-[#464646] mb-8">
                Our <span className="font-light text-gray-600">{t('ourSpecializations')}</span>
              </h2>
              <TextType
                text={t('specializationsDesc')}
                as="p"
                className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg font-light"
                typingSpeed={30}
                textColors={['#6b7280']}
                startOnVisible={true}
                showCursor={false}
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              {/* Services Exhibition Menu */}
              <motion.div
                className="space-y-8 order-2 md:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {services.map((service, index) => (
                  <motion.button
                    type="button"
                    aria-pressed={activeService?.categoryId === service.categoryId}
                    key={service.categoryId}
                    onMouseEnter={() => setSelectedCategory(service.categoryId)}
                    onFocus={() => setSelectedCategory(service.categoryId)}
                    onClick={() => setSelectedCategory(service.categoryId)}
                    className="group cursor-pointer relative w-full text-start focus-visible:outline-amber-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <div className={`border-s-4 ps-6 py-6 backdrop-blur-sm transition-all duration-500 ${activeService?.categoryId === service.categoryId ? 'border-amber-500 bg-white/60' : 'border-gray-200 group-hover:border-amber-500 group-hover:bg-white/60'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl sm:text-2xl font-light text-[#464646] group-hover:text-gray-800 transition-colors">
                          {service.category}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-600 transform group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed font-light">
                        {service.description}
                      </p>
                      {/* Museum-style accent line */}
                      <div className="w-8 h-0.5 bg-amber-400/0 group-hover:bg-amber-400 transition-all duration-500 mt-4" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* Gallery Display Case */}
              <motion.div
                className="relative h-96 md:h-[500px] w-full order-1 md:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* Museum-style display case with lighting */}
                <div className="relative h-full bg-white shadow-2xl overflow-hidden border border-gray-100">
                  <div className="absolute inset-0 p-8 bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
                    <ProjectImage
                      src={activeService?.image}
                      alt={activeService?.title || ''}
                      fallback={activeService ? t('projectMedia.unavailable') : neutralMessage}
                      className="w-full h-full object-cover object-center grayscale-[5%] contrast-110 rounded-sm"
                    />
                  </div>

                  {/* Gallery spotlight effect */}
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-amber-50/50 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white/80 to-transparent" />

                  {/* Museum information placard */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 border border-gray-200/50">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-light">
                      {activeService?.title || neutralMessage}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Clients Section - Museum Gallery Style */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 md:py-32 bg-gray-50/30 backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <div className="text-center mb-12">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                {t('ourPartnerships')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extralight text-[#464646] mt-4">
                Distinguished <span className="font-light text-gray-600">{t('distinguishedClientele')}</span>
              </h2>
            </div>

            {clientsData.length > 0 && (
              <InfiniteMovingLogos
                items={clientsData}
                direction="left"
                speed="slow"
                pauseOnHover={true}
                className="w-full"
              />
            )}

            <div className="text-center mt-8">
              <IntlLink
                href="/clients"
                className="text-sm uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors border-b border-amber-600/30 hover:border-amber-600 pb-1"
              >
                {t('viewAllPartners')}
              </IntlLink>
            </div>
          </div>
        </motion.section>

        {/* Client Testimonials - Refined Museum Style */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 md:py-32 bg-white/95 backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="mb-6">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  {t('clientTestimonials')}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight text-[#464646] mb-6">
                Voices from Our <span className="font-light text-gray-600">{t('voicesFromCollection')}</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base font-light">
                {t('voicesDesc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <InfiniteMovingCards
                items={testimonialsData}
                direction="right"
                speed="slow"
                pauseOnHover={true}
                className="mb-8"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Projects Section - Gallery Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 md:py-32 bg-gray-50/50 backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  {t('exhibitionHighlights')}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extralight text-[#464646] mb-8">
                Featured <span className="font-light text-gray-600">{t('featuredMasterpiecesTitle')}</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg font-light leading-relaxed">
                {t('featuredMasterpiecesDesc')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {!featuredProjectsData.length && <p role="status">{neutralMessage}</p>}
              {featuredProjectsData.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <IntlLink href="/projects" className="block">
                    {/* Museum exhibition frame */}
                    <div className="relative bg-white p-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      {/* Ambient lighting effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-white to-gray-50/30 group-hover:from-amber-50/40 transition-all duration-500" />

                      <div className="relative z-10">
                        <ProjectImage
                          src={project.image}
                          fallback={t('projectMedia.unavailable')}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="w-full h-64 sm:h-80 object-cover grayscale-[8%] group-hover:grayscale-0 contrast-105 group-hover:contrast-110 transition-all duration-700"
                        />

                        {/* Museum exhibition label */}
                        <div className="mt-6 px-2 border-t border-gray-100 pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-light text-[#464646] group-hover:text-gray-800 transition-colors">
                              {project.title}
                            </h3>
                          </div>
                          <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-light mb-2">
                            {project.category}
                          </p>
                          <div className="text-xs text-gray-400 font-light">
                            {t('collectionLocation')}
                          </div>
                          {/* Museum accent line */}
                          <div className="w-8 h-0.5 bg-amber-400/0 group-hover:bg-amber-400 transition-all duration-500 mt-3" />
                        </div>
                      </div>
                    </div>
                  </IntlLink>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <IntlLink
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm hover:bg-white text-[#464646] hover:text-amber-600 font-light rounded-none border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 text-base uppercase tracking-[0.15em] group"
              >
                {t('viewCompleteCollection')}
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </IntlLink>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action Section - Museum Contact */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true, amount: 0.3 }}
          className="py-20 md:py-32 bg-white/95 backdrop-blur-sm w-full"
        >
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="mb-8">
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                    {t('callToAction.commissionMasterpiece')}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-[#464646] mb-8 leading-tight">
                  {t('callToAction.readyToCreate')}<br />
                  <span className="font-light text-amber-600">{t('callToAction.architecturalLegacy')}</span>
                </h2>

                <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                  {t('callToAction.transformVision')}
                </p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IntlLink
                      href="/contact"
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-light py-4 px-8 rounded-none transition-all duration-300 hover:shadow-xl shadow-amber-500/25 text-base uppercase tracking-[0.15em] group"
                    >
                      {t('callToAction.startCommission')}
                      <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </IntlLink>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IntlLink
                      href="/projects"
                      className="border border-gray-300 hover:border-amber-500 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-amber-600 font-light py-4 px-8 rounded-none transition-all duration-300 text-base uppercase tracking-[0.15em]"
                    >
                      {t('callToAction.viewPortfolio')}
                    </IntlLink>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div >
    </div >
  );
};

export default Homepage;