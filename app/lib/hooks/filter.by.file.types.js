'use strict';

module.exports = function (allFileNames, regularExpression) {
    let files = [];
    let regex = new RegExp(regularExpression);

    for (let key in allFileNames) {
        if (regex.test(allFileNames[key])) {
            files.push(allFileNames[key]);
        }
    }

    return files;
};