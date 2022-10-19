const WEB_ROOT = 'public';

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

if (mix.inProduction()) {
	sassPlugins.push(cssnano());
}

mix.webpackConfig({
	stats: {
		children: false
	}
});

mix.disableNotifications();

mix.setPublicPath(WEB_ROOT);

// Main App
mix.sass('src/scss/app.scss', 'assets/css/app.css', {}, sassPlugins);
mix.js('src/js/app.js', `${WEB_ROOT}/assets/js/app.js`);

// App Helpers
mix.js('src/js/defer.js', `${WEB_ROOT}/assets/js/defer.js`);
mix.js('src/js/debounce.js', `${WEB_ROOT}/assets/js/debounce.js`);
mix.js('src/js/throttle.js', `${WEB_ROOT}/assets/js/throttle.js`);
mix.js('src/js/load-script.js', `${WEB_ROOT}/assets/js/load-script.js`);
mix.js('src/js/load-stylesheet.js', `${WEB_ROOT}/assets/js/load-stylesheet.js`);
mix.js('src/js/event-listeners.js', `${WEB_ROOT}/assets/js/event-listeners.js`);

mix.copy('src/fonts', `${WEB_ROOT}/assets/fonts`);
mix.copy('src/img', `${WEB_ROOT}/assets/img`);

// Web Components
components.forEach(component => {
	mix.sass(`templates/_components/${component}/${component}.scss`, `assets/css/${component}.css`, {}, sassPlugins);
	mix.js(`templates/_components/${component}/${component}.js`, `${WEB_ROOT}/assets/js/${component}.js`);
});

mix.extract();

if (mix.inProduction()) {
	mix.version();
}
