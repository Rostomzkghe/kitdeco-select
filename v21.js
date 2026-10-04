/* Luxury Guest V2.1: distinct guest/owner journeys and restrained motion.
   No analytics, storage, automated submission, booking or payment. */
(() => {
  'use strict';
  const D = window.LG;
  const page = document.body.dataset.page;
  const main = document.getElementById('contenu');
  if (!D || !main) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5"/></svg>';
  const photo = (key, eager = false) => {
    const item = D.images[key] || D.images.villa;
    const src = width => `https://images.unsplash.com/photo-${item[0]}?auto=format&fit=crop&w=${width}&q=85`;
    return `<img src="${src(1400)}" srcset="${src(600)} 600w, ${src(1000)} 1000w, ${src(1800)} 1800w" sizes="${eager ? '100vw' : '(max-width:680px) 94vw, 50vw'}" alt="${esc(item[1])}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''}>`;
  };
  const button = (text, href, ghost = false) => `<a class="btn${ghost ? ' ghost' : ''}" href="${esc(href)}">${text}${arrow}</a>`;
  const textLink = (text, href) => `<a class="text-link" href="${esc(href)}">${text}${arrow}</a>`;
  const guestUrl = 'contact.html?service=logements#demande';
  const ownerUrl = 'proprietaires.html#projet-proprietaire';
  const sectionHero = (owner = false) => `<section class="hero stay-hero ${owner ? 'owner-hero' : ''}"><div class="hero-visual">${photo(owner ? 'suite' : 'villa', true)}</div><div class="ambient" aria-hidden="true"></div><nav class="breadcrumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>/</span><a href="logements.html">Logements</a><span>/</span><span>${owner ? 'Propriétaires' : 'Séjours d’exception'}</span></nav><div class="wrap"><div class="hero-content"><div class="kicker">${owner ? 'L’espace propriétaires' : 'Logements · Séjours d’exception'}</div><h1>${owner ? 'Votre bien mérite<br><em>une autre attention.</em>' : 'L’adresse rare.<br><em>Le séjour à part.</em>'}</h1><p>${owner ? 'Conciergerie Airbnb et location courte durée : un accompagnement à définir autour de votre bien et de vos attentes.' : 'Une villa à l’abri des regards. Un appartement singulier. Un chalet pour se retrouver. Votre prochaine adresse se choisit avec attention.'}</p><div class="actions">${button(owner ? 'Parler de mon bien' : 'Trouver mon séjour', owner ? '#projet-proprietaire' : guestUrl)}${button(owner ? 'Notre accompagnement' : 'Explorer les séjours', owner ? '#accompagnement' : '#sejours', true)}</div></div></div><div class="hero-foot">${owner ? 'PROPRIÉTAIRES · ACCOMPAGNEMENT PERSONNALISÉ' : 'VILLAS · APPARTEMENTS · CHALETS · SÉLECTION SUR DEMANDE'}</div></section>`;
  const journeyNav = owner => `<nav class="journey-nav" aria-label="Les deux parcours Logements"><div class="wrap"><a href="logements.html" ${!owner ? 'aria-current="page"' : ''}><span>01</span> Séjours d’exception</a><a href="proprietaires.html" ${owner ? 'aria-current="page"' : ''}><span>02</span> Propriétaires · Confier mon bien</a></div></nav>`;

  document.querySelectorAll('.desktop-nav, .mobile-nav').forEach((nav, index) => {
    const existing = nav.querySelector('a[href="logements.html"]');
    if (!existing) return;
    const group = document.createElement('div');
    group.className = 'lodging-nav-group';
    const active = ['logements', 'proprietaires'].includes(page);
    group.innerHTML = `<div class="lodging-nav-top"><a href="logements.html" ${page === 'logements' ? 'aria-current="page"' : ''} class="${active ? 'nav-parent-active' : ''}">Logements</a><button type="button" class="subnav-toggle" aria-expanded="false" aria-controls="lodging-subnav-${index}" aria-label="Afficher les parcours Logements"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button></div><div class="lodging-subnav" id="lodging-subnav-${index}" hidden><a href="logements.html" ${page === 'logements' ? 'aria-current="page"' : ''}><small>Voyageurs</small>Séjours d’exception</a><a href="proprietaires.html" ${page === 'proprietaires' ? 'aria-current="page"' : ''}><small>Propriétaires</small>Confier mon bien</a></div>`;
    existing.replaceWith(group);
    const toggle = group.querySelector('button');
    const panel = group.querySelector('.lodging-subnav');
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); panel.hidden = true; };
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!opened)); panel.hidden = opened;
    });
    group.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
    document.addEventListener('click', e => { if (!group.contains(e.target)) close(); });
    group.addEventListener('focusout', () => setTimeout(() => { if (!group.contains(document.activeElement)) close(); }, 0));
    group.querySelectorAll('.lodging-subnav a').forEach(a => a.addEventListener('click', () => {
      close();
      document.getElementById('mobile-nav').classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    }));
  });
  const footerLinks = document.querySelector('.footer-links');
  if (footerLinks) footerLinks.insertAdjacentHTML('beforeend', '<a href="proprietaires.html">Espace propriétaires</a>');
  const version = document.querySelector('.footer-small > span');
  if (version) version.textContent = `© ${new Date().getFullYear()} Luxury Guest · Prévisualisation V2.1`;

  if (page === 'logements') {
    document.title = 'Séjours d’exception : villas, appartements & chalets | Luxury Guest';
    main.innerHTML = sectionHero() + journeyNav(false) + `<section class="section" id="sejours"><div class="wrap"><div class="section-head"><div><div class="kicker">Voyager autrement</div><h2>Un lieu à vous.<br><em>Le temps d’un séjour.</em></h2></div><p>Pas de catalogue impersonnel. Une recherche attentive, guidée par votre destination, votre rythme et ce qui compte pour vous.</p></div><div class="stay-collection">${[
      ['villa','01','Villas de caractère','De l’espace, de l’intimité, un horizon à partager.','Villa'],
      ['suite','02','Appartements singuliers','Une adresse choisie pour vivre la ville autrement.','Appartement'],
      ['courchevel','03','Chalets & refuges','L’esprit montagne, le confort et le plaisir de se retrouver.','Chalet']
    ].map(([image,number,title,description,type]) => `<article class="stay-card" data-reveal><a href="contact.html?service=logements&type=${encodeURIComponent(type)}#demande" aria-label="Préparer un séjour : ${esc(title)}"><div class="image-box">${photo(image)}</div><div class="stay-card-content"><span class="collection-number">${number} / LA SÉLECTION</span><h3>${title}</h3><p>${description}</p><span class="text-link">Imaginer mon séjour ${arrow}</span></div></a></article>`).join('')}</div><p class="mood-note">Photographies d’ambiance. Chaque lieu, ses équipements et ses conditions sont présentés dans votre proposition, selon les disponibilités.</p></div></section><section class="section editorial"><div class="wrap split"><div class="split-text" data-reveal><div class="kicker">Votre sélection privée</div><h2>Au-delà d’une recherche.<br><em>Une vraie rencontre.</em></h2><p>Vous ne cherchez pas simplement un logement. Vous cherchez l’atmosphère, l’emplacement et les détails qui donneront une autre dimension à votre séjour.</p><p>Décrivez-nous votre envie. Nous recherchons une adresse adaptée et vous présentons les possibilités, sans vous laisser seul face à une liste d’annonces.</p><div class="highlights"><span>Une recherche personnalisée</span><span>Des lieux choisis avec soin</span><span>Des détails confirmés avec vous</span></div><div class="actions">${button('Confier mes envies', guestUrl)}</div></div><div class="editorial-image" data-reveal><div class="image-box">${photo('chambre')}</div><div class="detail-tag"><span>Juste pour vous</span> L’esprit Luxury Guest</div></div></div></section><section class="section"><div class="wrap"><div class="section-head"><div><div class="kicker">Du premier échange au séjour</div><h2>Laissez la place<br><em>à l’essentiel.</em></h2></div></div><div class="process">${[
      ['01','Dites-nous où, et comment.','Destination, dates, voyageurs, budget et envies particulières.'],
      ['02','Découvrez votre proposition.','Un cadre, des photographies et des conditions précises à examiner avec votre concierge.'],
      ['03','Composez votre expérience.','Ajoutez, sur demande, un transfert, une table ou une sortie en mer.']
    ].map(([number,title,description]) => `<article class="process-item" data-reveal><div class="process-number">${number}</div><h3>${title}</h3><p>${description}</p></article>`).join('')}</div></div></section><section class="owner-invitation"><div class="wrap owner-invitation-inner"><div><div class="kicker">Vous êtes propriétaire ?</div><h2>Votre bien a aussi<br><em>son histoire à écrire.</em></h2><p>Un projet différent, un accompagnement dédié. Parlons de votre logement et de vos attentes de propriétaire.</p></div>${button('Confier mon bien','proprietaires.html',true)}</div></section><section class="section"><div class="wrap stay-end"><div class="kicker">Votre prochain départ</div><h2>Et si tout commençait<br><em>par votre envie ?</em></h2><div class="actions">${button('Trouver mon séjour',guestUrl)}${button('Nous appeler','tel:'+D.tel,true)}</div></div></section>`;
  }

  if (page === 'proprietaires') {
    document.title = 'Conciergerie Airbnb & location courte durée pour propriétaires | Luxury Guest';
    main.innerHTML = sectionHero(true) + journeyNav(true) + `<section class="section" id="accompagnement"><div class="wrap split"><div class="split-text" data-reveal><div class="kicker">Un accompagnement pour votre bien</div><h2>Votre logement.<br>Vos attentes.<br><em>Notre point de départ.</em></h2><p>Notre offre de conciergerie Airbnb s’adresse aux propriétaires qui souhaitent être accompagnés dans l’organisation de leur location courte durée.</p><p>Appartement, villa ou chalet : commençons par comprendre votre bien, son fonctionnement actuel et les missions que vous aimeriez déléguer. Le périmètre de l’accompagnement se définit ensemble.</p>${textLink('Présenter mon projet','#projet-proprietaire')}</div><div class="editorial-image" data-reveal><div class="image-box">${photo('villa')}</div><div class="detail-tag"><span>Votre bien, avec soin</span> Espace propriétaires</div></div></div></section><section class="section editorial"><div class="wrap"><div class="section-head"><div><div class="kicker">Un périmètre à construire ensemble</div><h2>Les bonnes attentions.<br><em>Au bon endroit.</em></h2></div><p>Les missions ci-dessous sont à étudier selon votre logement, sa localisation et vos besoins. Elles ne constituent pas un forfait déjà souscrit.</p></div><div class="process">${[
      ['01','Présentation du logement','Étudier la mise en valeur du bien, ses équipements et les informations utiles aux voyageurs.'],
      ['02','Organisation des séjours','Définir les besoins d’accueil, de communication et de suivi entre les séjours.'],
      ['03','Coordination sur place','Étudier les interventions nécessaires et leur organisation : préparation, entretien et suivi du logement.']
    ].map(([number,title,description]) => `<article class="process-item" data-reveal><div class="process-number">${number}</div><h3>${title}</h3><p>${description}</p></article>`).join('')}</div><p class="mood-note">Prestations, disponibilité locale, tarifs et conditions à confirmer dans une proposition personnalisée. Aucun revenu ni taux d’occupation n’est garanti.</p></div></section><section class="section" id="projet-proprietaire"><div class="wrap contact-layout"><aside class="contact-aside"><div class="kicker">Parlons de votre bien</div><h2>Un premier échange.<br><em>Un projet plus clair.</em></h2><p>Présentez votre logement et les missions que vous aimeriez nous confier. Ce formulaire est réservé aux propriétaires.</p><div class="contact-item"><small>Votre interlocuteur</small><a href="tel:${D.tel}">${D.phone}</a></div><div class="contact-item"><small>E-mail</small><a href="mailto:${D.email}">${D.email}</a></div><p class="mood-note">Aucun mandat n’est signé et aucune annonce n’est publiée via ce formulaire. Votre message sera transmis uniquement après votre validation dans l’application choisie.</p><p>${textLink('Vous cherchez plutôt un séjour ?','logements.html')}</p></aside><div class="request-card"><form id="owner-form" novalidate><div class="form-stage"><b>01 · Votre bien</b><span>02 · Récapitulatif</span></div><h2>Présentez-nous votre projet.</h2><p class="form-disclaimer">Les champs marqués d’un * sont nécessaires à la préparation de votre demande.</p><fieldset><legend>Le logement</legend><div class="form-grid">${input('owner-ville','Ville ou secteur *','text','required maxlength="100" placeholder="Ex. : Paris 16e, Cannes…"',true)}${select('owner-type','Type de bien *',['Appartement','Villa / maison','Chalet','Autre'])}${input('owner-capacite','Capacité d’accueil *','number','required min="1" max="100" inputmode="numeric" placeholder="Nombre de voyageurs"')}${input('owner-surface','Surface en m² (facultatif)','number','min="1" max="10000" placeholder="Ex. : 85"')}${select('owner-situation','Situation actuelle *',['Pas encore proposé à la location','Déjà en location courte durée','Résidence utilisée ponctuellement','Autre situation'])}</div></fieldset><fieldset><legend>Votre besoin</legend><div class="form-grid">${select('owner-besoin','Accompagnement souhaité *',['Un accompagnement global à définir','Préparation et présentation du bien','Accueil et suivi des séjours','Coordination et entretien','Je souhaite en discuter'],true)}<div class="field full"><label for="owner-message">Votre projet en quelques mots</label><textarea id="owner-message" maxlength="1200" rows="4" placeholder="Votre organisation actuelle, les missions à déléguer, vos disponibilités…"></textarea><small>N’indiquez ni données bancaires ni documents d’identité.</small></div></div></fieldset><fieldset><legend>Vos coordonnées</legend><div class="form-grid">${input('owner-nom','Prénom et nom *','text','required autocomplete="name" maxlength="80"',true)}${input('owner-phone','Téléphone *','tel','required autocomplete="tel" maxlength="30" placeholder="+33 6 00 00 00 00"')}${input('owner-email','E-mail (facultatif)','email','autocomplete="email" maxlength="150" placeholder="vous@exemple.fr"')}</div></fieldset><div class="form-footer"><label class="form-checkbox"><input id="owner-consent" type="checkbox" required><span>J’ai lu la <a href="confidentialite.html" target="_blank" rel="noopener">notice de confidentialité</a> et je choisis de transmettre ces informations lorsque je valide l’envoi dans WhatsApp ou ma messagerie. *</span></label><p id="owner-error" class="form-error" role="alert" hidden></p><button class="btn" type="submit">Préparer mon échange ${arrow}</button><p class="form-disclaimer">Aucun envoi automatique. Vous vérifiez votre message avant de choisir le canal de transmission.</p></div></form><section class="request-summary" id="owner-summary" hidden><div class="form-stage"><span>01 · Votre bien</span><b>02 · Récapitulatif</b></div><h2 id="owner-summary-title" tabindex="-1">Votre projet est prêt.</h2><p>Vérifiez votre récapitulatif. <strong>Aucun message n’a encore été envoyé.</strong></p><div class="summary-text" id="owner-summary-text"></div><div class="summary-actions"><a class="btn" id="owner-whatsapp" target="_blank" rel="noopener noreferrer">Ouvrir WhatsApp ${arrow}</a><a class="btn ghost" id="owner-mail">Ouvrir ma messagerie ${arrow}</a></div><p class="form-disclaimer">Validez l’envoi dans l’application choisie. Ce premier échange n’engage aucune prestation.</p><div class="summary-actions"><button class="summary-edit" type="button" id="owner-edit">← Modifier mon projet</button><button class="summary-edit" type="button" id="owner-copy">Copier le récapitulatif</button></div><p id="owner-copy-status" class="form-disclaimer" role="status"></p></section></div></div></section><section class="section editorial"><div class="wrap faq-layout"><div><div class="kicker">Pour les propriétaires</div><h2>Avant de<br><em>nous confier votre projet.</em></h2></div><div class="faq-list"><details><summary>Ce formulaire sert-il à réserver un logement ?</summary><p>Non. Il permet à un propriétaire de présenter son bien et son besoin d’accompagnement. Pour rechercher un hébergement, rendez-vous dans <a href="logements.html">Séjours d’exception</a>.</p></details><details><summary>Quelles missions peut-on vous confier ?</summary><p>Les missions sont définies après un premier échange, en fonction du bien, de sa localisation et des possibilités sur place. La proposition précise le périmètre retenu.</p></details><details><summary>Quels sont les tarifs de l’accompagnement ?</summary><p>Ils dépendent des missions convenues. Aucune commission, estimation de revenus ou formule tarifaire n’est appliquée automatiquement sur ce site.</p></details></div></div></section>`;
    setupOwnerForm();
  }
  function input(id,label,type,attributes='',wide=false) { return `<div class="field${wide?' full':''}"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attributes}></div>`; }
  function select(id,label,options,wide=false) { return `<div class="field${wide?' full':''}"><label for="${id}">${label}</label><select id="${id}" name="${id}" required><option value="">Choisir</option>${options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`; }
  function isMotionOff() { return document.documentElement.classList.contains('motion-off') || matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function scrollToElement(element) { element.scrollIntoView({behavior:isMotionOff()?'instant':'smooth',block:'start'}); }
  function setupOwnerForm() {
    const form=document.getElementById('owner-form');
    const $=id=>document.getElementById(id);
    const val=id=>$(id).value.trim();
    let message='';
    ['owner-nom','owner-phone','owner-ville'].forEach(id=>$(id).addEventListener('input',()=>$(id).setCustomValidity('')));
    form.addEventListener('submit',e=>{
      e.preventDefault();
      $('owner-error').hidden=true;
      const phone=val('owner-phone');
      const digits=phone.replace(/\D/g,'').length;
      $('owner-phone').setCustomValidity(!/^[+\d\s().-]+$/.test(phone)||digits<8||digits>15?'Indiquez un numéro de téléphone valide.':'');
      $('owner-nom').setCustomValidity(val('owner-nom').length<2?'Indiquez votre prénom et votre nom.':'');
      $('owner-ville').setCustomValidity(!val('owner-ville')?'Précisez la ville ou le secteur.':'');
      if(!form.checkValidity()) { form.reportValidity();$('owner-error').hidden=false;$('owner-error').textContent='Vérifiez les champs signalés avant de préparer votre échange.';return; }
      const lines=['Bonjour Luxury Guest,','Je suis propriétaire et souhaite échanger sur l’accompagnement de mon bien.','',`Localisation : ${val('owner-ville')}`,`Type de bien : ${val('owner-type')}`,`Capacité d’accueil : ${val('owner-capacite')} personnes`];
      if(val('owner-surface')) lines.push(`Surface : ${val('owner-surface')} m²`);
      lines.push(`Situation : ${val('owner-situation')}`,`Besoin : ${val('owner-besoin')}`);
      if(val('owner-message')) lines.push('','Mon projet :',val('owner-message'));
      lines.push('',`Nom : ${val('owner-nom')}`,`Téléphone : ${phone}`);
      if(val('owner-email')) lines.push(`E-mail : ${val('owner-email')}`);
      lines.push('','Merci de me préciser les possibilités, le périmètre et les conditions de votre accompagnement.');
      message=lines.join('\n');
      $('owner-summary-text').textContent=message;
      $('owner-whatsapp').href=`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(message)}`;
      $('owner-mail').href=`mailto:${D.email}?subject=${encodeURIComponent('Projet propriétaire — Luxury Guest')}&body=${encodeURIComponent(message)}`;
      form.hidden=true;$('owner-summary').hidden=false;$('owner-summary-title').focus({preventScroll:true});scrollToElement($('owner-summary'));
    });
    $('owner-edit').addEventListener('click',()=>{$('owner-summary').hidden=true;form.hidden=false;$('owner-ville').focus({preventScroll:true});scrollToElement(form);});
    $('owner-copy').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText(message);$('owner-copy-status').textContent='Récapitulatif copié.';}
      catch {const range=document.createRange();range.selectNodeContents($('owner-summary-text'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);$('owner-copy-status').textContent='Texte sélectionné : utilisez Copier dans votre navigateur.';}
    });
  }

  if(page==='contact') {
    const guestForm=document.getElementById('request-form');
    const service=document.getElementById('service');
    const extra=document.createElement('fieldset');
    extra.id='stay-preferences';
    extra.innerHTML='<legend>Le lieu que vous imaginez</legend><div class="form-grid"><div class="field"><label for="stay-type">Type de logement souhaité</label><select id="stay-type" name="stay-type"><option value="">Ouvert à vos propositions</option><option>Villa</option><option>Appartement</option><option>Chalet</option><option>Autre</option></select></div><div class="field"><label for="stay-atmosphere">Les détails qui comptent</label><input id="stay-atmosphere" name="stay-atmosphere" maxlength="180" placeholder="Piscine, vue mer, intimité, emplacement…"></div></div>';
    document.getElementById('transport-details').after(extra);
    const requested=new URLSearchParams(location.search).get('type');
    if(requested&&[...document.getElementById('stay-type').options].some(o=>o.value===requested))document.getElementById('stay-type').value=requested;
    const update=()=>{const isStay=service.value==='logements';extra.hidden=!isStay;extra.disabled=!isStay;guestForm.querySelector('h2').textContent=isStay?'Imaginons votre séjour.':'Imaginons votre expérience.';};
    update();service.addEventListener('change',update);
    guestForm.addEventListener('submit',()=>{
      if(service.value!=='logements'||!guestForm.hidden)return;
      const summary=document.getElementById('summary-text');
      const type=document.getElementById('stay-type').value;
      const wishes=document.getElementById('stay-atmosphere').value.trim();
      const additions=[type?`Type de logement : ${type}`:'',wishes?`Détails du logement : ${wishes}`:''].filter(Boolean);
      if(!additions.length)return;
      const message=summary.textContent.replace('\nNom :','\n'+additions.join('\n')+'\n\nNom :');
      summary.textContent=message;
      document.getElementById('send-whatsapp').href=`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(message)}`;
      document.getElementById('send-email').href=`mailto:${D.email}?subject=${encodeURIComponent('Demande de séjour — Luxury Guest')}&body=${encodeURIComponent(message)}`;
    });
    document.getElementById('copy-request').addEventListener('click',async e=>{
      if(service.value!=='logements')return;
      e.stopImmediatePropagation();
      const node=document.getElementById('summary-text');
      try {await navigator.clipboard.writeText(node.textContent);document.getElementById('copy-status').textContent='Récapitulatif copié.';}
      catch {const range=document.createRange();range.selectNodeContents(node);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);document.getElementById('copy-status').textContent='Texte sélectionné : utilisez Copier dans votre navigateur.';}
    },true);
  }

  // Client photography is now rendered from verified local assets.
  document.querySelectorAll('.service-card').forEach(card=>{
    if(card.querySelector('a[href="activites.html"]'))card.querySelector('.card-content > p').textContent='Sorties en mer, baignades et expériences privées. Des moments à vivre, vraiment.';
  });
  if(page==='activites') {
    const heroText=main.querySelector('.hero-content > p');
    heroText.textContent='Sorties en bateau, baignades en mer et escapades privées : le plaisir de vivre un moment ensemble.';
    const highlight=main.querySelector('.highlights span');
    if(highlight)highlight.innerHTML='Sorties en bateau';
    const card=main.querySelector('.offer-card');
    if(card){card.querySelector('h3').textContent='Une parenthèse en mer';card.querySelector('p').textContent='Petit bateau, baignade et criques à découvrir, en famille ou entre amis. Un programme adapté aux participants et aux conditions du jour.';}
  }
  document.querySelectorAll('.hero h1').forEach(title=>{
    title.innerHTML=title.innerHTML.split(/<br\s*\/?\s*>/i).map((line,index)=>`<span class="title-row"><span style="--line-delay:${index*100}ms">${line}</span></span>`).join('');
  });
  const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.querySelector('.site-header').append(progress);
  const hero=main.querySelector('.hero');
  const visual=hero?.querySelector('.hero-visual');
  let scheduled=false;
  const onScroll=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{
    scheduled=false;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
    if(visual)visual.style.setProperty('--parallax',!isMotionOff()&&matchMedia('(min-width:1001px)').matches&&scrollY<hero.offsetHeight?`${Math.min(55,scrollY*.11)}px`:'0px');
  });};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
  document.querySelector('.motion-toggle')?.addEventListener('click',()=>{if(visual)visual.style.setProperty('--parallax','0px');});
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach((element,index)=>{
      element.style.setProperty('--reveal-delay',`${(index%3)*65}ms`);
      if(element.getBoundingClientRect().top>innerHeight&&!isMotionOff()){element.classList.add('is-observed');observer.observe(element);}else element.classList.add('is-visible');
    });
  }
  if(matchMedia('(hover:hover) and (pointer:fine)').matches)document.querySelectorAll('.service-card,.stay-card,.owner-invitation-inner').forEach(card=>{
    let raf=0;
    card.addEventListener('pointermove',event=>{
      if(isMotionOff()||raf)return;
      raf=requestAnimationFrame(()=>{raf=0;const r=card.getBoundingClientRect();card.style.setProperty('--light-x',`${event.clientX-r.left}px`);card.style.setProperty('--light-y',`${event.clientY-r.top}px`);});
    },{passive:true});
  });
  document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{
    const text=item.querySelector('p');
    if(item.open&&!isMotionOff()&&text?.animate)text.animate([{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:230,easing:'ease-out'});
  }));
  if(location.hash) {
    const anchorId=decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(()=>document.getElementById(anchorId)?.scrollIntoView({behavior:'instant',block:'start'}));
  }
  document.documentElement.dataset.v21='ready';
})();
