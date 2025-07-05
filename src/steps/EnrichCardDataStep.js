const fetch = require('node-fetch');
const Step = require('../framework/Step');

class EnrichCardDataStep extends Step {
  // Petite pause pour respecter l'API de Scryfall
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Interroge Scryfall pour UNE carte
  async fetchCardData(cardName) {
    try {
      const encodedName = encodeURIComponent(cardName);
      const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodedName}`);
      
      if (!response.ok) {
        console.warn(`    ! Scryfall n'a pas trouvé de correspondance pour "${cardName}"`);
        return null;
      }
      
      const cardData = await response.json();
      return {
        name: cardData.name, // Nom officiel
        image_small: cardData.image_uris?.small,
        scryfall_uri: cardData.scryfall_uri,
      };
    } catch (error) {
      console.error(`    ! Erreur API pour "${cardName}":`, error.message);
      return null;
    }
  }

  async execute(context) {
    const { parsedDecks } = context;
    const cardDataCache = new Map(); // Un cache pour ne pas appeler l'API 50x pour la même carte
    
    console.log("  > Récupération des données depuis l'API Scryfall...");

    for (const deck of parsedDecks) {
      for (const card of [...deck.main, ...deck.side]) {
        if (!cardDataCache.has(card.name)) {
          // Si la carte n'est pas dans notre cache, on appelle l'API
          process.stdout.write(`    -> Recherche : ${card.name}\r`);
          const scryfallData = await this.fetchCardData(card.name);
          cardDataCache.set(card.name, scryfallData); // On stocke le résultat (même s'il est null)
          await this.sleep(100); // Pause de 100ms
        }
      }
    }
    
    console.log("\n  > Enrichissement des listes de decks...");
    // On enrichit chaque carte de chaque deck avec les données du cache
    for (const deck of parsedDecks) {
      for (const card of [...deck.main, ...deck.side]) {
        card.scryfallData = cardDataCache.get(card.name);
      }
    }

    context.parsedDecks = parsedDecks; // On met à jour le contexte avec les decks enrichis
    return context;
  }
}
module.exports = EnrichCardDataStep; 