const fetch = require('node-fetch');
const Step = require('../framework/Step');

// Mappe les noms de guildes/clans aux couleurs de Magic
const colorMap = {
  'azorius': ['W', 'U'], 'dimir': ['U', 'B'], 'rakdos': ['B', 'R'], 'gruul': ['R', 'G'], 'selesnya': ['G', 'W'],
  'orzhov': ['W', 'B'], 'izzet': ['U', 'R'], 'golgari': ['B', 'G'], 'boros': ['R', 'W'], 'simic': ['G', 'U'],
  'esper': ['W', 'U', 'B'], 'grixis': ['U', 'B', 'R'], 'jund': ['B', 'R', 'G'], 'naya': ['R', 'G', 'W'], 'bant': ['G', 'W', 'U'],
  'abzan': ['W', 'B', 'G'], 'jeskai': ['U', 'R', 'W'], 'sultai': ['B', 'G', 'U'], 'mardu': ['R', 'W', 'B'], 'temur': ['G', 'U', 'R'],
};

class FindDecksScryfallStep extends Step {
  
  async findSignatureCard(archetypeName) {
    const nameParts = archetypeName.toLowerCase().split(' ');
    const colorKey = nameParts.find(part => colorMap[part]);
    if (!colorKey) return null;

    const colors = colorMap[colorKey].join('');
    const query = `t:legendary t:creature c:${colors} f:standard`;
    const cardSearchUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=usd&dir=desc`;
    
    const response = await fetch(cardSearchUrl);
    if (!response.ok) return null;
    const results = await response.json();
    return results.data && results.data.length > 0 ? results.data[0] : null;
  }

  async execute(context) {
    const { archetypeName } = context;
    console.log(`  > Recherche de l'archétype "${archetypeName}" via Scryfall...`);
    
    const signatureCard = await this.findSignatureCard(archetypeName);
    if (!signatureCard) {
      throw new Error(`Impossible de trouver une carte signature pour l'archétype "${archetypeName}".`);
    }
    console.log(`  > Carte signature identifiée : ${signatureCard.name}`);
    console.log('  > NOTE : La récupération de listes de decks depuis des sites tiers est actuellement non-fonctionnelle à cause des protections anti-scraping.');
    console.log('  > Utilisation de données de decks simulées pour la démonstration du pipeline.');

    const fakeRawDecklist = `Deck
4 ${signatureCard.name}
4 Island
4 Swamp
4 Thoughtseize
4 Fatal Push
3 Liliana of the Veil
2 Graveyard Trespasser
4 Fable of the Mirror-Breaker
4 Bloodtithe Harvester
2 Hive of the Eye Tyrant
1 Takenuma, Abandoned Mire
4 Blood Crypt
4 Watery Grave

Sideboard
2 Duress
2 Leyline of the Void
3 Anger of the Gods
2 Extinction Event
2 Necromentia
2 Weathered Runestone
2 Go Blank`;
    const decklists = Array(5).fill(fakeRawDecklist);

    console.log(`  > ${decklists.length} decks (simulés) générés pour l'analyse.`);
    context.rawDecklists = decklists;
    
    return context;
  }
}

module.exports = FindDecksScryfallStep; 