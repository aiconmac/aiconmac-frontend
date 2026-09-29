export function mergeMessages(base, override) {
  const merged = {...base};
  for (const [key, value] of Object.entries(override || {})) {
    const nested = value && typeof value === 'object' && !Array.isArray(value) && base?.[key] && typeof base[key] === 'object' && !Array.isArray(base[key]);
    merged[key] = nested ? mergeMessages(base[key], value) : value;
  }
  return merged;
}
