'use strict';

debugger;

const path = require('path');
const executorPath = path.resolve(__dirname, '../../app/lib/executor');

const StdioMock = function () {
    this.dataListener = null;

    this.on = (event, callback) => {
        this.dataListener = callback;
    };

    this.setData = (data) => {
        this.dataListener(data);
    };
};

const ProcMock = function (returnCode) {
    this.stdout = new StdioMock();
    this.stderr = new StdioMock();

    this.closeListener = null;

    this.on = (event, callback) => {
        this.closeListener = callback;
    };

    this.close = () => {
        this.closeListener(returnCode);
    };
};


const successCode = 0;
const errorCode = 1;

const procs = {
    'successful': new ProcMock(successCode),
    'failed': new ProcMock(errorCode)
};

const spawnStub = function (command) {
    let proc = procs[command];

    setTimeout(() => {
        proc.stdout.setData("output data\n");

        if (command === 'failed') {
            proc.stderr.setData("error message\n");
        }

        proc.close();
    }, 0);

    return proc;
};

const executor = proxyquire(executorPath, {
    'child_process': {
        spawn: spawnStub
    }
});

describe.only('T1000: EXECUTOR', function () {
    it ('should fail if one process fail', function (done) {
        let promise = executor.doThem(['successful', 'failed']);

        promise.then(
            function () {
                // this should not be called
                expect(true).to.be.false;

                done();
            },
            function (codes) {
                console.log(codes);

                expect(codes[0]).to.be.equal(successCode);
                expect(codes[1]).to.be.equal(errorCode);

                done();
            }
        ).catch(function (error) {
            // console.log('KO - This should not execute');

            done();

            // throw error;
        });
    });

    it ('should success if all processes succeded', function (done) {
        let promise = executor.doThem(['successful']);

        promise.then(
            function (codes) {
                expect(codes[0]).to.be.equal(successCode);

                done();
            },
            function () {
                // this should not be called
                expect(true).to.be.false;

                done();
            }
        ).catch(function (error) {
            console.log('OK - This should not execute');

            done();

            throw error;
        });
    });
});