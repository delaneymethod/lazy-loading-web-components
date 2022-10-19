/**
 * Prevents trigger happy users from overwhelming the UI
 * @param func
 * @param timeout
 */
const debounce = (func, timeout = 300) => {
	let timer = null;

	return (...args) => {
		clearTimeout(timer);

		timer = setTimeout(() => func.apply(this, args), timeout);
	};
};

global.Debounce = debounce;
