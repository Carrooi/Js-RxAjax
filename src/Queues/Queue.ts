import {IQueue} from './IQueue';
import {Request} from '../Request';
import {Helpers} from '../Utils/Helpers';
import {QueueItem} from '../interfaces';


export class Queue implements IQueue
{


	private requests: Array<QueueItem> = [];

	private running: boolean = false;


	public hasDestructiveRequests(): boolean
	{
		for (let i = 0; i < this.requests.length; i++) {
			if (Helpers.isDestructiveMethod(this.requests[i].request.method)) {
				return true;
			}
		}

		return false;
	}


	public append(request: Request, fn: (done?: () => void) => void): void
	{
		if (!Helpers.isDestructiveMethod(request.method) && !this.hasDestructiveRequests()) {
			fn();
			return;
		}

		this.requests.push({
			request: request,
			fn: fn,
		});
	}


	public isRunning(): boolean
	{
		return this.running === true;
	}


	public run(): void
	{
		if (!this.requests.length) {
			this.running = false;
			return;
		}

		this.running = true;

		let item = <QueueItem>this.requests.shift();

		item.fn(() => {
			this.run();
		});
	}

}
