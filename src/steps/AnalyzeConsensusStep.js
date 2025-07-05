const Step = require('../framework/Step');

class AnalyzeConsensusStep extends Step {
  async execute(context) {
    const { parsedDecks, archetypeName } = context;
    const mainDeckCounts = new Map();
    const sideBoardCounts = new Map();
    parsedDecks.forEach(deck => {
      deck.main.forEach(card => {
        if (!mainDeckCounts.has(card.name)) mainDeckCounts.set(card.name, { totalCopies: 0, inLists: 0 });
        const current = mainDeckCounts.get(card.name);
        current.totalCopies += card.quantity;
        current.inLists += 1;
      });
      deck.side.forEach(card => {
        if (!sideBoardCounts.has(card.name)) sideBoardCounts.set(card.name, { totalCopies: 0, inLists: 0 });
        const current = sideBoardCounts.get(card.name);
        current.totalCopies += card.quantity;
        current.inLists += 1;
      });
    });
    const deckCount = parsedDecks.length;
    const formatResults = (countsMap) => {
      return Array.from(countsMap.entries())
        .map(([name, data]) => {
          const adoptionRate = data.inLists / deckCount;
          let status = '🟡 FLEX';
          if (adoptionRate >= 0.9) status = '✅ CORE';
          if (adoptionRate <= 0.4) status = '❌ SPICY';
          return { name, ...data, adoptionRate, status };
        })
        .sort((a, b) => b.inLists - a.inLists || b.totalCopies - a.totalCopies);
    };
    context.analysisResults = {
      mainDeck: formatResults(mainDeckCounts),
      sideboard: formatResults(sideBoardCounts),
      deckCount,
      archetype: archetypeName,
    };
    return context;
  }
}
module.exports = AnalyzeConsensusStep; 