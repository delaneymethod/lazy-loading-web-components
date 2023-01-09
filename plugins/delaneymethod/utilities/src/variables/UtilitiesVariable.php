<?php
/**
 * DelaneyMethod Utilities plugin for Craft CMS 3.x
 *
 * Custom helpers and Twig filters
 *
 * @link      https://delaneymethod.com
 * @copyright Copyright (c) 2022 DelaneyMethod
 */

namespace delaneymethod\utilities\variables;

use Craft;
use craft\helpers\App;
use craft\helpers\Template;
use Twig\Markup;

class UtilitiesVariable
{
    /**
     * @param string $string
     * @return bool
     */
    public function assetExists(string $string): bool
    {
        return file_exists(App::env('WEB_ROOT').'/'.$string);
    }

	/**
	 * Returns the file in $path
	 *
	 * @param string $path
	 * @return Markup
	 */
	public function inlineFile(string $path): Markup
	{
		return Template::raw(@file_get_contents(Craft::getAlias('@webroot').$path) ?? '');
	}
}
