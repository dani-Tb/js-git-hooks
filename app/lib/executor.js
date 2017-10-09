'use strict';

const runCommand = require('./run.command');

let commands;

const ERROR_CODE = 1;

const doThem = function (commandStrings, args = []) {
    commands = commandStrings;

    return commands.reduce(function (previousPromise, command) {
        let fullCommand = command.replace('$@', args.join(' '));

        return new Promise(function (resolve, reject) {
            previousPromise.then(
                function () {
                    resolve(runCommand(fullCommand));
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