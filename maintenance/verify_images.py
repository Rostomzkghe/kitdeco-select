"""Check the actual image decoding and UI on a local server or public preview.
No form is submitted and no message is sent. ImageKit and Jeanneau are blocked
in the browser deliberately to ensure the repaired images are self-hosted.
"""
import argparse
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='')
parser.add_argument('--out', default='image-verification/local')
args = parser.parse_args()
out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
server = None
if args.url:
    base = args.url.rstrip('/') + '/'
else:
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    server = ThreadingHTTPServer(('127.0.0.1', 8765), partial(Quiet, directory=str(Path.cwd())))
    Thread(target=server.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:8765/'
reports = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for label, viewport in [('desktop', {'width': 1440, 'height': 1000}), ('mobile', {'width': 390, 'height': 844})]:
            context = browser.new_context(viewport=viewport, reduced_motion='reduce')
            requests = []
            context.on('request', lambda req: requests.append(req.url))
            context.route('**/ik.imagekit.io/**', lambda route: route.abort())
            context.route('**/app.jeanneau.com/**', lambda route: route.abort())
            page = context.new_page()
            page.set_default_timeout(25000)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            try:
                for filename in ['index.html', 'destinations.html', 'activites.html']:
                    response = page.goto(base + filename, wait_until='domcontentloaded', timeout=60000)
                    assert response.status == 200, f'{filename}: HTTP {response.status}'
                    page.wait_for_selector('html[data-client-images="ready"]', state='attached')
                    selector = '.service-card:has(a[href="activites.html"]) img' if filename == 'index.html' else '.hero-visual img'
                    target = page.locator(selector).first
                    target.scroll_into_view_if_needed()
                    target.evaluate('(img) => img.decode()')
                    info = target.evaluate('(img) => ({src: img.currentSrc, width: img.naturalWidth, height: img.naturalHeight, complete: img.complete, alt: img.alt})')
                    expected = 'destinations-aube' if filename == 'destinations.html' else 'bateau-en-famille'
                    assert expected in info['src'] and '/assets/photos/' in info['src'], info
                    assert info['width'] > 0 and info['height'] > 0 and info['complete'], info
                    assert not errors, errors
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Horizontal overflow'
                    reports.append({'viewport': label, 'page': filename, 'passed': True, **info})
                    if filename == 'index.html':
                        page.locator('.service-card:has(a[href="activites.html"])').screenshot(path=str(out / f'activites-vip-{label}.png'))
                    if filename == 'destinations.html':
                        page.evaluate('scrollTo(0, 0)')
                        page.screenshot(path=str(out / f'destinations-{label}.png'))
                    if filename == 'activites.html':
                        page.locator('[data-photo="yacht"]').click()
                        gallery = page.locator('.lightbox img')
                        gallery.evaluate('(img) => img.decode()')
                        assert 'bateau-en-famille' in gallery.get_attribute('src')
                        assert gallery.evaluate('(img) => img.naturalWidth > 0')
                        reports.append({'viewport': label, 'page': filename, 'gallery': True, 'passed': True})
                assert not any('ik.imagekit.io' in url or 'jeanneau.com' in url for url in requests), 'Obsolete external image request'
            except Exception:
                page.screenshot(path=str(out / f'failure-{label}.png'))
                (out / 'errors.json').write_text(json.dumps({'page_errors': errors, 'requests': requests}, indent=2))
                raise
            finally:
                context.close()
        browser.close()
finally:
    if server:
        server.shutdown()
    (out / 'results.json').write_text(json.dumps({'base': base, 'checks': reports}, ensure_ascii=False, indent=2))
print(json.dumps({'base': base, 'passed_checks': len(reports), 'checks': reports}, ensure_ascii=False, indent=2))
