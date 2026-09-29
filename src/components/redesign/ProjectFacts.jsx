import {useTranslations} from 'next-intl';
export default function ProjectFacts({project, className}) {
  const t = useTranslations('Design');
  const facts = [[t('scale'), project.scale, true], [t('leadTime'), project.leadTimeDays && t('days', {count: project.leadTimeDays}), false], [t('client'), project.clientName, true]].filter(([, value]) => value);
  if (!facts.length) return null;
  return <dl className={className}>{facts.map(([label, value, english]) => <div key={label}><dt>{label}</dt><dd {...(english ? {lang: 'en', dir: 'ltr'} : {})}>{value}</dd></div>)}</dl>;
}
