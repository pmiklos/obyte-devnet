const path = require('path');
const fs = require('fs');
const copydir = require('copy-dir');

function getAppsDataDir() {
  switch (process.platform) {
    case 'win32':
      return process.env.LOCALAPPDATA;
    case 'linux':
      return process.env.HOME + '/.config';
    case 'darwin':
      return process.env.HOME + '/Library/Application Support';
    default:
      throw Error("unknown platform " + process.platform);
  }
}

const PROJECT = "obyte-devnet-witness";
const CONFDIR = getAppsDataDir();

if (fs.existsSync(path.join(CONFDIR, PROJECT))) {
  console.log("Configuration directory already exists.");
} else {
  copydir.sync(path.join('config', PROJECT), path.join(CONFDIR, PROJECT));
}

console.log("Fixing Obyte DAG explorer to update automatically");
let explorerFile = fs.readFileSync('node_modules/obyte-explorer/explorer.js').toString();
explorerFile = explorerFile.replace(/new_joint/g, 'new_my_transactions');
fs.writeFileSync('node_modules/obyte-explorer/explorer.js', explorerFile);

console.log("You can now run 'npm run genesis'");

