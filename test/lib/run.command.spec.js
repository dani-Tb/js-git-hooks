const path = require('path');

const runnerPath = path.resolve(__dirname, '../../app/lib/run.command');

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

    this.listeners = {};

    this.on = (event, callback) => {
        this.listeners[event] = callback;
    };

    this.close = () => {
        this.listeners['close'](returnCode);
    };
};


const spawnStub = function (command) {
    let proc = procs[command];
    let code = successCode;

    setTimeout(() => {
        proc.stdout.setData("output data\n");

        if (command === 'failed') {
            proc.stderr.setData("error message\n");
            code = errorCode;
        }

        proc.close(code);
    }, 0);

    return proc;
};

const successCode = 0;
const errorCode = 1;

const procs = {
    'successful': new ProcMock(successCode),
    'failed': new ProcMock(errorCode)
};

const runCommand = proxyquire(runnerPath, {
    'child_process': {
        spawn: spawnStub
    }
});

describe('RUN COMMAND', function () {
    it ('should return ERROR CODE on command failed', function (done) {
        let promise = runCommand('failed');

        promise.then(
            function () {
                done(new Error('This should not been called'));
            },
            function (code) {
                expect(code).to.be.equal(errorCode);

                done();
            }
        ).catch(function (error) {
            done(Error(`Should not throw exception :: ${error}`));
        });
    });

    it ('should return SUCCESS CODE on command success', function (done) {
        let promise = runCommand('successful');

        promise.then(
            function (code) {
                expect(code).to.be.equal(successCode);

                done();
            },
            function () {
                done(new Error('This should not been called'));
            }
        ).catch(function (error) {
            done(Error(`Should not throw exception :: ${error}`));
        });
    });
});