#!/usr/bin/env node

'use strict';

const executor = require('./app/lib/executor');

// executor.doIt('ls -hal --color');

const commands = [
    'ls -hal --color',
    // 'ping "non-valid-domain-name"',
    'ping -c 4 google.com',
];

executor.doThem(commands).then(
    function () {
        console.error("All command successful\n");

        process.exitCode = 0;
    },
    function () {
        console.log("Some commands Fail\n");

        process.exitCode = 1;
    }
);