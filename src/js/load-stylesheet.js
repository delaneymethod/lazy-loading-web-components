/**
 * Injects stylesheet into the head of the document
 * @param params
 */
const loadStylesheet = params => new Promise( (resolve, reject) => {
	const existingStylesheet = document.getElementById(params.id);

	if (! existingStylesheet) {
		if (params.href) {
			const link = document.createElement('link');
			link.href = params.href;
			link.rel = 'stylesheet';
			link.crossOrigin = 'anonymous';
			link.referrerpolicy = 'no-referrer';

			if (params.attrs) {
				params.attrs.forEach(attr => link.setAttribute(attr.key, attr.value));
			}

			if (link.readyState) {
				link.onreadystatechange = () => {
					if (link.readyState === 'loaded' || link.readyState === 'complete') {
						link.onreadystatechange = null;

						resolve(link.readyState);
					}
				};
			} else {
				link.onload = response => resolve(response);
				link.onerror = error => reject(error);
			}

			document.getElementsByTagName('head')[0].appendChild(link);
		} else {
			reject(`loadStylesheet -> ${params.id} -> missing href`);
		}
	} else {
		resolve(`loadStylesheet -> ${params.id} -> already exists`);
	}
}).catch(console.error);

export default loadStylesheet;
