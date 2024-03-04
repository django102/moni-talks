const should = require('should');
const sinon = require('sinon');
const pino = require('pino');
const LoggerService = require('../../../api/services/LoggerService');

describe('LoggerService', () => {
    let logger;
    let sandbox;

    before(() => {
        // Create a sandbox for stubs and spies
        sandbox = sinon.createSandbox();

        // Stub pino logger methods
        logger = {
            info: sandbox.stub(),
            debug: sandbox.stub(),
            trace: sandbox.stub(),
            warn: sandbox.stub(),
            error: sandbox.stub(),
            fatal: sandbox.stub()
        };

        // Replace pino logger with stubbed logger
        sandbox.stub(pino, 'pino').returns(logger);
    });

    afterEach(() => {
        // Reset stubs after each test
        sandbox.reset();
    });

    after(() => {
        // Restore original behavior after all tests
        sandbox.restore();
    });

    it('should log info message', () => {
        const message = 'This is an info message';
        LoggerService.info(message);

        should(logger.info.calledOnceWithExactly(message)).be.true;
    });

    it('should log debug message', () => {
        const message = 'This is a debug message';
        LoggerService.debug(message);

        should(logger.debug.calledOnceWithExactly(message)).be.true;
    });

    it('should log trace message', () => {
        const message = 'This is a trace message';
        LoggerService.trace(message);

        should(logger.trace.calledOnceWithExactly(message)).be.true;
    });

    it('should log warn message', () => {
        const message = 'This is a warn message';
        LoggerService.warn(message);

        should(logger.warn.calledOnceWithExactly(message)).be.true;
    });

    it('should log error message', () => {
        const message = 'This is an error message';
        LoggerService.error(message);

        should(logger.error.calledOnceWithExactly(message)).be.true;
    });

    it('should log fatal message', () => {
        const message = 'This is a fatal message';
        LoggerService.fatal(message);

        should(logger.fatal.calledOnceWithExactly(message)).be.true;
    });
});
