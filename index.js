const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Pipeline = require('./src/framework/Pipeline');
const pipelineConfig = require('./config/metagame_pipeline.json');

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: npm start -- --url <url> --name <name> [options]')
    .option('url', { alias: 'u', type: 'string', description: 'URL de la page archétype de MTGGoldfish', demandOption: true })
    .option('name', { alias: 'n', type: 'string', description: "Nom de l'archétype pour le rapport", demandOption: true })
    .option('date', { alias: 'd', type: 'string', description: 'Date de départ (AAAA-MM-JJ)', default: null })
    .option('keywords', { alias: 'k', type: 'array', description: 'Mots-clés de performance', default: [] })
    .option('no-cache', { type: 'boolean', description: 'Force le re-scraping de toutes les pages', default: false })
    .help().alias('help', 'h').argv;

  const initialContext = {
    archetypeUrl: argv.url,
    archetypeName: argv.name,
    filters: {
      sinceDate: argv.date,
      performanceKeywords: argv.keywords,
    },
    useCache: !argv.noCache,
  };

  console.log(`🚀 Lancement du pipeline : ${pipelineConfig.name}`);
  const pipeline = new Pipeline(pipelineConfig, initialContext);

  try {
    await pipeline.run();
    console.log(`✅ Pipeline terminé avec succès !`);
  } catch (error) {
    console.error(`❌ Erreur critique durant l'exécution du pipeline.`, error);
  }
}

main();
