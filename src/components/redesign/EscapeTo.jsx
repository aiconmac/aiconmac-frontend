'use client';
import {useEffect} from 'react';
export default function EscapeTo({href}) {
  useEffect(() => {
    const onKey = event => { if (event.key === 'Escape' && !document.querySelector('dialog[open]')) window.location.assign(href); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [href]);
  return null;
}
