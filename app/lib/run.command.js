'use strict';

const term = require('terminal-kit').terminal;
const spawn = require('child_process').spawn;

const SUCCESS_CODE = 0;
const ERROR_CODE = 1;

const runCommand = function (command) {
    term.green(`RUN ${command}\n`);

    return new Promise((resolve, reject) => {
        let proc = spawn(command, [], {shell: true});

        proc.stdout.on('data', function (data) {
            term(data.toString());
        });

        proc.stderr.on('data', function (data) {
            term.red(data.toString());
        });

        proc.on('close', function (code) {
            // console.log(`child process exited with code ${code}`);

            if (code === SUCCESS_CODE) {
                resolve(code);
            } else {
                reject(code);
            }
        });

        proc.on('error', function (error) {
            term.red(`Some error occurred: ${error}\n`);

            reject(ERROR_CODE);
        });

        proc.on('disconnect', function (res) {
            term.red(`Disconnect: ${res} \n`);
        });

        proc.on('exit', function (res) {
            term.red(`Exit ${res}\n`);
        });

        proc.on('message', function (msg) {
            term.red(`Message ${msg}\n`);
        });
    });
};

module.exports = runCommand;