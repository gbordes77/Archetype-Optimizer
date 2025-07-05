const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '..', '..', '.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

async function getDecklistFromPage(page, url) {
    await page.goto(url + '#arena', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('.copy-paste-box textarea', { timeout: 10000 });
    return await page.evaluate(() => document.querySelector('.copy-paste-box textarea').value);
}

async function execute(context) {
  const { config } = context;
  const { archetypeUrl, filters, useCache } = config;

  console.log('--- ÉTAPE 1: Scraping de MTGGoldfish (version robuste) ---');
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
  
  await page.goto(archetypeUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  
  const tournamentBlocks = await page.evaluate(() => Array.from(document.querySelectorAll('.archetype-tile')).map(tile => ({ tournamentName: tile.querySelector('.deck-tournament-name a')?.innerText.trim(), tournamentDate: tile.querySelector('.deck-tournament-name span.hidden-xs-down')?.innerText.trim().split(' ')[0], deckLink: tile.querySelector('.deck-tile-name a')?.href, })));
  console.log(`  > ${tournamentBlocks.length} résultats de tournois trouvés sur la page.`);

  const filteredBlocks = tournamentBlocks.filter(block => {
    if (!block.tournamentName || !block.tournamentDate || !block.deckLink) return false;
    if (filters.sinceDate && new Date(block.tournamentDate) < new Date(filters.sinceDate)) return false;
    if (filters.performanceKeywords.length > 0 && !filters.performanceKeywords.some(kw => block.tournamentName.toLowerCase().includes(kw.toLowerCase()))) return false;
    return true;
  });
  console.log(`  > ${filteredBlocks.length} résultats correspondent à vos filtres.`);
  
  const rawDecklists = [];
  for (const block of filteredBlocks) {
    const safeFilename = encodeURIComponent(block.deckLink) + '.txt';
    const cachePath = path.join(cacheDir, safeFilename);

    if (useCache && fs.existsSync(cachePath)) {
      console.log(`    -> Utilisation du cache pour : ${block.tournamentName}`);
      rawDecklists.push(fs.readFileSync(cachePath, 'utf-8'));
    } else {
      console.log(`    -> Extraction de : ${block.tournamentName} (live)`);
      try {
        const list = await getDecklistFromPage(page, block.deckLink);
        if (list) {
          fs.writeFileSync(cachePath, list);
          rawDecklists.push(list);
        }
      } catch(e) { console.log(`      ! Erreur sur le deck ${block.deckLink} (${e.message}). Passage au suivant.`); }
    }
  }

  await browser.close();

  if (rawDecklists.length === 0) throw new Error("Aucune decklist n'a pu être extraite avec les filtres actuels.");
  context.rawDecklists = rawDecklists;
  console.log(`--- ÉTAPE 1: Scraping terminé. ${rawDecklists.length} listes récupérées. ---\n`);
  return context;
}

module.exports = { execute }; 