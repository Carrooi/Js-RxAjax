import {MockBackend} from '../../../src/Backends/MockBackend';
import {Request} from '../../../src/Request';
import {Response} from '../../../src/Response';

import chai = require('chai');


let expect = chai.expect;
let url = 'http://localhost:3000';


describe('#Backends/XhrBackend', () => {

	describe('fetch()', () => {

		it('should fetch json data via GET', (done) => {
			let xhr = new MockBackend;
			let request = new Request(url, 'GET');

			xhr.receive('{"data": 1}', {'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: 1});
				done();
			});
		});

		it('should fetch json data via POST', (done) => {
			let xhr = new MockBackend;
			let request = new Request(url, 'POST');

			xhr.receive('{"data": 2}', {'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: 2});
				done();
			});
		});

		it('should fetch jsonp data', (done) => {
			let xhr = new MockBackend;
			let callback = MockBackend['JSONP_METHOD_PREFIX'] + (MockBackend['COUNTER'] + 1);

			let request = new Request(url, 'GET', callback + '("hello");', {
				jsonp: 'serviceCallback',
			});

			xhr.receiveAndResend({'content-type': 'application/javascript'});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.data).to.be.eql('hello');
				done();
			});
		});

		it('should fetch json data with prefix', (done) => {
			let xhr = new MockBackend;
			let request = new Request(url, 'POST', 'while(1);{"number":1}', {
				jsonPrefix: 'while(1);',
			});

			xhr.receiveAndResend({'content-type': 'application/json'});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({number: 1});
				done();
			});
		});

	});

});
