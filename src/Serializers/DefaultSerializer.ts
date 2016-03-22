import {Helpers} from '../Utils/Helpers';


/**
 * Serializer "borrowed" from jQuery
 */
export class DefaultSerializer
{


	public static serialize(data: any): string
	{
		let result = [];

		if (Helpers.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				DefaultSerializer.add(result, i, data[i]);
			}

		} else {
			for (let prefix in data) {
				if (data.hasOwnProperty(prefix)) {
					DefaultSerializer.buildParams(result, prefix, data[prefix]);
				}
			}
		}

		return result.join('&');
	}


	private static add(result: Array<string>, key: string|number, value: string|any): void
	{
		value = Helpers.isFunction(value) ? value() : (value == null ? '' : value);
		result.push(encodeURIComponent(key + '') + '=' + encodeURIComponent(<string>value));
	}


	private static buildParams(result: Array<string>, prefix: string, obj: any): void
	{
		if (Helpers.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				if (/\[\]$/.test(prefix)) {
					DefaultSerializer.add(result, prefix, obj[i]);

				} else {
					DefaultSerializer.buildParams(
						result,
						prefix + '[' + (typeof obj[i] === 'object' && obj[i] != null ? i : '') + ']',
						obj[i]
					);
				}
			}

		} else if (typeof obj === 'object' && obj != null) {
			for (let name in obj) {
				if (obj.hasOwnProperty(name)) {
					DefaultSerializer.buildParams(result, prefix + '[' + name + ']', obj[name]);
				}
			}

		} else {
			DefaultSerializer.add(result, prefix, obj);
		}
	}

}
