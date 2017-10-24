'use strict';

const { execSync } = require('child_process');

const gitCommandNoGrep = 'git diff --cached --name-only --diff-filter=ACMR';

let cwd = process.cwd();

module.exports = function () {
    return execSync(gitCommandNoGrep, {cwd: cwd})
        .toString()
        .trim()
        .split('\n');
};