import {Subject} from 'rxjs/Subject';
import {AbstractExtension} from './AbstractExtension';
import {Response} from '../Response';


export class Snippets extends AbstractExtension
{


	public static APPEND_ATTRIBUTE_NAME = 'data-append';


	public processed: Subject<any> = new Subject;


	public success(response: Response): void
	{
		let data = response.json();

		if (data !== null && typeof data['snippets'] !== 'undefined') {
			let empty = true;

			for (let id in data['snippets']) {
				if (data['snippets'].hasOwnProperty(id)) {
					empty = false;

					let el = document.getElementById(id);

					if (el.hasAttribute(Snippets.APPEND_ATTRIBUTE_NAME)) {
						this.appendSnippet(el, data['snippets'][id]);
					} else {
						this.updateSnippet(el, data['snippets'][id]);
					}
				}
			}

			if (!empty) {
				this.processed.next(response);
			}
		}
	}


	private updateSnippet(el: HTMLElement, snippet: string): void
	{
		el.innerHTML = snippet;
	}


	private appendSnippet(el: HTMLElement, snippet: string): void
	{
		el.innerHTML += snippet;
	}

}
