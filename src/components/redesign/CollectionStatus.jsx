'use client';
import {useTranslations} from 'next-intl';
export default function CollectionStatus({status, retry, empty = false, emptyKey = 'empty'}) {
  const t = useTranslations('Design');
  if (status === 'success' && !empty) return null;
  return <div className="collection-status" role="status"><p>{t(status === 'success' ? emptyKey : status)}</p>{(status === 'error' || status === 'malformed') && <button className="design-button" onClick={retry}>{t('retry')}</button>}</div>;
}
