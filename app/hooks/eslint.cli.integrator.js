#!/usr/bin/env node

const path = require('path');
const { CLIEngine } = require('eslint');
const term = require('terminal-kit').terminal;

const filterByFileTypes = require('../lib/hooks/filter.by.file.types');
const getGitCachedFiles = require('../lib/hooks/get.git.cached.files');

const configFile = '.eslintrc';
const ignoreFile = '.eslintignore';
const ERROR_CODE = 1;

const SEVERITY_WARN = 1;
const SEVERITY_ERROR = 2;

let cwd = process.cwd();
let configFilePath;
let ignoreFilePath;

const filterJsFiles = function (allFileNames) {
    return filterByFileTypes(allFileNames, /.js$/);
};

const getGitJsCachedFiles = function () {
    return filterJsFiles(getGitCachedFiles());
};

const executeLinter = function (files) {
    const cli = new CLIEngine({
        configFile: configFilePath,
        ignorePath: ignoreFilePath
    });

    files.forEach(function (file) {
        let filePath = path.resolve(cwd, file);

        term('\n Check: ').yellow(filePath);

        let { results, errorCount, warningCount } = cli.executeOnFiles([filePath]);

        if ((errorCount + warningCount) > 0) {
            for (let i in results) {
                let messages = results[i].messages;

                if (messages.length) {
                    for (let key in messages) {
                        if (messages[key].severity === SEVERITY_ERROR) {
                            process.exitCode = ERROR_CODE;
                            term.red(`\nERROR - ${messages[key].message}`);

                            if (messages[key].line !== undefined && messages[key].column !== undefined) {
                                term.column(65)
                                    .red(`Line:${messages[key].line}, Column:${messages[key].column}`);
                            }
                        } else if (messages[key].severity === SEVERITY_WARN) {
                            term.yellow(`\nWARN  - ${messages[key].message}`);

                            if (messages[key].line !== undefined && messages[key].column !== undefined) {
                                term.column(65)
                                    .yellow(`Line:${messages[key].line}, Column:${messages[key].column}`);
                            }
                        } else {
                            term.magenta(`\nLEVEL?- ${messages[key].message} `);

                            if (messages[key].line !== undefined && messages[key].column !== undefined) {
                                term.column(65)
                                    .magenta(`Line:${messages[key].line}, Column:${messages[key].column}`);
                            }
                        }
                    }
                } else {
                    term.green('\n- OK!');
                }
            }

            term(`\nResults : `)
                .red(`${errorCount} ERRORS`)
                .yellow(` ${warningCount} WARNINGS`);
        } else {
            term.green('\n- OK!');
        }

        term('\n');
    });
};

const GitChangesEslinting = function () {
    configFilePath = path.resolve(cwd, configFile);

    ignoreFilePath = path.resolve(cwd, ignoreFile);

    let files = getGitJsCachedFiles();

    if (files.length > 0) {
        executeLinter(files);
    } else {
        console.log('No JS files');
    }
};

GitChangesEslinting();