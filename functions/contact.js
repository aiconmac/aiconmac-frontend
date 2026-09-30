import {secure} from './_security.js';
export function onRequestGet({request}) {
  const url = new URL(request.url);
  return secure(Response.redirect(new URL(`/en/contact${url.search}`, url).toString(), 301));
}
