const Step = require('../framework/Step');

class AnalyzeConsensusStep extends Step {
  async execute(context) {
    const { parsedDecks, archetypeName } = context;
    const cardMap = new Map(); // Une seule map pour stocker les données complètes

    const processCard = (card, deckPart) => {
      const officialName = card.scryfallData?.name || card.name;
      if (!cardMap.has(officialName)) {
        cardMap.set(officialName, {
          name: officialName,
          scryfallData: card.scryfallData,
          main: { totalCopies: 0, inLists: 0 },
          side: { totalCopies: 0, inLists: 0 },
        });
      }
      const entry = cardMap.get(officialName);
      entry[deckPart].totalCopies += card.quantity;
      entry[deckPart].inLists += 1;
    };
    
    parsedDecks.forEach(deck => {
      deck.main.forEach(card => processCard(card, 'main'));
      deck.side.forEach(card => processCard(card, 'side'));
    });

    const deckCount = parsedDecks.length;
    const formatResults = (deckPart) => {
      return Array.from(cardMap.values())
        .filter(data => data[deckPart].inLists > 0) // On ne garde que les cartes présentes dans cette partie
        .map(data => {
          const partData = data[deckPart];
          const adoptionRate = partData.inLists / deckCount;
          let status = '🟡 FLEX';
          if (adoptionRate >= 0.9) status = '✅ CORE';
          if (adoptionRate <= 0.4) status = '❌ SPICY';
          return { 
            name: data.name,
            scryfallData: data.scryfallData,
            ...partData,
            adoptionRate,
            status
          };
        })
        .sort((a, b) => b.inLists - a.inLists || b.totalCopies - a.totalCopies);
    };
    
    context.analysisResults = {
      mainDeck: formatResults('main'),
      sideboard: formatResults('side'),
      deckCount,
      archetype: archetypeName,
    };
    return context;
  }
}
module.exports = AnalyzeConsensusStep; 