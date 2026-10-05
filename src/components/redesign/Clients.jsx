'use client';
import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import useCollection from '@/hooks/useCollection';
import {logoVariant} from '@/lib/portfolio.mjs';
import CollectionStatus from './CollectionStatus';
function Logo({client}) {
  const [failed, setFailed] = useState(false);
  if (!client.logo || failed) return <span className="ticker-name" lang="en" dir="ltr">{client.name}</span>;
  return <img src={logoVariant(client.logo, 1)} srcSet={`${logoVariant(client.logo, 2)} 2x`} width="88" height="48" alt={client.name} lang="en" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
export default function Clients({ticker = false, title, intro}) {
  const collection = useCollection('/clients');
  const t = useTranslations('Design');
  const locale = useLocale();
  const [paused, setPaused] = useState(false);
  if (ticker) return <div className="client-ticker">
    <div className={`ticker-window ${paused ? 'paused' : ''}`} onClick={() => setPaused(!paused)}><div className="ticker-track" dir="ltr" style={{'--names': collection.data.length}}>{[0, 1].map(copy => <span className="ticker-run" key={copy} aria-hidden={copy === 1 ? true : undefined}>{collection.data.map(client => <Logo client={client} key={client.id} />)}</span>)}</div></div>
    <CollectionStatus {...collection} empty={!collection.data.length} emptyKey="emptyClients" />
    {collection.data.length > 0 && <button aria-pressed={paused} onClick={() => setPaused(!paused)}>{t(paused ? 'play' : 'pause')}</button>}
  </div>;
  return <>
    <div><h2>{title}{collection.data.length > 0 && <span className="count"> (<bdi>{collection.data.length}</bdi>)</span>}</h2><p>{intro}</p></div>
    <div className="client-directory">
      <CollectionStatus {...collection} empty={!collection.data.length} emptyKey="emptyClients" />
      <div className="client-list">{collection.data.map((client, index) => <div className="client-row" key={client.id}><span>{String(index + 1).padStart(2, '0')}</span><span lang="en" dir="ltr">{client.name}</span></div>)}</div>
      <a className="boxed-link" href={`/${locale}/contact#enquire-form`}>{t('clientsCta')} {t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a>
    </div>
  </>;
}
