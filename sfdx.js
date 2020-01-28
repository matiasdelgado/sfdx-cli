const util = require('util');
const { spawn } = require('child_process');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  setDefaultUser,
  openBrowser
};

function setDefaultUser(username) {
  const setCommand = `sfdx force:config:set defaultusername=${username}`;
  return exec(setCommand);
}

function openBrowser() {
  const openCommand = 'sfdx force:org:open';
  return exec(openCommand);
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
