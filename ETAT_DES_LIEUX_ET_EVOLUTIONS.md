# État des Lieux et Évolutions - Archetype Optimizer

Ce document retrace les décisions techniques et les évolutions majeures du projet durant sa phase de stabilisation et de refactoring.

## 1. Contexte Initial

L'outil était un script Node.js fonctionnel mais fragile, basé sur le scraping du site `mtggoldfish.com`. Plusieurs problèmes rendaient son utilisation difficile :
-   **Arguments CLI :** Le passage d'arguments via `npm start --` était bogué.
-   **Chemins de modules :** Le chargement des étapes du pipeline cassait à cause d'une mauvaise résolution des chemins.
-   **Scraping Instable :** Le problème le plus critique. Les sélecteurs CSS pour extraire les decks de MTGGoldfish n'étaient plus valides, rendant l'outil inutilisable.

## 2. Le Pivot Stratégique : Abandon du Scraping Direct

Face à l'instabilité du scraping de MTGGoldfish (probablement due à des changements de structure et/ou des protections anti-bots), une décision d'architecture majeure a été prise : **abandonner complètement MTGGoldfish comme source de données.**

Cette décision a mené à une refonte profonde :

1.  **Nouvelle Source de Données :** L'API [Scryfall](https://scryfall.com/docs/api) a été choisie comme source primaire. Elle est publique, documentée, stable et conçue pour un usage programmatique.

2.  **Nouvelle Logique de Recherche :** Au lieu de scraper des pages, l'outil utilise une heuristique pour "deviner" l'identité d'un archétype :
    a.  Il analyse le nom fourni (ex: "Dimir Midrange").
    b.  Il en déduit les couleurs de mana associées ("Dimir" -> Bleu/Noir).
    c.  Il interroge l'API Scryfall pour trouver la créature légendaire la plus pertinente (basée sur la valeur monétaire, un indicateur de popularité) dans ces couleurs et dans le format Standard. Cette carte devient la "carte signature" de l'archétype.

3.  **Simplification de l'Usage :** L'interface en ligne de commande a été grandement simplifiée. Les options complexes (`--url`, `--date`, `--keywords`, `--no-cache`) ont été supprimées au profit d'une seule : `--name`.

## 3. Le Défi de la Récupération de Decks

Le nouveau modèle est plus robuste, mais il fait face à une limitation inhérente à l'écosystème des données de Magic: **il n'existe pas d'API publique et fiable pour lister des decks contenant une carte donnée.**

-   L'API Scryfall identifie la carte signature mais ne fournit que des liens vers des sites tiers (comme TCGPlayer) pour les decks.
-   Les tentatives de scraper ces sites tiers se sont heurtées aux mêmes problèmes de protections anti-bots (détection de `puppeteer`, chargement dynamique du contenu via JavaScript).

## 4. État Actuel et Solution Pragrmatique

Poursuivre la bataille contre le scraping étant contre-productif, la décision a été de conserver le cœur fonctionnel de l'application tout en simulant la partie irréalisable.

**L'outil est aujourd'hui dans un état stable et fonctionnel :**
-   ✅ Il identifie une carte signature pertinente via l'API Scryfall.
-   ✅ Il démontre le fonctionnement complet du pipeline d'analyse et de génération de rapport.
-   ⚠️ **Il utilise des listes de decks simulées** basées sur la carte signature trouvée. Un message clair dans la console informe l'utilisateur de cet état de fait.

## 5. Pistes d'Évolutions Futures

-   **Fournir les Decks Manuellement :** La prochaine étape logique serait de permettre à l'utilisateur de fournir lui-même les listes de decks à analyser, via des fichiers texte ou en les copiant/collant dans le terminal. L'outil deviendrait un analyseur pur, découplé du problème de la récupération de données.
-   **Explorer d'autres API :** Une veille technologique pour surveiller l'apparition d'une API de decks fiable.
-   **Améliorer l'Heuristique :** Affiner la logique de recherche de la carte signature (ex: prendre en compte d'autres types de cartes, analyser plus de mots-clés). 