/**
 * Waits until library has loaded before executing callback.
 * @param callback
 */
let waitForLibraryTimeout = null;

const defer = (library, callback) => {
	if (library) {
		if (callback) {
			callback();
		}

		clearTimeout(waitForLibraryTimeout);
	} else {
		waitForLibraryTimeout = setTimeout(() => defer(library, callback), 50);
	}
};

global.Defer = defer;
