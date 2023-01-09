const pathInfo = filepath => {
	const info = filepath.match(/(.*?[\\/:])?(([^\\/:]*?)(\.[^\\/.]+?)?)(?:[?#].*)?$/);

	return {
		path: info[1],
		file: info[2],
		name: info[3],
		ext: info[4]
	};
};

export default pathInfo;
