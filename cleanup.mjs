import { deleteAsync } from 'del';

const paths = await deleteAsync([
	'public/assets/js/**',
	'public/assets/css/**',
	'public/assets/fonts/**',
	'public/assets/img/**',
	'!public/assets',
	'!public/assets/js',
	'!public/assets/css',
	'!public/assets/fonts',
	'!public/assets/img'
]);

console.info('Deleted files:');
console.info(paths.join('\n'));
console.info('\n');
