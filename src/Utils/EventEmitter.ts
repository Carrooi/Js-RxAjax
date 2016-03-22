import {Subject, Subscription} from 'rxjs/Rx';
import {RxSubjectsList} from '../interfaces';


export abstract class EventEmitter
{


	private subjects: RxSubjectsList = {};


	public emit(name: string, data: any): void
	{
		this.subjects[name] || (this.subjects[name] = new Subject);
		this.subjects[name].next(data);
	}


	public listen(name, handler: Function): Subscription
	{
		this.subjects[name] || (this.subjects[name] = new Subject);
		return this.subjects[name].subscribe(<any>handler);
	}


	public dispose(): void
	{
		for (let name in this.subjects) {
			if (this.subjects.hasOwnProperty(name)) {
				this.subjects[name].unsubscribe();
			}
		}

		this.subjects = {};
	}

}
