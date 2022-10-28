<?php
/**
 * DelaneyMethod Utilities plugin for Craft CMS 3.x
 *
 * Custom helpers and Twig filters
 *
 * @link      https://delaneymethod.com
 * @copyright Copyright (c) 2022 DelaneyMethod
 */

namespace delaneymethod\utilities\twigextensions;

use Twig\TwigFilter;
use Twig\TwigFunction;
use Twig\Extension\AbstractExtension;

/**
 * @author    DelaneyMethod
 * @package   Utilities
 * @since     1.0.0
 */
class UtilitiesTwigExtension extends AbstractExtension
{
	/**
	 * @return string
	 */
	public function getName(): string
	{
		return 'Utilities';
	}

	/**
	 * @return TwigFilter[]
	 */
	public function getFilters(): array
	{
		return [];
	}

	/**
	 * @inheritdoc
	 */
	public function getFunctions(): array
	{
		return [];
	}
}
