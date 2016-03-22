import {Http} from '../../src/Http';
import {MockBackend} from '../../src/Backends/MockBackend';
import {Request} from '../../src/Request';
import {Response} from '../../src/Response';
import {AbstractExtension} from '../../src/Extensions/AbstractExtension';

import chai = require('chai');


let expect = chai.expect;
let url = 'http://localhost:3000';


let http: Http = null;
let xhr: MockBackend = null;


describe('#Http', () => {

	beforeEach(() => {
		xhr = new MockBackend;
		http = new Http({backend: xhr});
	});

	afterEach(() => {
		http.dispose();
	});

	describe('request()', () => {

		it('should call all successful events', (done) => {
			let called = [];

			http.listen('send', (request: Request) => {
				called.push('send');

				expect(request).to.be.an.instanceOf(Request);
			});

			http.listen('afterSend', (request: Request) => {
				called.push('afterSend');

				expect(request).to.be.an.instanceOf(Request);
			});

			http.listen('success', (response: Response) => {
				called.push('success');

				expect(response).to.be.an.instanceOf(Response);
				expect(called).to.be.eql(['send', 'afterSend', 'success']);
				done();
			});

			xhr.receive();

			http.request(url, 'GET').subscribe(() => {});
		});

		it('should call all errored events', (done) => {
			let called = [];

			http.listen('send', (request: Request) => {
				called.push('send');

				expect(request).to.be.an.instanceOf(Request);
			});

			http.listen('afterSend', (request: Request) => {
				called.push('afterSend');

				expect(request).to.be.an.instanceOf(Request);
			});

			http.listen('error', (err: Error) => {
				called.push('error');

				expect(err).to.be.an.instanceOf(Error);
				expect(called).to.be.eql(['send', 'afterSend', 'error']);
				done();
			});

			xhr.receive('', {}, 500);

			http.request(url, 'GET').subscribe(() => {}, () => {});
		});

	});

	describe('get()', () => {

		it('should fetch data via GET', (done) => {
			xhr.receive('');

			http.get(url).subscribe((response: Response) => {
				expect(response.json()).to.be.eql(null);
				done();
			});
		});

	});

	describe('post()', () => {

		it('should fetch data via POST', (done) => {
			xhr.receiveAndResend();

			http.post(url, '{"number": 1}').subscribe((response: Response) => {
				expect(response.json()).to.be.eql({number: 1});
				done();
			});
		});

	});

	describe('addExtension()', () => {

		it('should call all extension successful methods', (done) => {
			let called = [];

			class TestExtension extends AbstractExtension
			{


				public send(request: Request): void
				{
					called.push('send');

					expect(request).to.be.an.instanceOf(Request);
				}


				public afterSend(request: Request): void
				{
					called.push('afterSend');

					expect(request).to.be.an.instanceOf(Request);
				}


				public error(err: Error): void
				{
					called.push('error');
				}


				public success(response: Response): void
				{
					called.push('success');

					expect(response).to.be.an.instanceOf(Response);
					expect(called).to.be.eql(['send', 'afterSend', 'success']);
					done();
				}

			}

			http.addExtension(new TestExtension);

			xhr.receive();

			http.request(url, 'GET').subscribe(() => {});
		});

		it('should call all extension errored methods', (done) => {
			let called = [];

			class TestExtension extends AbstractExtension
			{


				public send(request: Request): void
				{
					called.push('send');

					expect(request).to.be.an.instanceOf(Request);
				}


				public afterSend(request: Request): void
				{
					called.push('afterSend');

					expect(request).to.be.an.instanceOf(Request);
				}


				public error(err: Error): void
				{
					called.push('error');

					expect(err).to.be.an.instanceOf(Error);
					expect(called).to.be.eql(['send', 'afterSend', 'error']);
					done();
				}


				public success(response: Response): void
				{
					called.push('success');
				}

			}

			http.addExtension(new TestExtension);

			xhr.receive('', {}, 500);

			http.request(url, 'GET').subscribe(() => {}, () => {});
		});

	});

});
