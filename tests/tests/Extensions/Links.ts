import {Http} from '../../../src/Http';
import {Response} from '../../../src/Response';
import {MockBackend} from '../../../src/Backends/MockBackend';
import {Links} from '../../../src/Extensions/Links';

import chai = require('chai');


let expect = chai.expect;


let http: Http = null;
let xhr: MockBackend = null;
let links: Links = null;
let el: HTMLElement = null;


let createClickEvent = (): MouseEvent => {
	let event = document.createEvent('MouseEvent');
	event.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);

	return event;
};


describe('#Extensions/Links', () => {

	beforeEach(() => {
		xhr = new MockBackend;
		http = new Http({backend: xhr});
		links = new Links;

		http.addExtension(links);

		el = document.createElement('a');
		el.setAttribute('href', '#');
		el.className = 'ajax';

		document.body.appendChild(el);
	});

	afterEach(() => {
		links.detachLinksEvent();
		document.body.removeChild(el);
	});

	it('should send request on click', (done) => {
		xhr.receive('1');

		http.listen('success', (response: Response) => {
			expect(response.json()).to.be.equal(1);
			done();
		});

		el.dispatchEvent(createClickEvent());
	});

});
