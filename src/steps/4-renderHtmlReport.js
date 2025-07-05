const fs = require('fs');
const path = require('path');

function getCategoryClass(category) {
  if (category === 'CORE') return 'category-core';
  if (category === 'FLEX') return 'category-flex';
  return 'category-spicy';
}

function execute(context) {
  const { consensus, config } = context;
  const { archetypeName } = config;
  console.log('--- ÉTAPE 4: Génération du rapport HTML ---');

  const cardsHtml = consensus
    .map(
      card => `
    <div class="card ${getCategoryClass(card.category)}">
      <a href="${card.scryfallData.scryfall_uri}" target="_blank">
        <img src="${card.scryfallData.image_small}" alt="${card.name}" loading="lazy" />
      </a>
      <div class="card-info">
        <div class="card-name">${card.name}</div>
        <div class="card-stats">
          <span class="stat">Inclusion: <strong>${card.inclusionRate}%</strong></span>
          <span class="stat">Avg Qty: <strong>${card.avgQuantity}</strong></span>
        </div>
      </div>
      <div class="card-category">${card.category}</div>
    </div>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport Metagame: ${archetypeName}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 2rem; }
        .header { text-align: center; margin-bottom: 2rem; }
        h1 { color: #bb86fc; }
        .container { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .card { background-color: #1e1e1e; border-radius: 10px; overflow: hidden; text-align: center; border: 1px solid #333; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(187, 134, 252, 0.3); }
        .card img { width: 100%; height: auto; display: block; }
        .card-info { padding: 0.8rem; }
        .card-name { font-weight: bold; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .card-stats { font-size: 0.8rem; display: flex; justify-content: space-around; }
        .stat { color: #b0b0b0; }
        .card-category { font-size: 0.7rem; font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 5px; color: #121212; position: absolute; top: 8px; right: 8px; }
        .category-core { background-color: #03dac6; border: 1px solid #03dac6; }
        .category-flex { background-color: #f7d56e; border: 1px solid #f7d56e; }
        .category-spicy { background-color: #cf6679; border: 1px solid #cf6679; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rapport de Consensus pour ${archetypeName}</h1>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      <div class="container">${cardsHtml}</div>
    </body>
    </html>
  `;

  const reportPath = path.join(process.cwd(), 'rapport_metagame.html');
  fs.writeFileSync(reportPath, htmlContent);

  console.log(`--- ÉTAPE 4: Rapport généré avec succès : ${reportPath} ---\n`);
  return context;
}

module.exports = { execute }; 