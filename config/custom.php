<?php

use craft\helpers\App;

return [
	'loadComponents' => App::env('LOAD') ?? 'on-demand',
];
