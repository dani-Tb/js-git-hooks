#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ignore = require('ignore');
const term = require('terminal-kit').terminal;

// const stylelint = require('stylelint');
const filterByFiletypes = require('../lib/hooks/filter.by.file.types');
const getGitCachedFiles = require('../lib/hooks/get.git.cached.files');
// const { execSync } = require('child_process');
const { doThem } = require('../lib/executor');

const configfile = '.stylelintrc';
const ignoreFile = '.stylelintignore';
const ERROR_CODE = 1;
const SUCCESS_CODE = 0;

let cwd = process.cwd();
let configFilePath;
let ignoreFilePath;

const filterScssFiles = function (allFileNames) {
    return filterByFiletypes(allFileNames, /.scss$/);
};

const getGitScssCachedFiles = function () {
    return filterScssFiles(getGitCachedFiles());
};

const removeIgnored = function (files) {
    const ignoreText = fs.readFileSync(ignoreFilePath, 'utf8');
    return ignore().add(ignoreText).filter(files);
};

const prepareCommands = function (files) {
    const commands = [];

    const baseDir = path.resolve(__dirname, '..', '..', '..', '..'); // TODO: improve this!

    const executable = path.resolve(
        require.resolve('stylelint').split('/stylelint/').shift(),
        'stylelint',
        'bin',
        'stylelint.js'
    );

    files = removeIgnored(files);

    for (let i in files) {
        let command = `${executable} "${files[i]}" \
        --config "${configFilePath}" --syntax scss --configBasedir ${baseDir}`;

        commands.push(command);
    }

    return commands;
};

const executeStyleLinter = function (files) {
    const commands = prepareCommands(files);

    return doThem(commands);
};

const GitChangesStyleLinting = function () {
    configFilePath = path.resolve(cwd, configfile);
    ignoreFilePath = path.resolve(cwd, ignoreFile);

    let files = getGitScssCachedFiles();

    if (files.length > 0) {
        executeStyleLinter(files).then(
            function () {
                term.green(`Style linting ok!\n`);

                process.exitCode = SUCCESS_CODE;
            },
            function (error) {
                term.red(`Fix your SCSS files! ${error}\n`);

                process.exitCode = ERROR_CODE;
            }
        ).catch(
            function (error) {
                term.red(`Fix your SCSS files! Unhandled exception: ${error}\n`);

                process.exitCode = ERROR_CODE;
            }
        );
    } else {
        term('No SCSS files to lint \n');
    }
};

GitChangesStyleLinting();
