const Pipeline = require('./src/framework/Pipeline');
const pipelineConfig = require('./config/metagame_pipeline.json');

async function main() {
  console.log(`🚀 Lancement du pipeline : ${pipelineConfig.name}`);
  
  const pipeline = new Pipeline(pipelineConfig);
  
  try {
    await pipeline.run();
    console.log(`✅ Pipeline terminé avec succès !`);
  } catch (error) {
    console.error(`❌ Erreur critique durant l'exécution du pipeline.`, error);
  }
}

main();
