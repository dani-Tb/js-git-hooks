#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const linter = require('eslint').linter;
const term = require('terminal-kit').terminal;
const { execSync } = require('child_process');

const configFile = '.eslintrc';
const ERROR_CODE = 1;

const gitCommandNoGrep = 'git diff --cached --name-only --diff-filter=ACMR';

let cwd = process.cwd();
let config;

const filterJsFiles = function (allFileNames) {
    let jsFiles = [];
    let regex = new RegExp(/.js$/);

    for (let key in allFileNames) {
        if (regex.test(allFileNames[key])) {
            jsFiles.push(allFileNames[key]);
        }
    }

    return jsFiles;
};

const getGitCachedFiles = function () {
    let allFilesChanged = execSync(gitCommandNoGrep, {cwd: cwd})
        .toString()
        .trim()
        .split('\n');

    return filterJsFiles(allFilesChanged);
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

    if (files.length > 0) {
        executeLinter(files);
    } else {
        console.log('No JS files');
    }
};


GitChangesEslinting();
