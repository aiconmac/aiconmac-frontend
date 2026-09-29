import {normalizeCategories, normalizeProjects} from './portfolio.mjs';
const configured = process.env.NEXT_PUBLIC_API_BASE_URL || '';
export const BUILD_API = /^https?:\/\//.test(configured) ? configured : 'https://api.aiconmac.com/api';
async function load(path) {
  const response = await fetch(`${BUILD_API}${path}`, {cache: 'force-cache'});
  if (!response.ok) throw new Error(`Build fetch ${path} failed with ${response.status}`);
  return response.json();
}
export const getProjects = () => load('/projects?isPublished=true').then(normalizeProjects);
export const getCategories = () => load('/categories').then(normalizeCategories);
