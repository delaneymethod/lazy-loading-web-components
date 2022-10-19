const addResourcesToCache = async (resources) => {
	const cache = await caches.open('v1');
	await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
	event.waitUntil(
		addResourcesToCache([
			'/',
			'/favicon.ico',
			'/assets/css/app.css',
			'/assets/css/index.critical.css',
			'/assets/js/manifest.js',
			'/assets/js/vendor.js',
			'/assets/js/app.js',
		])
	);
});
