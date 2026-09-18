'use client';
import {useCallback, useEffect, useState} from 'react';
import {fetcher} from '@/lib/api';
import {loadCollection, MalformedResponse} from '@/lib/portfolio.mjs';

export default function useCollection(path) {
  const [state, setState] = useState({data: [], status: 'loading'});
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    let active = true;
    let lastRequest = 0;
    function refresh() {
      lastRequest = Date.now();
      setState(previous => ({...previous, status: 'loading'}));
      loadCollection(path, fetcher).then(data => {
        if (active) setState({data, status: 'success'});
      }).catch(error => {
        if (active) setState(previous => ({...previous, status: error instanceof MalformedResponse ? 'malformed' : 'error'}));
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
