const util = require('util');
const exec = util.promisify(require('child_process').exec);
const validateContext = require('./context');

module.exports = openScratch;

function openScratch({ username }) {
  if(!validateContext()) {
    console.info('This folder is not a salesforce solution, cannot determine the default org.');
    return;
  }

  const userParam = username ? `-u ${username}` : '';
  const openCommand = `sfdx force:org:open ${userParam}`;
  process.stdout.write('Opening browser...'); // write message and do not add a CRLF
  return exec(openCommand).then(() => process.stdout.write('\033[2K')); // remove line
}
