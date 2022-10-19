/**
 * Injects script into the document
 * @param params
 */
const loadScript = params => {
	return new Promise( (resolve, reject) => {
		const existingScript = document.getElementById(params.id);

		if (! existingScript) {
			if (params.src) {
				const script = document.createElement('script');
				script.src = params.src;
				script.crossorigin = 'anonymous';
				script.referrerpolicy = 'no-referrer';

				if (params.attrs) {
					params.attrs.forEach(attr => script.setAttribute(attr.key, attr.value));
				}

				if (script.readyState) {
					script.onreadystatechange = () => {
						if (script.readyState === 'loaded' || script.readyState === 'complete') {
							script.onreadystatechange = null;

							resolve(script.readyState);
						}
					};
				} else {
					script.onload = response => resolve(response);
					script.onerror = error => reject(error);
				}

				if (params['data-add-to'] === 'head') {
					document.getElementsByTagName('head')[0].appendChild(script);
				} else {
					document.getElementsByTagName('body')[0].appendChild(script);
				}
			} else {
				reject(`loadScript -> ${params.id} -> missing src`);
			}
		} else {
			resolve(`loadScript -> ${params.id} -> already exists`);
		}
	}).catch(console.error);
};

global.LoadScript = loadScript;
