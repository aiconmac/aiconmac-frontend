import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {getProjects} from '@/lib/build-data.mjs';
import {imageVariant, localized} from '@/lib/portfolio.mjs';
import {pageMetadata} from '@/lib/seo.mjs';
import Gallery from '@/components/redesign/Gallery';
import ProjectFacts from '@/components/redesign/ProjectFacts';
import EscapeTo from '@/components/redesign/EscapeTo';

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap(locale => projects.map(project => ({locale, slug: project.slug})));
}

async function findProject(slug) {
  return (await getProjects()).find(project => project.slug === slug);
}

export async function generateMetadata({params}) {
  const {locale, slug} = await params;
  const project = await findProject(slug);
  if (!project) return {};
  const title = localized(project, 'title', locale).children;
  const description = localized(project, 'description', locale).children.slice(0, 160);
  return pageMetadata({locale, path: `/projects/${slug}`, title: `${title} — Aiconmac`, description, image: project.images[0] && imageVariant(project.images[0].url, 1200)});
}

export default async function ProjectPage({params}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const project = await findProject(slug);
  if (!project) notFound();
  const t = await getTranslations({locale, namespace: 'Design'});
  const title = localized(project, 'title', locale);
  const work = `/${locale}/projects`;
  return <main id="main-content" className="design-page"><EscapeTo href={work} /><article className="project-detail" aria-labelledby="detail-heading">
    <div className="detail-head"><h1 id="detail-heading" {...title} /><a className="design-button" href={work}>{t('backToWork')}</a></div>
    <Gallery images={project.images} alt={title.children} />
    <div className="detail-copy">
      {project.category && <div className="detail-fact"><span className="eyebrow">{t('category')}</span><span {...localized(project.category, 'name', locale)} /></div>}
      <ProjectFacts project={project} className="detail-facts" />
      {/* OWNER_CONTENT: Arabic descriptions pending; localized() falls back to English until entered in the dashboard. */}
      <p className="detail-description" {...localized(project, 'description', locale)} />
      <a className="design-button" href={`/${locale}/contact?project=${project.slug}#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a>
    </div>
  </article></main>;
}
