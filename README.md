# Archetype Optimizer

**Archetype Optimizer** est un outil en ligne de commande puissant conçu pour les joueurs de Magic: The Gathering. Il se connecte à l'API de Scryfall pour trouver des decks d'un archétype donné, analyse statistiquement les résultats, et génère un rapport HTML interactif pour vous aider à comprendre le méta-jeu et à optimiser votre liste.

## Fonctionnalités

- **Recherche par API** : Utilise la base de données de Scryfall, une source fiable, pour trouver des listes de decks.
- **Enrichissement des Données** : Valide chaque nom de carte via l'API Scryfall pour garantir la précision et récupérer les images officielles.
- **Analyse de Consensus** : Calcule les pourcentages d'adoption, le nombre moyen de copies, et classifie les cartes en `CORE`, `FLEX`, ou `SPICY`.
- **Rapport HTML Visuel** : Génère un fichier `rapport_metagame.html` unique, propre et facile à partager, avec les images des cartes et des liens vers Scryfall.
- **Système de Cache** : Les analyses répétées sont quasi-instantanées, car l'outil met en cache les données déjà téléchargées.

---

## Guide d'Utilisation

### 1. Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) (version 16 ou supérieure) installé sur votre machine.

### 2. Installation

1.  Clonez ce dépôt sur votre machine locale.
2.  Ouvrez un terminal et naviguez jusqu'au dossier du projet (`cd Archetype-Optimizer`).
3.  Installez les dépendances nécessaires avec la commande :
    ```bash
    npm install
    ```

### 3. Lancer une Analyse

L'outil se pilote entièrement depuis le terminal.

Utilisez la commande suivante en remplaçant la valeur d'exemple :

```bash
node index.js --name "NOM_DE_L_ARCHETYPE"
```

**Exemple concret :**

- **Analyse de "Dimir Midrange" :**
  ```bash
  node index.js --name "Dimir Midrange"
  ```

### 4. Options Disponibles

| Option      | Alias | Description                                        | Obligatoire |
|-------------|-------|----------------------------------------------------|-------------|
| `--name`    | `-n`  | Nom de l'archétype à rechercher.                   | **Oui**     |
| `--help`    | `-h`  | Affiche le menu d'aide.                            | Non         |

---

## Comprendre le Rapport Généré

Une fois l'analyse terminée, un fichier `rapport_metagame.html` est créé. Ouvrez-le dans votre navigateur.

### En-tête du Rapport

- **Titre** : Le nom de l'archétype que vous avez fourni.
- **Sous-titre** : La date de génération et le nombre total de listes de decks qui ont servi de base à l'analyse.

### Tableaux "Main Deck" et "Sideboard"

Chaque section contient un tableau détaillé. Voici la signification de chaque colonne :

- **Carte** :
  - Affiche l'image et le nom officiel de la carte (via Scryfall).
  - L'image est un lien cliquable qui vous redirige vers la page Scryfall de la carte pour plus de détails (légalité, rulings, etc.).

- **Nb Listes** :
  - Indique dans combien de listes la carte a été trouvée. Par exemple, `50 / 50` signifie que la carte était dans 100% des listes analysées.

- **% Adoption** :
  - La même information que "Nb Listes", mais exprimée en pourcentage. C'est l'indicateur principal de l'importance d'une carte.

- **Copies / Deck** :
  - Représente le nombre moyen de copies de cette carte **dans les listes qui la jouent**. Si une carte est jouée en 4 exemplaires dans 50% des decks et jamais dans les 50% autres, cette valeur sera `4.00`.

### Signification des Couleurs (Status)

Les lignes du tableau sont colorées pour vous donner une interprétation rapide de l'importance de chaque carte :

- **<span style="color:green;">✅ CORE (Vert)</span>** : Adoption **≥ 90%**. Ces cartes sont le cœur de la stratégie, le socle non négociable de l'archétype.

- **<span style="color:darkgoldenrod;">🟡 FLEX (Jaune)</span>** : Adoption **entre 40% et 89%**. Ces cartes sont des choix courants mais ajustables. C'est ici que se trouvent les "flex slots" et les choix qui dépendent du méta-jeu attendu.

- **<span style="color:red;">❌ SPICY (Rouge)</span>** : Adoption **< 40%**. Ces cartes sont des choix personnels, des expériences, ou des cartes de méta très spécifiques. Elles sont rarement vues et représentent les plus grandes déviations par rapport au consensus. 