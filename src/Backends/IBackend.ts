import {Request} from '../Request';
import {Response} from '../Response';


export interface IBackend
{


	fetch(request: Request, cb: (err: Error, response: Response) => void): Function;

}
