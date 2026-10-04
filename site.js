/* Luxury Guest V2.1 — verified, same-origin client photographs.
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
