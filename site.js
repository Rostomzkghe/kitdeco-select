/* V2.1 entry point. Preserve the validated V2 and apply the focused enhancement. */
(async () => {
  'use strict';
  document.documentElement.classList.add('v21-loading');
  try {
    await import('./site-v2.js');
    await import('./v21.js');
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
