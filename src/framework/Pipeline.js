const path = require('path');

class Pipeline {
  constructor(config, initialContext = {}) {
    this.name = config.name;
    this.steps = config.steps;
    this.context = initialContext; // Le contexte vient du lanceur
  }

  async run() {
    console.log(`|--- Démarrage du pipeline : ${this.name} ---|`);
    for (let i = 0; i < this.steps.length; i++) {
      const stepConfig = this.steps[i];
      try {
        const stepPath = path.resolve(process.cwd(), stepConfig.path.replace('../', ''));
        const StepClass = require(stepPath);
        const stepInstance = new StepClass(stepConfig.name);
        
        console.log(`\n[Étape ${i + 1}/${this.steps.length}] : Exécution de "${stepConfig.name}"...`);
        this.context = await stepInstance.execute(this.context);
        console.log(`[Étape ${i + 1}/${this.steps.length}] : "${stepConfig.name}" terminée.`);
      } catch (error) {
        console.error(`Erreur à l'étape "${stepConfig.name}":`, error.message);
        throw error;
      }
    }
    console.log(`\n|--- Pipeline ${this.name} terminé avec succès ---|`);
    return this.context;
  }
}

module.exports = Pipeline; 