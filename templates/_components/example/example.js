class Example extends Base {
	_selector = false;

	// If this component had a lightbox, we would call the following:
	_lightbox = {
		options: {},
		instance: false
	};

	// If this component had a slick carousel, we would call the following:
	_sliders = {
		large: {
			selector: false,
			options: {}
		},
		small: {
			selector: false,
			options: {}
		}
	};

	constructor() {
		super();

		if (this._settings.hasOwnProperty('selector')) {
			this._selector = this._settings.selector;
		}

		// If this component had a lightbox, we would call the following:
		if (this._settings.hasOwnProperty('lightbox')) {
			if (this._settings.lightbox.hasOwnProperty('options')) {
				this._lightbox.options = this._settings.lightbox.options;
			}
		}

		// If this component had a slick carousel, we would call the following:
		if (this._settings.hasOwnProperty('sliders')) {
			if (this._settings.sliders.hasOwnProperty('large') && this._settings.sliders.large.hasOwnProperty('selector') && this._settings.sliders.large.hasOwnProperty('options')) {
				this._sliders.large.selector = this._settings.sliders.large.selector;
				this._sliders.large.options = this._settings.sliders.large.options;
			}

			if (this._settings.sliders.hasOwnProperty('small') && this._settings.sliders.small.hasOwnProperty('selector') && this._settings.sliders.small.hasOwnProperty('options')) {
				this._sliders.small.selector = this._settings.sliders.small.selector;
				this._sliders.small.options = this._settings.sliders.small.options;
			}
		}
	};

	disconnectedCallback() {
		// If this component had a lightbox, we would call the following:
		if (this._lightbox.instance) {
			this._lightbox.instance.destroy();
		}

		// If this component had a slick carousel, we would call the following:
		if (this._sliders.large.selector && this._sliders.small.selector) {
			$(this._sliders.large.selector).slick('unslick');
			$(this._sliders.small.selector).slick('unslick');
		}
	};

	initComponent() {
		this.loadingComponent();

		requestIdleCallback(async () => {
			if (this._selector) {
				// If this component had a lightbox, we would call the following:
				if (! window.hasOwnProperty('GLightbox')) {
					scriptsLoader.push(this.initGLightBox());

					await Promise.all(scriptsLoader).catch(console.error);

					await this.initLightBox();
				}

				// If this component had a slick carousel, we would call the following:
				if (this._sliders.large.selector && this._sliders.small.selector) {
					this.initSlider();
				}

				/**
				 * Finally you've added all your 3rd party library functionality, we could fade in the actual component so the user doesnt seen the screen jump around.
				 * FYI, you can replace jQuery with vanilla JS - whatever floats your boat!
				 */
				$(this._selector).fadeIn();

				this.loadedComponent();
			} else {
				this.loadedComponent();
			}
		}, this._idleTimeout);
	};

	initSlider() {
		$(this._sliders.large.selector).on('init', () => {});
		$(this._sliders.large.selector).on('reInit', () => {});
		$(this._sliders.large.selector).slick(this._sliders.large.options);

		$(this._sliders.small.selector).on('init', () => {});
		$(this._sliders.small.selector).on('reInit', () => {});
		$(this._sliders.small.selector).slick(this._sliders.small.options);
	};

	async initLightBox() {
		if (window.hasOwnProperty('GLightbox')) {
			this._lightbox.instance = window.GLightbox({
				...this._lightbox.options,
				...this._glightbox.default.options
			});

			const gDownloadButton = await this.gDownloadButton();

			this._lightbox.instance.on('slide_before_load', async ({ slideConfig }) => {
				gDownloadButton.onclick = function (event) {
					event.preventDefault();

					// FIXME - do something with slideConfig.href

					return false;
				};

				const gContainer = this._lightbox.instance.modal.querySelector('.gcontainer');

				if (gContainer && gDownloadButton) {
					this._lightbox.instance.modal.querySelector('.gcontainer').append(gDownloadButton);
				}
			});
		}
	};
}

customElements.define('example', Example);
