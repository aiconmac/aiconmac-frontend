'use client';
import {useEffect} from 'react';
export default function EscapeTo({href}) {
  useEffect(() => {
    const onKey = event => { if (event.key === 'Escape' && !event.isComposing && !document.querySelector('dialog[open], details[open]')) window.location.assign(href); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [href]);
  return null;
}
