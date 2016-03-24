import {XhrBackend} from '../../../src/Backends/XhrBackend';
import {Request} from '../../../src/Request';
import {Response} from '../../../src/Response';

import chai = require('chai');


let expect = chai.expect;
let url = 'http://localhost:3000';


describe('#Backends/XhrBackend', () => {

	describe('fetch()', () => {

		it('should fetch json data via GET', (done) => {
			let xhr = new XhrBackend;
			let request = new Request(url, 'GET', {data: 1});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: '1'});
				done();
			});
		});

		it('should fetch json data via POST', (done) => {
			let xhr = new XhrBackend;
			let request = new Request(url, 'POST', {data: 1});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({data: '1'});
				done();
			});
		});

		it('should fetch jsonp data', (done) => {
			let xhr = new XhrBackend;
			let callback = XhrBackend['JSONP_METHOD_PREFIX'] + (XhrBackend['COUNTER'] + 1);

			let request = new Request(url, 'GET', {
				response: callback + '("hello");',
				contentType: 'application/javascript',
			}, {
				jsonp: 'serviceCallback',
			});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.data).to.be.eql('hello');
				done();
			});
		});

		it('should fetch json data with prefix', (done) => {
			let xhr = new XhrBackend;
			let request = new Request(url, 'POST', {response: 'while(1);{"number":1}'}, {
				jsonPrefix: 'while(1);',
			});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(response.json()).to.be.eql({number: 1});
				done();
			});
		});

		it('should send files', (done) => {
			let xhr = new XhrBackend;
			let request = new Request(url, 'POST', {}, {files: {
				readme: {
					filename: 'readme.md',
					file: new Blob(['testing readme'], {type: 'text/plain'}),
				},
				installation: {
					filename: 'ĚšČřŽýÁíÉ.md',
					file: new Blob(['yo'], {type: 'text/plain'}),
				}
			}});

			xhr.fetch(request, (err: Error, response: Response) => {
				expect(err).to.be.equal(null);
				expect(JSON.parse(response.getHeader('X-Mirror-Files'))).to.be.eql([		// Mirror-Files header is from mirror-server
					{
						name: 'readme',
						file: 'readme.md',
					},
					{
						name: 'installation',
						file: 'EsCrZyAiE.md',
					}
				]);
				done();
			});
		});

	});

});
