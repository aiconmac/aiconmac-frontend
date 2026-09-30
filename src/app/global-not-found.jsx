import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
import './redesign.css';

const Notice = ({messages, lang, dir}) => <section className="not-found design-section" lang={lang} dir={dir}>
  <p className="not-found-code">404</p>
  <h1>{messages.NotFound.description}</h1>
  <p className="not-found-links"><a href={`/${lang}/projects`}>{messages.Design.work}</a><a href={`/${lang}/contact`}>{messages.Design.contact}</a></p>
</section>;

export const metadata = {title: en.NotFound.title};

export default function RootNotFound() {
  return <html lang="en"><body><main id="main-content" className="design-page">
    <Notice messages={en} lang="en" dir="ltr" />
    <Notice messages={ar} lang="ar" dir="rtl" />
  </main></body></html>;
}
