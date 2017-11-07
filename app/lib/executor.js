'use strict';

const runCommand = require('./run.command');

let commands;

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
                    reject(error);
                }
            ).catch(
                function (error) {
                    reject(error);
                }
            );
        });
    }, Promise.resolve());
};

module.exports = {
    doThem
};