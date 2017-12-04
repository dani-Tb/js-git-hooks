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

    if (
        !fs.existsSync(dest) ||
        !fs.existsSync(path.resolve(dest, 'hooks'))
    ) {
        console.log('\n');
        console.log('\x1b[33m%s\x1b[0m', 'WARNING: cannot auto-install js-git-hooks:');
        console.log(' - No `.git/hooks` folder found. (are you using git subomdules?)');
        console.log(' - You can copy/install scripts by hand.');
        console.log('\n');

        process.exit(0);
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
