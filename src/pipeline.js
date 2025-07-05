// src/pipeline.js
const scrapeDecksStep = require('./steps/1-scrapeDecks');
const parseDecklistsStep = require('./steps/2-parseDecklists');
const analyzeConsensusStep = require('./steps/3-analyzeConsensus');
const renderHtmlReportStep = require('./steps/4-renderHtmlReport');

async function run(config) {
  let context = { config };
  context = await scrapeDecksStep.execute(context);
  context = await parseDecklistsStep.execute(context);
  context = await analyzeConsensusStep.execute(context);
  context = await renderHtmlReportStep.execute(context);
  return context;
}

module.exports = { run }; 