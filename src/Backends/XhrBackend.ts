import {IBackend} from './IBackend';
import {Request} from '../Request';
import {Response} from '../Response';
import {Helpers} from '../Utils/Helpers';
import {Serializer} from '../Serializers/Serializer';
import {DefaultSerializer} from '../Serializers/DefaultSerializer';
import {MultipartFormSerializer} from "../Serializers/MultipartFormSerializer";
import {FilesList} from '../interfaces';


export class XhrBackend implements IBackend
{


	private static COUNTER: number = 0;

	private static JSONP_METHOD_PREFIX = '__rxajax_jsonp_callback_';


	public fetch(request: Request, cb: (err: Error, response: Response) => void): Function
	{
		XhrBackend.COUNTER++;

		let xhr = Helpers.createXhr();
		let response = new Response;
		let url = request.url;
		let jsonpCallbackName: string = null;
		let inProgress = false;

		if (request.jsonp) {
			jsonpCallbackName = XhrBackend.JSONP_METHOD_PREFIX + XhrBackend.COUNTER;
			url = Helpers.appendUrlParameter(url, <string>request.jsonp, jsonpCallbackName);
		}

		Serializer.parseData(request.method, url, request.data, request.files, (data) => {
			url = data.url;

			xhr.addEventListener('progress', (e: ProgressEvent) => {
				response.emit('progress', e);
			});

			xhr.open(request.method, url, true);

			for (let headerName in request.headers) {
				if (request.headers.hasOwnProperty(headerName)) {
					xhr.setRequestHeader(headerName, request.headers[headerName]);
				}
			}

			if (url.match(/^(http)s?:\/\//) === null) {
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			}

			for (let headerName in data.headers) {
				if (data.headers.hasOwnProperty(headerName)) {
					xhr.setRequestHeader(headerName, data.headers[headerName]);
				}
			}

			if (request.mimeType) {
				xhr.overrideMimeType(request.mimeType);
			}

			xhr.onreadystatechange = () => {
				if (xhr.readyState !== 4) {
					return;
				}

				inProgress = false;

				response.status = xhr.status;
				response.headers = Helpers.parseHeaders(xhr.getAllResponseHeaders());

				if ((xhr.status < 200 || xhr.status > 300) && xhr.status !== 304) {
					let error = new Error('Error loading resource ' + request.url + ' - server replied: ' + xhr.statusText + ' (' + xhr.status + ').');
					error['request'] = request;
					cb(error, null);

					return;
				}

				if (xhr.status == 204 || request.method === 'HEAD') {
					response.statusText = 'nocontent';

				} else if (xhr.status === 304) {
					response.statusText = 'notmodified';

				} else {
					let responseData = xhr.responseText;

					response.statusText = xhr.statusText;
					response.contentType = xhr.getResponseHeader('content-type');

					if (request.jsonPrefix) {
						let prefix = Helpers.escapeString(request.jsonPrefix);
						responseData = responseData.replace(new RegExp('^' + prefix), '');
					}

					if (request.jsonp) {
						window[jsonpCallbackName] = (callbackData) => {
							response.data = callbackData;
						};

						eval(responseData);

					} else {
						response.data = responseData;
					}
				}

				cb(null, response);
			};

			xhr.send(data.data);
			inProgress = true;
		});

		return () => {
			if (inProgress) {
				xhr.abort();
			}
		};
	}

}
