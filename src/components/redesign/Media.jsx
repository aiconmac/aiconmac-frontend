'use client';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {imageVariant} from '@/lib/portfolio.mjs';
export default function Media({src, alt = '', priority = false, sizes = '(max-width: 600px) 100vw, (max-width: 899px) 50vw, 33vw'}) {
  const [failed, setFailed] = useState(false);
  const t = useTranslations('Design');
  if (!src || failed) return <span className="image-placeholder">{t('noImage')}</span>;
  const transformed = imageVariant(src, 960) !== src;
  return <img src={imageVariant(src, 960)} srcSet={transformed ? [480, 800, 1200, 1800].map(w => `${imageVariant(src, w)} ${w}w`).join(', ') : undefined} sizes={sizes} width="1600" height="1000" alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />;
}
