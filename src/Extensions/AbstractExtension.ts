import {Http} from '../Http';
import {Request} from '../Request';
import {Response} from '../Response';
import {EventEmitter} from '../Utils/EventEmitter';


export abstract class AbstractExtension extends EventEmitter
{


	protected http: Http;


	public attach(http: Http): void
	{
		this.http = http;
	}


	public send(request: Request): void
	{

	}


	public afterSend(request: Request): void
	{

	}


	public success(response: Response): void
	{

	}


	public error(err: Error): void
	{

	}

}
