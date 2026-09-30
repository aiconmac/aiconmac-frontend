import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
import './redesign.css';

const Notice = ({t, lang, dir}) => <section className="design-section" lang={lang} dir={dir}>
  <div><p className="eyebrow">{t.errorCode}</p><h1>{t.title}</h1><p>{t.description}</p></div>
  <div><a className="design-button orange" href={`/${lang}`}>{t.backHome}</a> <a className="design-button" href={`/${lang}/projects`}>{t.exploreProjects}</a></div>
</section>;

export const metadata = {title: en.NotFound.title};

export default function RootNotFound() {
  return <html lang="en"><body><main id="main-content" className="design-page">
    <Notice t={en.NotFound} lang="en" dir="ltr" />
    <Notice t={ar.NotFound} lang="ar" dir="rtl" />
  </main></body></html>;
}
