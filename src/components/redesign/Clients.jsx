'use client';
import {useLocale, useTranslations} from 'next-intl';
import useCollection from '@/hooks/useCollection';
import CollectionStatus from './CollectionStatus';
export default function Clients() {
  const collection = useCollection('/clients');
  const t = useTranslations('Design');
  const locale = useLocale();
  return <div className="client-directory">
    <CollectionStatus {...collection} empty={!collection.data.length} emptyKey="emptyClients" />
    <ul className="client-list">{collection.data.map(client => <li key={client.id} lang="en" dir="ltr">{client.name}</li>)}</ul>
    <a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('discussSimilar')} <span className="arrow" aria-hidden="true">→</span></a>
  </div>;
}
