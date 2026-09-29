import {getTranslations} from 'next-intl/server';
export default async function Quotes() {
  const t = await getTranslations('Design');
  const quotes = t.raw('quotes');
  // OWNER_CONTENT: quote texts pending from the owner; the section stays hidden until every quote has text.
  if (quotes.some(quote => !quote.text)) return null;
  return <section className="quotes design-section" aria-label={t('quotesTitle')}><div><h2>{t('quotesTitle')}</h2></div><div className="quote-list">{quotes.map(quote => <figure key={quote.name}><blockquote>{quote.text}</blockquote><figcaption><span lang="en" dir="ltr">{quote.name}</span> · {quote.role} · <span lang="en" dir="ltr">{quote.firm}</span></figcaption></figure>)}</div></section>;
}
