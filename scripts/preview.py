"""Serve the static export locally, including extensionless locale routes.

After changing API data (e.g. swapping fixtures), `rm -rf .next/cache/fetch-cache` before `npm run build`: build fetches use force-cache and otherwise reuse the old responses.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError

ROOT = Path(__file__).resolve().parents[1] / 'out'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        # Only public collections are proxied, never project-by-ID or admin endpoints.
        if self.path in ('/api/projects?isPublished=true', '/api/clients', '/api/categories'):
            try:
                with urlopen('https://api.aiconmac.com' + self.path, timeout=20) as response:
                    body = response.read()
                self.send_response(200)
            except URLError:
                body = b'{"message":"Public API unavailable. Retry shortly."}'
                self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        self.send_error(405, 'Local preview does not send submissions. Contracts are tested with intercepted requests.')

    def log_message(self, *args):
        pass

    def translate_path(self, path):
        resolved = super().translate_path(path)
        if Path(resolved.rstrip('/') + '.html').is_file():
            return resolved.rstrip('/') + '.html'
        return resolved

ThreadingHTTPServer.request_queue_size = 128

if __name__ == '__main__':
    print('Static preview: http://localhost:4173/en', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4173), Handler).serve_forever()
