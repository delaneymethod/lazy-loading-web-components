const fs = require('fs');
const mix = require('laravel-mix');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const { components } = require('./components.config.js');
const tailwindcssNesting = require('tailwindcss/nesting');

const sassPlugins = [
	postcssImport(),
	tailwindcssNesting(),
	tailwindcss('tailwindcss.config.js'),
	autoprefixer(),
];

const uid = () => {
	let text = '';

	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 16; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

if (mix.inProduction()) {
	sassPlugins.push(cssnano());
}

mix.options({
	processCssUrls: true
});

mix.webpackConfig({
	stats: {
		children: false
	}
});

mix.disableNotifications();

mix.setPublicPath(process.env.MIX_WEB_ROOT);

// Main App
mix.sass('src/scss/wc-app.scss', 'assets/css/wc-app.css', {}, sassPlugins);
mix.js('src/js/wc-app.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-app.js`);

// App Helpers
mix.js('src/js/wc-defer.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-defer.js`);
mix.js('src/js/wc-debounce.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-debounce.js`);
mix.js('src/js/wc-throttle.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-throttle.js`);
mix.js('src/js/wc-path-info.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-path-info.js`);
mix.js('src/js/wc-load-script.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-load-script.js`);
mix.js('src/js/wc-load-stylesheet.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-load-stylesheet.js`);
mix.js('src/js/wc-event-listeners.js', `${process.env.MIX_WEB_ROOT}/assets/js/wc-event-listeners.js`);

mix.copy('src/icons', `${process.env.MIX_WEB_ROOT}/assets/icons`);
mix.copy('src/fonts', `${process.env.MIX_WEB_ROOT}/assets/fonts`);
mix.copy('src/img', `${process.env.MIX_WEB_ROOT}/assets/img`);

// Web Components
components.forEach(component => {
	mix.sass(`templates/_components/${component}/${component}.scss`, `assets/css/${component}.css`, {}, sassPlugins);
	mix.js(`templates/_components/${component}/${component}.js`, `${process.env.MIX_WEB_ROOT}/assets/js/${component}.js`);
});

mix.extract();

if (mix.inProduction()) {
	mix.version();
}

mix.after(() => fs.writeFileSync('templates/buildVersion.twig', uid()));
