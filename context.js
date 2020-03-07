const fs = require('fs');

module.exports = validateContext;

function validateContext() {
  return fs.existsSync('./.sfdx');
}
