const Git = require('nodegit');
const path = require('path');
const fs = require('fs');
const linter = require('eslint').linter;

const findGitRoot = require('./app/lib/git.root.finder');

const currentPath = path.resolve(__dirname);

console.log('We are in : ' + currentPath);

const gitFolder = findGitRoot(currentPath);
const rootFolder = path.resolve(gitFolder, '..');

console.log('Git folder :: ' + gitFolder);
console.log('Root folder :: ' + rootFolder);

if (gitFolder === null) {
    console.log('No parent git project found');

    process.exit();
}


let p = Git.Repository.open(path.resolve(gitFolder)).then(
    function (repo) {
        repo.getStatus().then(function  (statuses) {
            function statusToText(status) {
                var words = [];
                if (status.isNew()) { words.push("NEW"); }
                if (status.isModified()) { words.push("MODIFIED"); }
                if (status.isTypechange()) { words.push("TYPECHANGE"); }
                if (status.isRenamed()) { words.push("RENAMED"); }
                if (status.isIgnored()) { words.push("IGNORED"); }

                return words.join(" ");
            }

            statuses.forEach(function(file) {
                console.log('  ');
                console.log(file.path() + " " + statusToText(file));

                console.log('Check file: ' + path.resolve(rootFolder, file.path()));

                // fs.readFile(file, 'utf8', function (err, data) {
                //     console.log('Error: %o', err);
                //     console.log('Data: %o', data.toString());
                // });

                let data = fs.readFileSync(path.resolve(rootFolder, file.path()));

                let code = new SourceCode(data.toString());

                console.log('Data : ' + code.text());

                // let messages = linter.verify(
                //     data.toString(),
                //     {
                //         "extends": "standard",
                //         "rules": {
                //         "indent": ["error", 4],
                //             "space-before-function-paren": ["error", {
                //             "anonymous": "always",
                //             "named": "never",
                //             "asyncArrow": "always"
                //         }],
                //             "semi": ["error", "always"],
                //             "eol-last": 0,
                //             "one-var": 0,
                //             "max-len": ["error", 120],
                //             "eqeqeq": ["warn", "always"]
                //     }
                // });
                //
                //
                // for (let key in messages) {
                //     console.log('Message ' + key + ': ' + messages[key].message);
                // }
                //
                // console.log('Done !!');

            });

        });
    },
    function (error) {
        console.log('Fails:\n\n' + JSON.stringify(error, null, 4));
    }
);

