import {Helpers} from '../Utils/Helpers';
import {FilesList} from '../interfaces';


export class MultipartFormSerializer
{


	public static serialize(boundary: string, data: any, files: FilesList, cb: (result: Uint8Array) => void): void
	{
		MultipartFormSerializer.serializeFiles(files, (loadedFiles) => {
			let result = [];

			data = data ? Helpers.flattenData(data) : [];
			for (let i = 0; i < data.length; i++) {
				result.push("Content-Disposition: form-data; name=\"" + data[i][0] + "\"\r\n\r\n" + (data[i][1] ? data[i][1] : '') + "\r\n");
			}

			for (let name in loadedFiles) {
				if (loadedFiles.hasOwnProperty(name)) {
					result.push(
						"Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + loadedFiles[name].filename + "\"\r\n" +
						"Content-Type: " + loadedFiles[name].type + "\r\n\r\n" +
						loadedFiles[name].content + "\r\n"
					);
				}
			}

			cb(MultipartFormSerializer.toBinary("--" + boundary + "\r\n" + result.join("--" + boundary + "\r\n") + "--" + boundary + "--\r\n"));
		});
	}


	private static serializeFiles(files: FilesList, cb): void
	{
		let loaded = {};
		let count = 0;
		let total = Object.keys(files).length;

		if (!total) {
			cb({});
		}

		for (let name in files) {
			if (files.hasOwnProperty(name)) {
				let file = files[name];
				let filename = null;

				if (!(files[name] instanceof Blob) && !(files[name] instanceof File) && files[name]['filename']) {
					filename = file['filename'];
					file = file['file'];
				}

				if (!filename && file instanceof File) {
					filename = file.name;
				}

				if (!filename) {
					throw new Error('Please, provide filename for file.');
				}

				loaded[name] = {
					file: file,
					filename: filename,
					content: null,
					type: (<File|Blob>file).type,
				};

				((name: string, file: File|Blob) => {
					let reader = new FileReader;

					reader.onload = () => {
						count++;
						loaded[name].content = reader.result;

						if (count === total) {
							cb(loaded);
						}
					};

					reader.readAsBinaryString(file);
				})(name, <File|Blob>file);
			}
		}
	}


	private static toBinary(data): Uint8Array
	{
		let bytes = data.length;
		let result = new Uint8Array(bytes);

		for (let i = 0; i < bytes; i++) {
			result[i] = data.charCodeAt(i) & 0xff;
		}

		return result;
	}

}
