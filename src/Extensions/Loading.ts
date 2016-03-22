import {AbstractExtension} from './AbstractExtension';


export class Loading extends AbstractExtension
{


	public send(): void
	{
		document.body.style.cursor = 'progress';
	}


	public success(): void
	{
		document.body.style.cursor = 'auto'
	}


	public error(): void
	{
		document.body.style.cursor = 'auto'
	}

}
