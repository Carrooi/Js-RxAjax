import {Validators} from './Utils/Validators';
import {HeadersList, FilesList, RequestOptions} from './interfaces';


export class Request
{


	private static DEFAULT_JSONP_NAME = 'callback';


	public url: string;

	public method: string;

	public data: any = null;

	public files: FilesList = {};

	public jsonp: boolean|string = false;

	public jsonPrefix: string = null;

	public mimeType: string = null;

	public headers: HeadersList = {};


	constructor(url: string, method: string, data: any = null, options: RequestOptions = {})
	{
		method = method.toUpperCase();

		if (!Validators.isValidHttpMethod(method)) {
			throw new Error('HTTP method ' + method + ' is not allowed.');
		}

		if (options.jsonp && method !== 'GET') {
			throw new Error('JSONP can be used only with GET HTTP method.');
		}

		this.url = url;
		this.method = method;
		this.data = data;

		if (options.files) {
			this.files = options.files;
		}

		if (options.jsonp) {
			this.jsonp = options.jsonp === true ? Request.DEFAULT_JSONP_NAME : options.jsonp;
		}

		if (options.jsonPrefix) {
			this.jsonPrefix = options.jsonPrefix;
		}

		if (options.mimeType) {
			this.mimeType = options.mimeType;
		}

		if (options.headers) {
			this.headers = options.headers;
		}
	}

}
