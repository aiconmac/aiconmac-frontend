import { getLocalizedContent } from './i18n-utils.js';

export function homepageProjects(data, locale, categoryLabel) {
  if (!Array.isArray(data)) return [];
  return data.flatMap(project => {
    if (!project || project.isPublished === false || !Array.isArray(project.images)) return [];
    const image = project.images.find(image => typeof image?.url === 'string' && /^(https?:\/\/|\/(?!\/))\S+$/.test(image.url.trim()));
    if (!image) return [];
    return [{
      id: project.id,
      title: getLocalizedContent(project, 'title', locale),
      description: getLocalizedContent(project, 'description', locale),
      categoryId: project.category,
      category: categoryLabel(project.category),
      image: image.url.trim(),
    }];
  });
}

export function categoryRepresentatives(projects) {
  const seen = new Set();
  return projects.filter(project => {
    if (!project.categoryId || seen.has(project.categoryId)) return false;
    seen.add(project.categoryId);
    return true;
  }).slice(0, 5);
}
