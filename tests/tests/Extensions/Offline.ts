import {Http} from '../../../src/Http';
import {MockBackend} from '../../../src/Backends/MockBackend';
import {Offline} from '../../../src/Extensions/Offline';


let http: Http = null;
let xhr: MockBackend = null;
let offline: Offline = null;


describe('#Extensions/Offline', () => {

	beforeEach(() => {
		xhr = new MockBackend;
		http = new Http({backend: xhr});
		offline = new Offline(null, 50, false);

		http.addExtension(offline);
	});

	afterEach(() => {
		offline.stop();
		http.connected.unsubscribe();
		http.disconnected.unsubscribe();
	});

	it('should call disconnect event', (done) => {
		xhr.receive();

		http.disconnected.subscribe(() => {
			done();
		});

		offline.start();

		setTimeout(() => {
			xhr.receive('', {}, 404);
		}, 200);
	});

	it('should call connected event', (done) => {
		xhr.receive('', {}, 404);

		http.connected.subscribe(() => {
			done();
		});

		offline.start();

		setTimeout(() => {
			xhr.receive();
		}, 200);
	});

});
