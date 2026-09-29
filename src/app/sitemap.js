import {getProjects} from '@/lib/build-data.mjs';
import {LOCALES, SITE} from '@/lib/seo.mjs';
export const dynamic = 'force-static';
export default async function sitemap() {
  const projects = await getProjects();
  const paths = ['', '/projects', '/contact', ...projects.map(project => `/projects/${project.slug}`)];
  const now = new Date();
  return paths.flatMap(path => LOCALES.map(locale => ({
    url: `${SITE}/${locale}${path}`,
    lastModified: now,
    alternates: {languages: Object.fromEntries([...LOCALES.map(code => [code, `${SITE}/${code}${path}`]), ['x-default', `${SITE}/en${path}`]])},
  })));
}
