/**
 * Prevents an event or action from being called multiple times in a short period
 * @param func
 * @param timeout
 */
const WcThrottle = (func, timeout = 100) => {
	let timer = null;

	return (...args) => {
		if (timer === null) {
			timer = setTimeout(() => {
				func.apply(this, args);

				timer = null;
			}, timeout);
		}
	};
};

global.WcThrottle = WcThrottle;
