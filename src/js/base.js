class Base extends HTMLElement {
	_settings = {};

	_idleTimeout = {
		timeout: 2000
	};

	_clickEventTimeout = null;

	_glightbox = {
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
	};

	constructor() {
		super();

		/* Merges default settings with specific component settings */
		if (this.hasAttribute('data-settings') && this.getAttribute('data-settings') !== null) {
			Object.assign(
				this._settings,
				this._settings,
				JSON.parse(this.getAttribute('data-settings'))
			);
		}

		if (this._settings.hasOwnProperty('selector')) {
			this._selector = this._settings.selector;
		}
	}

	connectedCallback() {
		this.initComponent();
	};

	disconnectedCallback() {};

	loadedComponent() {
		this.classList.add('component-loaded');
	};

	loadingComponent() {
		this.classList.remove('component-loaded');
	};

	/**
	 * http://kenwheeler.github.io/slick/
	 *
	 * @return Promise
	 */
	async initSlickCarousel() {
		const id = 'slick';

		const stylesheetSlickCarousel = LoadStylesheet({
			id: `${id}-stylesheet-loader`,
			href: `https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/${id}.min.css`,
			attrs: [{
				key: 'id',
				value: `${id}-stylesheet-loader`
			}, {
				key: 'integrity',
				value: 'sha512-yHknP1/AwR+yx26cB1y0cjvQUMvEa2PFzt1c9LlS4pRQ5NOTZFWbhBig+X9G9eYW/8m0/4OXNx8pxJ6z57x0dw=='
			}]
		});

		const scriptSlickCarousel = LoadScript({
			id: `${id}-script-loader`,
			src: `https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/${id}.min.js`,
			attrs: [{
				key: 'type',
				value: 'text/javascript'
			}, {
				key: 'id',
				value: `${id}-script-loader`,
			}, {
				key: 'defer',
				value: 'true'
			}, {
				key: 'integrity',
				value: 'sha512-HGOnQO9+SP1V92SrtZfjqxxtLmVzqZpjFFekvzZVWoiASSQgSr4cw9Kqd2+l8Llp4Gm0G8GIFJ4ddwZilcdb8A=='
			}, {
				key: 'data-add-to',
				value: 'body'
			}]
		});

		await Promise.all([stylesheetSlickCarousel, scriptSlickCarousel]);
	};

	/**
	 * https://biati-digital.github.io/glightbox/
	 *
	 * @return Promise
	 */
	async initGLightBox() {
		const id = 'glightbox';

		const stylesheetGLightBox = LoadStylesheet({
			id: `${id}-stylesheet-loader`,
			href: `https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/css/${id}.min.css`,
			attrs: [{
				key: 'id',
				value: `${id}-stylesheet-loader`
			}, {
				key: 'integrity',
				value: 'sha512-T+KoG3fbDoSnlgEXFQqwcTC9AdkFIxhBlmoaFqYaIjq2ShhNwNao9AKaLUPMfwiBPL0ScxAtc+UYbHAgvd+sjQ=='
			}]
		});

		const scriptGLightBox = LoadScript({
			id: `${id}-script-loader`,
			src: `https://cdnjs.cloudflare.com/ajax/libs/glightbox/3.2.0/js/${id}.min.js`,
			attrs: [{
				key: 'type',
				value: 'text/javascript'
			}, {
				key: 'id',
				value: `${id}-script-loader`,
			}, {
				key: 'defer',
				value: 'true'
			}, {
				key: 'integrity',
				value: 'sha512-S/H9RQ6govCzeA7F9D0m8NGfsGf0/HjJEiLEfWGaMCjFzavo+DkRbYtZLSO+X6cZsIKQ6JvV/7Y9YMaYnSGnAA=='
			}, {
				key: 'data-add-to',
				value: 'body'
			}]
		});

		await Promise.all([stylesheetGLightBox, scriptGLightBox]);
	};

	/**
	 * Adds a custom download button to the toolbar menu within GLightbox
	 *
	 * @return Promise
	 */
	async gDownloadButton() {
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
			mode: 'no-cors',
			cache: 'no-store',
		};

		fetch(fileUrl, options)
			.then(response => response.blob())
			.then(blob => this.downloadBlob(fileUrl, blob))
			.catch(console.error);
	};

	downloadBlob(url, blob) {
		const $this = this;

		const clickHandler = function() {
			if ($this._clickEventTimeout) {
				clearTimeout($this._clickEventTimeout);
			}

			$this._clickEventTimeout = setTimeout(() => {
				URL.revokeObjectURL(url);

				this.removeEventListener('click', clickHandler);

				(this.remove && (this.remove(), 1)) || (this.parentNode && this.parentNode.removeChild(this));
			}, 150);
		};

		const info = PathInfo(url);

		url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = info.name || 'download';
		a.addEventListener('click', clickHandler, false);
		a.click();

		return a;
	};
}

global.Base = Base;
