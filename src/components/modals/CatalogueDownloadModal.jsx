'use client';
import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {downloadBrochure} from '@/lib/api';
export default function CatalogueDownloadModal({isOpen, onClose}) {
  const t = useTranslations('Design');
  const dialog = useRef(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => { if (isOpen) dialog.current?.showModal(); }, [isOpen]);
  function close() { dialog.current?.close(); onClose(); }
  async function submit(event) {
    event.preventDefault();
    setStatus('pending');
    try {
      await downloadBrochure(email);
      const link = document.createElement('a');
      link.href = '/assets/Aiconmac_Catalogue.pdf';
      link.download = 'Aiconmac_Catalogue.pdf';
      link.click();
      setStatus('success');
    } catch { setStatus('error'); }
  }
  return <dialog className="catalogue-dialog" ref={dialog} aria-labelledby="catalogue-title" onCancel={event => {event.preventDefault(); if (status !== 'pending') close();}}>
    <button className="design-button" disabled={status === 'pending'} onClick={close}>{t('close')}</button>
    <h2 id="catalogue-title">{t('catalogueTitle')}</h2>
    {status === 'success' ? <p role="status">{t('catalogueDownloading')}</p> : <form onSubmit={submit}><p>{t('cataloguePrompt')}</p><label htmlFor="catalogue-email">{t('catalogueEmail')}</label><input id="catalogue-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={status === 'pending'} />{status === 'error' && <p role="alert">{t('errors.http')}</p>}<button className="design-button orange" disabled={status === 'pending'}>{t(status === 'pending' ? 'processing' : 'downloadCatalogue')}</button><p>{t('catalogueConsent')}</p></form>}
  </dialog>;
}
