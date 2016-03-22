export class Validators
{


	public static isValidHttpMethod(method: string): boolean
	{
		return ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'].indexOf(method) !== -1;
	}

}
