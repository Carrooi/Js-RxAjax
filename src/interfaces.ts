import {Subject} from 'rxjs/Rx';
import {Request} from './Request';
import {IBackend} from './Backends/IBackend';
import {IQueue} from './Queues/IQueue';


export declare interface HeadersList
{
	[name: string]: string,
}


export declare interface HttpOptions
{
	backend?: IBackend,
	queue?: IQueue,
}


export declare interface MockReceiverOptions
{
	data: string|boolean,
	headers: HeadersList,
	statusCode: number,
	statusText: string,
	timeout: number,
}


export declare interface SerializerResult
{
	headers: HeadersList,
	url: string,
	data: string|Uint8Array,
}


export declare interface RxSubjectsList
{
	[name: string]: Subject<any>,
}


export declare interface QueueItem
{
	request: Request,
	fn: (done: () => void) => void,
}


export declare interface FileInfo
{
	filename: string,
	file: File|Blob,
}


export declare interface FilesList
{
	[name: string]: File|Blob|FileInfo,
}


export declare interface RequestOptions
{
	jsonp?: boolean|string,
	jsonPrefix?: string,
	mimeType?: string,
	headers?: HeadersList,
	files?: FilesList,
}
