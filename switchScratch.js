const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = switchScratch;

function switchScratch({ open }) {
  return getScratchOrgs().then(orgs => {
    const choices = orgs.map(org => {
      return `${org.expirationDate} ${org.instanceUrl}${
        org.isDefaultUsername ? ' *' : ''
      }`;
    });

    const query = inquirer
      .prompt([
        {
          name: 'instanceUrl',
          message: 'Choose the Scratch org:',
          type: 'list',
          choices,
        },
      ])
      .then(({instanceUrl}) => {
        const index = choices.indexOf(instanceUrl);
        const {username} = orgs[index];

        const setCommand = `sfdx force:config:set defaultusername=${username}`;
        const openCommand = 'sfdx force:org:open';
        return exec(setCommand)
          .then(() => {
            if (open) {
              process.stdout.write('Opening browser...'); // write message and do not add a CRLF
              return exec(openCommand).then(() => process.stdout.write('\033[2K')); // remove line
            }
          })
      });
  });
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
