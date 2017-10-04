#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const linter = require('eslint').linter;
const term = require('terminal-kit').terminal;
const { execSync } = require('child_process');

const configFile = '.eslintrc';
const ERROR_CODE = 1;

const gitCommand = 'git diff --cached --name-only --diff-filter=ACMR | grep \'\\.js$\'';

let cwd = process.cwd();
let config;

const getGitCachedFiles = function () {
    return execSync(gitCommand, {cwd: cwd})
        .toString()
        .trim()
        .split('\n');
};

const executeLinter = function (files) {
    files.forEach(function (file) {
        let filePath = path.resolve(cwd, file);

        term('\n Check: ').yellow(filePath);

        let data = fs.readFileSync(filePath);

        let messages = linter.verify(
            data.toString(),
            config
        );

        if (messages.length) {
            for (let key in messages) {
                process.exitCode = ERROR_CODE;

                term.red(
                    '\n- ' + messages[key].message + ' Line:' + messages[key].line + ', Column:' + messages[key].column
                );
            }
        } else {
            term.green('\n- OK!');
        }

        term('\n');
    });
};

const GitChangesEslinting = function () {
    config = require('../config').getConfig(configFile);

    let files = getGitCachedFiles();

    executeLinter(files);
};

GitChangesEslinting();
