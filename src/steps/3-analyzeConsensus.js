// src/steps/3-analyzeConsensus.js
function execute(context) {
  const { parsedDecks } = context;
  console.log('--- ÉTAPE 3: Analyse du consensus ---');

  const cardOccurrences = new Map();
  const totalDecks = parsedDecks.length;

  parsedDecks.forEach(deck => {
    const allCards = [...deck.main, ...deck.side];
    const uniqueCardsInDeck = new Set(allCards.map(c => c.name));

    uniqueCardsInDeck.forEach(cardName => {
      const card = allCards.find(c => c.name === cardName);
      if (!card.scryfallData) return; // Ignore cards not found by Scryfall

      if (!cardOccurrences.has(cardName)) {
        cardOccurrences.set(cardName, {
          count: 0,
          totalQuantity: 0,
          inMain: 0,
          inSide: 0,
          scryfallData: card.scryfallData,
        });
      }
      const entry = cardOccurrences.get(cardName);
      entry.count++;
      
      const mainDeckCard = deck.main.find(c => c.name === cardName);
      if (mainDeckCard) {
        entry.inMain++;
        entry.totalQuantity += mainDeckCard.quantity;
      }
      
      const sideDeckCard = deck.side.find(c => c.name === cardName);
      if(sideDeckCard) {
        entry.inSide++;
      }
    });
  });

  const analyzedCards = Array.from(cardOccurrences.entries()).map(([name, data]) => {
    const inclusionRate = (data.count / totalDecks) * 100;
    const avgQuantity = data.totalQuantity / data.inMain;

    let category = 'SPICY';
    if (inclusionRate >= 80 && avgQuantity >= 3.5) {
      category = 'CORE';
    } else if (inclusionRate >= 40) {
      category = 'FLEX';
    }

    return {
      name,
      inclusionRate: inclusionRate.toFixed(2),
      avgQuantity: isNaN(avgQuantity) ? 'N/A (Side)' : avgQuantity.toFixed(2),
      category,
      scryfallData: data.scryfallData,
    };
  });

  analyzedCards.sort((a, b) => b.inclusionRate - a.inclusionRate);

  context.consensus = analyzedCards;
  console.log(`--- ÉTAPE 3: Analyse terminée. ${analyzedCards.length} cartes uniques analysées. ---\n`);
  return context;
}

module.exports = { execute }; 