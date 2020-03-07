const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const validateContext = require('./context');
const openScratch = require('./openScratch');

module.exports = switchScratch;

function switchScratch({ open }) {
  return getScratchOrgs().then(orgs => {
    const choices = orgs.map(org => {
      return `${org.expirationDate} ${org.instanceUrl}${
        org.isDefaultUsername ? ' *' : ''
      }`;
    });

    if (choices.length === 0) {
      console.info('There are no active scratch orgs');
      return;
    }

    const contextOk = validateContext();
    if (!contextOk) {
      console.info('This folder is not a salesforce solution, cannot switch the scratch orgs.');
      console.info('');
      if (!open) {
        choices.forEach(text => console.info(text));
        return;
      }
    }

    const query = inquirer
      .prompt([
        {
          name: 'instanceUrl',
          message: `${ contextOk ? 'Choose' : 'Open' } Scratch org:`,
          type: 'list',
          choices,
        },
      ])
      .then(({instanceUrl}) => {
        const index = choices.indexOf(instanceUrl);
        const {username} = orgs[index];

        return setDefaultIfPossible(username, contextOk).then(() => username);
      })
      .then(username => open && openScratch({ username }))
  });
}

function setDefaultIfPossible(username, contextOk) {
  if (!contextOk) {
    return Promise.resolve();
  }

  const setCommand = `sfdx force:config:set defaultusername=${username}`;
  return exec(setCommand);
}

function getScratchOrgs() {
  const command = 'sfdx force:org:list --json';
  return exec(command).then(({stderr, stdout}) => {
    if (stderr) {
      throw new Error(stderr);
    }
    const data = JSON.parse(stdout);
    return data.result.scratchOrgs.map(
      ({instanceUrl, isDefaultUsername, expirationDate, username}) => ({
        instanceUrl,
        isDefaultUsername,
        expirationDate,
        username,
      }),
    );
  });
}
