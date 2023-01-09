import 'intersection-observer';
import debounce from 'lodash.debounce';

import loadScript from './load-script.js';
import loadStylesheet from './load-stylesheet.js';

/* Keeps track of 3rd party script requests. Forces components to wait until a previous request for a 3rd party script has finished loading before doing anything. */
global.scriptsLoader = [];

class App extends HTMLElement {
	_mixManifest = null;

	_facebookId = 'FIXME';

	_googleTagManagerId = 'FIXME';

	constructor() {
		super();

		/* Loads components as the user scrolls them into viewport */
		if (String(this.dataset.load).toLowerCase() === 'on-demand') {
			this.initComponentsOnDemand();
		}

		/**
		 * Loads all non critical scripts, once per page load, as soon as the user interacts with the page.
		 * Allows for the initial page load/critical path rendering to be as quick as possible.
		 */
		this.initOneTimeEventListener(document, 'initNonCriticalScripts', () => this.initNonCriticalScripts());

		const initNonCriticalScriptsEvent = new CustomEvent('initNonCriticalScripts');
		const debouncedInteraction = debounce(() => document.dispatchEvent(initNonCriticalScriptsEvent), 10);

		document.addEventListener('click', debouncedInteraction);
		document.addEventListener('scroll', debouncedInteraction);
		document.addEventListener('keydown', debouncedInteraction);
		document.addEventListener('keypress', debouncedInteraction);
		document.addEventListener('mousedown', debouncedInteraction);
		document.addEventListener('mousemove', debouncedInteraction);
		document.addEventListener('touchstart', debouncedInteraction);
	};

	initOneTimeEventListener(node, type, callback) {
		node.addEventListener(type, function listener(event) {
			event.target.removeEventListener(event.type, listener, { once: true });

			return callback.call(this, event);
		}, { once: true });
	};

	disconnectedCallback() {
	}

	connectedCallback() {
	}

	initNonCriticalScripts() {
		this.initEventListeners();

		if (String(this.dataset.environment).toLowerCase() === 'production') {
			this.initPinterest();
			this.initFacebook();
			this.initGoogleTagManager();
		}
	};

	/**
	 * Observes and loads components into view as the user scrolls towards them. Components are only loaded once per page load.
	 */
	initComponentsOnDemand() {
		const componentsLoaded = {};

		const observer = new IntersectionObserver((entries, observerRef) => {
			entries.forEach(async entry => {
				if (entry.isIntersecting) {
					const nodeName = entry.target.nodeName.toLowerCase();

					if (! componentsLoaded[nodeName]) {
						this.initComponent(nodeName);

						componentsLoaded[nodeName] = true;

						observerRef.unobserve(entry.target);
					}
				}
			});
		}, {
			threshold: 0,
			rootMargin: '0px 0px 200px 0px'
		});

		const components = document.querySelectorAll('.web-component');
		components.forEach(component => observer.observe(component));
	};

	initComponent(nodeName) {
		const stylesheet = loadStylesheet({
			id: `${nodeName}-stylesheet-loader`,
			href: `/assets/css/${nodeName}.css?v=${this.dataset.buildVersion}`,
			attrs: [{
				key: 'id',
				value: `${nodeName}-stylesheet-loader`
			}]
		});

		const script = loadScript({
			id: `${nodeName}-script-loader`,
			src: `/assets/css/${nodeName}.js?v=${this.dataset.buildVersion}`,
			attrs: [{
				key: 'id',
				value: `${nodeName}-script-loader`,
			}]
		});

		Promise
			.all([script, stylesheet])
			.catch(console.error);
	};

	initEventListeners() {
		const id = 'event-listeners';

		loadScript({
			id: `${id}-script-loader`,
			src: `/assets/js/${id}.js?v=${this.dataset.buildVersion}`,
			attrs: [{
				key: 'id',
				value: `${id}-script-loader`
			}]
		}).then(() => {});
	}

	initPinterest() {
		const id = 'pinit';

		loadScript({
			id:	`${id}-script-loader`,
			src: `//assets.pinterest.com/js/${id}.js`,
			attrs: [{
				key: 'type',
				value: 'text/javascript'
			}, {
				key: 'id',
				value: `${id}-script-loader`
			}, {
				key: 'defer',
				value: 'true'
			}, {
				key: 'data-pin-hover',
				value: 'true'
			}, {
				key: 'data-add-to',
				value: 'body'
			}]
		}).then(() => {});
	};

	initFacebook() {
		const id = 'facebook-script-loader';
		const existingScript = document.getElementById(id);

		if (this._facebookId && ! existingScript) {
			/* DO NOT REMOVE - CUSTOM */
			!function (b, e, f, g, a, c, d) {
				b.fbq || (a = b.fbq = function () {
					a.callMethod ? a.callMethod.apply(a, arguments) : a.queue.push(arguments)
				}, b._fbq || (b._fbq = a), a.push = a, a.loaded = !0, a.version = '2.0', a.queue = [], c = e.createElement(f), c.async = !0, c.id = id, c.src = g, d = e.getElementsByTagName(f)[0], d.parentNode.insertBefore(c, d))
			}
			(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', this._facebookId);
			fbq('track', 'PageView');
		}
	};

	initGoogleTagManager() {
		const id = 'google-tag-manager-script-loader';
		const existingScript = document.getElementById(id);

		if (this._googleTagManagerId && ! existingScript) {
			/* DO NOT REMOVE - CUSTOM */
			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
				var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
				j.async = true;
				j.id = id;
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})
			(window, document, 'script', 'dataLayer', this._googleTagManagerId);
		}
	};
}

customElements.define('my-app', App);
