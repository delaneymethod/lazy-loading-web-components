/**
 * Waits until library has loaded before executing callback.
 * @param callback
 */
let waitForLibraryTimeout = null;

const WcDefer = (library, callback) => {
	if (library) {
		if (callback) {
			callback();
		}

		clearTimeout(waitForLibraryTimeout);
	} else {
		waitForLibraryTimeout = setTimeout(() => WcDefer(library, callback), 50);
	}
};

global.WcDefer = WcDefer;
