import {Http} from '../../../src/Http';
import {MockBackend} from '../../../src/Backends/MockBackend';
import {Snippets} from '../../../src/Extensions/Snippets';

import chai = require('chai');


let expect = chai.expect;
let url = 'http://localhost:3000';


let http: Http = null;
let xhr: MockBackend = null;
let snippets: Snippets = null;
let el: HTMLDivElement = null;


describe('#Extensions/Snippets', () => {

	beforeEach(() => {
		xhr = new MockBackend;
		http = new Http({backend: xhr});
		snippets = new Snippets;

		http.addExtension(snippets);

		el = document.createElement('div');
		el.id = 'snippet-el';
		el.innerHTML = 'before';
		el.style.display = 'none';

		document.body.appendChild(el);
	});

	afterEach(() => {
		document.body.removeChild(el);
	});

	it('should update snippet', (done) => {
		expect(el.innerHTML).to.be.equal('before');

		snippets.processed.subscribe(() => {
			expect(el.innerHTML).to.be.equal('after');
			done();
		});

		xhr.receive('{"snippets": {"snippet-el": "after"}}');

		http.get(url).subscribe(() => {});
	});

	it('should append snippet', (done) => {
		expect(el.innerHTML).to.be.equal('before');

		el.setAttribute('data-append', 'data-append');

		snippets.processed.subscribe(() => {
			expect(el.innerHTML).to.be.equal('before-after');
			done();
		});

		xhr.receive('{"snippets": {"snippet-el": "-after"}}');

		http.get(url).subscribe(() => {});
	});

});
