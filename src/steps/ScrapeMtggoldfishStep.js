const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Step = require('../framework/Step');

const cacheDir = path.join(__dirname, '..', '..', '.cache');
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

class ScrapeMtggoldfishStep extends Step {
  async getDecklistFromPage(page, url) {
    await page.goto(url + '#arena', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.copy-paste-box textarea');
    return await page.evaluate(() => document.querySelector('.copy-paste-box textarea').value);
  }

  async execute(context) {
    const { archetypeUrl, filters, useCache } = context;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(archetypeUrl, { waitUntil: 'networkidle2' });

    const tournamentBlocks = await page.evaluate(() => Array.from(document.querySelectorAll('.archetype-tile')).map(tile => ({ tournamentName: tile.querySelector('.deck-tournament-name a')?.innerText.trim(), tournamentDate: tile.querySelector('.deck-tournament-name span.hidden-xs-down')?.innerText.trim().split(' ')[0], deckLink: tile.querySelector('.deck-tile-name a')?.href, })));
    const filteredBlocks = tournamentBlocks.filter(block => {
      if (!block.tournamentName || !block.tournamentDate || !block.deckLink) return false;
      if (filters.sinceDate && new Date(block.tournamentDate) < new Date(filters.sinceDate)) return false;
      if (filters.performanceKeywords.length > 0 && !filters.performanceKeywords.some(kw => block.tournamentName.toLowerCase().includes(kw.toLowerCase()))) return false;
      return true;
    });

    console.log(`  > ${filteredBlocks.length} listes correspondent à vos filtres.`);
    
    const rawDecklists = [];
    for (const block of filteredBlocks) {
      const safeFilename = encodeURIComponent(block.deckLink) + '.txt';
      const cachePath = path.join(cacheDir, safeFilename);

      if (useCache && fs.existsSync(cachePath)) {
        console.log(`    -> Cache pour : ${block.tournamentName}`);
        rawDecklists.push(fs.readFileSync(cachePath, 'utf-8'));
      } else {
        console.log(`    -> Live... : ${block.tournamentName}`);
        try {
          const list = await this.getDecklistFromPage(page, block.deckLink);
          if (list) {
            fs.writeFileSync(cachePath, list);
            rawDecklists.push(list);
          }
        } catch(e) { console.log(`      ! Erreur sur ce deck.`); }
      }
    }
    await browser.close();

    if (rawDecklists.length === 0) throw new Error("Aucune decklist n'a pu être extraite.");
    
    context.rawDecklists = rawDecklists;
    return context;
  }
}
module.exports = ScrapeMtggoldfishStep; 