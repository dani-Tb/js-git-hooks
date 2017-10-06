'use strict';

const runCommand = require('./run.command');

let commands;

const ERROR_CODE = 1;

const doThem = function (commandStrings) {
    commands = commandStrings;

    return commands.reduce(function (previousPromise, command) {
        return new Promise(function (resolve, reject) {
            previousPromise.then(
                function () {
                    resolve(runCommand(command));
                },
                function (error) {
                    console.log(`Command error ${error}`);

                    reject(ERROR_CODE);
                }
            ).catch(
                function (error) {
                    console.log(`Command exception ${error}`);

                    reject(ERROR_CODE);
                }
            );
        });
    }, Promise.resolve());
};

module.exports = {
    doThem
};