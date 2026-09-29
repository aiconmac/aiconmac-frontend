'use client';
import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {downloadBrochure} from '@/lib/api';
export default function CatalogueDownloadModal({isOpen, onClose}) {
  const t = useTranslations('Design');
  const dialog = useRef(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({state: 'idle'});
  useEffect(() => { if (isOpen) dialog.current?.showModal(); }, [isOpen]);
  function close() { dialog.current?.close(); onClose(); }
  async function submit(event) {
    event.preventDefault();
    setStatus({state: 'pending'});
    try {
      await downloadBrochure(email);
      const link = document.createElement('a');
      link.href = '/assets/Aiconmac_Catalogue.pdf';
      link.download = 'Aiconmac_Catalogue.pdf';
      link.click();
      setStatus({state: 'success'});
    } catch (error) { setStatus({state: 'error', kind: error.kind || 'http'}); }
  }
  return <dialog className="catalogue-dialog" ref={dialog} aria-labelledby="catalogue-title" onCancel={event => { event.preventDefault(); close(); }}>
    <button className="design-button" onClick={close}>{t('close')}</button>
    <h2 id="catalogue-title">{t('catalogueTitle')}</h2>
    {status.state === 'success' ? <p role="status">{t('catalogueDownloading')}</p> : <form onSubmit={submit}><p>{t('cataloguePrompt')}</p><label htmlFor="catalogue-email">{t('catalogueEmail')}</label><input id="catalogue-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={status.state === 'pending'} />{status.state === 'error' && <p role="alert">{t(`errors.${status.kind}`)}</p>}<button className="design-button" disabled={status.state === 'pending'}>{t(status.state === 'pending' ? 'processing' : 'catalogueTitle')}</button><p>{t('catalogueConsent')}</p></form>}
  </dialog>;
}
