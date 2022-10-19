'use strict';

import { generate } from 'critical';
import config from './criticalcss.config.js';

const doCriticalCSS = (data, processData, callback) => {
	if (data.length > 0) {
		const loop = (data, i, processData, callback) => {
			processData(data[i], i, () => {
				i++;

				if (i < data.length) {
					loop(data, i, processData, callback);
				} else {
					callback();
				}
			});
		};

		loop(data, 0, processData, callback);
	}
};

const processData = async ({ url: src, filename }, i, callback) => {
	const target = process.env.WEB_ROOT + config.prefix + filename + config.suffix;
	const params = (({ urls, prefix, suffix, ...object }) => object)(config);

	console.info(`-> Generating Critical CSS: ${src} -> ${target}`);

	generate({
		src,
		target,
		...params,
	}, error => {
		if (error) {
			console.error(error);
		}

		callback();
	}).then(() => callback());
};

doCriticalCSS(config.urls, processData, () => {});
