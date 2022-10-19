# Lazy Loading Web Components

This lazy loading Web Components template / idea was created after I worked on numerous CraftCMS projects that used a custom Page Builder idea that I helped development over at Solspace.

I won't get too much into how the Page Builder was built itself but it used a mixture of Neo and SuperTables to allow users to create page content based on components. e.g Hero, Sticky Menu, Gallery, Slider or a Form. You get the gist...

The main functionality uses the Intersection Observer API and dynamic imports to load Web Components (WC) only when they're needed on the page.

Using this pattern defers the loading of the component source until the tag is visible on the page, so:

- If a user visits on a browser that can't or won't run JavaScript or doesn't support WC, they won't download the JS/CSS that they'll never use.
- If a user visits on a browser that does support WC and does visit a page containing the WC, and scrolls down to the part of the page that contains the WC, they'll download the JS/CSS that they require on demand.

This way we can progressively enhance the user experience not only based on browser features, but also only when a component is actually required.

Other features of this project:

- Component JS/CSS is only injected into the page once. So if a page has the same component added multiple times, the JS/CSS is only loaded once.
- Multiple requests to 3rd party scripts are queued and components wait until the 3rd party script is available before loading fully.
- Non critical scripts or functionality, e.g. jQuery event listeners, can be loaded after the users first interaction with the page.

This template is also work in progress and might contain bugs. In order to get this template running correctly, you really need a CraftCMS backend upset.

# Project installation

Install npm dependencies
---
`npm install`

## JS Framework

Additional libraries and JS code can be added in `src/js/app.js`.

I've split out additional libraries and JS code specific to the component in `src/js/base.js`.

## SCSS Framework

Additional libraries and SCSS/CSS code can be added from `src/scss/app.scss`.

## Web Components

An example component can be found in `templates/_components/example`.

There are a number of steps to add a new component to the project:

1) Duplicate the `example` folder and rename to match the component you are building.
	2) Component names must follow a valid Web Component naming format. E.g `hero`.
2) Update `components.config.js` with your component name.

## Working on the project

SCSS and JS files are compiled using [**Laravel Mix**](https://laravel-mix.com/). Laravel Mix settings/commands can be found in `webpack.mix.js`.

On a fresh repo clone, run `npm install` to install the needed libraries for Laravel Mix and the tools it uses to compile SCSS and JS.

**Don't have `npm` installed?** (eg. on a fresh server without node/npm installed) Try this documentation to install node and npm: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04

> **Recommendation**: install and use `nvm` to manage different versions of node in case the version used to run Laravel Mix doesn't work properly.

Once `npm` is installed and `npm install` has been run, you can compile the assets using `npm run dev` (uncompressed) or `npm run prod` (compressed, for production use). `npm run watch` can be used to watch for changes during development. Run `npm run` for additional/alternate commands that can be used to compile assets.

### Critical CSS

To generate critical css files for each page listed in `criticalcss.config.js`, run `npm run criticalcss`.

### Cleaning the Assets folder

To clean the `public/assets` folder, run `npm run cleanup`.

## Deploying (Staging or Production)

`npm run prod` or `npx mix --production`
