class Step {
  constructor(name) {
    if (this.constructor === Step) throw new Error("La classe 'Step' est abstraite.");
    this.name = name;
  }
  async execute(context) {
    throw new Error(`La méthode 'execute' doit être implémentée par : ${this.name}`);
  }
}
module.exports = Step; 