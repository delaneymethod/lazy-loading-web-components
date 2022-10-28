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

use craft\helpers\App;

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
}
