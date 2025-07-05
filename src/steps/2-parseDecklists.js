const axios = require('axios');

async function execute(context) {
  const { rawDecklists } = context;
  console.log('--- ÉTAPE 2: Parsing et Enrichissement Scryfall ---');
  
  const cardRegex = /^(\d+)\s+(.+)/;
  const parsedDecks = [];
  const scryfallCache = new Map();

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getScryfallData = async (cardName) => {
    if (scryfallCache.has(cardName)) return scryfallCache.get(cardName);
    
    try {
      process.stdout.write(`    -> Scryfall API call for: ${cardName.substring(0,50)}\r`);
      const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
      const data = {
        name: response.data.name,
        image_small: response.data.image_uris?.small,
        scryfall_uri: response.data.scryfall_uri,
      };
      scryfallCache.set(cardName, data);
      await sleep(75); // Pause de 75ms pour respecter l'API
      return data;
    } catch (error) {
      console.warn(`\n    ! Avertissement: Scryfall n'a pas trouvé "${cardName}".`);
      scryfallCache.set(cardName, null); // Mettre en cache l'échec pour ne pas redemander
      return null;
    }
  };

  for (const list of rawDecklists) {
    const deck = { main: [], side: [] };
    let currentSection = 'main';
    const lines = list.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.toLowerCase() === 'deck') continue;
      if (trimmedLine.toLowerCase() === 'sideboard') {
        currentSection = 'side';
        continue;
      }
      const match = trimmedLine.match(cardRegex);
      if (match) {
        const cardName = match[2].trim();
        const card = {
          quantity: parseInt(match[1]),
          name: cardName,
          scryfallData: await getScryfallData(cardName),
        };
        deck[currentSection].push(card);
      }
    }
    parsedDecks.push(deck);
  }
  
  process.stdout.write('\n'); // Ligne vide pour nettoyer la console
  context.parsedDecks = parsedDecks;
  console.log(`--- ÉTAPE 2: Parsing & Enrichissement terminés. ---\n`);
  return context;
}

module.exports = { execute }; 