JS GIT HOOKS
============

A small script to use as git hooks. It checks modified files.

Not a lot of features, it fits my needs.

**Installation**
----------------

Use npm:

```bash
npm install js-git-hooks --save-dev
```

**Usage**
---------

Create and edit *.jshooksrc* in the root of your git project.
At this time only *pre-commit* and *pre-push* hooks are installed. 
Easy code update can install other hooks, but I don't need it at this time.   

Example of *.jshooksrc*:

```json
{
    "githooks": {
        "pre-commit": [
            "node  app/lib/hooks/eslint.integrator.js",
            "npm test"
          ],
        "pre-push": [
            "npm test",
            "php app/console run:hooks $@"
        ]
     }
}    
```
*githooks* key has a collection of hooks, and each hook has a list of shell commands 
relative to git project hook. This namespaces hooks list for add other config values 
if needed in the future.
 
Use **$@** to propagate hook arguments to commands. For example in *pre-push* hooks.

**WARNING!**
-----------

Npm post install script will remove previous pre-commit and pre-push scripts.
Copy them elsewhere and  use a .jshooksrc to define multiple commands to run as hooks: 
[.jshooksrc](.jshooksrc)

d.T.b - 2017