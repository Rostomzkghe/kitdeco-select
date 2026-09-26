# Luxury Guest — V2

20 pages navigables et une page 404, sans dépendance JavaScript externe.

## Architecture
`content.js` : services, destinations, coordonnées et sources photos.
`site.js` : compositions des pages et interactions.
`styles.css` : direction artistique, animations et responsive.
`assets/logo.svg` : logo extrait des éléments de marque fournis.
Les photographies sont chargées depuis Unsplash. Elles illustrent une ambiance et ne constituent pas un catalogue de biens disponibles.

## Formulaire
Préparation locale d’un récapitulatif, puis ouverture de WhatsApp ou de la messagerie e-mail du visiteur. Celui-ci confirme l’envoi dans l’application choisie. Aucun envoi automatique, aucune base de données, aucun paiement, aucune confirmation automatique de réservation.
Préremplissage service/destination, champs transport conditionnels, validation des coordonnées et dates, récapitulatif modifiable.

## Prévisualisation
Servir le dossier avec un serveur HTTP statique. JavaScript et un accès Internet aux photographies sont nécessaires. Ne modifier que la branche dédiée `luxury-guest-preview`, jamais la branche main du dépôt. La V1 reste consultable via son ancien commit.

## Avant lancement commercial
Valider les textes, coordonnées, prestations et photographies avec le client. Compléter les informations juridiques et les conditions contractuelles : les pages incluses sont clairement indiquées comme non finalisées. Définir la réception des demandes et, au besoin, un backend. Configurer le domaine et l’hébergement définitifs. Pré-rendre les contenus HTML pour le référencement. Retirer noindex et adapter robots.txt uniquement après validation.
