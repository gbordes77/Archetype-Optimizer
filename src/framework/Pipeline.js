// src/framework/Pipeline.js
const path = require('path');

class Pipeline {
  constructor(config) {
    this.name = config.name;
    this.steps = config.steps;
    this.context = config.context || {};
  }

  async run() {
    console.log(`|--- Démarrage du pipeline : ${this.name} ---|`);
    let stepNumber = 1;
    for (const stepConfig of this.steps) {
      try {
        const stepPath = path.resolve(__dirname, '..', '..', stepConfig.path);
        const StepClass = require(stepPath);
        const stepInstance = new StepClass(stepConfig.name);
        
        console.log(`\n[Étape ${stepNumber}/${this.steps.length}] : Exécution de "${stepConfig.name}"...`);
        this.context = await stepInstance.execute(this.context);
        console.log(`[Étape ${stepNumber}/${this.steps.length}] : "${stepConfig.name}" terminée.`);
        stepNumber++;

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