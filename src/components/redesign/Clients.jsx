'use client';
import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import useCollection from '@/hooks/useCollection';
import {localized} from '@/lib/portfolio.mjs';
import CollectionStatus from './CollectionStatus';
export default function Clients({ticker = false}) {
  const collection = useCollection('/clients');
  const t = useTranslations('Design');
  const locale = useLocale();
  const [paused, setPaused] = useState(false);
  if (ticker) return <div className="client-ticker">
    <div className={`ticker-window ${paused ? 'paused' : ''}`}><div className="ticker-track" dir="ltr">{[0, 1].map(copy => <span className="ticker-run" key={copy} aria-hidden={copy === 1 ? true : undefined}>{collection.data.map(client => <span key={client.id} {...localized(client, 'name', locale)} />)}</span>)}</div></div>
    <CollectionStatus {...collection} empty={!collection.data.length} emptyKey="emptyClients" />
    <div className="ticker-actions"><a href={`/${locale}/projects#clients`}>{t('directory')} →</a>{collection.data.length > 0 && <button aria-pressed={paused} onClick={() => setPaused(!paused)}>{t(paused ? 'play' : 'pause')}</button>}</div>
  </div>;
  return <div className="client-list"><CollectionStatus {...collection} empty={!collection.data.length} emptyKey="emptyClients" />{collection.data.map((client, index) => <div className="client-row" key={client.id}><span>{String(index + 1).padStart(2, '0')}</span><span {...localized(client, 'name', locale)} /><a href={`/${locale}/contact`}>{t('enquireAction')} →</a></div>)}</div>;
}
