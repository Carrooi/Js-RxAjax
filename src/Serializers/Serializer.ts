import {DefaultSerializer} from './DefaultSerializer';
import {MultipartFormSerializer} from './MultipartFormSerializer';
import {Helpers} from '../Utils/Helpers';
import {SerializerResult, FilesList, HeadersList} from '../interfaces';


export class Serializer
{


	public static parseData(method: string, url: string, data: any, files: FilesList, cb: (data: SerializerResult) => void): void
	{
		if (Object.keys(files).length) {
			let boundary = '---------------------------' + Date.now().toString(16);

			MultipartFormSerializer.serialize(boundary, data, files, (data) => {
				cb({
					headers: {
						'Content-type': 'multipart/form-data; boundary=' + boundary,
					},
					url: url,
					data: data,
				});
			});

		} else if (data !== null) {
			let headers: HeadersList = {};

			data = DefaultSerializer.serialize(data);

			if (method === 'POST') {
				headers['Content-type'] = 'application/x-www-form-urlencoded';
			} else {
				url = Helpers.appendUrlParameters(url, data);
				data = null;
			}

			cb({
				headers: headers,
				url: url,
				data: data,
			});
		}
	}

}
