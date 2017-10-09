'use strict';

const term = require('terminal-kit').terminal;
const executor = require('./lib/executor');

const SUCCESS_CODE = 0;
const ERROR_CODE = 1;

let config;

function commandNotConfigured(command) {
    return !config.hasOwnProperty('githooks') || !config.githooks.hasOwnProperty(command);
}

module.exports = function (command, configFilePath, args) {
    if (!command) {
        throw new Error('No hook specified to run. See --help');
    }

    config = require('./lib/config').getConfig(configFilePath);

    if (commandNotConfigured(command)) {
        throw new Error('No hook configured in jshooksrc file.');
    }

    executor.doThem(config.githooks[command], args).then(
        function () {
            term.green(`Hooks passed!\n`);

            process.exitCode = SUCCESS_CODE;
        },
        function (error) {
            term.red(`Fix your code! ${error}\n`);

            process.exitCode = ERROR_CODE;
        }
    ).catch(
        function (error) {
            term.red(`Fix your code! Unhandled exception: ${error}\n`);

            process.exitCode = ERROR_CODE;
        }
    );
};