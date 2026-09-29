'use client';
import {useTranslations} from 'next-intl';
export default function CollectionStatus({status, kind, retry, empty = false, emptyKey = 'empty'}) {
  const t = useTranslations('Design');
  if (status === 'success' && !empty) return null;
  const text = status === 'success' ? t(emptyKey) : status === 'error' ? t(`errors.${kind}`) : t('loading');
  return <div className="collection-status" role="status"><p>{text}</p>{status !== 'success' && <button className="design-button" onClick={retry}>{t('retry')}</button>}</div>;
}
