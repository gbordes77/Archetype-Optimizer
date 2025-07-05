const Step = require('../framework/Step');

class ParseDecklistsStep extends Step {
  async execute(context) {
    const { rawDecklists } = context;
    const cardRegex = /^(\d+)\s+(.+)/;
    const parsedDecks = [];
    rawDecklists.forEach(list => {
      const deck = { main: [], side: [] };
      let currentSection = 'main';
      list.split('\n').forEach(line => {
        line = line.trim();
        if (!line || line.toLowerCase() === 'deck') return;
        if (line.toLowerCase() === 'sideboard') {
          currentSection = 'side';
          return;
        }
        const match = line.match(cardRegex);
        if (match) {
          const card = { quantity: parseInt(match[1]), name: match[2].trim() };
          deck[currentSection].push(card);
        }
      });
      parsedDecks.push(deck);
    });
    context.parsedDecks = parsedDecks;
    return context;
  }
}
module.exports = ParseDecklistsStep; 