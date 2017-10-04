#!/usr/bin/node

const path = require('path');
const fs = require('fs');

const installHook = function (destPath, name) {
    let dest = path.resolve(destPath);

    console.log('dest ' + dest);

    let script = path.resolve(__dirname, './js-git-hooks.js');

    let scriptContent = `
#!/usr/bin/env sh 

CONFIG_FILE_PATH=$(readlink -f .jshooksrc) 
  
${script} -c ${name} -f $CONFIG_FILE_PATH
  
`;

    if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
    }

    fs.writeFileSync(dest, scriptContent);
    fs.chmodSync(dest, '754');
};

const install = function () {
    let dest = path.resolve(process.cwd(), '.git');

    if (!dest) {
        throw new Error('Not valid project to install in');
    }

    console.log('Project folder: ' + dest);

    installHook(path.resolve(dest, './hooks/pre-commit'), 'pre-commit');
};

install();