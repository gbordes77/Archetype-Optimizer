const fs = require('fs');
const Step = require('../framework/Step');

class RenderHtmlReportStep extends Step {
  async execute(context) {
    const { analysisResults } = context;
    const { mainDeck, sideboard, deckCount, archetype } = analysisResults;

    const createRow = (card) => {
      const statusClass = card.status === '✅ CORE' ? 'core' : (card.status === '🟡 FLEX' ? 'flex' : 'spicy');
      const imageUrl = card.scryfallData?.image_small || ''; // Image depuis Scryfall
      const scryfallLink = card.scryfallData?.scryfall_uri || '#';
      const cardName = card.scryfallData?.name || card.name;

      return `
        <tr class="${statusClass}">
          <td>
            <div class="card-cell">
              <a href="${scryfallLink}" target="_blank"><img src="${imageUrl}" alt="${cardName}" loading="lazy"></a>
              <span>${cardName}</span>
            </div>
          </td>
          <td>${card.inLists} / ${deckCount}</td>
          <td>${(card.adoptionRate * 100).toFixed(1)}%</td>
          <td>${(card.totalCopies / card.inLists).toFixed(2)}</td>
        </tr>`;
    };

    const htmlContent = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Analyse: ${archetype}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#333;max-width:1400px;margin:20px auto;padding:0 20px}
      header{text-align:center;border-bottom:2px solid #eee;padding-bottom:20px;margin-bottom:20px}
      h1{color:#1a237e}h2{color:#004d40;border-bottom:1px solid #ddd;padding-bottom:10px}
      .container{display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start}
      .column{flex:1;min-width:500px}
      table{width:100%;border-collapse:collapse}th,td{padding:8px;text-align:left;border-bottom:1px solid #ddd;vertical-align:middle}
      thead{background-color:#333;color:white}
      tr.core{background-color:#e8f5e9}tr.flex{background-color:#fffde7}tr.spicy{background-color:#ffebee}
      .card-cell{display:flex;align-items:center;gap:15px}
      .card-cell img{width:66px;height:92px;border-radius:5px}
    </style></head><body>
    <header><h1>Analyse Metagame - ${archetype}</h1><h4>Rapport généré le ${new Date().toLocaleString('fr-FR')} sur la base de ${deckCount} listes.</h4></header>
    <main><div class="container">
      <div class="column"><h2>Consensus Main Deck</h2><table><thead><tr><th>Carte</th><th>Nb Listes</th><th>% Adoption</th><th>Copies / Deck</th></tr></thead><tbody>${mainDeck.map(createRow).join('')}</tbody></table></div>
      <div class="column"><h2>Consensus Sideboard</h2><table><thead><tr><th>Carte</th><th>Nb Listes</th><th>% Adoption</th><th>Copies / Deck</th></tr></thead><tbody>${sideboard.map(createRow).join('')}</tbody></table></div>
    </div></main></body></html>`;

    fs.writeFileSync('rapport_metagame.html', htmlContent);
    return context;
  }
}
module.exports = RenderHtmlReportStep; 