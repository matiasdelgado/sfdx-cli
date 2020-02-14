#!/usr/bin/env node

const program = require('commander');
const switchScratch = require('./switchScratch');
const showLogs = require('./showLogs');
const { runTestMethod, runTestClass } = require('./runTests');
const { pullFromScratch, pushToScratch } = require('./scratchCode');
const { showCurrent } = require('./scratchInfo');

program
  .version('0.0.1')
  .usage('sfdx-cli <command> <options>');

program
  .command('switch')
  .option('-o, --open', 'Open the scratch org page in the browser')
  .description('Switch scratch org')
  .action(switchScratch);

program
  .command('log')
  .description('Show remote logs')
  .action(showLogs);

program
  .command('display')
  .option('-m, --markdown', 'Generates MD code')
  .description('Display current scratch org url')
  .action(showCurrent);

program
  .command('code')
  .option('-p, --push', 'Push to scratch org')
  .option('-l, --pull', 'Pull from scratch org')
  .action(() => {
    console.info(arguments);
  });

program
  .command('test')
  .description('Run tests by class or method name')
  .option('-c, --classnames <classnames>', 'Run tests in class')
  .option('-m, --method <method>', 'Run test by name')
  .action(({ method, classnames }) => {
    if (method) {
      return runTestMethod(method);
    }
    if (classnames) {
      return runTestClass(classnames);
    }
  });

program.parse(process.argv);
