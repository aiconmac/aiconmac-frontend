'use client';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import Media from './Media';
export default function Gallery({images, numeral, alt}) {
  const t = useTranslations('Design');
  const [shot, setShot] = useState(0);
  const current = images[Math.min(shot, Math.max(0, images.length - 1))];
  return <div className="detail-gallery"><div className="detail-stage"><Media key={current?.url} src={current?.url} alt={alt} priority sizes="(max-width: 899px) 100vw, 67vw" /><span className="plate-number" aria-hidden="true">{numeral}</span></div>
    {images.length > 1 && <><div className="photo-controls"><button onClick={() => setShot((shot + images.length - 1) % images.length)}>{t('previous')}</button><span aria-live="polite">{t('photo')} {shot + 1} / {images.length}</span><button onClick={() => setShot((shot + 1) % images.length)}>{t('next')}</button></div><div className="thumbnails">{images.map((image, index) => <button key={image.id || image.url} aria-label={`${t('photo')} ${index + 1}`} aria-pressed={index === shot} onClick={() => setShot(index)}><Media src={image.url} sizes="72px" /></button>)}</div></>}
  </div>;
}
