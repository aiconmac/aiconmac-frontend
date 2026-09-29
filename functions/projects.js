export function onRequestGet({request}) {
  const url = new URL(request.url);
  return Response.redirect(new URL(`/en/projects${url.search}`, url).toString(), 301);
}
