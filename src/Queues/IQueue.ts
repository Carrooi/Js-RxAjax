import {Request} from '../Request';


export interface IQueue
{


	append(request: Request, fn: (done?: () => void) => void): void;

	isRunning(): boolean;

	run(): void;

}
