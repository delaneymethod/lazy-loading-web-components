module.exports = {
	content: [
		'./storage/runtime/compiled_templates/**/*.php',
		'./templates/**/*.{twig,css,scss}',
	],
	theme: {
		screens: {
			'sm': '640px', // Mobile Devices
			'md': '768px', // iPads, Tablets
			'lg': '1024px', // Small Screens
			'xl': '1280px' // 13" Laptop
		},
		extend: {
			screens: {
				'xl-laptop': '1366px', // 14" Laptop
				'xl-desktop': '1440px', // Desktop
				'2xl': '1536px', //  Large Screens
				'3xl': '1920px' //  Extra Large Screens
			},
		}
	}
}
