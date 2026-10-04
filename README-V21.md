# Luxury Guest V2.1

La V2 est conservée ; les évolutions sont dans v21.js et v21.css.

- Séjours d’exception = voyageurs. Propriétaires = parcours séparé sous Logements.
- Mot-clé conciergerie Airbnb uniquement sur la page propriétaires.
- Formulaires séparés, validation locale, récapitulatif puis WhatsApp ou e-mail ; aucun envoi automatique, aucune collecte en base.
- Lumière de survol, parallaxe desktop limitée, révélation de titres, cascade au défilement, indicateur de progression et menu Logements accessible au clic/clavier.
- Respect de prefers-reduced-motion et du bouton de réduction des animations.
- Les pages de prévisualisation restent noindex. Aucun domaine client ni formulaire serveur modifié.
- L’image familiale en bateau est un candidat issu de Jeanneau. Licence commerciale non vérifiée : autorisation ou remplacement obligatoire avant lancement. Les autres images sont des photographies d’ambiance de la V2.

Lancement local : servir le dossier en HTTP. Les modules JavaScript nécessitent HTTP ; ne pas ouvrir directement le fichier via file://. Images externes : Internet nécessaire.

Avant production : photos propres/licenciées, périmètre des services, mentions légales et confidentialité finalisés ; pré-rendu HTML des contenus et activation de l’indexation seulement après validation.
