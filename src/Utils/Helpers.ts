export class Helpers
{


	public static DESTRUCTIVE_METHODS = ['PUT', 'POST', 'DELETE'];


	public static isFunction(obj: any): boolean
	{
		return typeof obj === 'function';
	}


	public static isArray(obj: any): boolean
	{
		return Object.prototype.toString.call(obj) === '[object Array]';
	}


	public static isObject(obj: any): boolean
	{
		return Object.prototype.toString.call(obj) === '[object Object]';
	}


	public static escapeString(str: string): string
	{
		return str.replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
	}


	public static appendUrlParameter(url: string, name: string, value: string): string
	{
		url += url.indexOf('?') !== -1 ? '&' : '?';
		url += name + '=' + value;

		return url;
	}


	public static appendUrlParameters(url: string, params: string): string
	{
		url += url.indexOf('?') !== -1 ? '&' : '?';
		url += params;

		return url;
	}


	public static addEventListener(el: any, event: string, listener: (e: Event, target: HTMLElement) => void, checkFn?: (target: HTMLElement) => boolean): EventListener
	{
		let fn = (e: Event) => {
			if (!checkFn) {
				listener(e, <HTMLElement>e.target);

			} else {
				let check = Helpers.matchElementWithParents(e.target, checkFn);
				if (check) {
					listener(e, <HTMLElement>check);
				}
			}
		};

		el.addEventListener(event, fn);

		return fn;
	}


	public static matchElementWithParents(el: any, checkFn: (el: HTMLElement) => boolean): boolean|HTMLElement
	{
		while (el) {
			if (checkFn(el)) {
				return el;
			}

			el = el.parentElement;
		}

		return false;
	}


	public static flattenData(data: any): any
	{
		let result = [];

		let process = (data: any, prefix: string = null): any => {
			if (Helpers.isArray(data)) {
				for (let i = 0; i < data.length; i++) {
					add(prefix, '', data[i]);
				}

			} else if (Helpers.isObject(data)) {
				for (let key in data) {
					if (data.hasOwnProperty(key)) {
						add(prefix, key, data[key]);
					}
				}

			} else {
				add(prefix, '', data);
			}
		};

		let add = (prefix: string, name: string, value: string|number) => {
			name = prefix === null ? name : prefix + '[' + name + ']';

			if (Helpers.isArray(value) || Helpers.isObject(value)) {
				process(value, name);

			} else {
				value = (value === null || value === '') ? null : value;
				result.push([name, value]);
			}
		};

		process(data);

		return result;
	}


	public static isHistoryApiSupported()
	{
		return window.history && history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);
	}


	public static isDestructiveMethod(method: string): boolean
	{
		return Helpers.DESTRUCTIVE_METHODS.indexOf(method) > 0;
	}


	public static parseHeaders(headers: string): any
	{
		let  result = {};

		if (!headers) {
			return result;
		}

		let headerPairs = headers.split('\u000d\u000a');
		for (let i = 0; i < headerPairs.length; i++) {
			let headerPair = headerPairs[i];
			let index = headerPair.indexOf('\u003a\u0020');

			if (index > 0) {
				result[headerPair.substring(0, index)] = headerPair.substring(index + 2);
			}
		}

		return result;
	}


	public static createXhr(): XMLHttpRequest
	{
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest;
		} else {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}


	/**
	 * @see http://stackoverflow.com/a/32756572
	 */
	public static toASCII(str: string): string
	{
		let diacritics = {
			a: 'ÀÁÂÃÄÅàáâãäåĀāąĄ',
			c: 'ÇçćĆčČ',
			d: 'đĐďĎ',
			e: 'ÈÉÊËèéêëěĚĒēęĘ',
			i: 'ÌÍÎÏìíîïĪī',
			l: 'łŁ',
			n: 'ÑñňŇńŃ',
			o: 'ÒÓÔÕÕÖØòóôõöøŌō',
			r: 'řŘ',
			s: 'ŠšśŚ',
			t: 'ťŤ',
			u: 'ÙÚÛÜùúûüůŮŪū',
			y: 'ŸÿýÝ',
			z: 'ŽžżŻźŹ',
		};

		for (var toLetter in diacritics) {
			if (diacritics.hasOwnProperty(toLetter)) {
				for (let i = 0; i < diacritics[toLetter].length; i++) {
					let fromLetter = diacritics[toLetter][i];

					if (str.indexOf(fromLetter) < 0) {
						continue;
					}

					let toCaseLetter = fromLetter === fromLetter.toUpperCase() ? toLetter.toUpperCase() : toLetter;

					str = str.replace(new RegExp(fromLetter, 'g'), toCaseLetter);
				}
			}
		}

		return str;
	}

}
