import {AbstractExtension} from './AbstractExtension';
import {Helpers} from '../Utils/Helpers';


export class Links extends AbstractExtension
{


	private listener: EventListener;


	constructor()
	{
		super();

		this.listener = Helpers.addEventListener(document, 'click', (e: Event, el: HTMLLinkElement) => {
			e.preventDefault();
			this.http.get(el.href).subscribe(() => {});
		}, (el: HTMLElement) => {
			let classes = el.className.split(' ');
			return el.nodeName.toLowerCase() === 'a' && classes.indexOf('ajax') !== -1 && classes.indexOf('not-ajax') === -1;
		});
	}


	public detachLinksEvent(): void
	{
		document.removeEventListener('click', this.listener);
	}

}
