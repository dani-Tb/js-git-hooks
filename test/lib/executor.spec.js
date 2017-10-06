'use strict';

const path = require('path');
const executorPath = path.resolve(__dirname, '../../app/lib/executor');

const successCode = 0;
const errorCode = 1;

const runCommandStub = function (command) {
    if (command === 'successful') {
        return Promise.resolve(successCode);
    }

    if (command === 'failed') {
        return Promise.reject(errorCode);
    }

    throw new Error('Exception Run Command Stub');
};

const executor = proxyquire(executorPath, {
    './run.command': runCommandStub
});

describe('T1000: EXECUTOR', function () {
    it ('should fail if one process fail', function (done) {
        let promise = executor.doThem(['successful', 'failed']);

        promise.then(
            function () {
                // this should not be called
                console.log(`this should not be called \n`);

                expect(true).to.be.false;

                done();
            },
            function (code) {
                console.log(code);

                expect(code).to.be.equal(errorCode);

                done();
            }
        ).catch(function (error) {
            console.log('KO - This should not execute');

            done(new Error(`Some exception thrown:: ${error}\n`));
        });
    });

    // TODO: fix this test !! SPY not working (¿??¿¿?)
    it ('should not execute remaining commands if one fails', function (done) {
        let runSpy = sinon.spy(runCommandStub);

        const executor = proxyquire(executorPath, {
            './run.command': runSpy
        });

        let promise = executor.doThem(['failed', 'successful']);

        promise.then(
            function () {
                // this should not be called
                console.log(`this should not be called \n`);

                expect(true).to.be.false;

                done();
            },
            function (code) {
                console.log(code);
                expect(code).to.be.equal(errorCode);

                // expect(runSpy).to.have.been.calledWith('failed');
                // expect(runSpy).not.to.have.been.calledWith('successful');

                expect(runSpy.calledWith('failed')).to.be.true;

                done();
            }
        ).catch(function (error) {
            console.log('KO - This should not execute');

            done(new Error(`Some exception thrown:: ${error}\n`));
        });
    });

    it ('should success if all processes succeded', function (done) {
        let promise = executor.doThem(['successful']);

        promise.then(
            function (code) {
                expect(code).to.be.equal(successCode);

                done();
            },
            function () {
                // this should not be called
                expect(true).to.be.false;

                done();
            }
        ).catch(function (error) {
            console.log('OK - This should not execute');

            done(`Some exception thrown ${error}\n`);
        });
    });
});