import { deleteAsync } from 'del';

const paths = await deleteAsync([
	'web/assets/js/**',
	'web/assets/css/**',
	'web/assets/icons/**',
	'web/assets/fonts/**',
	'web/assets/img/**',
	'!web/assets',
	'!web/assets/js',
	'!web/assets/css',
	'!web/assets/icons',
	'!web/assets/fonts',
	'!web/assets/img'
]);

console.info('Deleted files:');
console.info(paths.join('\n'));
console.info('\n');
