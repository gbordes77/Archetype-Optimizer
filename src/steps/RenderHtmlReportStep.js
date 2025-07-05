const fs = require('fs');
const path = require('path');
const Step = require('../framework/Step');

class RenderHtmlReportStep extends Step {
  async execute(context) {
    const { analysisResults } = context;
    const { mainDeck, sideboard, deckCount, archetype } = analysisResults;

    const createRow = (card) => {
      let statusClass = '';
      if (card.status === '✅ CORE') statusClass = 'core';
      if (card.status === '🟡 FLEX') statusClass = 'flex';
      if (card.status === '❌ SPICY') statusClass = 'spicy';
      return `<tr class="${statusClass}"><td>${card.name}</td><td>${card.totalCopies}</td><td>${card.inLists}</td><td>${(card.adoptionRate * 100).toFixed(1)}%</td><td>${card.status}</td></tr>`;
    };

    const htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Analyse: ${archetype}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333;max-width:1400px;margin:20px auto;padding:0 20px}header{text-align:center;border-bottom:2px solid #eee;padding-bottom:20px;margin-bottom:20px}h1{color:#1a237e}h2{color:#004d40;border-bottom:1px solid #ddd;padding-bottom:10px}.container{display:flex;flex-wrap:wrap;gap:40px}.column{flex:1;min-width:500px}table{width:100%;border-collapse:collapse}th,td{padding:12px;text-align:left;border-bottom:1px solid #ddd}thead{background-color:#333;color:white}tr.core{background-color:#e8f5e9}tr.flex{background-color:#fffde7}tr.spicy{background-color:#ffebee}</style></head><body><header><h1>Analyse Metagame - ${archetype}</h1><h4>Rapport généré le ${new Date().toLocaleString('fr-FR')} sur la base de ${deckCount} listes.</h4></header><main><div class="container"><div class="column"><h2>Consensus Main Deck</h2><table><thead><tr><th>Carte</th><th>Copies</th><th>Nb Listes</th><th>% Adoption</th><th>Status</th></tr></thead><tbody>${mainDeck.map(createRow).join('')}</tbody></table></div><div class="column"><h2>Consensus Sideboard</h2><table><thead><tr><th>Carte</th><th>Copies</th><th>Nb Listes</th><th>% Adoption</th><th>Status</th></tr></thead><tbody>${sideboard.map(createRow).join('')}</tbody></table></div></div></main></body></html>`;

    fs.writeFileSync('rapport_metagame.html', htmlContent);
    return context;
  }
}
module.exports = RenderHtmlReportStep; 