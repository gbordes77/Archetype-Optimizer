// src/framework/Step.js
class Step {
  constructor(name) {
    if (this.constructor === Step) {
      throw new Error("La classe 'Step' est abstraite et ne peut pas être instanciée directement.");
    }
    this.name = name;
  }

  async execute(context) {
    throw new Error(`La méthode 'execute' doit être implémentée par la classe enfant : ${this.name}`);
  }
}

module.exports = Step; 