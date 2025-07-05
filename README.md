# Archetype Optimizer (v2.1)

**Archetype Optimizer** est un outil en ligne de commande puissant conçu pour les joueurs de Magic: The Gathering. Il analyse des centaines de listes de decks pour un archétype donné, extrait un "consensus" statistique et génère un rapport HTML interactif et visuel pour vous aider à comprendre le méta-jeu actuel et à optimiser votre liste.

## Fonctionnalités

- **Scraping Robuste** : Récupère les dernières listes de tournois pour n'importe quel archétype depuis `mtggoldfish.com`, en utilisant une technique de scraping fiabilisée.
- **Filtrage Puissant** : Affinez votre recherche par date de tournoi ou par mots-clés de performance (ex: `challenge`, `top8`, `qualifier`).
- **Cache Intelligent** : Sauvegarde automatiquement les decklists déjà téléchargées pour des analyses ultérieures quasi-instantanées.
- **Enrichissement des Données** : Valide chaque nom de carte via l'API Scryfall pour garantir la précision et récupérer les images officielles.
- **Analyse de Consensus** : Calcule les pourcentages d'adoption, le nombre moyen de copies, et classifie les cartes en `CORE`, `FLEX`, ou `SPICY`.
- **Rapport Visuel Interactif** : Génère un fichier HTML unique, moderne et facile à partager, affichant toutes les cartes et statistiques.

## Installation

1.  Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v16 ou supérieur) installé.
2.  Clonez ce dépôt : `git clone https://github.com/gbordes77/Archetype-Optimizer.git`
3.  Entrez dans le dossier : `cd Archetype-Optimizer`
4.  Installez les dépendances : `npm install`

## Guide d'Utilisation

### 1. Lancer une Analyse

L'outil se pilote entièrement depuis le terminal. La commande de base est `npm start --` suivie de vos options.

**Étape 1 : Trouver l'URL de votre archétype**

1.  Rendez-vous sur [mtggoldfish.com/metagame](https://www.mtggoldfish.com/metagame/standard#paper).
2.  Sélectionnez le format qui vous intéresse (Standard, Modern, Legacy, etc.).
3.  Dans la liste des archétypes, cliquez sur celui que vous voulez analyser.
4.  Copiez l'URL de la page qui s'affiche. Ce sera votre `--url`.

**Étape 2 : Exécuter la commande**

Utilisez la commande suivante en remplaçant les valeurs d'exemple :

```bash
npm start -- --url "URL_DE_L_ARCHETYPE" --name "NOM_DE_L_ARCHETYPE" [options]
```

**Exemples concrets :**

- **Analyse simple de "Dimir Midrange" en Standard :**
  ```bash
  npm start -- --url "https://www.mtggoldfish.com/archetype/standard-dimir-midrange-a5f1e5f8-fa27-4d80-82d1-217234691461" --name "Dimir Midrange"
  ```

- **Analyse de "Boros Convoke" en Pioneer, uniquement les Top 8 de "Challenge" depuis le 15 juin 2024 :**
  ```bash
  npm start -- --url "URL_DE_BOROS_CONVOKE" --name "Pioneer Boros Convoke" --date "2024-06-15" --keywords challenge top8
  ```

- **Forcer une nouvelle analyse sans utiliser le cache :**
  ```bash
  npm start -- --url "URL_DE_L_ARCHETYPE" --name "Mon Archetype" --no-cache
  ```

### 2. Options Disponibles

| Option      | Alias | Description                                        | Obligatoire |
|-------------|-------|----------------------------------------------------|-------------|
| `--url`     | `-u`  | URL de la page de l'archétype sur MTGGoldfish.       | **Oui**     |
| `--name`    | `-n`  | Nom de l'archétype qui apparaîtra dans le rapport. | **Oui**     |
| `--date`    | `-d`  | Date de début (YYYY-MM-DD) pour filtrer les listes.  | Non         |
| `--keywords`| `-k`  | Mots-clés pour filtrer par nom de tournoi.         | Non         |
| `--no-cache`|       | Désactive le cache et force un nouveau scraping.   | Non         |
| `--help`    | `-h`  | Affiche le menu d'aide.                            | Non         |

### 3. Interpréter le Rapport

Le rapport généré (`rapport_metagame.html`) est un fichier HTML. Ouvrez-le dans votre navigateur. Les cartes sont classées par taux d'inclusion décroissant et sont groupées par couleur :

-   <span style="color:#03dac6">**CORE**</span> : Les piliers de l'archétype. Ces cartes sont présentes dans presque toutes les listes (>80% d'inclusion) et en grand nombre. Elles sont non-négociables.
-   <span style="color:#f7d56e">**FLEX**</span> : Les cartes flexibles. Elles apparaissent fréquemment (>40%) mais en quantités variables. Ce sont les slots que vous pouvez adapter à votre style de jeu ou au metagame attendu.
-   <span style="color:#cf6679">**SPICY**</span> : Les choix personnels ou de niche. Ces cartes apparaissent rarement et représentent des innovations, des choix de side spécifiques, ou des préférences de joueurs. 