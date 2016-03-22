import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Request} from './Request';
import {Response} from './Response';
import {IBackend} from './Backends/IBackend';
import {XhrBackend} from './Backends/XhrBackend';
import {Queue} from './Queue';
import {EventEmitter} from './Utils/EventEmitter';
import {AbstractExtension} from './Extensions/AbstractExtension';
import {HttpOptions, RequestOptions, FilesList} from './interfaces';


export class Http extends EventEmitter
{


	private backend: IBackend;

	private queue: Queue;

	private extensions: Array<AbstractExtension> = [];


	constructor(options: HttpOptions = {})
	{
		super();

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

			this.queue.append(request, (done) => {
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
		super.emit(name, data);

		for (let i = 0; i < this.extensions.length; i++) {
			if (typeof this.extensions[i][name] !== 'undefined') {
				this.extensions[i][name](data);
			}
		}
	}

}
