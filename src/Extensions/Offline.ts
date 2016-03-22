import {AbstractExtension} from './AbstractExtension';
import {Response} from '../Response';


export class Offline extends AbstractExtension
{


	private timer: number = null;

	private offline: boolean = false;

	private url: string;

	private timeout: number;


	constructor(url: string = 'favicon.ico', timeout: number = 5000, autostart: boolean = true)
	{
		super();

		this.url = url;
		this.timeout = timeout;

		if (autostart) {
			this.start();
		}
	}


	public start(): void
	{
		if (this.timer !== null) {
			throw new Error('Offline http extension is already running.');
		}

		this.check();
	}


	public stop(): void
	{
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}


	private check()
	{
		this.timer = setTimeout(() => {
			let unique = Math.floor(Math.random() * 1000000000);		// prevent from caching

			this.http.request(this.url, 'HEAD', {r: unique}).subscribe((response: Response) => {
				if ((response.status >= 200 && response.status <= 300) || response.status === 304) {
					if (this.offline) {
						this.offline = false;
						this.http.emit('connected', null);
					}

				} else if (!this.offline) {
					this.offline = true;
					this.http.emit('disconnected', null);
				}

				this.check();

			}, () => {
				if (!this.offline) {
					this.offline = true;
					this.http.emit('disconnected', null);
				}

				this.check();
			});
		}, this.timeout);
	}

}
