'use client';

import { useState } from 'react';

export default function ProjectImage({ src, alt = '', fallback, className = '', ...props }) {
  const [failedSource, setFailedSource] = useState(null);
  if (!src || failedSource === src) {
    return <div role="img" aria-label={fallback} className={`flex items-center justify-center bg-neutral-200 text-neutral-600 text-sm p-6 ${className}`}>{fallback}</div>;
  }
  // Native images support remote project URLs without substituting unrelated photos.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} src={src} alt={alt} className={className} onError={() => setFailedSource(src)} />;
}
