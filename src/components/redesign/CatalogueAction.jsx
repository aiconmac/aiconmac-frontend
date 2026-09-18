'use client';
import {useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
const Catalogue = dynamic(() => import('@/components/modals/CatalogueDownloadModal'), {ssr: false});
export default function CatalogueAction() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const t = useTranslations('Design');
  return <><button ref={button} onClick={() => setOpen(true)}>{t('catalogue')}</button>{open && <Catalogue isOpen onClose={() => {setOpen(false); button.current?.focus();}} />}</>;
}
