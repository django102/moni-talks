const assert = require('assert');
const should = require('should');
const sinon = require('sinon'); // For mocking res object methods

const { json, nojson } = require('../../../api/services/ResponseService');


describe('ResponseService', () => {
    describe('json function', () => {
        let res, statusMock, jsonMock;

        beforeEach(() => {
            statusMock = sinon.stub().returnsThis();
            jsonMock = sinon.spy();
            res = {
                status: statusMock,
                json: jsonMock,
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return JSON response with status true and provided message', () => {
            const status = 200;
            const message = 'Success';
            json(status, res, message);
            assert(statusMock.calledWith(status));
            assert(jsonMock.calledWith({ status: true, message }));
        });

        it('should return JSON response with status false if status is greater than 299', () => {
            const status = 400;
            const message = 'Error';
            json(status, res, message);
            assert(statusMock.calledWith(status));
            assert(jsonMock.calledWith({ status: false, message }));
        });

        it('should include data in response if provided', () => {
            delete res.formatResponse;

            const status = 200;
            const message = 'Success';
            const data = { name: 'John', age: 30 };
            json(status, res, message, data);
            assert(statusMock.calledWith(status));
            assert(jsonMock.calledWith({ status: true, message, data }));
        });
        
        it('should include meta in response if provided', () => {
            const status = 200;
            const message = 'Success';
            const data = { name: 'John', age: 30 };
            const meta = { totalPages: 5 };
            json(status, res, message, data, meta);
            assert(statusMock.calledWith(status));
            assert(jsonMock.calledWith({ status: true, message, data, meta }));
        });
    });

    describe('nojson function', () => {
        let res, statusMock, jsonMock;

        beforeEach(() => {
            statusMock = sinon.stub().returnsThis();
            jsonMock = sinon.spy();
            res = {
                status: statusMock,
                json: jsonMock
            };
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return JSON response with provided data', () => {
            const status = 200;
            const data = { message: 'Data response' };
            nojson(status, res, null, data);
            assert(statusMock.calledWith(status));
            assert(jsonMock.calledWith(data));
        });
    });
});
