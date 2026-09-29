import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { mergeMessages } from './messages.mjs';
import en from '../../messages/en.json';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;
    if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
    const messages = locale === 'en' ? en : mergeMessages(en, (await import(`../../messages/${locale}.json`)).default);
    return { locale, messages };
});
