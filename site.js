/* V2.1 entry point. Preserve the validated layout and apply client-supplied images. */
(async () => {
  'use strict';
  const clientImages = {
    boat: {
      src: 'https://ik.imagekit.io/Fibonacci/bateau%20en%20famille.jpg',
      alt: 'Sortie en bateau et baignade en mer en famille'
    },
    destinations: {
      src: 'https://ik.imagekit.io/Fibonacci/san-diego-dawn-early-morning-with-palm-tree-silhouette.jpg',
      alt: 'Silhouettes de palmiers à l’aube à San Diego'
    }
  };

  function setClientImage(img, image) {
    if (!img) return;
    // Remove the previous responsive sources so they cannot override the new URL.
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.src = image.src;
    img.alt = image.alt;
    img.decoding = 'async';
    img.dataset.clientImage = 'true';
  }

  function applyClientImages() {
    const page = document.body.dataset.page;
    // Update the activity card and the same photograph wherever the V2.1 uses it.
    document.querySelectorAll('img.family-boat-image, .service-card a[href="activites.html"] img, [data-photo="yacht"] img').forEach(img => {
      setClientImage(img, clientImages.boat);
    });

    // Only the Destinations overview hero uses the new dawn photograph.
    if (page === 'destinations') {
      const heroImage = document.querySelector('#contenu .hero-visual img');
      setClientImage(heroImage, clientImages.destinations);
      if (heroImage) {
        heroImage.classList.remove('family-boat-image');
        heroImage.loading = 'eager';
        heroImage.setAttribute('fetchpriority', 'high');
      }
    }

    // Registered after the existing gallery handlers to preserve the same source on zoom.
    document.querySelectorAll('[data-photo="yacht"]').forEach(button => {
      button.addEventListener('click', () => {
        const dialog = document.querySelector('.lightbox');
        if (!dialog) return;
        setClientImage(dialog.querySelector('img'), clientImages.boat);
        const caption = dialog.querySelector('figcaption');
        if (caption) caption.textContent = 'Sortie en mer en famille · Photographie d’ambiance fournie pour Luxury Guest.';
      });
    });

    // Remove the obsolete Jeanneau attribution for the replaced candidate image.
    if (page === 'credits') {
      document.querySelectorAll('.info-callout a[href*="jeanneau.com"]').forEach(link => {
        const notice = link.closest('.info-callout');
        if (notice) notice.textContent = 'Les visuels « Activités VIP » et du hero « Destinations » sont fournis par le client et hébergés sur ImageKit. Les autres photographies conservent leurs crédits ci-dessous.';
      });
      const grid = document.querySelector('.credits-grid');
      const previousCredit = grid?.querySelector('a[href*="FWJinfDsIn8"]')?.closest('.credit');
      if (previousCredit) previousCredit.remove();
      if (grid) {
        [clientImages.boat, clientImages.destinations].forEach(image => {
          const credit = document.createElement('div');
          credit.className = 'credit';
          const description = document.createElement('p');
          description.textContent = image.alt;
          const source = document.createElement('p');
          source.textContent = 'Visuel fourni par le client · Hébergement ImageKit';
          const link = document.createElement('a');
          link.href = image.src;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Voir le visuel ↗';
          credit.append(description, source, link);
          grid.append(credit);
        });
      }
    }
    document.documentElement.dataset.clientImages = 'ready';
  }

  document.documentElement.classList.add('v21-loading');
  try {
    await import('./site-v2.js');
    await import('./v21.js');
    // Apply before revealing the page: no old logo is displayed between renders.
    applyClientImages();
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
