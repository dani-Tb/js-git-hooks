#!/usr/bin/env node

const path = require('path');
const argv = require('yargs')
    .usage('Usage: $0 -f /config/file -c command')
    .demandOption(['f', 'c'])
    .argv;

const AppPath = path.resolve(__dirname, '../app/main.js');
const App = require(AppPath);
let command, configFile;

if (argv.c) {
    command = argv.c;
} else {
    throw new Error('No command defined');
}

if (argv.f) {
    configFile = path.resolve(argv.f);
} else {
    throw new Error('No config file defined');
}

App(command, configFile);

// console.log('exit code :: ', process.exitCode);