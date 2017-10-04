'use strict';

const path = require('path');
const fs = require('fs');

const getConfig = function (file) {
    return Object.assign(JSON.parse(fs.readFileSync(file, 'utf8')), {'projectPath': path.dirname(file)});
};

module.exports = {
    getConfig,
};
