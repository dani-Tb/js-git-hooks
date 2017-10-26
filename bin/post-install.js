#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const Mustache = require('mustache');

const findGitFolderCommand = 'git rev-parse --show-toplevel';

const getGitRootFolder = function () {
    return execSync(findGitFolderCommand).toString().trim().replace(`\n`, '');
};

const copyFile = function (src, dest) {
    fs.renameSync(src, dest);
};

const installHook = function (destPath, name) {
    let dest = path.resolve(destPath);

    console.log('dest ' + dest);

    let script = path.resolve(__dirname, './js-git-hooks.js');
    let templateString = fs.readFileSync(path.resolve(__dirname, '..', 'Resources', 'script.template')).toString();

    let scriptContent = Mustache.render(templateString, {name: name, script: script});

    if (fs.existsSync(dest) && !fs.existsSync(`${dest}.js-git-hooks-old`)) {
        copyFile(dest, `${dest}.js-git-hooks-old`);
    }

    fs.writeFileSync(dest, scriptContent);
    fs.chmodSync(dest, '754');
};

const install = function () {
    let dest = path.resolve(getGitRootFolder(), '.git');

    if (!dest) {
        throw new Error('Not valid project to install in');
    }

    console.log('Project folder: ' + dest);

    installHook(path.resolve(dest, './hooks/pre-commit'), 'pre-commit');
    installHook(path.resolve(dest, './hooks/pre-push'), 'pre-push');
};

const nonValidEnvironments = ['oficinas', 'preprod', 'prod'];

const mustPostInstallInThisEnvironment = function () {
    return !process.env.NODE_ENV || nonValidEnvironments.indexOf(process.env.NODE_ENV) === -1;
};

if (mustPostInstallInThisEnvironment()) {
    install();
} else {
    console.log('JS GIT HOOKS POST INSTALL SKIPPED');
}
