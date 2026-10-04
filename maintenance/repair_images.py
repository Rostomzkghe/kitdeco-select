"""Repair only the two Luxury Guest photographs on the preview branch.
Retrieve client originals without ImageKit processing, then resize locally.
Usage: python maintenance/repair_images.py [site directory] [--offline]
"""
import io
import json
import sys
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ENTRYPOINT = r'''/* Luxury Guest V2.1 — verified, same-origin client photographs.
   The originals are optimized at build time, not by the visitor's browser. */
(async () => {
  'use strict';
  document.documentElement.classList.add('v21-loading');
  try {
    const D = window.LG;
    if (!D || !D.images) throw new Error('Contenu du site indisponible.');
    D.clientImages = {
      yacht: {
        src: 'assets/photos/bateau-en-famille-1200.webp',
        small: 'assets/photos/bateau-en-famille-600.webp',
        smallWidth: 600, width: 1200, height: 1200,
        alt: 'Une famille partage un moment à bord d’un bateau au coucher du soleil',
        className: 'family-boat-image'
      },
      'destinations-cover': {
        src: 'assets/photos/destinations-aube-1920.webp',
        small: 'assets/photos/destinations-aube-960.webp',
        smallWidth: 960, width: 1920, height: 1281,
        alt: 'Palmiers, jardin et bassin éclairé à l’aube à San Diego',
        className: 'destinations-cover-image'
      }
    };
    // Register before rendering: no old yacht, Jeanneau logo or failing CDN URL.
    for (const [key, image] of Object.entries(D.clientImages)) {
      D.images[key] = [image.src, image.alt, 'Visuel fourni pour Luxury Guest', ''];
    }
    await import('./site-v2.js');
    await import('./v21.js');
    if (document.body.dataset.page === 'credits') {
      const content = document.querySelector('.content-narrow');
      const intro = content?.querySelector(':scope > p');
      if (intro) intro.textContent = 'Les photographies du bateau en famille et des palmiers à l’aube sont les visuels fournis pour Luxury Guest, optimisés et hébergés avec le site. Les autres images d’ambiance conservent leurs sources indiquées ci-dessous.';
      const headings = [...(content?.querySelectorAll('h2') || [])];
      const licence = headings.find(heading => heading.textContent === 'Licence');
      if (licence?.nextElementSibling) licence.nextElementSibling.textContent = 'Les autres photographies proviennent de la collection Unsplash. Les titulaires doivent valider les droits des visuels fournis pour la marque avant son lancement commercial.';
    }
    document.documentElement.dataset.clientImages = 'ready';
  } catch (error) {
    console.error('Luxury Guest: chargement incomplet', error);
    const notice = document.createElement('p');
    notice.className = 'load-notice';
    notice.setAttribute('role', 'status');
    notice.textContent = 'Le chargement est incomplet. Actualisez la page ou contactez la conciergerie au +33 7 68 27 57 69.';
    document.body.append(notice);
  } finally {
    document.documentElement.classList.remove('v21-loading');
  }
})();
'''

URL_FUNCTION = r'''  const url = (k, w=1400) => {
    const client = D.clientImages?.[k];
    if (client) return w <= client.smallWidth ? client.small : client.src;
    return `https://images.unsplash.com/photo-${(D.images[k] || D.images.hero)[0]}?auto=format&fit=crop&w=${w}&q=85`;
  };'''
PHOTO_FUNCTION = r'''  const photo = (k, cls='', eager=false) => {
    const i = D.images[k] || D.images.hero;
    const client = D.clientImages?.[k];
    const sizes = eager ? '100vw' : '(max-width:680px) 94vw, (max-width:1000px) 48vw, 40vw';
    if (client) return `<img class="${esc([cls,client.className].filter(Boolean).join(' '))}" data-client-image="${esc(k)}" src="${client.src}" srcset="${client.small} ${client.smallWidth}w, ${client.src} ${client.width}w" sizes="${sizes}" width="${client.width}" height="${client.height}" alt="${esc(client.alt)}" loading="${eager?'eager':'lazy'}" decoding="async" ${eager?'fetchpriority="high"':''}>`;
    return `<img class="${cls}" src="${url(k,1400)}" srcset="${url(k,600)} 600w, ${url(k,1000)} 1000w, ${url(k,1800)} 1800w" sizes="${sizes}" alt="${esc(i[1])}" loading="${eager?'eager':'lazy'}" decoding="async" ${eager?'fetchpriority="high"':''}>`;
  };'''


def patch(root: Path) -> None:
    renderer = root / 'site-v2.js'
    text = renderer.read_text()
    if 'const client = D.clientImages?.[k];' not in text:
        lines = text.splitlines()
        assert sum(line.startswith('  const url = ') for line in lines) == 1
        assert sum(line.startswith('  const photo = ') for line in lines) == 1
        text = '\n'.join(URL_FUNCTION if line.startswith('  const url = ') else PHOTO_FUNCTION if line.startswith('  const photo = ') else line for line in lines) + '\n'
    old = "function destinationsPage(){return hero('yacht',"
    new = "function destinationsPage(){return hero('destinations-cover',"
    assert text.count(old) == 1 or text.count(new) == 1, 'Unexpected Destinations renderer'
    text = text.replace(old, new, 1)
    renderer.write_text(text)
    enhancement = root / 'v21.js'
    text = enhancement.read_text()
    start_marker = '  // Candidate photograph:'
    if start_marker in text:
        start = text.index(start_marker)
        end = text.index("  document.querySelectorAll('.service-card')", start)
        text = text[:start] + '  // Client photography is now rendered from verified local assets.\n' + text[end:]
    start_marker = '  document.querySelectorAll(\'[data-photo="yacht"]\')'
    if start_marker in text:
        start = text.index(start_marker)
        end = text.index("  document.querySelectorAll('.hero h1')", start)
        text = text[:start] + text[end:]
    assert 'jeanneau.com' not in text, 'Obsolete source remains'
    enhancement.write_text(text)
    (root / 'site.js').write_text(ENTRYPOINT)


def main() -> None:
    root = Path(next((arg for arg in sys.argv[1:] if not arg.startswith('--')), '.'))
    offline = '--offline' in sys.argv
    target = root / 'assets/photos'
    target.mkdir(parents=True, exist_ok=True)
    sources = {
        'bateau-en-famille': ('https://ik.imagekit.io/Fibonacci/bateau%20en%20famille.jpg?tr=orig-true', [600, 1200]),
        'destinations-aube': ('https://ik.imagekit.io/Fibonacci/san-diego-dawn-early-morning-with-palm-tree-silhouette.jpg?tr=orig-true', [960, 1920])
    }
    for name, (source, widths) in sources.items():
        if not offline:
            request = urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0 LuxuryGuestImageRepair/1.0'})
            with urllib.request.urlopen(request, timeout=45) as response:
                assert response.status == 200 and response.headers.get('Content-Type', '').startswith('image/'), 'Source is not an image'
                raw = response.read(30_000_000)
            image = Image.open(io.BytesIO(raw))
            image.load()
            image = ImageOps.exif_transpose(image).convert('RGB')
            for width in widths:
                resized = image.copy()
                resized.thumbnail((width, width), Image.Resampling.LANCZOS)
                resized.save(target / f'{name}-{width}.webp', 'WEBP', quality=84, method=6)
        for width in widths:
            asset = target / f'{name}-{width}.webp'
            with Image.open(asset) as decoded:
                decoded.load()
                assert decoded.width == width
                print(json.dumps({'asset': str(asset), 'size': decoded.size, 'bytes': asset.stat().st_size}))
    patch(root)

if __name__ == '__main__':
    main()
