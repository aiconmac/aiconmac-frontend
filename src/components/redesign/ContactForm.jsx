'use client';
import {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {poster} from '@/lib/api';
import {localized} from '@/lib/portfolio.mjs';
import {cleanDrawings, DRAWING_LIMITS} from '@/lib/contact.mjs';
export default function ContactForm({categories, projects}) {
  const t = useTranslations('Design');
  const locale = useLocale();
  const form = useRef(null);
  const status = useRef(null);
  const [state, setState] = useState({phase: 'idle'});
  useEffect(() => { if (state.phase === 'success' || state.phase === 'error') status.current?.focus(); }, [state]);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('project');
    if (!Object.hasOwn(projects, slug)) return;
    const project = projects[slug];
    form.current.message.value = `${t('form.about', {title: project.title})}\n\n`;
    if (project.category) form.current.projectType.value = project.category;
  }, [projects, t]);
  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const drawings = cleanDrawings(data.getAll('drawings'));
    if (!drawings) { setState({phase: 'error', message: t('errors.files')}); return; }
    data.delete('drawings');
    drawings.forEach(file => data.append('drawings', file));
    setState({phase: 'pending'});
    try {
      await poster('/contact', data, drawings.length ? {timeout: 120000} : undefined);
      form.current.reset();
      setState({phase: 'success'});
    } catch (error) {
      setState({phase: 'error', message: t(`errors.${error.kind || 'http'}`)});
    }
  }
  const text = state.phase === 'pending' ? t('form.sending') : state.phase === 'success' ? t('form.sent') : state.message || '';
  return <form id="enquire-form" ref={form} className="enquire-form" onSubmit={submit}>
    <label>{t('form.name')}<input name="fullName" required autoComplete="name" /></label>
    <label>{t('form.email')}<input name="email" type="email" required autoComplete="email" dir="ltr" /></label>
    <label>{t('form.phone')}<input name="phone" type="tel" autoComplete="tel" dir="ltr" /></label>
    <label>{t('form.category')}<select name="projectType" required defaultValue=""><option value="" disabled>{t('form.choose')}</option>{categories.map(category => <option key={category.slug} value={category.slug} {...localized(category, 'name', locale)} />)}</select></label>
    <label>{t('form.message')}<textarea name="message" dir="auto" required minLength={10} rows={6} /></label>
    <label>{t('form.drawings')}<input name="drawings" type="file" multiple accept={DRAWING_LIMITS.accept} /><span className="hint">{t('form.drawingsHint')}</span></label>
    <p ref={status} tabIndex={-1} role="status" aria-live="polite" className="form-status">{text}</p>
    <button className="design-button orange" disabled={state.phase === 'pending'}>{t('form.submit')} →</button>
  </form>;
}
