import {IQueue} from './IQueue';
import {Request} from '../Request';


export class ImmediateQueue implements IQueue
{


	public append(request: Request, fn: (done?: () => void) => void): void
	{
		fn();
	}


	public run(): void
	{

	}

}
