'use strict';

const term = require('terminal-kit').terminal;

const spawn = require('child_process').spawn;

const doIt = function (command) {
    return new Promise( (resolve, reject) => {
        let proc = spawn(command, [], {shell: true});

        proc.stdout.on('data', function (data) {
            term(data.toString());
        });

        proc.stderr.on('data', function (data) {
            term.red(data.toString());
        });

        proc.on('close', function (code) {
            // console.log(`child process exited with code ${code}`);

            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
};

const doThem = function (commands) {
    const promises = [];

    for (let key in commands) {
        promises.push(doIt(commands[key]));
    }

    return Promise.all(promises);
};

module.exports = {
    // doIt,
    doThem,
};