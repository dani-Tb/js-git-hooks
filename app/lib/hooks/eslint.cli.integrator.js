#!/usr/bin/env node

const path = require('path');
const { CLIEngine } = require('eslint');
const term = require('terminal-kit').terminal;
const { execSync } = require('child_process');

const configFile = '.eslintrc';
const ignoreFile = '.eslintignore';
const ERROR_CODE = 1;

const SEVERITY_WARN = 1;
const SEVERITY_ERROR = 2;

const gitCommandNoGrep = 'git diff --cached --name-only --diff-filter=ACMR';

let cwd = process.cwd();
let configFilePath;
let ignoreFilePath;

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

    let files = getGitCachedFiles();

    if (files.length > 0) {
        executeLinter(files);
    } else {
        console.log('No JS files');
    }
};

GitChangesEslinting();