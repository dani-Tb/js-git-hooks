'use strict';

// const term = require('terminal-kit').terminal;
const executor = require('./lib/executor');

let config;

function commandNotConfigured(command) {
    return !config.hasOwnProperty('githooks') || !config.githooks.hasOwnProperty(command);
}

module.exports = function (command, configFilePath) {
    if (!command) {
        throw new Error('No hook specified to run. See --help');
    }

    config = require('./lib/config').getConfig(configFilePath);

    if (commandNotConfigured(command)) {
        throw new Error('No hook configured in jshooksrc file.');
    }

    executor.doThem(config.githooks[command]).then(
        function () {
            console.log('Hooks passed!');

            process.exitCode = 0;
        },
        function () {
            console.log('Fix your code!');

            process.exitCode = -1;
        }
    );
};