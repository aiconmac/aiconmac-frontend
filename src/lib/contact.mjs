export const DRAWING_LIMITS = {files: 5, bytes: 10 * 1024 * 1024, accept: '.pdf,.dwg,.dxf,.jpg,.jpeg,.png'};
export function cleanDrawings(files) {
  const real = [...files].filter(file => file && file.size > 0 && file.name);
  if (real.length > DRAWING_LIMITS.files || real.some(file => file.size > DRAWING_LIMITS.bytes)) return null;
  return real;
}
