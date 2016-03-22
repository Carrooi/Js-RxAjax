import {Helpers} from './Utils/Helpers';
import {EventEmitter} from './Utils/EventEmitter';


export class Response extends EventEmitter
{


	public status: number = null;

	public statusText: string = null;

	public contentType: string = null;

	public data: any = null;

	public headers: any = null;

	private _json: any = null;


	public json(): any
	{
		if (this._json === null) {
			if (this.data === '') {
				this._json = false;

			} else {
				this._json = JSON.parse(this.data);
			}
		}

		return this._json ? this._json : null;
	}


	public getHeader(header: string): string
	{
		if (!this.headers) {
			return null;
		}

		return typeof this.headers[header] === 'undefined' ? null : this.headers[header];
	}


	public testContentType(contentType): boolean
	{
		return this.contentType !== null && this.contentType.match(Helpers.escapeString(contentType)) !== null;
	}


	public isApplicationJson(): boolean
	{
		return this.testContentType('application/json');
	}


	public isApplicationJavascript(): boolean
	{
		return this.testContentType('application/javascript');
	}


	public isTextJavascript(): boolean
	{
		return this.testContentType('text/javascript');
	}

}
