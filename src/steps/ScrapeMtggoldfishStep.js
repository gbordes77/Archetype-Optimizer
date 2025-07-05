const puppeteer = require('puppeteer');
const Step = require('../framework/Step');

class ScrapeMtggoldfishStep extends Step {
  async execute(context) {
    const { archetypeUrl, filters } = context;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(archetypeUrl, { waitUntil: 'networkidle2' });

    const tournamentBlocks = await page.evaluate(() => 
      Array.from(document.querySelectorAll('.archetype-tile')).map(tile => ({
        tournamentName: tile.querySelector('.deck-tournament-name a')?.innerText.trim(),
        tournamentDate: tile.querySelector('.deck-tournament-name span.hidden-xs-down')?.innerText.trim().split(' ')[0],
        deckLink: tile.querySelector('.deck-tile-name a')?.href,
      }))
    );
    console.log(`  > ${tournamentBlocks.length} résultats de tournois trouvés.`);

    const filteredBlocks = tournamentBlocks.filter(block => {
      if (!block.tournamentName || !block.tournamentDate || !block.deckLink) return false;
      if (filters.sinceDate && new Date(block.tournamentDate) < new Date(filters.sinceDate)) return false;
      if (filters.performanceKeywords.length > 0 && !filters.performanceKeywords.some(kw => block.tournamentName.toLowerCase().includes(kw))) return false;
      return true;
    });
    console.log(`  > ${filteredBlocks.length} résultats correspondent à vos filtres.`);

    const rawDecklists = [];
    for (const block of filteredBlocks) {
      try {
        await page.goto(block.deckLink + '#arena', { waitUntil: 'networkidle2' });
        await page.waitForSelector('.copy-paste-box textarea');
        const list = await page.evaluate(() => document.querySelector('.copy-paste-box textarea').value);
        if (list) rawDecklists.push(list);
      } catch(e) { console.log(`    ! Erreur sur le deck ${block.deckLink}, passage au suivant.`); }
    }
    await browser.close();

    if (rawDecklists.length === 0) throw new Error("Aucune decklist n'a pu être extraite avec les filtres actuels.");
    
    context.rawDecklists = rawDecklists;
    return context;
  }
}
module.exports = ScrapeMtggoldfishStep; 