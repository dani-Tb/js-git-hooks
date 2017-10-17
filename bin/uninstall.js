#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const findGitFolderCommand = 'git rev-parse --show-toplevel';

const getGitRootFolder = function () {
    return execSync(findGitFolderCommand).toString().trim().replace('\n', '');
};

const removeHook = function (dest, name) {
    const backUpFilename = path.resolve(dest, name + '.js-git-hooks-old');

    if (fs.existsSync(backUpFilename)) {
        fs.unlinkSync(path.resolve(dest, name));
        fs.renameSync(backUpFilename, path.resolve(dest, name));
    } else {
        console.log('no bkup to restore ' + backUpFilename);
    }
};

const uninstall = function () {
    let dest = path.resolve(getGitRootFolder(), '.git', 'hooks');

    if (!dest) {
        throw new Error('Not valid project to install in');
    }

    removeHook(dest, 'pre-commit');
    removeHook(dest, 'pre-push');
};

uninstall();