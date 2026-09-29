'use client';
import {useCallback, useEffect, useState} from 'react';
import {fetcher} from '@/lib/api';
import {dropPending, loadCollection, MalformedResponse} from '@/lib/portfolio.mjs';

export default function useCollection(path) {
  const [state, setState] = useState({data: [], status: 'loading', kind: null});
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => { dropPending(path); setAttempt(value => value + 1); }, [path]);
  useEffect(() => {
    let active = true;
    let lastRequest = 0;
    function refresh() {
      lastRequest = Date.now();
      setState(previous => ({...previous, status: 'loading'}));
      loadCollection(path, fetcher).then(data => {
        if (active) setState({data, status: 'success', kind: null});
      }).catch(error => {
        if (active) setState(previous => ({...previous, status: 'error', kind: error instanceof MalformedResponse ? 'malformed' : error.kind || 'http'}));
      });
    }
    refresh();
    function visible() {
      if (document.visibilityState === 'visible' && Date.now() - lastRequest >= 30000) refresh();
    }
    document.addEventListener('visibilitychange', visible);
    return () => { active = false; document.removeEventListener('visibilitychange', visible); };
  }, [path, attempt]);
  return {...state, retry};
}
