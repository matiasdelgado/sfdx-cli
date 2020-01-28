const spawn = require('child_process').spawn;

module.exports = { pullFromScratch, pushToScratch };

function pushToScratch() {
  spawn('sfdx', ['force:source:push', '-f'], { stdio:'inherit' });
}

function pullFromScratch() {
  spawn('sfdx', ['force:source:pull', '-f'], { stdio:'inherit' });
}

function handleCode(options) {
  
}
