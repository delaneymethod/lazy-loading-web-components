import Base from '../../../src/js/base.js';

class MyExample extends Base {
	constructor() {
		super();

		if (this.settings.selector) {
			// If this component had a lightbox, we would call the following:
			if (Object.prototype.hasOwnProperty.call(this.settings, 'lightbox')) {
				this.initLightBox();
			}

			/*
			// If this component had a slider, we would call the following:
			if (Object.prototype.hasOwnProperty.call(this.settings, 'slider')) {
					this.initSlider();
			}
			*/
		}
	};

	initSlider() {
	};

	initLightBox() {
		if (!Object.prototype.hasOwnProperty.call(window, 'GLightbox')) {
			scriptsLoader.push(this.initGLightBox());

			Promise.all(scriptsLoader)
				.then(() => this.initLightBox())
				.catch(console.error);
		} else {
			const lightbox = window.GLightbox({
				...this.settings.lightbox.options,
				...this.glightbox.default.options
			});

			const gDownloadButton = this.gDownloadButton();

			lightbox.on('slide_before_load', async ({ slideConfig }) => {
				gDownloadButton.onclick = function (event) {
					event.preventDefault();

					// FIXME - do something with slideConfig.href
					console.log('do something with slideConfig.href');

					return false;
				};

				const gContainer = lightbox.modal.querySelector('.gcontainer');

				if (gContainer && gDownloadButton) {
					lightbox.modal.querySelector('.gcontainer').append(gDownloadButton);
				}
			});
		}
	};
}

customElements.define('my-example', MyExample);
