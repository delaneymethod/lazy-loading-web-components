import pathInfo from './path-info.js';
import loadScript from './load-script.js';
import loadStylesheet from './load-stylesheet.js';

class Base extends HTMLElement {
	settings = {};

	selector = false;

	clickEventTimeout = null;

	glightbox = Object.freeze({
		default: {
			loop: true,
			zoomable: false,
			draggable: false,
			openEffect: 'fade',
			closeEffect: 'fade',
			slideEffect: 'fade',
			autoplayVideos: true,
			touchNavigation: true,
			plyr: {
				config: {
					iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.2/plyr.svg'
				},
				css: 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.2/plyr.min.css',
				js: 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.2/plyr.polyfilled.min.js'
			}
		}
	});

	constructor() {
		super();

		/* Merges default settings with specific component settings */
		if (this.hasAttribute('data-settings') && this.getAttribute('data-settings') !== null) {
			Object.assign(
				this.settings,
				this.settings,
				JSON.parse(this.getAttribute('data-settings'))
			);

			if (Object.prototype.hasOwnProperty.call(this.settings, 'selector')) {
				this.selector = this.settings.selector;
			}
		}
	}

	disconnectedCallback() {
	}

	connectedCallback() {
	}

	/**
	 * https://github.com/NickPiscitelli/Glider.js
	 *
	 * @return Promise
	 */
	initGlider() {
		const id = 'glider';

		const stylesheet = loadStylesheet({
			id: `${id}-stylesheet-loader`,
			href: `https://cdnjs.cloudflare.com/ajax/libs/glider-js/1.7.8/${id}.min.css`,
			attrs: [{
				key: 'id',
				value: `${id}-stylesheet-loader`
			}]
		});

		const script = loadScript({
			id: `${id}-script-loader`,
			src: `https://cdnjs.cloudflare.com/ajax/libs/glider-js/1.7.8/${id}.min.js`,
			attrs: [{
				key: 'id',
				value: `${id}-script-loader`,
			}]
		});

		return Promise
			.all([stylesheet, script])
			.catch(console.error);
	};

	/**
	 * https://biati-digital.github.io/glightbox/
	 *
	 * @return Promise
	 */
	initGLightBox() {
		const id = 'glightbox';

		const stylesheet = loadStylesheet({
			id: `${id}-stylesheet-loader`,
			href: `https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/css/${id}.min.css`,
			attrs: [{
				key: 'id',
				value: `${id}-stylesheet-loader`
			}]
		});

		const script = loadScript({
			id: `${id}-script-loader`,
			src: `https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/js/${id}.min.js`,
			attrs: [{
				key: 'id',
				value: `${id}-script-loader`,
			}]
		});

		return Promise
			.all([stylesheet, script])
			.catch(console.error);
	};

	/**
	 * Adds a custom download button to the toolbar menu within GLightbox
	 */
	gDownloadButton() {
		/* Creates a new custom button for GLightbox. See individual components for the onClick handler. */
		const button = document.createElement('button');
		button.innerHTML = '<svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1_206)"><path d="M7.24994 13.9598C7.36037 14.0687 7.50644 14.125 7.6525 14.125C7.79856 14.125 7.9442 14.0701 8.05542 13.9602L13.1854 8.89769C13.4081 8.67796 13.4081 8.32183 13.1854 8.10245C12.9628 7.88308 12.6019 7.88273 12.3796 8.10245L8.2225 12.2055V1.75C8.2225 1.43922 7.966 1.1875 7.6525 1.1875C7.339 1.1875 7.0825 1.43922 7.0825 1.75V12.2055L2.92542 8.10273C2.70276 7.88301 2.34188 7.88301 2.11958 8.10273C1.89728 8.32246 1.89692 8.67859 2.11958 8.89797L7.24994 13.9598ZM13.9225 15.8125H1.3825C1.06743 15.8125 0.8125 16.0656 0.8125 16.375C0.8125 16.6844 1.06743 16.9375 1.3825 16.9375H13.9225C14.2376 16.9375 14.4925 16.6859 14.4925 16.375C14.4925 16.0641 14.236 15.8125 13.9225 15.8125Z" fill="#FFFFFF"/></g><defs><clipPath id="clip0_1_206"><rect width="13.68" height="18" fill="white" transform="translate(0.8125 0.0625)"/></clipPath></defs></svg>';
		button.classList.add('gbtn');
		button.classList.add('gclose');
		button.classList.add('gdownload');
		button.setAttribute('aria-label', 'Download');
		button.setAttribute('data-taborder', '4');

		return button;
	};

	fetchAndDownloadFile(fileUrl) {
		const options = {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
		};

		fetch(fileUrl, options)
			.then(response => response.blob())
			.then(blob => this.downloadBlob(fileUrl, blob))
			.catch(console.error);
	};

	downloadBlob(url, blob) {
		const $this = this;

		const clickHandler = function() {
			if ($this.clickEventTimeout) {
				clearTimeout($this.clickEventTimeout);
			}

			$this.clickEventTimeout = setTimeout(() => {
				URL.revokeObjectURL(url);

				this.removeEventListener('click', clickHandler);

				(this.remove && (this.remove(), 1)) || (this.parentNode && this.parentNode.removeChild(this));
			}, 150);
		};

		const info = pathInfo(url);

		const href = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = href;
		a.download = info.name + info.ext  || 'download';
		a.addEventListener('click', clickHandler, false);
		a.click();

		return a;
	};
}

export default Base;
