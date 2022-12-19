import 'intersection-observer';
import $ from 'jquery';
import lazySizes from 'lazysizes';

lazySizes.cfg.loadMode = 2;
lazySizes.cfg.expand = '700';
lazySizes.cfg.expFactor = 1.7;

global.jQuery = global.$ = $.noConflict();

/* Keeps track of 3rd party script requests. Forces components to wait until a previous request for a 3rd party script has finished loading before doing anything. */
global.scriptsLoader = [];

import './wc-base.js';
import './wc-defer.js';
import './wc-debounce.js';
import './wc-throttle.js';
import './wc-path-info.js';
import './wc-load-script.js';
import './wc-load-stylesheet.js';

class WcApp extends HTMLElement {
	_idleTimeout = {
		timeout: 2000
	};

	_mixManifest = null;

	_facebookId = 'FIXME';

	_googleTagManagerId = 'FIXME';

	_currentTimestamp = Date.now();

	constructor() {
		super();

		this.initPolyfills();

		/**
		 * Loads all non critical scripts, once per page load, as soon as the user interacts with the page.
		 * Allows for the initial page load/critical path rendering to be as quick as possible.
		 */
		this.initOneTimeEventListener(document, 'initNonCriticalScripts', () => this.initNonCriticalScripts());

		const initNonCriticalScriptsEvent = new CustomEvent('initNonCriticalScripts');

		const debouncedInteraction = WcDebounce(() => document.dispatchEvent(initNonCriticalScriptsEvent), 100);

		document.addEventListener('click', debouncedInteraction);
		document.addEventListener('scroll', debouncedInteraction);
		document.addEventListener('keydown', debouncedInteraction);
		document.addEventListener('keypress', debouncedInteraction);
		document.addEventListener('mousedown', debouncedInteraction);
		document.addEventListener('mousemove', debouncedInteraction);
		document.addEventListener('touchstart', debouncedInteraction);
	};

	initPolyfills() {
		/**
		 * A stupid polyfill for Safari (Is it the new IE?)
		 * See: https://developer.chrome.com/blog/using-requestidlecallback
		 */
		window.requestIdleCallback = window.requestIdleCallback || function(cb) {
			const start = Date.now();

			return setTimeout(function() {
				cb({
					didTimeout: false,
					timeRemaining: function() {
						return Math.max(0, 50 - (Date.now() - start));
					},
				});
			}, 1);
		};

		window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
			clearTimeout(id);
		};
	};

	initOneTimeEventListener(node, type, callback) {
		node.addEventListener(type, function listener(event) {
			event.target.removeEventListener(event.type, listener, { once: true });

			return callback.call(this, event);
		}, { once: true });
	};

	disconnectedCallback() {};

	connectedCallback() {
		window.addEventListener('load', async () => requestIdleCallback(async () => {
			await this.initMixManifest();

			/* Loads all components at once */
			/* await this.initComponents(); */

			/* Loads components as the user scrolls them into viewport */
			await this.initComponentsOnDemand();

			await this.initServiceWorker();
		}, this._idleTimeout));
	};

	getMixManifestVersion(key) {
		return (this._mixManifest && this._mixManifest[key]) ? this._mixManifest[key] : key;
	};

	initNonCriticalScripts() {
		this.initEventListeners();

		if (this.dataset.environment === 'production') {
			this.initPinterest();
			this.initFacebook();
			this.initGoogleTagManager();
		}
	};

	async initServiceWorker() {
		// Do your thing... Cache assets for offline use, run background processes and lots more
		return Promise.resolve();
	};

	async initMixManifest() {
		if (! this._mixManifest) {
			this._mixManifest = await fetch(`/mix-manifest.json?v=${this.dataset.buildVersion}`, {
				method: 'GET',
				cache: 'no-store'
			}).then(response => response.json());
		}
	};

	/**
	 * Loads components instantly and once per page load.
	 */
	async initComponents() {
		const components = document.querySelectorAll('.web-component');

		for (const component of components) {
			const nodeName = component.nodeName.toLowerCase();

			await this.initComponent(nodeName).then(() => {});
		}

		return Promise.resolve();
	};

	/**
	 * Observes and loads components into view as the user scrolls towards them. Components are only loaded once per page load.
	 */
	async initComponentsOnDemand() {
		const componentsLoaded = {};

		const observer = new IntersectionObserver((entries, observerRef) => {
			entries.forEach(async entry => {
				if (entry.isIntersecting) {
					const nodeName = entry.target.nodeName.toLowerCase();

					observerRef.unobserve(entry.target);

					if (! componentsLoaded[nodeName]) {
						await this.initComponent(nodeName);

						componentsLoaded[nodeName] = true;
					}
				}
			});
		}, {
			threshold: 0,
			rootMargin: '0px 0px 60px 0px'
		});

		const components = document.querySelectorAll('.web-component');
		components.forEach(component => observer.observe(component));
	};

	async initComponent(nodeName) {
		const stylesheet = WcLoadStylesheet({
			id: `${nodeName}-stylesheet-loader`,
			href: this.getMixManifestVersion(`/assets/css/${nodeName}.css`),
			attrs: [{
				key: 'id',
				value: `${nodeName}-stylesheet-loader`
			}]
		});

		const script = WcLoadScript({
			id: `${nodeName}-script-loader`,
			src: this.getMixManifestVersion(`/assets/js/${nodeName}.js`),
			attrs: [{
				key: 'type',
				value: 'text/javascript'
			}, {
				key: 'id',
				value: `${nodeName}-script-loader`,
			}, {
				key: 'defer',
				value: 'true'
			}, {
				key: 'data-add-to',
				value: 'body'
			}]
		});

		await Promise
			.all([script, stylesheet])
			.catch(console.error);
	};

	initEventListeners() {
		const id = 'event-listeners';

		WcLoadScript({
			id: `${id}-script-loader`,
			src: `/assets/js/${id}.js?v=${this.dataset.buildVersion}`,
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
				key: 'data-add-to',
				value: 'body'
			}]
		}).then();
	}

	initPinterest() {
		const id = 'pinit';

		WcLoadScript({
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
		}).then();
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

customElements.define('wc-app', WcApp);
