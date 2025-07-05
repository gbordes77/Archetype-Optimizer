const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const pipeline = require('./src/pipeline');

// Définition des options de la ligne de commande
const argv = yargs(hideBin(process.argv))
  .usage('Usage: npm start -- --url <url> --name <name> [options]')
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'URL de la page archétype de MTGGoldfish',
    demandOption: true,
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    description: "Nom de l'archétype pour le rapport",
    demandOption: true,
  })
  .option('date', {
    alias: 'd',
    type: 'string',
    description: 'Date de départ (AAAA-MM-JJ) pour le filtre',
    default: null,
  })
  .option('keywords', {
    alias: 'k',
    type: 'array',
    description: 'Mots-clés de performance (ex: --keywords challenge qualifier)',
    default: [],
  })
  .option('no-cache', {
    type: 'boolean',
    description: 'Force le re-scraping de toutes les pages, sans utiliser le cache.',
    default: false,
  })
  .help()
  .alias('help', 'h').argv;

// On construit l'objet config à partir des arguments de la ligne de commande
const config = {
  archetypeUrl: argv.url,
  archetypeName: argv.name,
  filters: {
    sinceDate: argv.date,
    performanceKeywords: argv.keywords,
  },
  useCache: !argv.noCache,
};

async function main() {
  console.log(`🚀 Lancement de l'optimisation pour l'archétype : ${config.archetypeName}`);
  try {
    await pipeline.run(config);
    console.log('✅ Processus terminé avec succès ! Le fichier "rapport_metagame.html" a été créé.');
  } catch (error) {
    console.error('❌ Une erreur critique est survenue durant l\'exécution du pipeline :', error);
  }
}

main();
