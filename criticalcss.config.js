module.exports = {
	urls: [
		{
			url: '/',
			filename: 'index',
		},
		// Add additional pages here
	],
	base: './',
	prefix: '/assets/css/',
	suffix: '.critical.css',
	css: [
		'./public/assets/css/app.css',
	],
	inline: false,
	dimensions: [
		{
			width: 1366,
			height: 768,
		},
	],
	request: {
		https: {
			rejectUnauthorized: false,
		},
	},
	penthouse: {
		blockJSRequests: true,
	},
};
