'use strict';

const path = require('path');
const mainPath = path.resolve(__dirname, '../app/main');

const executor = {
    doThem: function () {}
};

const commandsLis = [
    'echo "hola\n"'
];

const configMock = {
    'githooks': {
        'pre-commit': commandsLis
    }
};

const App = proxyquire(mainPath, {
    './lib/executor': executor,
    './lib/config': {
        getConfig: function () {
            return configMock;
        }
    }
});

describe('JS GIT HOOKS MAIN',  () => {
    describe('invoke failures', () => {
        it ('should throw exception if no hook specified to run', () => {
            expect(() => {
                App();
            }).to.throw();
        });

        it ('should throw exception if hook is not in the configuration', () => {
            expect(() => {
                App('pre_push');
            }).to.throw();
        });
    });

    describe('invoke success', () => {
        it ('should run commands defined', () => {
            let doThemSpy = sinon.stub(executor, 'doThem').callsFake(function () {
                return {
                    then: function (cb) {
                        cb();

                        return {
                            catch: function () {}
                        };
                    }
                };
            });

            App('pre-commit');

            expect(doThemSpy.callCount).to.equal(1);
            expect(doThemSpy).to.have.been.calledWith(commandsLis);

            doThemSpy.restore();
        });
    });
});