const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Pipeline = require('./src/framework/Pipeline');
const pipelineConfig = require('./config/metagame_pipeline.json');

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: node index.js --name <archetype-name>')
    .option('name', { alias: 'n', type: 'string', description: "Nom de l'archétype à analyser", demandOption: true })
    .help().alias('help', 'h').argv;

  const initialContext = {
    archetypeName: argv.name,
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
