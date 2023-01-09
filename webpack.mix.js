const fs = require('fs');
const mix = require('laravel-mix');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const { components } = require('./components.config.js');
const tailwindcssNesting = require('tailwindcss/nesting');

require('laravel-mix-criticalcss');

const sassPlugins = [
	postcssImport(),
	tailwindcssNesting(),
	tailwindcss('tailwindcss.config.js'),
	autoprefixer(),
];

if (mix.inProduction()) {
	sassPlugins.push(cssnano());
}

const uid = () => {
	let text = '';

	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 16; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

const readAppend = async (file, appendFile) =>
	new Promise((resolve, reject) =>
		fs.readFile(appendFile, function (error, data) {
			if (error) reject(error);

			fs.appendFile(file, data, function (error) {
				if (error) reject(error);

				resolve();
			});
		})
	);

mix.webpackConfig({
	stats: {
		children: false
	}
});

mix.disableNotifications();

mix.setPublicPath(process.env.MIX_WEB_ROOT);

// App Helpers
mix.js('src/js/event-listeners.js', `${process.env.MIX_WEB_ROOT}/assets/js/event-listeners.js`);

mix.copy('src/icons', `${process.env.MIX_WEB_ROOT}/assets/icons`);
mix.copy('src/fonts', `${process.env.MIX_WEB_ROOT}/assets/fonts`);
mix.copy('src/img', `${process.env.MIX_WEB_ROOT}/assets/img`);

if (process.env.LOAD === 'all') {
	// IF LOADING ALL COMPONENTS UPON PAGE LOAD, WE COMBINE MAIN APP AND COMPONENTS SCSS TO GENERATE SINGLE CSS FILE, MOVING THE FILE INTO THE PUBLIC FOLDER
	const combinedScss = 'src/scss/app-combined.scss';

	mix.before(async () => {
		await readAppend(combinedScss, 'src/scss/app.scss');

		for (let i = 0; i < components.length; i++) {
			await readAppend(combinedScss, `templates/_components/${components[i]}/${components[i]}.scss`);
		}
	});

	mix.sass(combinedScss, 'assets/css/app.css', {}, sassPlugins);
} else {
	// IF LOADING COMPONENTS ON-DEMAND, WE GENERATE EACH INDIVIDUAL SCSS INTO CSS, MOVING THE FILES INTO THE PUBLIC FOLDER
	mix.sass('src/scss/app.scss', 'assets/css/app.css', {}, sassPlugins);

	components.forEach(component => mix.sass(`templates/_components/${component}/${component}.scss`, `assets/css/${component}.css`, {}, sassPlugins));
}

if (process.env.LOAD === 'all') {
	// IF LOADING ALL COMPONENTS UPON PAGE LOAD, WE COMBINE MAIN APP AND COMPONENTS JS TO GENERATE SINGLE JS FILE, MOVING THE FILE INTO THE PUBLIC FOLDER
	const scripts = [];

	scripts.push('src/js/app.js');

	components.map(component => scripts.push(`templates/_components/${component}/${component}.js`));

	mix.js(scripts, `${process.env.MIX_WEB_ROOT}/assets/js/app.js`);
} else {
	// IF LOADING COMPONENTS ON-DEMAND, WE GENERATE EACH INDIVIDUAL JS FILE, MOVING THE FILE INTO THE PUBLIC FOLDER
	mix.js('src/js/app.js', `${process.env.MIX_WEB_ROOT}/assets/js/app.js`);

	components.forEach(component => mix.js(`templates/_components/${component}/${component}.js`, `${process.env.MIX_WEB_ROOT}/assets/js/${component}.js`));
}

mix.extract();

if (mix.inProduction()) {
	const criticalCssUrls = [];

	criticalCssUrls.push(
		{
			url: '/',
			template: 'index',
		},
	);

	mix.criticalCss({
		enabled: true,
		paths: {
			base: process.env.PRIMARY_SITE_URL,
			templates: `${process.env.MIX_WEB_ROOT}/assets/css/`,
			suffix: '.critical',
		},
		urls: criticalCssUrls,
		options: {
			minify: true,
			extract: false,
			inline: false,
			inlineImages: false,
			width: 1600,
			height: 1200,
			penthouse: {
				timeout: 1200000,
			},
		},
	});
}

mix.after(() => fs.writeFileSync('templates/buildVersion.twig', uid()));
