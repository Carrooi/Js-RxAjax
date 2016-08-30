import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subject} from 'rxjs/Subject';
import {Request} from './Request';
import {Response} from './Response';
import {IBackend} from './Backends/IBackend';
import {XhrBackend} from './Backends/XhrBackend';
import {IQueue} from './Queues/IQueue';
import {Queue} from './Queues/Queue';
import {AbstractExtension} from './Extensions/AbstractExtension';
import {HttpOptions, RequestOptions, FilesList} from './interfaces';


export class Http
{


	private backend: IBackend;

	private queue: IQueue;

	private extensions: Array<AbstractExtension> = [];


	public send: Subject<any> = new Subject;

	public afterSend: Subject<any> = new Subject;

	public success: Subject<any> = new Subject;

	public error: Subject<any> = new Subject;

	public connected: Subject<any> = new Subject;

	public disconnected: Subject<any> = new Subject;


	constructor(options: HttpOptions = {})
	{
		if (!options.backend) {
			options.backend = new XhrBackend;
		}

		if (!options.queue) {
			options.queue = new Queue;
		}

		this.backend = options.backend;
		this.queue = options.queue;
	}


	public request(url, method: string = 'GET', data: any = null, options: RequestOptions = {}): Observable<Response>
	{
		return new Observable<Response>((subscriber: Subscriber<Response>) => {
			let request = new Request(url, method, data, options);
			let stop = null;

			this.emit('send', request);

			this.queue.append(request, (done?: () => void) => {
				stop = this.backend.fetch(request, (err: Error, response: Response) => {
					if (done) {
						done();
					}

					if (err) {
						subscriber.error(err);

						this.emit('error', err);

					} else {
						subscriber.next(response);
						subscriber.complete();

						this.emit('success', response);
					}
				});
			});

			if (!this.queue.isRunning()) {
				this.queue.run();
			}

			this.emit('afterSend', request);

			return () => {
				if (stop) {
					stop();
				}
			};
		});
	}


	public get(url: string, data: any = null, options: RequestOptions = {}): Observable<Response>
	{
		return this.request(url, 'GET', data, options);
	}


	public post(url: string, data: any = null, options: RequestOptions = {}): Observable<Response>
	{
		return this.request(url, 'POST', data, options);
	}


	public files(url: string, files: FilesList = {}, data: any = null, options: RequestOptions = {}): Observable<Response>
	{
		options.files = files;
		return this.request(url, 'POST', data, options);
	}


	public addExtension(extension: AbstractExtension): void
	{
		extension.attach(this);
		this.extensions.push(extension);
	}


	public emit(name: string, data: any): void
	{
		(<Subject<any>>this[name]).next(data);

		for (let i = 0; i < this.extensions.length; i++) {
			if (typeof this.extensions[i][name] !== 'undefined') {
				this.extensions[i][name](data);
			}
		}
	}

}
