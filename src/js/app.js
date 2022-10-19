import 'intersection-observer';
import $ from 'jquery';
import 'lazysizes';

global.jQuery = global.$ = $.noConflict();

/* Keeps track of 3rd party script requests. Forces components to wait until a previous request for a 3rd party script has finished loading before doing anything. */
global.scriptsLoader = [];

import './base.js';
import './defer.js';
import './debounce.js';
import './throttle.js';
import './path-info.js';
import './load-script.js';
import './load-stylesheet.js';

class App extends HTMLElement {
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

		const debouncedInteraction = Debounce(event => event.target.dispatchEvent(initNonCriticalScriptsEvent), 300);

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
			await this.initServiceWorker();

			this.initObserver();
		}, this._idleTimeout));
	};

	getMixManifestVersion(key) {
		return (this._mixManifest && this._mixManifest[key]) ? this._mixManifest[key] : key;
	};

	initNonCriticalScripts() {
		this.initEventListeners();
		this.initPinterest();
		this.initFacebook();
		this.initGoogleTagManager();
	};

	async initServiceWorker() {
		// Do your thing... Cache assets for offline use, run background processes and lots more
		return Promise.resolve();
	};

	async initMixManifest() {
		if (! this._mixManifest) {
			this._mixManifest = await fetch(`/mix-manifest.json?id=${this._currentTimestamp}`, { method: 'GET', cache: 'no-store' }).then(response => response.json());
		}
	};

	initObserver() {
		/**
		 * Observes and loads components into view as the user scrolls towards them.
		 * Components are only loaded once per page load.
		 */
		const componentsLoaded = {};

		const observer = new IntersectionObserver((entries, observerRef) => {
			entries.forEach(async entry => {
				if (entry.isIntersecting) {
					let nodeName = entry.target.nodeName.toLowerCase();

					if (nodeName === 'img') {
						if (! entry.target.id) {
							nodeName = 'image-' + Math.floor(Math.random() * 9000000000) + 1000000000;
						} else {
							nodeName = entry.target.id;
						}
					}

					observerRef.unobserve(entry.target);

					if (! componentsLoaded[nodeName]) {
						const id = nodeName;

						// Lazy loads images within components
						if (nodeName.includes('image-')) {
							entry.target.id = id;
							entry.target.src = entry.target.dataset.src;
							entry.target.classList.add('image-loaded');

							componentsLoaded[nodeName] = true;
						} else {
							const stylesheet = LoadStylesheet({
								id: `${id}-stylesheet-loader`,
								href: this.getMixManifestVersion(`/assets/css/${nodeName}.css`),
								attrs: [{
									key: 'id',
									value: `${id}-stylesheet-loader`
								}]
							});

							const script = LoadScript({
								id: `${id}-script-loader`,
								src: this.getMixManifestVersion(`/assets/js/${nodeName}.js`),
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
									key: 'data-add-to',
									value: 'body'
								}]
							});

							await Promise
								.all([script, stylesheet])
								.catch(console.error)
								.finally(() => (componentsLoaded[nodeName] = true));
						}
					}
				}
			});
		}, {
			root: null,
			rootMargin: '0px',
			threshold: [0.0, 1.0]
		});

		const components = document.querySelectorAll('.component');
		components.forEach(component => observer.observe(component));
	};

	initEventListeners() {
		const id = 'event-listeners';

		LoadScript({
			id: `${id}-script-loader`,
			src: `/assets/js/${id}.js`,
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

		LoadScript({
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
		/**
		 * FIXME - Find a way to insert no script stuff
		 *
		 * <!-- Facebook (noscript) -->
		 * <noscript><img height="1" width="1" style="display:none;" src="https://www.facebook.com/tr?id=__FIXME__&amp;ev=PageView&amp;noscript=1"/></noscript>
		 * <!-- End Facebook (noscript) -->
		 */

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
		/**
		 * FIXME - Find a way to insert no script stuff
		 *
		 * <!-- Google Tag Manager (noscript) -->
		 * <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=__FIXME__" height="0" width="0" style="display:none;visibility:hidden;"></iframe></noscript>
		 * <!-- End Google Tag Manager (noscript) -->
		 */

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

customElements.define('app', App);
