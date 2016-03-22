import {AbstractExtension} from './AbstractExtension';
import {Response} from '../Response';


export class Redirect
{


	public success(response: Response): void
	{
		let data = response.json();

		if (data !== null && typeof data['redirect'] !== 'undefined') {
			window.location.href = data['redirect'];
		}
	}

}
