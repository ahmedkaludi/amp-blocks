<?php

/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Amp Blocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Class to Enqueue CSS/JS of all the blocks.
 *
 * @category class
 */
class Amp_Blocks_Frontend
{

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Check for amp
	 *
	 * @var null
	 */
	private static $ampcheck = 'nonamp';

	/**
	 * Class Constructor.
	 */
	public function __construct()
	{
		add_action('init', array($this, 'on_init'), 20);
		add_action('enqueue_block_assets', array($this, 'blocks_assets'));
		add_action('after_setup_theme', array($this,'ampforwp_template_mode_is_activate'), 999);


		$siteUrl = filter_input(INPUT_SERVER, 'REQUEST_URI');
		$amp_end_query = explode('/', $siteUrl);
		if (function_exists('ampforwp_generate_endpoint') && (in_array('amp', $amp_end_query) || in_array('?amp', $amp_end_query))) {
			add_action('amp_post_template_css', array($this, 'frontend_inline_css'), 20);
			add_action('amp_post_template_css', array($this, 'frontend_gfonts'), 90);
			self::$ampcheck = 'amp';
		} else {
			add_action('wp_enqueue_scripts', array($this, 'frontend_inline_css'), 20);
			add_action('wp_head', array($this, 'frontend_gfonts'), 90);
		}
	}

	function ampforwp_template_mode_is_activate(){
		if(function_exists('ampforwp_generate_endpoint') && get_theme_support('amp-template-mode') && !is_customize_preview()){
			add_action('amp_post_template_css', array($this, 'frontend_inline_css'), 20);
			add_action('amp_post_template_css', array($this, 'frontend_gfonts'), 90);
			self::$ampcheck = 'amp'; 
		}
	}

	/**
	 * Instance Control
	 */
	public static function get_instance()
	{
		if (is_null(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * On init startup.
	 */
	public function on_init()
	{
		// Only load if Gutenberg is available.
		if (!function_exists('register_block_type')) {
			return;
		}
		register_block_type(
			'amp/rowlayout',
			array(
				'render_callback' => array($this, 'render_row_layout_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'amp/column',
			array(
				'render_callback' => array($this, 'render_column_layout_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'amp/advancedbtn',
			array(
				'render_callback' => array($this, 'render_advanced_btn_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'amp/buttongroup',
			array(
				'render_callback' => array($this, 'render_advanced_btn_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'amp/advancedheading',
			array(
				'render_callback' => array($this, 'render_advanced_heading_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'amp/icon',
			array(
				'render_callback' => array($this, 'render_icon_css'),
				'editor_script' => 'amp-blocks-js',
				'editor_style' => 'amp-blocks-editor-css',
			)
		);
		register_block_type(
			'ampblocks/form',
			array(
				'render_callback' => array( $this, 'render_form_css' ),
				'editor_script'   => 'amp-blocks-js',
				'editor_style'    => 'amp-blocks-editor-css',
			)
		);

		add_filter('excerpt_allowed_blocks', array($this, 'add_blocks_to_excerpt'), 20);
	}

	/**
	 * Allow Columns to be looked at for inner content.
	 *
	 * @param array $allowed inner blocks.
	 */
	public function add_blocks_to_excerpt($allowed)
	{
		$allowed = array_merge($allowed, apply_filters('amp_blocks_allowed_excerpt_blocks', array('amp/advancedheading')));
		return $allowed;
	}

	/**
	 * Render Row Block CSS Inline
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_row_layout_css($attributes, $content)
	{
		if (!wp_style_is('amp-blocks-rowlayout', 'enqueued')) {
			wp_enqueue_style('amp-blocks-rowlayout');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'rowlayout', $unique_id)) {
				$this->render_row_layout_scripts($attributes);
				$css = $this->row_layout_array_css($attributes, $unique_id);
				if (!empty($css)) {
					if (doing_filter('the_content')) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css($css, $style_id, true);
					}
				}
			}
		}
		return $content;
	}

	/**
	 * Adds Scripts for row block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function render_row_layout_scripts($attr)
	{
		if (isset($attr['backgroundSettingTab']) && 'slider' === $attr['backgroundSettingTab']) {
			wp_enqueue_style('amp-blocks-pro-slick');
			wp_enqueue_script('amp-blocks-slick-init');
		}
		if (isset($attr['backgroundSettingTab']) && 'video' === $attr['backgroundSettingTab'] && isset($attr['backgroundVideo']) && isset($attr['backgroundVideo'][0]) && isset($attr['backgroundVideo'][0]['btns']) && true === $attr['backgroundVideo'][0]['btns']) {
			wp_enqueue_script('amp-blocks-video-bg');
		}
	}

	/**
	 * Builds Css for row layout block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function row_layout_array_css($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['firstColumnWidth']) && !empty($attr['firstColumnWidth']) && (!isset($attr['columns']) || 2 === $attr['columns'])) {
			$css .= '@media (min-width: 767px) {';
			$css .= '#ri' . $unique_id . ' > .cw > .c-1 {';
			$css .= 'flex: 0 1 ' . $attr['firstColumnWidth'] . '%;';
			$css .= '}';
			$css .= '#ri' . $unique_id . ' > .cw > .c-2 {';
			$css .= 'flex: 0 1 ' . abs($attr['firstColumnWidth'] - 100) . '%;';
			$css .= '}';
			$css .= '}';
			if (isset($attr['tabletLayout']) && !empty($attr['tabletLayout'])) {
				if ('left-golden' === $attr['tabletLayout']) {
					$tabCol1 = '66.67';
					$tabCol2 = '33.33';
				} elseif ('right-golden' === $attr['tabletLayout']) {
					$tabCol1 = '33.33';
					$tabCol2 = '66.67';
				} elseif ('row' === $attr['tabletLayout']) {
					$tabCol1 = '100';
					$tabCol2 = '100';
				} else {
					$tabCol1 = '50';
					$tabCol2 = '50';
				}
				$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
				$css .= '#ri' . $unique_id . ' > .cw > .c-1 {';
				$css .= 'flex: 0 1 ' . $tabCol1 . '%;';
				$css .= '}';
				$css .= '#ri' . $unique_id . ' > .cw > .c-2 {';
				$css .= 'flex: 0 1 ' . $tabCol2 . '%;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['firstColumnWidth']) && !empty($attr['firstColumnWidth']) && isset($attr['secondColumnWidth']) && !empty($attr['secondColumnWidth']) && (isset($attr['columns']) && 3 === $attr['columns'])) {
			$css .= '@media (min-width: 767px) {';
			$css .= '#ri' . $unique_id . ' > .cw > .c-1 {';
			$css .= 'flex: 0 1 ' . $attr['firstColumnWidth'] . '%;';
			$css .= '}';
			$css .= '#ri' . $unique_id . ' > .cw > .c-2 {';
			$css .= 'flex: 0 1 ' . $attr['secondColumnWidth'] . '%;';
			$css .= '}';
			$css .= '#ri' . $unique_id . ' > .cw > .c-3 {';
			$css .= 'flex: 0 1 ' . abs(($attr['firstColumnWidth'] + $attr['secondColumnWidth']) - 100) . '%;';
			$css .= '}';
			$css .= '}';
			if (isset($attr['tabletLayout']) && !empty($attr['tabletLayout'])) {
				if ('left-half' === $attr['tabletLayout']) {
					$tabCol1 = '50';
					$tabCol2 = '25';
					$tabCol3 = '25';
				} elseif ('right-half' === $attr['tabletLayout']) {
					$tabCol1 = '25';
					$tabCol2 = '25';
					$tabCol3 = '50';
				} elseif ('center-half' === $attr['tabletLayout']) {
					$tabCol1 = '25';
					$tabCol2 = '50';
					$tabCol3 = '25';
				} elseif ('center-wide' === $attr['tabletLayout']) {
					$tabCol1 = '20';
					$tabCol2 = '60';
					$tabCol3 = '20';
				} elseif ('center-exwide' === $attr['tabletLayout']) {
					$tabCol1 = '15';
					$tabCol2 = '70';
					$tabCol3 = '15';
				} elseif ('row' === $attr['tabletLayout']) {
					$tabCol1 = '100';
					$tabCol2 = '100';
					$tabCol3 = '100';
				} else {
					$tabCol1 = '33.33';
					$tabCol2 = '33.33';
					$tabCol3 = '33.33';
				}
				$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
				$css .= '#ri' . $unique_id . ' > .cw > .c-1 {';
				$css .= 'flex: 0 1 ' . $tabCol1 . '%;';
				$css .= '}';
				$css .= '#ri' . $unique_id . ' > .cw > .c-2 {';
				$css .= 'flex: 0 1 ' . $tabCol2 . '%;';
				$css .= '}';
				$css .= '#ri' . $unique_id . ' > .cw > .c-3 {';
				$css .= 'flex: 0 1 ' . $tabCol3 . '%;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['bgColor']) || isset($attr['bgImg']) || isset($attr['topMargin']) || isset($attr['bottomMargin'])) {
			$css .= '#ri' . $unique_id . ' {';
			if (isset($attr['topMargin'])) {
				$css .= 'margin-top:' . $attr['topMargin'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
			}
			if (isset($attr['bottomMargin'])) {
				$css .= 'margin-bottom:' . $attr['bottomMargin'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
			}
			if (isset($attr['bgColor'])) {
				$css .= 'background-color:' . $attr['bgColor'] . ';';
			}
			if (isset($attr['bgImg']) && !empty($attr['bgImg']) && (!isset($attr['backgroundSettingTab']) || empty($attr['backgroundSettingTab']) || 'normal' === $attr['backgroundSettingTab'])) {
				if (isset($attr['bgImgAttachment'])) {
					$bg_attach = $attr['bgImgAttachment'];
				} else {
					$bg_attach = 'scroll';
				}
				$css .= 'background-image:url(' . $attr['bgImg'] . ');';
				$css .= 'background-size:' . (isset($attr['bgImgSize']) ? $attr['bgImgSize'] : 'cover') . ';';
				$css .= 'background-position:' . (isset($attr['bgImgPosition']) ? $attr['bgImgPosition'] : 'center center') . ';';
				$css .= 'background-attachment:' . $bg_attach . ';';
				$css .= 'background-repeat:' . (isset($attr['bgImgRepeat']) ? $attr['bgImgRepeat'] : 'no-repeat') . ';';
			}
			$css .= '}';
		}
		if (isset($attr['zIndex'])) {
			$css .= '.ri' . $unique_id . ' > .cw {';
			$css .= 'z-index:' . $attr['zIndex'] . ';';
			$css .= '}';
		}
		if (isset($attr['textColor'])) {
			$css .= '.ri' . $unique_id . ', .ri' . $unique_id . ' h1, .ri' . $unique_id . ' h2, .ri' . $unique_id . ' h3, .ri' . $unique_id . ' h4, .ri' . $unique_id . ' h5, .ri' . $unique_id . ' h6 {';
			$css .= 'color:' . $attr['textColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['linkColor'])) {
			$css .= '.ri' . $unique_id . ' a {';
			$css .= 'color:' . $attr['linkColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['linkHoverColor'])) {
			$css .= '.ri' . $unique_id . ' a:hover {';
			$css .= 'color:' . $attr['linkHoverColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['bottomSep']) && 'none' != $attr['bottomSep']) {
			if (isset($attr['bottomSepHeight']) || isset($attr['bottomSepWidth'])) {
				if (isset($attr['bottomSepHeight'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep {';
					$css .= 'height:' . $attr['bottomSepHeight'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['bottomSepWidth'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep svg {';
					$css .= 'width:' . $attr['bottomSepWidth'] . '%;';
					$css .= '}';
				}
			}
			if (isset($attr['bottomSepHeightTab']) || isset($attr['bottomSepWidthTab'])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				if (isset($attr['bottomSepHeightTab'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep {';
					$css .= 'height:' . $attr['bottomSepHeightTab'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['bottomSepWidthTab'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep svg {';
					$css .= 'width:' . $attr['bottomSepWidthTab'] . '%;';
					$css .= '}';
				}
				$css .= '}';
			}
			if (isset($attr['bottomSepHeightMobile']) || isset($attr['bottomSepWidthMobile'])) {
				$css .= '@media (max-width: 767px) {';
				if (isset($attr['bottomSepHeightMobile'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep {';
					$css .= 'height:' . $attr['bottomSepHeightMobile'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['bottomSepWidthMobile'])) {
					$css .= '#ri' . $unique_id . ' .rlbottom-sep svg {';
					$css .= 'width:' . $attr['bottomSepWidthMobile'] . '%;';
					$css .= '}';
				}
				$css .= '}';
			}
		}
		if (isset($attr['topSep']) && 'none' != $attr['topSep']) {
			if (isset($attr['topSepHeight']) || isset($attr['topSepWidth'])) {
				if (isset($attr['topSepHeight'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep {';
					$css .= 'height:' . $attr['topSepHeight'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['topSepWidth'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep svg {';
					$css .= 'width:' . $attr['topSepWidth'] . '%;';
					$css .= '}';
				}
			}
			if (isset($attr['topSepHeightTab']) || isset($attr['topSepWidthTab'])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				if (isset($attr['topSepHeightTab'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep {';
					$css .= 'height:' . $attr['topSepHeightTab'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['topSepWidthTab'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep svg {';
					$css .= 'width:' . $attr['topSepWidthTab'] . '%;';
					$css .= '}';
				}
				$css .= '}';
			}
			if (isset($attr['topSepHeightMobile']) || isset($attr['topSepWidthMobile'])) {
				$css .= '@media (max-width: 767px) {';
				if (isset($attr['topSepHeightMobile'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep {';
					$css .= 'height:' . $attr['topSepHeightMobile'] . 'px;';
					$css .= '}';
				}
				if (isset($attr['topSepWidthMobile'])) {
					$css .= '#ri' . $unique_id . ' .rltop-sep svg {';
					$css .= 'width:' . $attr['topSepWidthMobile'] . '%;';
					$css .= '}';
				}
				$css .= '}';
			}
		}
		if (isset($attr['topPadding']) || isset($attr['bottomPadding']) || isset($attr['leftPadding']) || isset($attr['rightPadding']) || isset($attr['minHeight']) || isset($attr['maxWidth'])) {
			$css .= '#ri' . $unique_id . ' > .cw {';
			if (isset($attr['topPadding'])) {
				$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
			}
			if (isset($attr['bottomPadding'])) {
				$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
			}
			if (isset($attr['leftPadding'])) {
				$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
			}
			if (isset($attr['rightPadding'])) {
				$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
			}
			if (isset($attr['minHeight'])) {
				$css .= 'min-height:' . $attr['minHeight'] . (isset($attr['minHeightUnit']) && !empty($attr['minHeightUnit']) ? $attr['minHeightUnit'] : 'px') . ';';
			}
			if (isset($attr['maxWidth'])) {
				$css .= 'max-width:' . $attr['maxWidth'] . (isset($attr['maxWidthUnit']) && !empty($attr['maxWidthUnit']) ? $attr['maxWidthUnit'] : 'px') . ';';
				$css .= 'margin-left:auto;';
				$css .= 'margin-right:auto;';
			}
			$css .= '}';
		}
		if (isset($attr['overlay']) || isset($attr['overlayBgImg']) || isset($attr['overlaySecond'])) {
			$css .= '#ri' . $unique_id . ' > .rloverlay {';
			if (isset($attr['overlayOpacity'])) {
				if ($attr['overlayOpacity'] < 10) {
					$css .= 'opacity:0.0' . $attr['overlayOpacity'] . ';';
				} else if ($attr['overlayOpacity'] >= 100) {
					$css .= 'opacity:1;';
				} else {
					$css .= 'opacity:0.' . $attr['overlayOpacity'] . ';';
				}
			}
			if (isset($attr['currentOverlayTab']) && 'grad' == $attr['currentOverlayTab']) {
				$type = (isset($attr['overlayGradType']) ? $attr['overlayGradType'] : 'linear');
				if ('radial' === $type) {
					$angle = (isset($attr['overlayBgImgPosition']) ? 'at ' . $attr['overlayBgImgPosition'] : 'at center center');
				} else {
					$angle = (isset($attr['overlayGradAngle']) ? $attr['overlayGradAngle'] . 'deg' : '180deg');
				}
				$loc = (isset($attr['overlayGradLoc']) ? $attr['overlayGradLoc'] : '0');
				$color = (isset($attr['overlay']) ? $this->hex2rgba($attr['overlay'], (isset($attr['overlayFirstOpacity']) && is_numeric($attr['overlayFirstOpacity']) ? $attr['overlayFirstOpacity'] : 1)) : 'transparent');
				$locsecond = (isset($attr['overlayGradLocSecond']) ? $attr['overlayGradLocSecond'] : '100');
				$colorsecond = (isset($attr['overlaySecond']) ? $this->hex2rgba($attr['overlaySecond'], (isset($attr['overlaySecondOpacity']) && is_numeric($attr['overlaySecondOpacity']) ? $attr['overlaySecondOpacity'] : 1)) : '#00B5E2');
				$css .= 'background-image: ' . $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%);';
			} else {
				if (isset($attr['overlay'])) {
					$css .= 'background-color:' . $attr['overlay'] . ';';
				}
				if (isset($attr['overlayBgImg'])) {
					if (isset($attr['overlayBgImgAttachment'])) {
						$overbg_attach = $attr['overlayBgImgAttachment'];
					} else {
						$overbg_attach = 'scroll';
					}
					$css .= 'background-image:url(' . $attr['overlayBgImg'] . ');';
					$css .= 'background-size:' . (isset($attr['overlayBgImgSize']) ? $attr['overlayBgImgSize'] : 'cover') . ';';
					$css .= 'background-position:' . (isset($attr['overlayBgImgPosition']) ? $attr['overlayBgImgPosition'] : 'center center') . ';';
					$css .= 'background-attachment:' . $overbg_attach . ';';
					$css .= 'background-repeat:' . (isset($attr['overlayBgImgRepeat']) ? $attr['overlayBgImgRepeat'] : 'no-repeat') . ';';
				}
			}
			if (isset($attr['overlayBlendMode'])) {
				$css .= 'mix-blend-mode:' . $attr['overlayBlendMode'] . ';';
			}
			$css .= '}';
		}
		$tablet_overlay = (isset($attr['tabletOverlay']) && is_array($attr['tabletOverlay']) && isset($attr['tabletOverlay'][0]) && is_array($attr['tabletOverlay'][0]) ? $attr['tabletOverlay'][0] : array());
		$tablet_background = (isset($attr['tabletBackground']) && is_array($attr['tabletBackground']) && isset($attr['tabletBackground'][0]) && is_array($attr['tabletBackground'][0]) ? $attr['tabletBackground'][0] : array());
		if (isset($attr['tabletPadding']) || isset($attr['topMarginT']) || isset($attr['bottomMarginT']) || (isset($tablet_overlay['enable']) && $tablet_overlay['enable']) || (isset($tablet_background['enable']) && $tablet_background['enable'])) {
			$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
			if (isset($attr['topMarginT']) || isset($attr['bottomMarginT'])) {
				$css .= '#ri' . $unique_id . ' {';
				if (isset($attr['topMarginT'])) {
					$css .= 'margin-top:' . $attr['topMarginT'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
				}
				if (isset($attr['bottomMarginT'])) {
					$css .= 'margin-bottom:' . $attr['bottomMarginT'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
				}
				$css .= '}';
			}
			if (isset($attr['tabletPadding']) && is_array($attr['tabletPadding'])) {
				$css .= '#ri' . $unique_id . ' > .cw {';
				if (isset($attr['tabletPadding'][0]) && is_numeric($attr['tabletPadding'][0])) {
					$css .= 'padding-top:' . $attr['tabletPadding'][0] . 'px;';
				}
				if (isset($attr['tabletPadding'][1]) && is_numeric($attr['tabletPadding'][1])) {
					$css .= 'padding-right:' . $attr['tabletPadding'][1] . 'px;';
				}
				if (isset($attr['tabletPadding'][2]) && is_numeric($attr['tabletPadding'][2])) {
					$css .= 'padding-bottom:' . $attr['tabletPadding'][2] . 'px;';
				}
				if (isset($attr['tabletPadding'][3]) && is_numeric($attr['tabletPadding'][3])) {
					$css .= 'padding-left:' . $attr['tabletPadding'][3] . 'px;';
				}
				$css .= '}';
			}
			if (isset($tablet_background['enable']) && $tablet_background['enable']) {
				$css .= '#ri' . $unique_id . ' {';
				if (!empty($tablet_background['bgColor'])) {
					$css .= 'background-color:' . $tablet_background['bgColor'] . ';';
				}
				if (!empty($tablet_background['bgImg'])) {
					if (!empty($tablet_background['bgImgAttachment'])) {
						$bg_attach = $tablet_background['bgImgAttachment'];
					} else {
						$bg_attach = 'scroll';
					}
					$css .= 'background-image:url(' . $tablet_background['bgImg'] . ') ;';
					$css .= 'background-size:' . (!empty($tablet_background['bgImgSize']) ? $tablet_background['bgImgSize'] : 'cover') . ';';
					$css .= 'background-position:' . (!empty($tablet_background['bgImgPosition']) ? $tablet_background['bgImgPosition'] : 'center center') . ';';
					$css .= 'background-attachment:' . $bg_attach . ';';
					$css .= 'background-repeat:' . (!empty($tablet_background['bgImgRepeat']) ? $tablet_background['bgImgRepeat'] : 'no-repeat') . ';';
				} else if (isset($tablet_background['forceOverDesk']) && $tablet_background['forceOverDesk']) {
					$css .= 'background-image:none;';
				}
				$css .= '}';
				if (isset($attr['backgroundSettingTab']) && !empty($attr['backgroundSettingTab']) && 'normal' !== $attr['backgroundSettingTab']) {
					$css .= '#ri' . $unique_id . ' .amp-pre-blocks-bg-video-container, #ri' . $unique_id . ' .amp-pre-blocks-bg-slider {';
					$css .= 'display:none;';
					$css .= '}';
				}
			}
			if (!empty($tablet_overlay['enable']) && $tablet_overlay['enable']) {
				$css .= '#ri' . $unique_id . ' > .rloverlay {';
				if (!empty($tablet_overlay['overlayOpacity'])) {
					if ($tablet_overlay['overlayOpacity'] < 10) {
						$css .= 'opacity:0.0' . $tablet_overlay['overlayOpacity'] . ';';
					} else if ($tablet_overlay['overlayOpacity'] >= 100) {
						$css .= 'opacity:1;';
					} else {
						$css .= 'opacity:0.' . $tablet_overlay['overlayOpacity'] . ';';
					}
				}
				if (!empty($tablet_overlay['currentOverlayTab']) && 'grad' == $tablet_overlay['currentOverlayTab']) {
					$type = (!empty($tablet_overlay['overlayGradType']) ? $tablet_overlay['overlayGradType'] : 'linear');
					if ('radial' === $type) {
						$angle = (!empty($tablet_overlay['overlayBgImgPosition']) ? 'at ' . $tablet_overlay['overlayBgImgPosition'] : 'at center center');
					} else {
						$angle = (!empty($tablet_overlay['overlayGradAngle']) ? $tablet_overlay['overlayGradAngle'] . 'deg' : '180deg');
					}
					$loc = (!empty($tablet_overlay['overlayGradLoc']) ? $tablet_overlay['overlayGradLoc'] : '0');
					$color = (!empty($tablet_overlay['overlay']) ? $tablet_overlay['overlay'] : 'transparent');
					$locsecond = (!empty($tablet_overlay['overlayGradLocSecond']) ? $tablet_overlay['overlayGradLocSecond'] : '100');
					$colorsecond = (!empty($tablet_overlay['overlaySecond']) ? $tablet_overlay['overlaySecond'] : '#00B5E2');
					$css .= 'background-image: ' . $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%);';
				} else {
					if (!empty($tablet_overlay['overlay'])) {
						$css .= 'background-color:' . $tablet_overlay['overlay'] . ';';
					}
					if (!empty($tablet_overlay['overlayBgImg'])) {
						if (!empty($tablet_overlay['overlayBgImgAttachment'])) {
							$overbg_attach = 'fixed';
						} else {
							$overbg_attach = 'scroll';
						}
						$css .= 'background-image:url(' . $tablet_overlay['overlayBgImg'] . ');';
						$css .= 'background-size:' . (!empty($tablet_overlay['overlayBgImgSize']) ? $tablet_overlay['overlayBgImgSize'] : 'cover') . ';';
						$css .= 'background-position:' . (!empty($tablet_overlay['overlayBgImgPosition']) ? $tablet_overlay['overlayBgImgPosition'] : 'center center') . ';';
						$css .= 'background-attachment:' . $overbg_attach . ';';
						$css .= 'background-repeat:' . (!empty($tablet_overlay['overlayBgImgRepeat']) ? $tablet_overlay['overlayBgImgRepeat'] : 'no-repeat') . ';';
					}
				}
				if (!empty($tablet_overlay['overlayBlendMode'])) {
					$css .= 'mix-blend-mode:' . $tablet_overlay['overlayBlendMode'] . ';';
				}
				$css .= '}';
			}
			$css .= '}';
		}
		$mobile_overlay = (isset($attr['mobileOverlay']) && is_array($attr['mobileOverlay']) && isset($attr['mobileOverlay'][0]) && is_array($attr['mobileOverlay'][0]) ? $attr['mobileOverlay'][0] : array());
		$mobile_background = (isset($attr['mobileBackground']) && is_array($attr['mobileBackground']) && isset($attr['mobileBackground'][0]) && is_array($attr['mobileBackground'][0]) ? $attr['mobileBackground'][0] : array());
		if (isset($attr['topPaddingM']) || isset($attr['bottomPaddingM']) || isset($attr['leftPaddingM']) || isset($attr['rightPaddingM']) || isset($attr['topMarginM']) || isset($attr['bottomMarginM']) || (isset($mobile_overlay['enable']) && $mobile_overlay['enable']) || (isset($mobile_background['enable']) && $mobile_background['enable'] == 'true')) {
			$css .= '@media (max-width: 767px) {';
			if (isset($attr['topMarginM']) || isset($attr['bottomMarginM'])) {
				$css .= '#ri' . $unique_id . ' {';
				if (isset($attr['topMarginM'])) {
					$css .= 'margin-top:' . $attr['topMarginM'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
				}
				if (isset($attr['bottomMarginM'])) {
					$css .= 'margin-bottom:' . $attr['bottomMarginM'] . (isset($attr['marginUnit']) && !empty($attr['marginUnit']) ? $attr['marginUnit'] : 'px') . ';';
				}
				$css .= '}';
			}
			if (isset($attr['topPaddingM']) || isset($attr['bottomPaddingM']) || isset($attr['leftPaddingM']) || isset($attr['rightPaddingM'])) {
				$css .= '#ri' . $unique_id . ' > .cw {';
				if (isset($attr['topPaddingM'])) {
					$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
				}
				if (isset($attr['bottomPaddingM'])) {
					$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
				}
				if (isset($attr['leftPaddingM'])) {
					$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
				}
				if (isset($attr['rightPaddingM'])) {
					$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
				}
				$css .= '}';
			}
			if (isset($mobile_background['enable']) && $mobile_background['enable']) {
				$css .= '#ri' . $unique_id . ' {';
				if (isset($mobile_background['bgColor']) && !empty($mobile_background['bgColor'])) {
					$css .= 'background-color:' . $mobile_background['bgColor'] . ';';
				}
				if (isset($mobile_background['bgImg']) && !empty($mobile_background['bgImg'])) {
					if (!empty($mobile_background['bgImgAttachment'])) {
						$bg_attach = $mobile_background['bgImgAttachment'];
					} else {
						$bg_attach = 'scroll';
					}
					$css .= 'background-image:url(' . $mobile_background['bgImg'] . ') ;';
					$css .= 'background-size:' . (!empty($mobile_background['bgImgSize']) ? $mobile_background['bgImgSize'] : 'cover') . ';';
					$css .= 'background-position:' . (!empty($mobile_background['bgImgPosition']) ? $mobile_background['bgImgPosition'] : 'center center') . ';';
					$css .= 'background-attachment:' . $bg_attach . ';';
					$css .= 'background-repeat:' . (!empty($mobile_background['bgImgRepeat']) ? $mobile_background['bgImgRepeat'] : 'no-repeat') . ';';
				} else if (isset($mobile_background['forceOverDesk']) && $mobile_background['forceOverDesk']) {
					$css .= 'background-image:none;';
				}
				$css .= '}';
				if (isset($attr['backgroundSettingTab']) && !empty($attr['backgroundSettingTab']) && 'normal' !== $attr['backgroundSettingTab']) {
					$css .= '#ri' . $unique_id . ' .amp-pre-blocks-bg-video-container, #ri' . $unique_id . ' .amp-pre-blocks-bg-slider {';
					$css .= 'display:none;';
					$css .= '}';
				}
			}
			if (isset($mobile_overlay['enable']) && $mobile_overlay['enable']) {
				$css .= '#ri' . $unique_id . ' > .rloverlay {';
				if (!empty($mobile_overlay['overlayOpacity'])) {
					if ($mobile_overlay['overlayOpacity'] < 10) {
						$css .= 'opacity:0.0' . $mobile_overlay['overlayOpacity'] . ';';
					} else if ($mobile_overlay['overlayOpacity'] >= 100) {
						$css .= 'opacity:1;';
					} else {
						$css .= 'opacity:0.' . $mobile_overlay['overlayOpacity'] . ';';
					}
				}
				if (!empty($mobile_overlay['currentOverlayTab']) && 'grad' == $mobile_overlay['currentOverlayTab']) {
					$type = (!empty($mobile_overlay['overlayGradType']) ? $mobile_overlay['overlayGradType'] : 'linear');
					if ('radial' === $type) {
						$angle = (!empty($mobile_overlay['overlayBgImgPosition']) ? 'at ' . $mobile_overlay['overlayBgImgPosition'] : 'at center center');
					} else {
						$angle = (!empty($mobile_overlay['overlayGradAngle']) ? $mobile_overlay['overlayGradAngle'] . 'deg' : '180deg');
					}
					$loc = (!empty($mobile_overlay['overlayGradLoc']) ? $mobile_overlay['overlayGradLoc'] : '0');
					$color = (!empty($mobile_overlay['overlay']) ? $mobile_overlay['overlay'] : 'transparent');
					$locsecond = (!empty($mobile_overlay['overlayGradLocSecond']) ? $mobile_overlay['overlayGradLocSecond'] : '100');
					$colorsecond = (!empty($mobile_overlay['overlaySecond']) ? $mobile_overlay['overlaySecond'] : '#00B5E2');
					$css .= 'background-image: ' . $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%);';
				} else {
					if (!empty($mobile_overlay['overlay'])) {
						$css .= 'background-color:' . $mobile_overlay['overlay'] . ';';
					}
					if (!empty($mobile_overlay['overlayBgImg'])) {
						if (!empty($mobile_overlay['overlayBgImgAttachment'])) {
							$overbg_attach = $mobile_overlay['overlayBgImgAttachment'];
						} else {
							$overbg_attach = 'scroll';
						}
						$css .= 'background-image:url(' . $mobile_overlay['overlayBgImg'] . ');';
						$css .= 'background-size:' . (!empty($mobile_overlay['overlayBgImgSize']) ? $mobile_overlay['overlayBgImgSize'] : 'cover') . ';';
						$css .= 'background-position:' . (!empty($mobile_overlay['overlayBgImgPosition']) ? $mobile_overlay['overlayBgImgPosition'] : 'center center') . ';';
						$css .= 'background-attachment:' . $overbg_attach . ';';
						$css .= 'background-repeat:' . (!empty($mobile_overlay['overlayBgImgRepeat']) ? $mobile_overlay['overlayBgImgRepeat'] : 'no-repeat') . ';';
					}
				}
				if (!empty($mobile_overlay['overlayBlendMode'])) {
					$css .= 'mix-blend-mode:' . $mobile_overlay['overlayBlendMode'] . ';';
				}
				$css .= '}';
			}
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public function hex2rgba($hex, $alpha)
	{
		$hex = str_replace('#', '', $hex);

		if (strlen($hex) == 3) {
			$r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
			$g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
			$b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
		} else {
			$r = hexdec(substr($hex, 0, 2));
			$g = hexdec(substr($hex, 2, 2));
			$b = hexdec(substr($hex, 4, 2));
		}
		$rgba = 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
		return $rgba;
	}

	/**
	 * Render Inline CSS helper function
	 *
	 * @param array $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style.
	 * @param bool $in_content the bool for whether or not it should run in content.
	 */
	public function render_inline_css($css, $style_id, $in_content = false)
	{
		if (self::$ampcheck == 'amp')
			echo $css;
		if (!is_admin()) {
			wp_register_style($style_id, false);
			wp_enqueue_style($style_id);
			wp_add_inline_style($style_id, $css);
			if (1 === did_action('wp_head') && $in_content) {
				wp_print_styles($style_id);
			}
		}
	}

	/**
	 * Render Column Block CSS Inline
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_column_layout_css($attributes, $content)
	{
		if (isset($attributes['uniqueID']) && !empty($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
		} else {
			$unique_id = rand(100, 10000);
			$pos = strpos($content, 'c-');
			if (false !== $pos) {
				$content = substr_replace($content, 'cd' . $unique_id . ' c-', $pos, strlen('c-'));
			}
		}
		$style_id = 'amp-blocks' . esc_attr($unique_id);
		if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'column', $unique_id)) {
			$css = $this->column_layout_css($attributes, $unique_id);
			if (!empty($css)) {
				if (doing_filter('the_content')) {
					$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
				} else {
					$this->render_inline_css($css, $style_id, true);
				}
			}
		}
		return $content;
	}
	/**
	 * Load the front end Google Fonts
	 */
	public function frontend_gfonts()
	{
		if (empty(self::$gfonts)) {
			return;
		}
		$print_google_fonts = apply_filters('amp_blocks_print_google_fonts', true);
		if (!$print_google_fonts) {
			return;
		}
		$link    = '';
		$subsets = array();
		foreach (self::$gfonts as $key => $gfont_values) {
			if (!empty($link)) {
				$link .= '%7C'; // Append a new font to the string.
			}
			$link .= $gfont_values['fontfamily'];
			if (!empty($gfont_values['fontvariants'])) {
				$link .= ':';
				$link .= implode(',', $gfont_values['fontvariants']);
			}
			if (!empty($gfont_values['fontsubsets'])) {
				foreach ($gfont_values['fontsubsets'] as $subset) {
					if (!in_array($subset, $subsets)) {
						array_push($subsets, $subset);
					}
				}
			}
		}
		if (!empty($subsets)) {
			$link .= '&amp;subset=' . implode(',', $subsets);
		}
		if (self::$ampcheck == 'amp') {
			$google_font_path =  'https://fonts.googleapis.com/css?family=' . urlencode(esc_attr(str_replace('|', '%7C', $link)));
			echo file_get_contents($google_font_path);
		} else {
			echo '<link href="//fonts.googleapis.com/css?family=' . esc_attr(str_replace('|', '%7C', $link)) . '" rel="stylesheet">';
		}
	}
	public function allow_ampBlock_css_inamp()
	{
	}

	/**
	 * Builds CSS for column layout block.
	 *
	 * @param object $attr the blocks attr.
	 * @param string $unique_id the blocks parent attr ID.
	 */
	public function column_layout_css($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['topPadding']) || isset($attr['bottomPadding']) || isset($attr['leftPadding']) || isset($attr['rightPadding']) || isset($attr['topMargin']) || isset($attr['bottomMargin']) || isset($attr['rightMargin']) || isset($attr['leftMargin']) || isset($attr['border']) || isset($attr['borderWidth'])) {
			$css .= '.ab > .cw > .cd' . $unique_id . ' > .ci {';
			if (isset($attr['topPadding'])) {
				$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
			}
			if (isset($attr['bottomPadding'])) {
				$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
			}
			if (isset($attr['leftPadding'])) {
				$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
			}
			if (isset($attr['rightPadding'])) {
				$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
			}
			if (isset($attr['topMargin'])) {
				$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
			}
			if (isset($attr['bottomMargin'])) {
				$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
			}
			if (isset($attr['rightMargin'])) {
				$css .= 'margin-right:' . $attr['rightMargin'] . 'px;';
			}
			if (isset($attr['leftMargin'])) {
				$css .= 'margin-left:' . $attr['leftMargin'] . 'px;';
			}
			if (isset($attr['border'])) {
				$alpha = (isset($attr['borderOpacity']) && !empty($attr['borderOpacity']) ? $attr['borderOpacity'] : 1);
				$css .= 'border-color:' . $this->hex2rgba($attr['border'], $alpha) . ';';
			}
			if (isset($attr['borderWidth']) && !empty($attr['borderWidth']) && is_array($attr['borderWidth'])) {
				$css .= 'border-width:' . $attr['borderWidth'][0] . 'px ' . $attr['borderWidth'][1] . 'px ' . $attr['borderWidth'][2] . 'px ' . $attr['borderWidth'][3] . 'px ;';
			}
			if (isset($attr['borderRadius']) && !empty($attr['borderRadius']) && is_array($attr['borderRadius'])) {
				$css .= 'border-radius:' . $attr['borderRadius'][0] . 'px ' . $attr['borderRadius'][1] . 'px ' . $attr['borderRadius'][2] . 'px ' . $attr['borderRadius'][3] . 'px ;';
			}
			if (isset($attr['displayShadow']) && true == $attr['displayShadow'] && isset($attr['shadow']) && is_array($attr['shadow']) && isset($attr['shadow'][0]) && is_array($attr['shadow'][0])) {
				$css .= 'box-shadow:' . (isset($attr['shadow'][0]['inset']) && true === $attr['shadow'][0]['inset'] ? 'inset ' : '') . (isset($attr['shadow'][0]['hOffset']) && is_numeric($attr['shadow'][0]['hOffset']) ? $attr['shadow'][0]['hOffset'] : '0') . 'px ' . (isset($attr['shadow'][0]['vOffset']) && is_numeric($attr['shadow'][0]['vOffset']) ? $attr['shadow'][0]['vOffset'] : '0') . 'px ' . (isset($attr['shadow'][0]['blur']) && is_numeric($attr['shadow'][0]['blur']) ? $attr['shadow'][0]['blur'] : '14') . 'px ' . (isset($attr['shadow'][0]['spread']) && is_numeric($attr['shadow'][0]['spread']) ? $attr['shadow'][0]['spread'] : '0') . 'px ' . $this->hex2rgba((isset($attr['shadow'][0]['color']) && !empty($attr['shadow'][0]['color']) ? $attr['shadow'][0]['color'] : '#000000'), (isset($attr['shadow'][0]['opacity']) && is_numeric($attr['shadow'][0]['opacity']) ? $attr['shadow'][0]['opacity'] : 0.2)) . ';';
			}
			$css .= '}';
		}
		if (isset($attr['backgroundImg']) && is_array($attr['backgroundImg']) && isset($attr['backgroundImg'][0]) && is_array($attr['backgroundImg'][0]) && isset($attr['backgroundImg'][0]['bgImg']) && !empty($attr['backgroundImg'][0]['bgImg'])) {
			$bg_img = $attr['backgroundImg'][0];
			$css .= '.ab > .cw > .cd' . $unique_id . ' > .ci {';
			if (isset($attr['background']) && !empty($attr['background'])) {
				$alpha = (isset($attr['backgroundOpacity']) && !empty($attr['backgroundOpacity']) ? $attr['backgroundOpacity'] : 1);
				$css .= 'background-color:' . $this->hex2rgba($attr['background'], $alpha) . ';';
			}
			$css .= 'background-image:url(' . $bg_img['bgImg'] . ');';
			$css .= 'background-size:' . (!empty($bg_img['bgImgSize']) ? $bg_img['bgImgSize'] : 'cover') . ';';
			$css .= 'background-position:' . (!empty($bg_img['bgImgPosition']) ? $bg_img['bgImgPosition'] : 'center center') . ';';
			$css .= 'background-attachment:' . (!empty($bg_img['bgImgAttachment']) ? $bg_img['bgImgAttachment'] : 'scroll') . ';';
			$css .= 'background-repeat:' . (!empty($bg_img['bgImgRepeat']) ? $bg_img['bgImgRepeat'] : 'no-repeat') . ';';
			$css .= '}';
		}
		if (isset($attr['textAlign']) && is_array($attr['textAlign']) && isset($attr['textAlign'][0]) && !empty($attr['textAlign'][0])) {
			$css .= '.ab > .cw > .cd' . $unique_id . ' {';
			$css .= 'text-align:' . $attr['textAlign'][0] . ';';
			$css .= '}';
		}
		if (isset($attr['textColor'])) {
			$css .= '.cd' . $unique_id . ', .cd' . $unique_id . ' h1, .cd' . $unique_id . ' h2, .cd' . $unique_id . ' h3, .cd' . $unique_id . ' h4, .cd' . $unique_id . ' h5, .cd' . $unique_id . ' h6 {';
			$css .= 'color:' . $attr['textColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['linkColor'])) {
			$css .= '.cd' . $unique_id . ' a {';
			$css .= 'color:' . $attr['linkColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['linkHoverColor'])) {
			$css .= '.cd' . $unique_id . ' a:hover {';
			$css .= 'color:' . $attr['linkHoverColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['textAlign']) && is_array($attr['textAlign']) && isset($attr['textAlign'][1]) && !empty($attr['textAlign'][1])) {
			$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
			$css .= '.ab > .cw > .cd' . $unique_id . ' {';
			$css .= 'text-align:' . $attr['textAlign'][1] . ';';
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['textAlign']) && is_array($attr['textAlign']) && isset($attr['textAlign'][2]) && !empty($attr['textAlign'][2])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.ab > .cw > .cd' . $unique_id . ' {';
			$css .= 'text-align:' . $attr['textAlign'][2] . ';';
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['zIndex'])) {
			$css .= '.ab > .cw > .cd' . $unique_id . ' {';
			if (isset($attr['zIndex'])) {
				$css .= 'z-index:' . $attr['zIndex'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['collapseOrder'])) {
			$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
			$css .= '.cw.tlthree-grid > .cd' . $unique_id . ', .cw.tltwo-grid > .cd' . $unique_id . ', .cw.tlrow > .cd' . $unique_id . ' {';
			if (isset($attr['collapseOrder'])) {
				$css .= 'order:' . $attr['collapseOrder'] . ';';
			}
			$css .= '}';
			$css .= '}';
			$css .= '@media (max-width: 767px) {';
			$css .= '.cw.mthree-grid > .cd' . $unique_id . ', .cw.mtwo-grid > .cd' . $unique_id . ', .cw.mrow > .cd' . $unique_id . ' {';
			if (isset($attr['collapseOrder'])) {
				$css .= 'order:' . $attr['collapseOrder'] . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['topPaddingT']) || isset($attr['bottomPaddingT']) || isset($attr['leftPaddingT']) || isset($attr['rightPaddingT']) || isset($attr['topMarginT']) || isset($attr['bottomMarginT']) || isset($attr['rightMarginT']) || isset($attr['leftMarginT'])) {
			$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
			$css .= '.ab > .cw > .cd' . $unique_id . ' > .ci {';
			if (isset($attr['topPaddingT'])) {
				$css .= 'padding-top:' . $attr['topPaddingT'] . 'px;';
			}
			if (isset($attr['bottomPaddingT'])) {
				$css .= 'padding-bottom:' . $attr['bottomPaddingT'] . 'px;';
			}
			if (isset($attr['leftPaddingT'])) {
				$css .= 'padding-left:' . $attr['leftPaddingT'] . 'px;';
			}
			if (isset($attr['rightPaddingT'])) {
				$css .= 'padding-right:' . $attr['rightPaddingT'] . 'px;';
			}
			if (isset($attr['topMarginT'])) {
				$css .= 'margin-top:' . $attr['topMarginT'] . 'px;';
			}
			if (isset($attr['bottomMarginT'])) {
				$css .= 'margin-bottom:' . $attr['bottomMarginT'] . 'px;';
			}
			if (isset($attr['rightMarginT'])) {
				$css .= 'margin-right:' . $attr['rightMarginT'] . 'px;';
			}
			if (isset($attr['leftMarginT'])) {
				$css .= 'margin-left:' . $attr['leftMarginT'] . 'px;';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['topPaddingM']) || isset($attr['bottomPaddingM']) || isset($attr['leftPaddingM']) || isset($attr['rightPaddingM']) || isset($attr['topMarginM']) || isset($attr['bottomMarginM']) || isset($attr['rightMarginM']) || isset($attr['leftMarginM'])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.ab > .cw > .cd' . $unique_id . ' > .ci {';
			if (isset($attr['topPaddingM'])) {
				$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
			}
			if (isset($attr['bottomPaddingM'])) {
				$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
			}
			if (isset($attr['leftPaddingM'])) {
				$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
			}
			if (isset($attr['rightPaddingM'])) {
				$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
			}
			if (isset($attr['topMarginM'])) {
				$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
			}
			if (isset($attr['bottomMarginM'])) {
				$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
			}
			if (isset($attr['rightMarginM'])) {
				$css .= 'margin-right:' . $attr['rightMarginM'] . 'px;';
			}
			if (isset($attr['leftMarginM'])) {
				$css .= 'margin-left:' . $attr['leftMarginM'] . 'px;';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Render Advanced Btn Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_advanced_btn_css($attributes, $content)
	{
		if (!wp_style_is('amp-blocks-btn', 'enqueued')) {
			wp_enqueue_style('amp-blocks-btn');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'advancedbtn', $unique_id)) {
				if ($this->it_is_not_amp()) {
					if (isset($attributes['btns']) && is_array($attributes['btns'])) {
						foreach ($attributes['btns'] as $btnkey => $btnvalue) {
							if (is_array($btnvalue)) {
								if (isset($btnvalue['target']) && !empty($btnvalue['target']) && 'video' == $btnvalue['target']) {
									wp_enqueue_style('amp-blocks-magnific-css');
									wp_enqueue_script('amp-blocks-magnific-js');
								}
							}
						}
					}
				}
				$css = $this->blocks_advanced_btn_array($attributes, $unique_id);
				if (!empty($css)) {
					// This only runs if the content if loaded via the rest API. Normally the css would already be added in the head.
					if (doing_filter('the_content')) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css($css, $style_id, true);
					}
				}
			}
		}
		return $content;
	}

	/**
	 * Render Tabs Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function it_is_not_amp()
	{
		$not_amp = true;
		if (function_exists('is_amp_endpoint') && is_amp_endpoint()) {
			$not_amp = false;
		}
		return $not_amp;
	}

	/**
	 * Builds CSS for Advanced Button block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advanced_btn_array($attr, $unique_id)
	{
		if (isset($attr['btns']) && is_array($attr['btns'])) {
			foreach ($attr['btns'] as $btnkey => $btnvalue) {
				if (is_array($btnvalue)) {
					if (isset($btnvalue['target']) && !empty($btnvalue['target']) && 'video' == $btnvalue['target']) {
						wp_enqueue_style('amp-blocks-magnific-css');
						wp_enqueue_script('amp-blocks-magnific-js');
					}
				}
			}
		}
		$css = '';
		if (isset($attr['typography']) || isset($attr['textTransform'])) {
			$css .= '.b' . $unique_id . ' .b {';
			if (isset($attr['typography']) && !empty($attr['typography'])) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if (isset($attr['fontWeight']) && !empty($attr['fontWeight'])) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if (isset($attr['fontStyle']) && !empty($attr['fontStyle'])) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			if (isset($attr['textTransform']) && !empty($attr['textTransform'])) {
				$css .= 'text-transform:' . $attr['textTransform'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['btns']) && is_array($attr['btns'])) {
			foreach ($attr['btns'] as $btnkey => $btnvalue) {
				$btns_group_padding = '';
				if (is_array($btnvalue)) {
					if (isset($btnvalue['paddingTop']) && is_numeric($btnvalue['paddingTop'])) {
						$btns_group_padding .=  $btnvalue['paddingTop'] . 'px ';
					} else {
						$btns_group_padding .=  '0px ';
					}
					if (isset($btnvalue['paddingRight']) && is_numeric($btnvalue['paddingRight'])) {
						$btns_group_padding .=  $btnvalue['paddingRight'] . 'px ';
					} else {
						$btns_group_padding .=  '0px ';
					}
					if (isset($btnvalue['paddingBottom']) && is_numeric($btnvalue['paddingBottom'])) {
						$btns_group_padding .=  $btnvalue['paddingBottom'] . 'px ';
					} else {
						$btns_group_padding .=  '0px ';
					}
					if (isset($btnvalue['paddingLeft']) && is_numeric($btnvalue['paddingLeft'])) {
						$btns_group_padding .=  $btnvalue['paddingLeft'] . 'px; ';
					} else {
						$btns_group_padding .=  '0px ';
					}
					if (!empty($btns_group_padding)) {
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' {';
						$css .= 'padding:' . $btns_group_padding;
						$css .= '}';
					}
					if ((isset($btnvalue['responsivepaddingTop']) && is_array($btnvalue['responsivepaddingTop']) && isset($btnvalue['responsivepaddingTop'][0]) && is_numeric($btnvalue['responsivepaddingTop'][0])) ||
						(isset($btnvalue['responsivepaddingRight']) && is_array($btnvalue['responsivepaddingRight']) && isset($btnvalue['responsivepaddingRight'][0]) && is_numeric($btnvalue['responsivepaddingRight'][0])) ||
						(isset($btnvalue['responsivepaddingBottom']) && is_array($btnvalue['responsivepaddingBottom']) && isset($btnvalue['responsivepaddingBottom'][0]) && is_numeric($btnvalue['responsivepaddingBottom'][0])) ||
						(isset($btnvalue['responsivepaddingLeft']) && is_array($btnvalue['responsivepaddingLeft']) && isset($btnvalue['responsivepaddingLeft'][0]) && is_numeric($btnvalue['responsivepaddingLeft'][0]))
					) {
						$btns_padding_responsive = '';

						if (isset($btnvalue['responsivepaddingTop']) && is_array($btnvalue['responsivepaddingTop']) && isset($btnvalue['responsivepaddingTop'][0]) && is_numeric($btnvalue['responsivepaddingTop'][0])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingTop'][0] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingRight']) && is_array($btnvalue['responsivepaddingRight']) && isset($btnvalue['responsivepaddingRight'][0]) && is_numeric($btnvalue['responsivepaddingRight'][0])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingRight'][0] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingBottom']) && is_array($btnvalue['responsivepaddingBottom']) && isset($btnvalue['responsivepaddingBottom'][0]) && is_numeric($btnvalue['responsivepaddingBottom'][0])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingBottom'][0] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingLeft']) && is_array($btnvalue['responsivepaddingLeft']) && isset($btnvalue['responsivepaddingLeft'][0]) && is_numeric($btnvalue['responsivepaddingLeft'][0])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingLeft'][0] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}

						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' {';
						$css .= 'padding :' . $btns_padding_responsive . ';';
						$css .= '}';
						$css .= '}';
					}
					if ((isset($btnvalue['responsivepaddingTop']) && is_array($btnvalue['responsivepaddingTop']) && isset($btnvalue['responsivepaddingTop'][1]) && is_numeric($btnvalue['responsivepaddingTop'][1])) ||
						(isset($btnvalue['responsivepaddingRight']) && is_array($btnvalue['responsivepaddingRight']) && isset($btnvalue['responsivepaddingRight'][1]) && is_numeric($btnvalue['responsivepaddingRight'][1])) ||
						(isset($btnvalue['responsivepaddingBottom']) && is_array($btnvalue['responsivepaddingBottom']) && isset($btnvalue['responsivepaddingBottom'][1]) && is_numeric($btnvalue['responsivepaddingBottom'][1])) ||
						(isset($btnvalue['responsivepaddingLeft']) && is_array($btnvalue['responsivepaddingLeft']) && isset($btnvalue['responsivepaddingLeft'][1]) && is_numeric($btnvalue['responsivepaddingLeft'][1]))
					) {
						$btns_padding_responsive = '';

						if (isset($btnvalue['responsivepaddingTop']) && is_array($btnvalue['responsivepaddingTop']) && isset($btnvalue['responsivepaddingTop'][1]) && is_numeric($btnvalue['responsivepaddingTop'][1])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingTop'][1] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingRight']) && is_array($btnvalue['responsivepaddingRight']) && isset($btnvalue['responsivepaddingRight'][1]) && is_numeric($btnvalue['responsivepaddingRight'][1])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingRight'][1] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingBottom']) && is_array($btnvalue['responsivepaddingBottom']) && isset($btnvalue['responsivepaddingBottom'][1]) && is_numeric($btnvalue['responsivepaddingBottom'][1])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingBottom'][1] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}
						if (isset($btnvalue['responsivepaddingLeft']) && is_array($btnvalue['responsivepaddingLeft']) && isset($btnvalue['responsivepaddingLeft'][1]) && is_numeric($btnvalue['responsivepaddingLeft'][1])) {
							$btns_padding_responsive .= $btnvalue['responsivepaddingLeft'][1] . 'px ';
						} else {
							$btns_padding_responsive .=  '0px ';
						}

						$css .= '@media (max-width: 767px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' {';
						$css .= 'padding :' . $btns_padding_responsive . ';';
						$css .= '}';
						$css .= '}';
					}
					if (isset($btnvalue['backgroundType']) && 'gradient' === $btnvalue['backgroundType'] || isset($btnvalue['backgroundHoverType']) && 'gradient' === $btnvalue['backgroundHoverType']) {
						$bgtype = 'gradient';
					} else {
						$bgtype = 'solid';
					}
					$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b {';
					if (isset($attr['widthType']) && 'fixed' === $attr['widthType'] && isset($btnvalue['width']) && is_array($btnvalue['width']) && isset($btnvalue['width'][0]) && !empty($btnvalue['width'][0])) {
						$css .= 'width:' . $btnvalue['width'][0] . 'px;';
					}
					if (!isset($btnvalue['btnSize']) || (isset($btnvalue['btnSize']) && 'custom' === $btnvalue['btnSize'])) {
						if (isset($btnvalue['paddingLR']) && is_numeric($btnvalue['paddingLR'])) {
							$css .= 'padding-left:' . $btnvalue['paddingLR'] . 'px;';
							$css .= 'padding-right:' . $btnvalue['paddingLR'] . 'px;';
						}
						if (isset($btnvalue['paddingBT']) && is_numeric($btnvalue['paddingBT'])) {
							$css .= 'padding-top:' . $btnvalue['paddingBT'] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['paddingBT'] . 'px;';
						}
					}
					if (isset($btnvalue['color']) && !empty($btnvalue['color'])) {
						$css .= 'color:' . $btnvalue['color'] . ';';
					}
					if (isset($btnvalue['size']) && !empty($btnvalue['size'])) {
						$css .= 'font-size:' . $btnvalue['size'] . 'px;';
					}
					if (isset($btnvalue['backgroundType']) && 'gradient' === $btnvalue['backgroundType']) {
						$bg1 = (!isset($btnvalue['background']) || 'transparent' === $btnvalue['background'] ? 'rgba(255,255,255,0)' : $this->hex2rgba($btnvalue['background'], (isset($btnvalue['backgroundOpacity']) && is_numeric($btnvalue['backgroundOpacity']) ? $btnvalue['backgroundOpacity'] : 1)));
						$bg2 = (isset($btnvalue['gradient'][0]) && !empty($btnvalue['gradient'][0]) ? $this->hex2rgba($btnvalue['gradient'][0], (isset($btnvalue['gradient'][1]) && is_numeric($btnvalue['gradient'][1]) ? $btnvalue['gradient'][1] : 1)) : $this->hex2rgba('#999999', (isset($btnvalue['gradient'][1]) && is_numeric($btnvalue['gradient'][1]) ? $btnvalue['gradient'][1] : 1)));
						if (isset($btnvalue['gradient'][4]) && 'radial' === $btnvalue['gradient'][4]) {
							$css .= 'background:radial-gradient(at ' . (isset($btnvalue['gradient'][6]) && !empty($btnvalue['gradient'][6]) ? $btnvalue['gradient'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($btnvalue['gradient'][2]) && is_numeric($btnvalue['gradient'][2]) ? $btnvalue['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($btnvalue['gradient'][3]) && is_numeric($btnvalue['gradient'][3]) ? $btnvalue['gradient'][3] : '100') . '%);';
						} else if (!isset($btnvalue['gradient'][4]) || 'radial' !== $btnvalue['gradient'][4]) {
							$css .= 'background:linear-gradient(' . (isset($btnvalue['gradient'][5]) && !empty($btnvalue['gradient'][5]) ? $btnvalue['gradient'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($btnvalue['gradient'][2]) && is_numeric($btnvalue['gradient'][2]) ? $btnvalue['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($btnvalue['gradient'][3]) && is_numeric($btnvalue['gradient'][3]) ? $btnvalue['gradient'][3] : '100') . '%);';
						}
					} else if (isset($btnvalue['background']) && !empty($btnvalue['background']) && 'transparent' === $btnvalue['background']) {
						$css .= 'background:transparent;';
					} else if (isset($btnvalue['background']) && !empty($btnvalue['background'])) {
						$alpha = (isset($btnvalue['backgroundOpacity']) && is_numeric($btnvalue['backgroundOpacity']) ? $btnvalue['backgroundOpacity'] : 1);
						$css .= 'background:' . $this->hex2rgba($btnvalue['background'], $alpha) . ';';
					}
					if (isset($btnvalue['border']) && !empty($btnvalue['border'])) {
						$alpha = (isset($btnvalue['borderOpacity']) && is_numeric($btnvalue['borderOpacity']) ? $btnvalue['borderOpacity'] : 1);
						$css .= 'border-color:' . $this->hex2rgba($btnvalue['border'], $alpha) . ';';
					}
					if (isset($btnvalue['boxShadow']) && is_array($btnvalue['boxShadow']) && isset($btnvalue['boxShadow'][0]) && true === $btnvalue['boxShadow'][0]) {
						$css .= 'box-shadow:' . (isset($btnvalue['boxShadow'][7]) && true === $btnvalue['boxShadow'][7] ? 'inset ' : '') . (isset($btnvalue['boxShadow'][3]) && is_numeric($btnvalue['boxShadow'][3]) ? $btnvalue['boxShadow'][3] : '1') . 'px ' . (isset($btnvalue['boxShadow'][4]) && is_numeric($btnvalue['boxShadow'][4]) ? $btnvalue['boxShadow'][4] : '1') . 'px ' . (isset($btnvalue['boxShadow'][5]) && is_numeric($btnvalue['boxShadow'][5]) ? $btnvalue['boxShadow'][5] : '2') . 'px ' . (isset($btnvalue['boxShadow'][6]) && is_numeric($btnvalue['boxShadow'][6]) ? $btnvalue['boxShadow'][6] : '0') . 'px ' . $this->hex2rgba((isset($btnvalue['boxShadow'][1]) && !empty($btnvalue['boxShadow'][1]) ? $btnvalue['boxShadow'][1] : '#000000'), (isset($btnvalue['boxShadow'][2]) && is_numeric($btnvalue['boxShadow'][2]) ? $btnvalue['boxShadow'][2] : 0.2)) . ';';
					}
					$css .= '}';
					$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b:hover, .b' . $unique_id . ' .bw-' . $btnkey . ' .b:focus {';
					if (isset($btnvalue['colorHover']) && !empty($btnvalue['colorHover'])) {
						$css .= 'color:' . $btnvalue['colorHover'] . ';';
					}
					if (isset($btnvalue['borderHover']) && !empty($btnvalue['borderHover'])) {
						$alpha = (isset($btnvalue['borderHoverOpacity']) && is_numeric($btnvalue['borderHoverOpacity']) ? $btnvalue['borderHoverOpacity'] : 1);
						$css .= 'border-color:' . $this->hex2rgba($btnvalue['borderHover'], $alpha) . ';';
					}
					if (isset($btnvalue['boxShadowHover']) && is_array($btnvalue['boxShadowHover']) && isset($btnvalue['boxShadowHover'][0]) && true === $btnvalue['boxShadowHover'][0] && isset($btnvalue['boxShadowHover'][7]) && true !== $btnvalue['boxShadowHover'][7]) {
						$css .= 'box-shadow:' . (isset($btnvalue['boxShadowHover'][7]) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '') . (isset($btnvalue['boxShadowHover'][3]) && is_numeric($btnvalue['boxShadowHover'][3]) ? $btnvalue['boxShadowHover'][3] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][4]) && is_numeric($btnvalue['boxShadowHover'][4]) ? $btnvalue['boxShadowHover'][4] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][5]) && is_numeric($btnvalue['boxShadowHover'][5]) ? $btnvalue['boxShadowHover'][5] : '3') . 'px ' . (isset($btnvalue['boxShadowHover'][6]) && is_numeric($btnvalue['boxShadowHover'][6]) ? $btnvalue['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($btnvalue['boxShadowHover'][1]) && !empty($btnvalue['boxShadowHover'][1]) ? $btnvalue['boxShadowHover'][1] : '#000000'), (isset($btnvalue['boxShadowHover'][2]) && is_numeric($btnvalue['boxShadowHover'][2]) ? $btnvalue['boxShadowHover'][2] : 0.4)) . ';';
					}
					$css .= '}';
					if ('gradient' === $bgtype) {
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b:before {';
						if (isset($btnvalue['backgroundHoverType']) && 'gradient' === $btnvalue['backgroundHoverType']) {
							$bg1 = (!isset($btnvalue['backgroundHover']) ? $this->hex2rgba('#444444', (isset($btnvalue['backgroundHoverOpacity']) && is_numeric($btnvalue['backgroundHoverOpacity']) ? $btnvalue['backgroundHoverOpacity'] : 1)) : $this->hex2rgba($btnvalue['backgroundHover'], (isset($btnvalue['backgroundHoverOpacity']) && is_numeric($btnvalue['backgroundHoverOpacity']) ? $btnvalue['backgroundHoverOpacity'] : 1)));
							$bg2 = (isset($btnvalue['gradientHover'][0]) && !empty($btnvalue['gradientHover'][0]) ? $this->hex2rgba($btnvalue['gradientHover'][0], (isset($btnvalue['gradientHover'][1]) && is_numeric($btnvalue['gradientHover'][1]) ? $btnvalue['gradientHover'][1] : 1)) : $this->hex2rgba('#999999', (isset($btnvalue['gradientHover'][1]) && is_numeric($btnvalue['gradientHover'][1]) ? $btnvalue['gradientHover'][1] : 1)));
							if (isset($btnvalue['gradientHover'][4]) && 'radial' === $btnvalue['gradientHover'][4]) {
								$css .= 'background:radial-gradient(at ' . (isset($btnvalue['gradientHover'][6]) && !empty($btnvalue['gradientHover'][6]) ? $btnvalue['gradientHover'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($btnvalue['gradientHover'][2]) && is_numeric($btnvalue['gradientHover'][2]) ? $btnvalue['gradientHover'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($btnvalue['gradientHover'][3]) && is_numeric($btnvalue['gradientHover'][3]) ? $btnvalue['gradientHover'][3] : '100') . '%);';
							} else if (!isset($btnvalue['gradientHover'][4]) || 'radial' !== $btnvalue['gradientHover'][4]) {
								$css .= 'background:linear-gradient(' . (isset($btnvalue['gradientHover'][5]) && !empty($btnvalue['gradientHover'][5]) ? $btnvalue['gradientHover'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($btnvalue['gradientHover'][2]) && is_numeric($btnvalue['gradientHover'][2]) ? $btnvalue['gradientHover'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($btnvalue['gradientHover'][3]) && is_numeric($btnvalue['gradientHover'][3]) ? $btnvalue['gradientHover'][3] : '100') . '%);';
							}
						} else if (isset($btnvalue['backgroundHover']) && !empty($btnvalue['backgroundHover'])) {
							$alpha = (isset($btnvalue['backgroundHoverOpacity']) && is_numeric($btnvalue['backgroundHoverOpacity']) ? $btnvalue['backgroundHoverOpacity'] : 1);
							$css .= 'background:' . $this->hex2rgba($btnvalue['backgroundHover'], $alpha) . ';';
						}
						if (isset($btnvalue['boxShadowHover']) && is_array($btnvalue['boxShadowHover']) && isset($btnvalue['boxShadowHover'][0]) && true === $btnvalue['boxShadowHover'][0] && isset($btnvalue['boxShadowHover'][7]) && true === $btnvalue['boxShadowHover'][7]) {
							$css .= 'box-shadow:' . (isset($btnvalue['boxShadowHover'][7]) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '') . (isset($btnvalue['boxShadowHover'][3]) && is_numeric($btnvalue['boxShadowHover'][3]) ? $btnvalue['boxShadowHover'][3] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][4]) && is_numeric($btnvalue['boxShadowHover'][4]) ? $btnvalue['boxShadowHover'][4] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][5]) && is_numeric($btnvalue['boxShadowHover'][5]) ? $btnvalue['boxShadowHover'][5] : '3') . 'px ' . (isset($btnvalue['boxShadowHover'][6]) && is_numeric($btnvalue['boxShadowHover'][6]) ? $btnvalue['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($btnvalue['boxShadowHover'][1]) && !empty($btnvalue['boxShadowHover'][1]) ? $btnvalue['boxShadowHover'][1] : '#000000'), (isset($btnvalue['boxShadowHover'][2]) && is_numeric($btnvalue['boxShadowHover'][2]) ? $btnvalue['boxShadowHover'][2] : 0.4)) . ';';
							$css .= 'border-radius:' . (isset($btnvalue['borderRadius']) && is_numeric($btnvalue['borderRadius']) ? $btnvalue['borderRadius'] : '3') . 'px;';
						}
						$css .= '}';
					} else {
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b:before {';
						$css .= 'display:none;';
						$css .= '}';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b:hover, .b' . $unique_id . ' .bw-' . $btnkey . ' .b:focus {';
						if (isset($btnvalue['backgroundHover']) && !empty($btnvalue['backgroundHover'])) {
							$alpha = (isset($btnvalue['backgroundHoverOpacity']) && is_numeric($btnvalue['backgroundHoverOpacity']) ? $btnvalue['backgroundHoverOpacity'] : 1);
							$css .= 'background:' . $this->hex2rgba($btnvalue['backgroundHover'], $alpha) . ';';
						} else {
							$alpha = (isset($btnvalue['backgroundHoverOpacity']) && is_numeric($btnvalue['backgroundHoverOpacity']) ? $btnvalue['backgroundHoverOpacity'] : 1);
							$css .= 'background:' . $this->hex2rgba('#444444', $alpha) . ';';
						}
						if (isset($btnvalue['boxShadowHover']) && is_array($btnvalue['boxShadowHover']) && isset($btnvalue['boxShadowHover'][0]) && true === $btnvalue['boxShadowHover'][0] && isset($btnvalue['boxShadowHover'][7]) && true === $btnvalue['boxShadowHover'][7]) {
							$css .= 'box-shadow:' . (isset($btnvalue['boxShadowHover'][7]) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '') . (isset($btnvalue['boxShadowHover'][3]) && is_numeric($btnvalue['boxShadowHover'][3]) ? $btnvalue['boxShadowHover'][3] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][4]) && is_numeric($btnvalue['boxShadowHover'][4]) ? $btnvalue['boxShadowHover'][4] : '2') . 'px ' . (isset($btnvalue['boxShadowHover'][5]) && is_numeric($btnvalue['boxShadowHover'][5]) ? $btnvalue['boxShadowHover'][5] : '3') . 'px ' . (isset($btnvalue['boxShadowHover'][6]) && is_numeric($btnvalue['boxShadowHover'][6]) ? $btnvalue['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($btnvalue['boxShadowHover'][1]) && !empty($btnvalue['boxShadowHover'][1]) ? $btnvalue['boxShadowHover'][1] : '#000000'), (isset($btnvalue['boxShadowHover'][2]) && is_numeric($btnvalue['boxShadowHover'][2]) ? $btnvalue['boxShadowHover'][2] : 0.4)) . ';';
						}
						$css .= '}';
					}
					// Tablet CSS.
					if ((isset($btnvalue['responsiveSize']) && is_array($btnvalue['responsiveSize']) && isset($btnvalue['responsiveSize'][0]) && is_numeric($btnvalue['responsiveSize'][0])) || (isset($attr['widthType']) && 'fixed' === $attr['widthType'] && isset($btnvalue['width']) && is_array($btnvalue['width']) && isset($btnvalue['width'][1]) && !empty($btnvalue['width'][1]))) {
						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b {';
						if (isset($btnvalue['responsiveSize']) && is_array($btnvalue['responsiveSize']) && isset($btnvalue['responsiveSize'][0]) && is_numeric($btnvalue['responsiveSize'][0])) {
							$css .= 'font-size:' . $btnvalue['responsiveSize'][0] . 'px;';
						}
						if (isset($attr['widthType']) && 'fixed' === $attr['widthType'] && isset($btnvalue['width']) && is_array($btnvalue['width']) && isset($btnvalue['width'][1]) && !empty($btnvalue['width'][1])) {
							$css .= 'width:' . $btnvalue['width'][1] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					if (isset($btnvalue['btnSize']) && 'custom' === $btnvalue['btnSize'] && ((isset($btnvalue['responsivePaddingBT']) && is_array($btnvalue['responsivePaddingBT']) && isset($btnvalue['responsivePaddingBT'][0]) && is_numeric($btnvalue['responsivePaddingBT'][0])) || (isset($btnvalue['responsivePaddingLR']) && is_array($btnvalue['responsivePaddingLR']) && isset($btnvalue['responsivePaddingLR'][0]) && is_numeric($btnvalue['responsivePaddingLR'][0])))) {
						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b {';
						if (isset($btnvalue['responsivePaddingLR']) && is_array($btnvalue['responsivePaddingLR']) && isset($btnvalue['responsivePaddingLR'][0]) && is_numeric($btnvalue['responsivePaddingLR'][0])) {
							$css .= 'padding-left:' . $btnvalue['responsivePaddingLR'][0] . 'px;';
							$css .= 'padding-right:' . $btnvalue['responsivePaddingLR'][0] . 'px;';
						}
						if (isset($btnvalue['responsivePaddingBT']) && is_array($btnvalue['responsivePaddingBT']) && isset($btnvalue['responsivePaddingBT'][0]) && is_numeric($btnvalue['responsivePaddingBT'][0])) {
							$css .= 'padding-top:' . $btnvalue['responsivePaddingBT'][0] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['responsivePaddingBT'][0] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					// Mobile CSS.
					if ((isset($btnvalue['responsiveSize']) && is_array($btnvalue['responsiveSize']) && isset($btnvalue['responsiveSize'][1]) && is_numeric($btnvalue['responsiveSize'][1])) || (isset($attr['widthType']) && 'fixed' === $attr['widthType'] && isset($btnvalue['width']) && is_array($btnvalue['width']) && isset($btnvalue['width'][2]) && !empty($btnvalue['width'][2]))) {
						$css .= '@media (max-width: 767px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b {';
						if (isset($btnvalue['responsiveSize']) && is_array($btnvalue['responsiveSize']) && isset($btnvalue['responsiveSize'][1]) && is_numeric($btnvalue['responsiveSize'][1])) {
							$css .= 'font-size:' . $btnvalue['responsiveSize'][1] . 'px;';
						}
						if (isset($attr['widthType']) && 'fixed' === $attr['widthType'] && isset($btnvalue['width']) && is_array($btnvalue['width']) && isset($btnvalue['width'][2]) && !empty($btnvalue['width'][2])) {
							$css .= 'width:' . $btnvalue['width'][2] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					if (isset($btnvalue['btnSize']) && 'custom' === $btnvalue['btnSize'] && ((isset($btnvalue['responsivePaddingLR']) && is_array($btnvalue['responsivePaddingLR']) && isset($btnvalue['responsivePaddingLR'][1]) && is_numeric($btnvalue['responsivePaddingLR'][1])) || (isset($btnvalue['responsivePaddingBT']) && is_array($btnvalue['responsivePaddingBT']) && isset($btnvalue['responsivePaddingBT'][1]) && is_numeric($btnvalue['responsivePaddingBT'][1])))) {
						$css .= '@media (max-width: 767px) {';
						$css .= '.b' . $unique_id . ' .bw-' . $btnkey . ' .b {';
						if (isset($btnvalue['responsivePaddingLR']) && is_array($btnvalue['responsivePaddingLR']) && isset($btnvalue['responsivePaddingLR'][1]) && is_numeric($btnvalue['responsivePaddingLR'][1])) {
							$css .= 'padding-left:' . $btnvalue['responsivePaddingLR'][1] . 'px;';
							$css .= 'padding-right:' . $btnvalue['responsivePaddingLR'][1] . 'px;';
						}
						if (isset($btnvalue['responsivePaddingBT']) && is_array($btnvalue['responsivePaddingBT']) && isset($btnvalue['responsivePaddingBT'][1]) && is_numeric($btnvalue['responsivePaddingBT'][1])) {
							$css .= 'padding-top:' . $btnvalue['responsivePaddingBT'][1] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['responsivePaddingBT'][1] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
				}
			}
		}
		return $css;
	}

	/**
	 * Render Advanced Heading Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_advanced_heading_css($attributes, $content)
	{
		if (!wp_style_is('amp-blocks-heading', 'enqueued')) {
			wp_enqueue_style('amp-blocks-heading');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'advancedheading', $unique_id)) {
				$css = $this->blocks_advanced_heading_array($attributes, $unique_id);
				if (!empty($css)) {
					if (doing_filter('the_content')) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css($css, $style_id, true);
					}
				}
			}
		}
		return $content;
	}

	/**
	 * Builds CSS for Advanced Heading block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advanced_heading_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['size']) || isset($attr['lineHeight']) || isset($attr['typography']) || isset($attr['fontWeight']) || isset($attr['fontStyle']) || isset($attr['textTransform'])) {
			$css .= '#h' . $unique_id . ', #h' . $unique_id . ' .hp {';
			if (isset($attr['size']) && !empty($attr['size'])) {
				$css .= 'font-size:' . $attr['size'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['lineHeight']) && !empty($attr['lineHeight'])) {
				$css .= 'line-height:' . $attr['lineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			if (isset($attr['fontWeight']) && !empty($attr['fontWeight'])) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if (isset($attr['fontStyle']) && !empty($attr['fontStyle'])) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			if (isset($attr['typography']) && !empty($attr['typography'])) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if (isset($attr['textTransform']) && !empty($attr['textTransform'])) {
				$css .= 'text-transform:' . $attr['textTransform'] . ';';
			}
			$css .= '}';
		}
		// Highlight.
		if (isset($attr['markBorder']) || isset($attr['markBorderWidth']) || isset($attr['markBorderStyle']) || isset($attr['markPadding']) || isset($attr['markLetterSpacing']) || isset($attr['markSize']) || isset($attr['markLineHeight']) || isset($attr['markTypography']) || isset($attr['markColor']) || isset($attr['markBG']) || isset($attr['markTextTransform'])) {
			$css .= '#h' . $unique_id . ' mark, #h' . $unique_id . ' .hp mark {';
			if (isset($attr['markLetterSpacing']) && !empty($attr['markLetterSpacing'])) {
				$css .= 'letter-spacing:' . $attr['markLetterSpacing'] . 'px;';
			}
			if (isset($attr['markSize']) && is_array($attr['markSize']) && !empty($attr['markSize'][0])) {
				$css .= 'font-size:' . $attr['markSize'][0] . (!isset($attr['markSizeType']) ? 'px' : $attr['markSizeType']) . ';';
			}
			if (isset($attr['markLineHeight']) && is_array($attr['markLineHeight']) && !empty($attr['markLineHeight'][0])) {
				$css .= 'line-height:' . $attr['markLineHeight'][0] . (!isset($attr['markLineType']) ? 'px' : $attr['markLineType']) . ';';
			}
			if (isset($attr['markTypography']) && !empty($attr['markTypography'])) {
				$css .= 'font-family:' . $attr['markTypography'] . ';';
			}
			if (isset($attr['markFontWeight']) && !empty($attr['markFontWeight'])) {
				$css .= 'font-weight:' . $attr['markFontWeight'] . ';';
			}
			if (isset($attr['markFontStyle']) && !empty($attr['markFontStyle'])) {
				$css .= 'font-style:' . $attr['markFontStyle'] . ';';
			}
			if (isset($attr['markColor']) && !empty($attr['markColor'])) {
				$css .= 'color:' . $attr['markColor'] . ';';
			}
			if (isset($attr['markTextTransform']) && !empty($attr['markTextTransform'])) {
				$css .= 'text-transform:' . $attr['markTextTransform'] . ';';
			}
			if (isset($attr['markBG']) && !empty($attr['markBG'])) {
				$alpha = (isset($attr['markBGOpacity']) && !empty($attr['markBGOpacity']) ? $attr['markBGOpacity'] : 1);
				$css .= 'background:' . $this->hex2rgba($attr['markBG'], $alpha) . ';';
			}
			if (isset($attr['markBorder']) && !empty($attr['markBorder'])) {
				$alpha = (isset($attr['markBorderOpacity']) && !empty($attr['markBorderOpacity']) ? $attr['markBorderOpacity'] : 1);
				$css .= 'border-color:' . $this->hex2rgba($attr['markBorder'], $alpha) . ';';
			}
			if (isset($attr['markBorderWidth']) && !empty($attr['markBorderWidth'])) {
				$css .= 'border-width:' . $attr['markBorderWidth'] . 'px;';
			}
			if (isset($attr['markBorderStyle']) && !empty($attr['markBorderStyle'])) {
				$css .= 'border-style:' . $attr['markBorderStyle'] . ';';
			}
			if (isset($attr['markPadding']) && is_array($attr['markPadding'])) {
				$css .= 'padding:' . (isset($attr['markPadding'][0]) ? $attr['markPadding'][0] . 'px' : 0) . ' ' . (isset($attr['markPadding'][1]) ? $attr['markPadding'][1] . 'px' : 0) . ' ' . (isset($attr['markPadding'][2]) ? $attr['markPadding'][2] . 'px' : 0) . ' ' . (isset($attr['markPadding'][3]) ? $attr['markPadding'][3] . 'px' : 0) . ';';
			}
			$css .= '}';
		}
		if (isset($attr['tabSize']) || isset($attr['tabLineHeight'])) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#h' . $unique_id . ', #h' . $unique_id . ' .hp {';
			if (isset($attr['tabSize'])) {
				$css .= 'font-size:' . $attr['tabSize'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['tabLineHeight'])) {
				$css .= 'line-height:' . $attr['tabLineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ((isset($attr['markSize']) && is_array($attr['markSize']) && !empty($attr['markSize'][1])) || isset($attr['markLineHeight']) && is_array($attr['markLineHeight']) && !empty($attr['markLineHeight'][1])) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#h' . $unique_id . ' mark, #h' . $unique_id . ' .hp mark {';
			if (isset($attr['markSize']) && is_array($attr['markSize']) && !empty($attr['markSize'][1])) {
				$css .= 'font-size:' . $attr['markSize'][1] . (!isset($attr['markSizeType']) ? 'px' : $attr['markSizeType']) . ';';
			}
			if (isset($attr['markLineHeight']) && is_array($attr['markLineHeight']) && !empty($attr['markLineHeight'][1])) {
				$css .= 'line-height:' . $attr['markLineHeight'][1] . (!isset($attr['markLineType']) ? 'px' : $attr['markLineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['mobileSize']) || isset($attr['mobileLineHeight'])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#h' . $unique_id . ', #h' . $unique_id . ' .hp {';
			if (isset($attr['mobileSize'])) {
				$css .= 'font-size:' . $attr['mobileSize'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['mobileLineHeight'])) {
				$css .= 'line-height:' . $attr['mobileLineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ((isset($attr['markSize']) && is_array($attr['markSize']) && !empty($attr['markSize'][2])) || isset($attr['markLineHeight']) && is_array($attr['markLineHeight']) && !empty($attr['markLineHeight'][2])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#h' . $unique_id . ' mark, #h' . $unique_id . ' .hp mark {';
			if (isset($attr['markSize']) && is_array($attr['markSize']) && !empty($attr['markSize'][2])) {
				$css .= 'font-size:' . $attr['markSize'][2] . (!isset($attr['markSizeType']) ? 'px' : $attr['markSizeType']) . ';';
			}
			if (isset($attr['markLineHeight']) && is_array($attr['markLineHeight']) && !empty($attr['markLineHeight'][2])) {
				$css .= 'line-height:' . $attr['markLineHeight'][2] . (!isset($attr['markLineType']) ? 'px' : $attr['markLineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds CSS for Tabs block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_tabs_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['contentBorder']) || isset($attr['innerPadding']) || isset($attr['minHeight']) || isset($attr['contentBorderColor']) || isset($attr['contentBgColor'])) {
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .wp-block-amp-tab {';
			if (isset($attr['contentBorder']) && !empty($attr['contentBorder']) && is_array($attr['contentBorder'])) {
				$css .= 'border-width:' . $attr['contentBorder'][0] . 'px ' . $attr['contentBorder'][1] . 'px ' . $attr['contentBorder'][2] . 'px ' . $attr['contentBorder'][3] . 'px;';
			}
			if (isset($attr['innerPadding']) && !empty($attr['innerPadding']) && is_array($attr['innerPadding'])) {
				$css .= 'padding:' . $attr['innerPadding'][0] . 'px ' . $attr['innerPadding'][1] . 'px ' . $attr['innerPadding'][2] . 'px ' . $attr['innerPadding'][3] . 'px;';
			}
			if (isset($attr['minHeight']) && !empty($attr['minHeight'])) {
				$css .= 'min-height:' . $attr['minHeight'] . 'px;';
			}
			if (isset($attr['contentBorderColor']) && !empty($attr['contentBorderColor'])) {
				$css .= 'border-color:' . $attr['contentBorderColor'] . ';';
			}
			if (isset($attr['contentBgColor']) && !empty($attr['contentBgColor'])) {
				$css .= 'background:' . $attr['contentBgColor'] . ';';
			}
			$css .= '}';
		}
		$layout = isset($attr['layout']) ? $attr['layout'] : 'tabs';
		$widthType = isset($attr['widthType']) ? $attr['widthType'] : 'normal';
		if (isset($attr['titleMargin'])) {
			$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li {';
			if (isset($attr['titleMargin']) && !empty($attr['titleMargin']) && is_array($attr['titleMargin'])) {
				$css .= 'margin:' . $attr['titleMargin'][0] . 'px ' . ('vtabs' !== $layout && 'percent' === $widthType ? '0px ' : $attr['titleMargin'][1] . 'px ') . $attr['titleMargin'][2] . 'px ' . ('vtabs' !== $layout && 'percent' === $widthType ? '0px;' : $attr['titleMargin'][3] . 'px;');
			}
			$css .= '}';
		}
		if ('vtabs' !== $layout && 'percent' === $widthType) {
			if (isset($attr['gutter']) && !empty($attr['gutter']) && is_array($attr['gutter'])) {
				$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title {';
				$css .= 'margin-right:' . $attr['gutter'][0] . 'px;';
				$css .= '}';
			}
			if (isset($attr['tabWidth']) && !empty($attr['tabWidth']) && is_array($attr['tabWidth']) && !empty($attr['tabWidth'][1]) && '' !== $attr['tabWidth'][1]) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list.amp-pre-tabs-list-columns > li {';
				$css .= 'flex: 0 1 ' . round(100 / $attr['tabWidth'][1], 2) . '%;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['gutter']) && !empty($attr['gutter']) && is_array($attr['gutter']) && isset($attr['gutter'][1]) && is_numeric($attr['gutter'][1])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title {';
				$css .= 'margin-right:' . $attr['gutter'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['tabWidth']) && !empty($attr['tabWidth']) && is_array($attr['tabWidth']) && !empty($attr['tabWidth'][2]) && '' !== $attr['tabWidth'][2]) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list.amp-pre-tabs-list-columns > li {';
				$css .= 'flex: 0 1 ' . round(100 / $attr['tabWidth'][2], 2) . '%;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['gutter']) && !empty($attr['gutter']) && is_array($attr['gutter']) && isset($attr['gutter'][2]) && is_numeric($attr['gutter'][2])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title {';
				$css .= 'margin-right:' . $attr['gutter'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['size']) || isset($attr['lineHeight']) || isset($attr['typography']) || isset($attr['titleBorderWidth']) || isset($attr['titleBorderRadius']) || isset($attr['titlePadding']) || isset($attr['titleBorder']) || isset($attr['titleColor']) || isset($attr['titleBg'])) {
			$css .= '.wp-block-amp-tabs .amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title .amp-tab-title {';
			if (isset($attr['size']) && !empty($attr['size'])) {
				$css .= 'font-size:' . $attr['size'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['lineHeight']) && !empty($attr['lineHeight'])) {
				$css .= 'line-height:' . $attr['lineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			if (isset($attr['typography']) && !empty($attr['typography'])) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if (isset($attr['fontWeight']) && !empty($attr['fontWeight'])) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if (isset($attr['fontStyle']) && !empty($attr['fontStyle'])) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			if (isset($attr['titleBorderWidth']) && !empty($attr['titleBorderWidth']) && is_array($attr['titleBorderWidth'])) {
				$css .= 'border-width:' . $attr['titleBorderWidth'][0] . 'px ' . $attr['titleBorderWidth'][1] . 'px ' . $attr['titleBorderWidth'][2] . 'px ' . $attr['titleBorderWidth'][3] . 'px ;';
			}
			if (isset($attr['titleBorderRadius']) && !empty($attr['titleBorderRadius']) && is_array($attr['titleBorderRadius'])) {
				$css .= 'border-radius:' . $attr['titleBorderRadius'][0] . 'px ' . $attr['titleBorderRadius'][1] . 'px ' . $attr['titleBorderRadius'][2] . 'px ' . $attr['titleBorderRadius'][3] . 'px ;';
			}
			if (isset($attr['titlePadding']) && !empty($attr['titlePadding']) && is_array($attr['titlePadding'])) {
				$css .= 'padding:' . $attr['titlePadding'][0] . 'px ' . $attr['titlePadding'][1] . 'px ' . $attr['titlePadding'][2] . 'px ' . $attr['titlePadding'][3] . 'px ;';
			}
			if (isset($attr['titleBorder']) && !empty($attr['titleBorder'])) {
				$css .= 'border-color:' . $attr['titleBorder'] . ';';
			}
			if (isset($attr['titleColor']) && !empty($attr['titleColor'])) {
				$css .= 'color:' . $attr['titleColor'] . ';';
			}
			if (isset($attr['titleBg']) && !empty($attr['titleBg'])) {
				$css .= 'background:' . $attr['titleBg'] . ';';
			}
			$css .= '}';
		}
		// Hover.
		if (isset($attr['titleBorderHover']) || isset($attr['titleColorHover']) || isset($attr['titleBgHover'])) {
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title:hover, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title .amp-tab-title:hover {';
			if (isset($attr['titleBorderHover']) && !empty($attr['titleBorderHover'])) {
				$css .= 'border-color:' . $attr['titleBorderHover'] . ';';
			}
			if (isset($attr['titleColorHover']) && !empty($attr['titleColorHover'])) {
				$css .= 'color:' . $attr['titleColorHover'] . ';';
			}
			if (isset($attr['titleBgHover']) && !empty($attr['titleBgHover'])) {
				$css .= 'background:' . $attr['titleBgHover'] . ';';
			}
			$css .= '}';
		}
		// Active.
		if (isset($attr['titleBorderActive']) || isset($attr['titleColorActive']) || isset($attr['titleBgActive'])) {
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li.amp-tab-title-active .amp-tab-title, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title.amp-tab-title-active .amp-tab-title  {';
			if (isset($attr['titleBorderActive']) && !empty($attr['titleBorderActive'])) {
				$css .= 'border-color:' . $attr['titleBorderActive'] . ';';
			}
			if (isset($attr['titleColorActive']) && !empty($attr['titleColorActive'])) {
				$css .= 'color:' . $attr['titleColorActive'] . ';';
			}
			if (isset($attr['titleBgActive']) && !empty($attr['titleBgActive'])) {
				$css .= 'background:' . $attr['titleBgActive'] . ';';
			} else {
				$css .= 'background:#ffffff;';
			}
			$css .= '}';
		}
		if (isset($attr['tabSize']) || isset($attr['tabLineHeight'])) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title {';
			if (isset($attr['tabSize'])) {
				$css .= 'font-size:' . $attr['tabSize'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['tabLineHeight'])) {
				$css .= 'line-height:' . $attr['tabLineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['mobileSize']) || isset($attr['mobileLineHeight'])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-tab-title  {';
			if (isset($attr['mobileSize'])) {
				$css .= 'font-size:' . $attr['mobileSize'] . (!isset($attr['sizeType']) ? 'px' : $attr['sizeType']) . ';';
			}
			if (isset($attr['mobileLineHeight'])) {
				$css .= 'line-height:' . $attr['mobileLineHeight'] . (!isset($attr['lineType']) ? 'px' : $attr['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['enableSubtitle']) && true == $attr['enableSubtitle'] && isset($attr['subtitleFont']) && is_array($attr['subtitleFont']) && is_array($attr['subtitleFont'][0])) {
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-title-sub-text, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title .amp-title-sub-text {';
			$subtitle_font = $attr['subtitleFont'][0];
			if (isset($subtitle_font['size']) && is_array($subtitle_font['size']) && !empty($subtitle_font['size'][0])) {
				$css .= 'font-size:' . $subtitle_font['size'][0] . (!isset($subtitle_font['sizeType']) ? 'px' : $subtitle_font['sizeType']) . ';';
			}
			if (isset($subtitle_font['lineHeight']) && is_array($subtitle_font['lineHeight']) && !empty($subtitle_font['lineHeight'][0])) {
				$css .= 'line-height:' . $subtitle_font['lineHeight'][0] . (!isset($subtitle_font['lineType']) ? 'px' : $subtitle_font['lineType']) . ';';
			}
			if (isset($subtitle_font['letterSpacing']) && !empty($subtitle_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $subtitle_font['letterSpacing'] . 'px;';
			}
			if (isset($subtitle_font['textTransform']) && !empty($subtitle_font['textTransform'])) {
				$css .= 'text-transform:' . $subtitle_font['textTransform'] . ';';
			}
			if (isset($subtitle_font['family']) && !empty($subtitle_font['family'])) {
				$css .= 'font-family:' . $subtitle_font['family'] . ';';
			}
			if (isset($subtitle_font['style']) && !empty($subtitle_font['style'])) {
				$css .= 'font-style:' . $subtitle_font['style'] . ';';
			}
			if (isset($subtitle_font['weight']) && !empty($subtitle_font['weight'])) {
				$css .= 'font-weight:' . $subtitle_font['weight'] . ';';
			}
			if (isset($subtitle_font['padding']) && is_array($subtitle_font['padding'])) {
				$css .= 'padding:' . $subtitle_font['padding'][0] . 'px ' . $subtitle_font['padding'][1] . 'px ' . $subtitle_font['padding'][2] . 'px ' . $subtitle_font['padding'][3] . 'px;';
			}
			if (isset($subtitle_font['margin']) && is_array($subtitle_font['margin'])) {
				$css .= 'margin:' . $subtitle_font['margin'][0] . 'px ' . $subtitle_font['margin'][1] . 'px ' . $subtitle_font['margin'][2] . 'px ' . $subtitle_font['margin'][3] . 'px;';
			}
			$css .= '}';
		}
		if (isset($attr['subtitleFont']) && is_array($attr['subtitleFont']) && isset($attr['subtitleFont'][0]) && is_array($attr['subtitleFont'][0]) && ((isset($attr['subtitleFont'][0]['size']) && is_array($attr['subtitleFont'][0]['size']) && isset($attr['subtitleFont'][0]['size'][1]) && !empty($attr['subtitleFont'][0]['size'][1])) || (isset($attr['subtitleFont'][0]['lineHeight']) && is_array($attr['subtitleFont'][0]['lineHeight']) && isset($attr['subtitleFont'][0]['lineHeight'][1]) && !empty($attr['subtitleFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-title-sub-text, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title .amp-title-sub-text {';
			if (isset($attr['subtitleFont'][0]['size'][1]) && !empty($attr['subtitleFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['subtitleFont'][0]['size'][1] . (!isset($attr['subtitleFont'][0]['sizeType']) ? 'px' : $attr['subtitleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['subtitleFont'][0]['lineHeight'][1]) && !empty($attr['subtitleFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['subtitleFont'][0]['lineHeight'][1] . (!isset($attr['subtitleFont'][0]['lineType']) ? 'px' : $attr['subtitleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['subtitleFont']) && is_array($attr['subtitleFont']) && isset($attr['subtitleFont'][0]) && is_array($attr['subtitleFont'][0]) && ((isset($attr['subtitleFont'][0]['size']) && is_array($attr['subtitleFont'][0]['size']) && isset($attr['subtitleFont'][0]['size'][2]) && !empty($attr['subtitleFont'][0]['size'][2])) || (isset($attr['subtitleFont'][0]['lineHeight']) && is_array($attr['subtitleFont'][0]['lineHeight']) && isset($attr['subtitleFont'][0]['lineHeight'][2]) && !empty($attr['subtitleFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-tabs-id' . $unique_id . ' > .amp-tabs-title-list li .amp-title-sub-text, .amp-tabs-id' . $unique_id . ' > .amp-tabs-content-wrap > .amp-tabs-accordion-title .amp-title-sub-text {';
			if (isset($attr['subtitleFont'][0]['size'][2]) && !empty($attr['subtitleFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['subtitleFont'][0]['size'][2] . (!isset($attr['subtitleFont'][0]['sizeType']) ? 'px' : $attr['subtitleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['subtitleFont'][0]['lineHeight'][2]) && !empty($attr['subtitleFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['subtitleFont'][0]['lineHeight'][2] . (!isset($attr['subtitleFont'][0]['lineType']) ? 'px' : $attr['subtitleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds CSS for Spacer block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_spacer_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['tabletSpacerHeight']) && !empty($attr['tabletSpacerHeight'])) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-block-spacer-' . $unique_id . ' .amp-block-spacer {';
			$css .= 'height:' . $attr['tabletSpacerHeight'] . (isset($attr['spacerHeightUnits']) ? $attr['spacerHeightUnits'] : 'px') . ' !important;';
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['mobileSpacerHeight']) && !empty($attr['mobileSpacerHeight'])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-block-spacer-' . $unique_id . ' .amp-block-spacer {';
			$css .= 'height:' . $attr['mobileSpacerHeight'] . (isset($attr['spacerHeightUnits']) ? $attr['spacerHeightUnits'] : 'px') . ' !important;';
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Render Icon CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_icon_css($attributes, $content)
	{
		if (!wp_style_is('amp-blocks-icon', 'enqueued')) {
			wp_enqueue_style('amp-blocks-icon');
		}
		return $content;
	}

	/**
	 * Builds CSS for InfoBox block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_infobox_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['containerBorder']) || isset($attr['containerBackground']) || isset($attr['containerPadding']) || isset($attr['containerBorderRadius']) || isset($attr['containerBorderWidth'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap {';
			if (isset($attr['containerBorder']) && !empty($attr['containerBorder'])) {
				$alpha = (isset($attr['containerBorderOpacity']) && is_numeric($attr['containerBorderOpacity']) ? $attr['containerBorderOpacity'] : 1);
				$css .= 'border-color:' . $this->hex2rgba($attr['containerBorder'], $alpha) . ';';
			}
			if (isset($attr['containerBorderRadius']) && !empty($attr['containerBorderRadius'])) {
				$css .= 'border-radius:' . $attr['containerBorderRadius'] . 'px;';
			}
			if (isset($attr['containerBackground']) && !empty($attr['containerBackground'])) {
				$alpha = (isset($attr['containerBackgroundOpacity']) && is_numeric($attr['containerBackgroundOpacity']) ? $attr['containerBackgroundOpacity'] : 1);
				$css .= 'background:' . $this->hex2rgba($attr['containerBackground'], $alpha) . ';';
			}
			if (isset($attr['containerPadding']) && is_array($attr['containerPadding'])) {
				$css .= 'padding:' . $attr['containerPadding'][0] . 'px ' . $attr['containerPadding'][1] . 'px ' . $attr['containerPadding'][2] . 'px ' . $attr['containerPadding'][3] . 'px;';
			}
			if (isset($attr['containerBorderWidth']) && is_array($attr['containerBorderWidth'])) {
				$css .= 'border-width:' . $attr['containerBorderWidth'][0] . 'px ' . $attr['containerBorderWidth'][1] . 'px ' . $attr['containerBorderWidth'][2] . 'px ' . $attr['containerBorderWidth'][3] . 'px;';
			}
			$css .= '}';
		}
		$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover {';
		$border_hover = (isset($attr['containerHoverBorder']) && !empty($attr['containerHoverBorder']) ? $attr['containerHoverBorder'] : '#eeeeee');
		$alpha = (isset($attr['containerHoverBorderOpacity']) && is_numeric($attr['containerHoverBorderOpacity']) ? $attr['containerHoverBorderOpacity'] : 1);
		$bg_hover = (isset($attr['containerHoverBackground']) && !empty($attr['containerHoverBackground']) ? $attr['containerHoverBackground'] : '#f2f2f2');
		$bg_alpha = (isset($attr['containerHoverBackgroundOpacity']) && is_numeric($attr['containerHoverBackgroundOpacity']) ? $attr['containerHoverBackgroundOpacity'] : 1);
		$css .= 'border-color:' . $this->hex2rgba($border_hover, $alpha) . ';';
		$css .= 'background:' . $this->hex2rgba($bg_hover, $bg_alpha) . ';';
		$css .= '}';
		if (isset($attr['mediaIcon']) && is_array($attr['mediaIcon']) && is_array($attr['mediaIcon'][0])) {
			$media_icon = $attr['mediaIcon'][0];
		} else {
			$media_icon = array();
		}
		if (isset($attr['mediaStyle']) && is_array($attr['mediaStyle']) && is_array($attr['mediaStyle'][0])) {
			$media_style = $attr['mediaStyle'][0];
		} else {
			$media_style = array();
		}
		if (isset($attr['mediaImage']) && is_array($attr['mediaImage']) && is_array($attr['mediaImage'][0])) {
			$media_image = $attr['mediaImage'][0];
		} else {
			$media_image = array();
		}
		if (isset($media_image['subtype']) && 'svg+xml' === $media_image['subtype']) {
			if (isset($media_image['maxWidth']) && !empty($media_image['maxWidth'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-media .amp-info-box-image {';
				$css .= 'width:' . $media_image['maxWidth'] . 'px;';
				$css .= 'height:auto;';
				$css .= '}';
			}
			if (isset($media_icon['color']) && !empty($media_icon['color'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-media .amp-info-box-image {';
				$css .= 'fill:' . $media_icon['color'] . ';';
				$css .= '}';
			}
			if (isset($media_icon['hoverColor']) && !empty($media_icon['hoverColor'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-media .amp-info-box-image {';
				$css .= 'fill:' . $media_icon['hoverColor'] . ';';
				$css .= '}';
			}
		}
		$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-media {';
		if (isset($media_icon['color']) && !empty($media_icon['color'])) {
			$css .= 'color:' . $media_icon['color'] . ';';
		}
		if (isset($media_style['background']) && !empty($media_style['background'])) {
			$css .= 'background:' . $media_style['background'] . ';';
		}
		if (isset($media_style['border']) && !empty($media_style['border'])) {
			$css .= 'border-color:' . $media_style['border'] . ';';
		}
		if (isset($media_style['borderRadius']) && !empty($media_style['borderRadius'])) {
			$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
		}
		if (isset($media_style['borderWidth']) && is_array($media_style['borderWidth'])) {
			$css .= 'border-width:' . (empty($media_style['borderWidth'][0]) ? '0' : $media_style['borderWidth'][0]) . 'px ' . (empty($media_style['borderWidth'][1]) ? '0' : $media_style['borderWidth'][1]) . 'px ' . (empty($media_style['borderWidth'][2]) ? '0' : $media_style['borderWidth'][2]) . 'px ' . (empty($media_style['borderWidth'][3]) ? '0' : $media_style['borderWidth'][3]) . 'px;';
		}
		if (isset($media_style['padding']) && is_array($media_style['padding'])) {
			$css .= 'padding:' . (empty($media_style['padding'][0]) ? '0' : $media_style['padding'][0]) . 'px ' . (empty($media_style['padding'][1]) ? '0' : $media_style['padding'][1]) . 'px ' . (empty($media_style['padding'][2]) ? '0' : $media_style['padding'][2]) . 'px ' . (empty($media_style['padding'][3]) ? '0' : $media_style['padding'][3]) . 'px;';
		}
		if (isset($media_style['margin']) && is_array($media_style['margin']) && isset($attr['mediaAlign']) && 'top' !== $attr['mediaAlign']) {
			$css .= 'margin:' . (empty($media_style['margin'][0]) ? '0' : $media_style['margin'][0]) . 'px ' . (empty($media_style['margin'][1]) ? '0' : $media_style['margin'][1]) . 'px ' . (empty($media_style['margin'][2]) ? '0' : $media_style['margin'][2]) . 'px ' . (empty($media_style['margin'][3]) ? '0' : $media_style['margin'][3]) . 'px;';
		}
		$css .= '}';
		if (isset($media_style['margin']) && is_array($media_style['margin']) && (!isset($attr['mediaAlign']) || 'top' === $attr['mediaAlign'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-media-container {';
			$css .= 'margin:' . (empty($media_style['margin'][0]) ? '0' : $media_style['margin'][0]) . 'px ' . (empty($media_style['margin'][1]) ? '0' : $media_style['margin'][1]) . 'px ' . (empty($media_style['margin'][2]) ? '0' : $media_style['margin'][2]) . 'px ' . (empty($media_style['margin'][3]) ? '0' : $media_style['margin'][3]) . 'px;';
			$css .= '}';
		}
		if (isset($media_style['borderRadius']) && !empty($media_style['borderRadius'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-media img {';
			$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
			$css .= '}';
		}
		$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-media {';
		if (isset($media_icon['hoverColor']) && !empty($media_icon['hoverColor'])) {
			$css .= 'color:' . $media_icon['hoverColor'] . ';';
		}
		if (isset($media_style['hoverBackground']) && !empty($media_style['hoverBackground'])) {
			$css .= 'background:' . $media_style['hoverBackground'] . ';';
		}
		if (isset($media_style['hoverBorder']) && !empty($media_style['hoverBorder'])) {
			$css .= 'border-color:' . $media_style['hoverBorder'] . ';';
		}
		$css .= '}';
		if (((isset($attr['mediaType']) && 'icon' === $attr['mediaType'] || !isset($attr['mediaType'])) && isset($media_icon['hoverAnimation']) && 'drawborder' === $media_icon['hoverAnimation']) || (isset($attr['mediaType']) && 'image' === $attr['mediaType'] && isset($media_image['hoverAnimation']) && ('drawborder' === $media_image['hoverAnimation'] || 'grayscale-border-draw' === $media_image['hoverAnimation']))) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap .amp-blocks-info-box-media {';
			$css .= 'border-width:0;';
			if (isset($media_style['borderWidth']) && is_array($media_style['borderWidth'])) {
				$css .= 'box-shadow: inset 0 0 0 ' . $media_style['borderWidth'][0] . 'px ' . (isset($media_style['border']) && !empty($media_style['border']) ? $media_style['border'] : '#444444') . ';';
			}
			$css .= '}';
			if (isset($media_style['borderRadius']) && !empty($media_style['borderRadius'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap .amp-blocks-info-box-media:before, #amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap .amp-blocks-info-box-media:after {';
				$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
				$css .= '}';
			}
			if (isset($media_style['borderWidth']) && is_array($media_style['borderWidth'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap .amp-blocks-info-box-media:before {';
				$css .= ' border-width:' . $media_style['borderWidth'][0] . 'px;';
				$css .= '}';
			}
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap .amp-blocks-info-box-media:after {';
			$css .= ' border-width:0;';
			$css .= '}';
			if (isset($media_style['borderWidth']) && is_array($media_style['borderWidth'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-media:after {';
				$css .= 'border-right-color:' . (isset($media_style['hoverBorder']) && !empty($media_style['hoverBorder']) ? $media_style['hoverBorder'] : '#444444') . ';';
				$css .= 'border-right-width:' . $media_style['borderWidth'][0] . 'px;';
				$css .= 'border-top-width:' . $media_style['borderWidth'][0] . 'px;';
				$css .= 'border-bottom-width:' . $media_style['borderWidth'][0] . 'px;';
				$css .= '}';
			}
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-media:before {';
			$css .= 'border-top-color:' . (isset($media_style['hoverBorder']) && !empty($media_style['hoverBorder']) ? $media_style['hoverBorder'] : '#444444') . ';';
			$css .= 'border-right-color:' . (isset($media_style['hoverBorder']) && !empty($media_style['hoverBorder']) ? $media_style['hoverBorder'] : '#444444') . ';';
			$css .= 'border-bottom-color:' . (isset($media_style['hoverBorder']) && !empty($media_style['hoverBorder']) ? $media_style['hoverBorder'] : '#444444') . ';';
			$css .= '}';
		}
		if (isset($attr['titleColor']) || isset($attr['titleFont'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
			if (isset($attr['titleColor']) && !empty($attr['titleColor'])) {
				$css .= 'color:' . $attr['titleColor'] . ';';
			}
			if (isset($attr['titleFont']) && is_array($attr['titleFont']) && is_array($attr['titleFont'][0])) {
				$title_font = $attr['titleFont'][0];
				if (isset($title_font['size']) && is_array($title_font['size']) && !empty($title_font['size'][0])) {
					$css .= 'font-size:' . $title_font['size'][0] . (!isset($title_font['sizeType']) ? 'px' : $title_font['sizeType']) . ';';
				}
				if (isset($title_font['lineHeight']) && is_array($title_font['lineHeight']) && !empty($title_font['lineHeight'][0])) {
					$css .= 'line-height:' . $title_font['lineHeight'][0] . (!isset($title_font['lineType']) ? 'px' : $title_font['lineType']) . ';';
				}
				if (isset($title_font['letterSpacing']) && !empty($title_font['letterSpacing'])) {
					$css .= 'letter-spacing:' . $title_font['letterSpacing'] . 'px;';
				}
				if (isset($title_font['textTransform']) && !empty($title_font['textTransform'])) {
					$css .= 'text-transform:' . $title_font['textTransform'] . ';';
				}
				if (isset($title_font['family']) && !empty($title_font['family'])) {
					$css .= 'font-family:' . $title_font['family'] . ';';
				}
				if (isset($title_font['style']) && !empty($title_font['style'])) {
					$css .= 'font-style:' . $title_font['style'] . ';';
				}
				if (isset($title_font['weight']) && !empty($title_font['weight'])) {
					$css .= 'font-weight:' . $title_font['weight'] . ';';
				}
				if (isset($title_font['padding']) && is_array($title_font['padding'])) {
					$css .= 'padding:' . $title_font['padding'][0] . 'px ' . $title_font['padding'][1] . 'px ' . $title_font['padding'][2] . 'px ' . $title_font['padding'][3] . 'px;';
				}
				if (isset($title_font['margin']) && is_array($title_font['margin'])) {
					$css .= 'margin:' . $title_font['margin'][0] . 'px ' . $title_font['margin'][1] . 'px ' . $title_font['margin'][2] . 'px ' . $title_font['margin'][3] . 'px;';
				}
			}
			$css .= '}';
		}
		if (isset($attr['titleHoverColor']) && !empty($attr['titleHoverColor'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-title {';
			$css .= 'color:' . $attr['titleHoverColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['titleFont']) && is_array($attr['titleFont']) && isset($attr['titleFont'][0]) && is_array($attr['titleFont'][0]) && ((isset($attr['titleFont'][0]['size']) && is_array($attr['titleFont'][0]['size']) && isset($attr['titleFont'][0]['size'][1]) && !empty($attr['titleFont'][0]['size'][1])) || (isset($attr['titleFont'][0]['lineHeight']) && is_array($attr['titleFont'][0]['lineHeight']) && isset($attr['titleFont'][0]['lineHeight'][1]) && !empty($attr['titleFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
			if (isset($attr['titleFont'][0]['size'][1]) && !empty($attr['titleFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['titleFont'][0]['size'][1] . (!isset($attr['titleFont'][0]['sizeType']) ? 'px' : $attr['titleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleFont'][0]['lineHeight'][1]) && !empty($attr['titleFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][1] . (!isset($attr['titleFont'][0]['lineType']) ? 'px' : $attr['titleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['titleFont']) && is_array($attr['titleFont']) && isset($attr['titleFont'][0]) && is_array($attr['titleFont'][0]) && ((isset($attr['titleFont'][0]['size']) && is_array($attr['titleFont'][0]['size']) && isset($attr['titleFont'][0]['size'][2]) && !empty($attr['titleFont'][0]['size'][2])) || (isset($attr['titleFont'][0]['lineHeight']) && is_array($attr['titleFont'][0]['lineHeight']) && isset($attr['titleFont'][0]['lineHeight'][2]) && !empty($attr['titleFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
			if (isset($attr['titleFont'][0]['size'][2]) && !empty($attr['titleFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['titleFont'][0]['size'][2] . (!isset($attr['titleFont'][0]['sizeType']) ? 'px' : $attr['titleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleFont'][0]['lineHeight'][2]) && !empty($attr['titleFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][2] . (!isset($attr['titleFont'][0]['lineType']) ? 'px' : $attr['titleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['titleMinHeight']) && is_array($attr['titleMinHeight']) && isset($attr['titleMinHeight'][0])) {
			if (is_numeric($attr['titleMinHeight'][0])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][0] . 'px;';
				$css .= '}';
			}
			if (isset($attr['titleMinHeight'][1]) && is_numeric($attr['titleMinHeight'][1])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['titleMinHeight'][2]) && is_numeric($attr['titleMinHeight'][2])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['mediaAlignTablet']) && !empty($attr['mediaAlignTablet'])) {
			if ('top' === $attr['mediaAlignTablet']) {
				$display = 'block';
				$align = '';
				$content = '';
			} elseif ('left' === $attr['mediaAlignTablet']) {
				$display = 'flex';
				$align = 'center';
				$content = 'flex-start';
			} else {
				$display = 'flex';
				$align = 'center';
				$content = 'flex-end';
			}
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap {';
			$css .= 'display: ' . $display . ';';
			if (!empty($align)) {
				$css .= 'align-items: ' . $align . ';';
			}
			if (!empty($content)) {
				$css .= 'justify-content: ' . $content . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['mediaAlignMobile']) && !empty($attr['mediaAlignMobile'])) {
			if ('top' === $attr['mediaAlignMobile']) {
				$display = 'block';
				$content = '';
			} elseif ('left' === $attr['mediaAlignMobile']) {
				$display = 'flex';
				$content = 'flex-start';
				$direction = 'row';
			} else {
				$display = 'flex';
				$content = 'flex-end';
				$direction = 'row-reverse';
			}
			$css .= '@media (max-width: 767px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap {';
			$css .= 'display: ' . $display . ';';

			if (!empty($content)) {
				$css .= 'justify-content: ' . $content . ';';
			}
			if (!empty($direction)) {
				$css .= 'flex-direction: ' . $direction . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['textColor']) || isset($attr['textFont'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
			if (isset($attr['textColor']) && !empty($attr['textColor'])) {
				$css .= 'color:' . $attr['textColor'] . ';';
			}
			if (isset($attr['textFont']) && is_array($attr['textFont']) && is_array($attr['textFont'][0])) {
				$text_font = $attr['textFont'][0];
				if (isset($text_font['size']) && is_array($text_font['size']) && !empty($text_font['size'][0])) {
					$css .= 'font-size:' . $text_font['size'][0] . (!isset($text_font['sizeType']) ? 'px' : $text_font['sizeType']) . ';';
				}
				if (isset($text_font['lineHeight']) && is_array($text_font['lineHeight']) && !empty($text_font['lineHeight'][0])) {
					$css .= 'line-height:' . $text_font['lineHeight'][0] . (!isset($text_font['lineType']) ? 'px' : $text_font['lineType']) . ';';
				}
				if (isset($text_font['letterSpacing']) && !empty($text_font['letterSpacing'])) {
					$css .= 'letter-spacing:' . $text_font['letterSpacing'] . 'px;';
				}
				if (isset($text_font['family']) && !empty($text_font['family'])) {
					$css .= 'font-family:' . $text_font['family'] . ';';
				}
				if (isset($text_font['style']) && !empty($text_font['style'])) {
					$css .= 'font-style:' . $text_font['style'] . ';';
				}
				if (isset($text_font['weight']) && !empty($text_font['weight'])) {
					$css .= 'font-weight:' . $text_font['weight'] . ';';
				}
			}
			$css .= '}';
		}
		if (isset($attr['textHoverColor']) && !empty($attr['textHoverColor'])) {
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-text {';
			$css .= 'color:' . $attr['textHoverColor'] . ';';
			$css .= '}';
		}
		if (isset($attr['textFont']) && is_array($attr['textFont']) && isset($attr['textFont'][0]) && is_array($attr['textFont'][0]) && ((isset($attr['textFont'][0]['size']) && is_array($attr['textFont'][0]['size']) && isset($attr['textFont'][0]['size'][1]) && !empty($attr['textFont'][0]['size'][1])) || (isset($attr['textFont'][0]['lineHeight']) && is_array($attr['textFont'][0]['lineHeight']) && isset($attr['textFont'][0]['lineHeight'][1]) && !empty($attr['textFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
			if (isset($attr['textFont'][0]['size'][1]) && !empty($attr['textFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['textFont'][0]['size'][1] . (!isset($attr['textFont'][0]['sizeType']) ? 'px' : $attr['textFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['textFont'][0]['lineHeight'][1]) && !empty($attr['textFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['textFont'][0]['lineHeight'][1] . (!isset($attr['textFont'][0]['lineType']) ? 'px' : $attr['textFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['textFont']) && is_array($attr['textFont']) && isset($attr['textFont'][0]) && is_array($attr['textFont'][0]) && ((isset($attr['textFont'][0]['size']) && is_array($attr['textFont'][0]['size']) && isset($attr['textFont'][0]['size'][2]) && !empty($attr['textFont'][0]['size'][2])) || (isset($attr['textFont'][0]['lineHeight']) && is_array($attr['textFont'][0]['lineHeight']) && isset($attr['textFont'][0]['lineHeight'][2]) && !empty($attr['textFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
			if (isset($attr['textFont'][0]['size'][2]) && !empty($attr['textFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['textFont'][0]['size'][2] . (!isset($attr['textFont'][0]['sizeType']) ? 'px' : $attr['textFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['textFont'][0]['lineHeight'][2]) && !empty($attr['textFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['textFont'][0]['lineHeight'][2] . (!isset($attr['textFont'][0]['lineType']) ? 'px' : $attr['textFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['textMinHeight']) && is_array($attr['textMinHeight']) && isset($attr['textMinHeight'][0])) {
			if (is_numeric($attr['textMinHeight'][0])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][0] . 'px;';
				$css .= '}';
			}
			if (isset($attr['textMinHeight'][1]) && is_numeric($attr['textMinHeight'][1])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['textMinHeight'][2]) && is_numeric($attr['textMinHeight'][2])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['learnMoreStyles']) && is_array($attr['learnMoreStyles']) && is_array($attr['learnMoreStyles'][0])) {
			$learn_more_styles = $attr['learnMoreStyles'][0];
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-learnmore {';
			if (isset($learn_more_styles['color']) && !empty($learn_more_styles['color'])) {
				$css .= 'color:' . $learn_more_styles['color'] . ';';
			}
			if (isset($learn_more_styles['background']) && !empty($learn_more_styles['background'])) {
				$css .= 'background:' . $learn_more_styles['background'] . ';';
			}
			if (isset($learn_more_styles['border']) && !empty($learn_more_styles['border'])) {
				$css .= 'border-color:' . $learn_more_styles['border'] . ';';
			}
			if (isset($learn_more_styles['borderRadius']) && !empty($learn_more_styles['borderRadius'])) {
				$css .= 'border-radius:' . $learn_more_styles['borderRadius'] . 'px;';
			}
			if (isset($learn_more_styles['size']) && is_array($learn_more_styles['size']) && !empty($learn_more_styles['size'][0])) {
				$css .= 'font-size:' . $learn_more_styles['size'][0] . (!isset($learn_more_styles['sizeType']) ? 'px' : $learn_more_styles['sizeType']) . ';';
			}
			if (isset($learn_more_styles['lineHeight']) && is_array($learn_more_styles['lineHeight']) && !empty($learn_more_styles['lineHeight'][0])) {
				$css .= 'line-height:' . $learn_more_styles['lineHeight'][0] . (!isset($learn_more_styles['lineType']) ? 'px' : $learn_more_styles['lineType']) . ';';
			}
			if (isset($learn_more_styles['letterSpacing']) && !empty($learn_more_styles['letterSpacing'])) {
				$css .= 'letter-spacing:' . $learn_more_styles['letterSpacing'] . 'px;';
			}
			if (isset($learn_more_styles['family']) && !empty($learn_more_styles['family'])) {
				$css .= 'font-family:' . $learn_more_styles['family'] . ';';
			}
			if (isset($learn_more_styles['style']) && !empty($learn_more_styles['style'])) {
				$css .= 'font-style:' . $learn_more_styles['style'] . ';';
			}
			if (isset($learn_more_styles['weight']) && !empty($learn_more_styles['weight'])) {
				$css .= 'font-weight:' . $learn_more_styles['weight'] . ';';
			}
			if (isset($learn_more_styles['borderWidth']) && is_array($learn_more_styles['borderWidth'])) {
				$css .= 'border-width:' . $learn_more_styles['borderWidth'][0] . 'px ' . $learn_more_styles['borderWidth'][1] . 'px ' . $learn_more_styles['borderWidth'][2] . 'px ' . $learn_more_styles['borderWidth'][3] . 'px;';
			}
			if (isset($learn_more_styles['padding']) && is_array($learn_more_styles['padding'])) {
				$css .= 'padding:' . $learn_more_styles['padding'][0] . 'px ' . $learn_more_styles['padding'][1] . 'px ' . $learn_more_styles['padding'][2] . 'px ' . $learn_more_styles['padding'][3] . 'px;';
			}
			if (isset($learn_more_styles['margin']) && is_array($learn_more_styles['margin'])) {
				$css .= 'margin:' . $learn_more_styles['margin'][0] . 'px ' . $learn_more_styles['margin'][1] . 'px ' . $learn_more_styles['margin'][2] . 'px ' . $learn_more_styles['margin'][3] . 'px;';
			}
			$css .= '}';
			if (isset($learn_more_styles['colorHover']) || isset($learn_more_styles['colorHover']) || isset($learn_more_styles['borderHover'])) {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover .amp-blocks-info-box-learnmore {';
				if (isset($learn_more_styles['colorHover']) && !empty($learn_more_styles['colorHover'])) {
					$css .= 'color:' . $learn_more_styles['colorHover'] . ';';
				}
				if (isset($learn_more_styles['backgroundHover']) && !empty($learn_more_styles['backgroundHover'])) {
					$css .= 'background:' . $learn_more_styles['backgroundHover'] . ';';
				}
				if (isset($learn_more_styles['borderHover']) && !empty($learn_more_styles['borderHover'])) {
					$css .= 'border-color:' . $learn_more_styles['borderHover'] . ';';
				}
				$css .= '}';
			}
		}
		if (isset($attr['learnMoreStyles']) && is_array($attr['learnMoreStyles']) && isset($attr['learnMoreStyles'][0]) && is_array($attr['learnMoreStyles'][0]) && ((isset($attr['learnMoreStyles'][0]['size']) && is_array($attr['learnMoreStyles'][0]['size']) && isset($attr['learnMoreStyles'][0]['size'][1]) && !empty($attr['learnMoreStyles'][0]['size'][1])) || (isset($attr['learnMoreStyles'][0]['lineHeight']) && is_array($attr['learnMoreStyles'][0]['lineHeight']) && isset($attr['learnMoreStyles'][0]['lineHeight'][1]) && !empty($attr['learnMoreStyles'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-learnmore {';
			if (isset($attr['learnMoreStyles'][0]['size'][1]) && !empty($attr['learnMoreStyles'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['learnMoreStyles'][0]['size'][1] . (!isset($attr['learnMoreStyles'][0]['sizeType']) ? 'px' : $attr['learnMoreStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['learnMoreStyles'][0]['lineHeight'][1]) && !empty($attr['learnMoreStyles'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['learnMoreStyles'][0]['lineHeight'][1] . (!isset($attr['learnMoreStyles'][0]['lineType']) ? 'px' : $attr['learnMoreStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['learnMoreStyles']) && is_array($attr['learnMoreStyles']) && isset($attr['learnMoreStyles'][0]) && is_array($attr['learnMoreStyles'][0]) && ((isset($attr['learnMoreStyles'][0]['size']) && is_array($attr['learnMoreStyles'][0]['size']) && isset($attr['learnMoreStyles'][0]['size'][2]) && !empty($attr['learnMoreStyles'][0]['size'][2])) || (isset($attr['learnMoreStyles'][0]['lineHeight']) && is_array($attr['learnMoreStyles'][0]['lineHeight']) && isset($attr['learnMoreStyles'][0]['lineHeight'][2]) && !empty($attr['learnMoreStyles'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-learnmore {';
			if (isset($attr['learnMoreStyles'][0]['size'][2]) && !empty($attr['learnMoreStyles'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['learnMoreStyles'][0]['size'][2] . (!isset($attr['learnMoreStyles'][0]['sizeType']) ? 'px' : $attr['learnMoreStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['learnMoreStyles'][0]['lineHeight'][2]) && !empty($attr['learnMoreStyles'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['learnMoreStyles'][0]['lineHeight'][2] . (!isset($attr['learnMoreStyles'][0]['lineType']) ? 'px' : $attr['learnMoreStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['displayShadow']) && !empty($attr['displayShadow']) && true === $attr['displayShadow']) {
			if (isset($attr['shadow']) && is_array($attr['shadow']) && is_array($attr['shadow'][0])) {
				$shadow = $attr['shadow'][0];
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap {';
				$css .= 'box-shadow:' . $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $this->hex2rgba($shadow['color'], $shadow['opacity']) . ';';
				$css .= '}';
			}
			if (isset($attr['shadowHover']) && is_array($attr['shadowHover']) && is_array($attr['shadowHover'][0])) {
				$shadow_hover = $attr['shadowHover'][0];
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover {';
				$css .= 'box-shadow:' . $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $this->hex2rgba($shadow_hover['color'], $shadow_hover['opacity']) . ';';
				$css .= '}';
			} else {
				$css .= '#amp-info-box' . $unique_id . ' .amp-blocks-info-box-link-wrap:hover {';
				$css .= 'box-shadow:0px 0px 14px 0px rgba(0,0,0,0.2);';
				$css .= '}';
			}
		}
		return $css;
	}

	/**
	 * Builds CSS for Accordion block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_accordion_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['contentBorderColor']) || isset($attr['contentBgColor']) || isset($attr['contentPadding']) || isset($attr['contentBorderRadius']) || isset($attr['contentBorder'])) {
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-accordion-panel-inner {';
			if (isset($attr['contentBorderColor']) && !empty($attr['contentBorderColor'])) {
				$css .= 'border-color:' . $attr['contentBorderColor'] . ';';
			}
			if (isset($attr['contentBorderRadius']) && !empty($attr['contentBorderRadius'])) {
				$css .= 'border-radius:' . $attr['contentBorderRadius'][0] . 'px ' . $attr['contentBorderRadius'][1] . 'px ' . $attr['contentBorderRadius'][2] . 'px ' . $attr['contentBorderRadius'][3] . 'px;';
			}
			if (isset($attr['contentBgColor']) && !empty($attr['contentBgColor'])) {
				$css .= 'background:' . $attr['contentBgColor'] . ';';
			}
			if (isset($attr['contentPadding']) && is_array($attr['contentPadding'])) {
				$css .= 'padding:' . $attr['contentPadding'][0] . 'px ' . $attr['contentPadding'][1] . 'px ' . $attr['contentPadding'][2] . 'px ' . $attr['contentPadding'][3] . 'px;';
			}
			if (isset($attr['contentBorder']) && is_array($attr['contentBorder'])) {
				$css .= 'border-width:' . $attr['contentBorder'][0] . 'px ' . $attr['contentBorder'][1] . 'px ' . $attr['contentBorder'][2] . 'px ' . $attr['contentBorder'][3] . 'px;';
			}
			$css .= '}';
		}

		if (isset($attr['titleStyles']) && is_array($attr['titleStyles']) && is_array($attr['titleStyles'][0])) {
			$title_styles = $attr['titleStyles'][0];
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header {';
			if (isset($title_styles['color']) && !empty($title_styles['color'])) {
				$css .= 'color:' . $title_styles['color'] . ';';
			}
			if (isset($title_styles['background']) && !empty($title_styles['background'])) {
				$css .= 'background:' . $title_styles['background'] . ';';
			}
			if (isset($title_styles['border']) && is_array($title_styles['border']) && !empty($title_styles['border'][0])) {
				$css .= 'border-color:' . $title_styles['border'][0] . ' ' . $title_styles['border'][1] . ' ' . $title_styles['border'][2] . ' ' . $title_styles['border'][3] . ';';
			}
			if (isset($title_styles['size']) && is_array($title_styles['size']) && !empty($title_styles['size'][0])) {
				$css .= 'font-size:' . $title_styles['size'][0] . (!isset($title_styles['sizeType']) ? 'px' : $title_styles['sizeType']) . ';';
			}
			if (isset($title_styles['lineHeight']) && is_array($title_styles['lineHeight']) && !empty($title_styles['lineHeight'][0])) {
				$css .= 'line-height:' . $title_styles['lineHeight'][0] . (!isset($title_styles['lineType']) ? 'px' : $title_styles['lineType']) . ';';
			}
			if (isset($title_styles['letterSpacing']) && !empty($title_styles['letterSpacing'])) {
				$css .= 'letter-spacing:' . $title_styles['letterSpacing'] . 'px;';
			}
			if (isset($title_styles['textTransform']) && !empty($title_styles['textTransform'])) {
				$css .= 'text-transform:' . $title_styles['textTransform'] . ';';
			}
			if (isset($title_styles['family']) && !empty($title_styles['family'])) {
				$css .= 'font-family:' . $title_styles['family'] . ';';
			}
			if (isset($title_styles['style']) && !empty($title_styles['style'])) {
				$css .= 'font-style:' . $title_styles['style'] . ';';
			}
			if (isset($title_styles['weight']) && !empty($title_styles['weight'])) {
				$css .= 'font-weight:' . $title_styles['weight'] . ';';
			}
			if (isset($title_styles['borderRadius']) && is_array($title_styles['borderRadius'])) {
				$css .= 'border-radius:' . $title_styles['borderRadius'][0] . 'px ' . $title_styles['borderRadius'][1] . 'px ' . $title_styles['borderRadius'][2] . 'px ' . $title_styles['borderRadius'][3] . 'px;';
			}
			if (isset($title_styles['borderWidth']) && is_array($title_styles['borderWidth'])) {
				$css .= 'border-width:' . $title_styles['borderWidth'][0] . 'px ' . $title_styles['borderWidth'][1] . 'px ' . $title_styles['borderWidth'][2] . 'px ' . $title_styles['borderWidth'][3] . 'px;';
			}
			if (isset($title_styles['padding']) && is_array($title_styles['padding'])) {
				$css .= 'padding:' . $title_styles['padding'][0] . 'px ' . $title_styles['padding'][1] . 'px ' . $title_styles['padding'][2] . 'px ' . $title_styles['padding'][3] . 'px;';
			}
			if (isset($title_styles['marginTop']) && !empty($title_styles['marginTop'])) {
				$css .= 'margin-top:' . $title_styles['marginTop'] . 'px;';
			}
			$css .= '}';
			if (isset($title_styles['size']) && is_array($title_styles['size']) && !empty($title_styles['size'][0])) {
				$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header .b-svg-icon svg {';
				$css .= 'width:' . $title_styles['size'][0] . (!isset($title_styles['sizeType']) ? 'px' : $title_styles['sizeType']) . ';';
				$css .= 'height:' . $title_styles['size'][0] . (!isset($title_styles['sizeType']) ? 'px' : $title_styles['sizeType']) . ';';
				$css .= '}';
			}
			if (isset($title_styles['color']) && !empty($title_styles['color'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['color'] . ';';
				$css .= '}';
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $title_styles['color'] . ';';
				$css .= '}';
			}
			if (isset($title_styles['background']) && !empty($title_styles['background'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['background'] . ';';
				$css .= '}';
			}
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header:hover, .amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header:focus {';
			if (isset($title_styles['colorHover']) && !empty($title_styles['colorHover'])) {
				$css .= 'color:' . $title_styles['colorHover'] . ';';
			}
			if (isset($title_styles['backgroundHover']) && !empty($title_styles['backgroundHover'])) {
				$css .= 'background:' . $title_styles['backgroundHover'] . ';';
			}
			if (isset($title_styles['borderHover']) && is_array($title_styles['borderHover']) && !empty($title_styles['borderHover'][0])) {
				$css .= 'border-color:' . $title_styles['borderHover'][0] . ' ' . $title_styles['borderHover'][1] . ' ' . $title_styles['borderHover'][2] . ' ' . $title_styles['borderHover'][3] . ';';
			}
			$css .= '}';
			if (isset($title_styles['colorHover']) && !empty($title_styles['colorHover'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header:hover .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header:hover .amp-blocks-accordion-icon-trigger:before, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header:focus .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header:focus .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['colorHover'] . ';';
				$css .= '}';
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:hover .amp-blocks-accordion-icon-trigger, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:focus .amp-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $title_styles['colorHover'] . ';';
				$css .= '}';
			}
			if (isset($title_styles['backgroundHover']) && !empty($title_styles['backgroundHover'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:hover .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:hover .amp-blocks-accordion-icon-trigger:before, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:focus .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header:focus .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['backgroundHover'] . ';';
				$css .= '}';
			}
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header.amp-accordion-panel-active {';
			if (isset($title_styles['colorActive']) && !empty($title_styles['colorActive'])) {
				$css .= 'color:' . $title_styles['colorActive'] . ';';
			}
			if (isset($title_styles['backgroundActive']) && !empty($title_styles['backgroundActive'])) {
				$css .= 'background:' . $title_styles['backgroundActive'] . ';';
			}
			if (isset($title_styles['borderActive']) && is_array($title_styles['borderActive']) && !empty($title_styles['borderActive'][0])) {
				$css .= 'border-color:' . $title_styles['borderActive'][0] . ' ' . $title_styles['borderActive'][1] . ' ' . $title_styles['borderActive'][2] . ' ' . $title_styles['borderActive'][3] . ';';
			}
			$css .= '}';
			if (isset($title_styles['colorActive']) && !empty($title_styles['colorActive'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header.amp-accordion-panel-active .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basiccircle ):not( .amp-accodion-icon-style-xclosecircle ):not( .amp-accodion-icon-style-arrowcircle ) .amp-blocks-accordion-header.amp-accordion-panel-active .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['colorActive'] . ';';
				$css .= '}';
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header.amp-accordion-panel-active .amp-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $title_styles['colorActive'] . ';';
				$css .= '}';
			}
			if (isset($title_styles['backgroundActive']) && !empty($title_styles['backgroundActive'])) {
				$css .= '.amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header.amp-accordion-panel-active .amp-blocks-accordion-icon-trigger:after, .amp-accordion-id' . $unique_id . ':not( .amp-accodion-icon-style-basic ):not( .amp-accodion-icon-style-xclose ):not( .amp-accodion-icon-style-arrow ) .amp-blocks-accordion-header.amp-accordion-panel-active .amp-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['backgroundActive'] . ';';
				$css .= '}';
			}
		}
		if (isset($attr['titleStyles']) && is_array($attr['titleStyles']) && isset($attr['titleStyles'][0]) && is_array($attr['titleStyles'][0]) && ((isset($attr['titleStyles'][0]['size']) && is_array($attr['titleStyles'][0]['size']) && isset($attr['titleStyles'][0]['size'][1]) && !empty($attr['titleStyles'][0]['size'][1])) || (isset($attr['titleStyles'][0]['lineHeight']) && is_array($attr['titleStyles'][0]['lineHeight']) && isset($attr['titleStyles'][0]['lineHeight'][1]) && !empty($attr['titleStyles'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header {';
			if (isset($attr['titleStyles'][0]['size'][1]) && !empty($attr['titleStyles'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['titleStyles'][0]['size'][1] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleStyles'][0]['lineHeight'][1]) && !empty($attr['titleStyles'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][1] . (!isset($attr['titleStyles'][0]['lineType']) ? 'px' : $attr['titleStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header .b-svg-icon svg {';
			$css .= 'width:' . $attr['titleStyles'][0]['size'][1] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			$css .= 'height:' . $attr['titleStyles'][0]['size'][1] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['titleStyles']) && is_array($attr['titleStyles']) && isset($attr['titleStyles'][0]) && is_array($attr['titleStyles'][0]) && ((isset($attr['titleStyles'][0]['size']) && is_array($attr['titleStyles'][0]['size']) && isset($attr['titleStyles'][0]['size'][2]) && !empty($attr['titleStyles'][0]['size'][2])) || (isset($attr['titleStyles'][0]['lineHeight']) && is_array($attr['titleStyles'][0]['lineHeight']) && isset($attr['titleStyles'][0]['lineHeight'][2]) && !empty($attr['titleStyles'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header {';
			if (isset($attr['titleStyles'][0]['size'][2]) && !empty($attr['titleStyles'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['titleStyles'][0]['size'][2] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleStyles'][0]['lineHeight'][2]) && !empty($attr['titleStyles'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][2] . (!isset($attr['titleStyles'][0]['lineType']) ? 'px' : $attr['titleStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '.amp-accordion-id' . $unique_id . ' .amp-blocks-accordion-header .b-svg-icon svg {';
			$css .= 'width:' . $attr['titleStyles'][0]['size'][2] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			$css .= 'height:' . $attr['titleStyles'][0]['size'][2] . (!isset($attr['titleStyles'][0]['sizeType']) ? 'px' : $attr['titleStyles'][0]['sizeType']) . ';';
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds CSS for Testimonial block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_testimonials_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['layout']) && 'carousel' === $attr['layout'] && isset($attr['columnGap']) && !empty($attr['columnGap'])) {
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-blocks-carousel .amp-blocks-testimonial-carousel-item {';
			$css .= 'padding: 0 ' . ($attr['columnGap'] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init {';
			$css .= 'margin: 0 -' . ($attr['columnGap'] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-blocks-carousel .slick-prev {';
			$css .= 'left:' . ($attr['columnGap'] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-blocks-carousel .slick-next {';
			$css .= 'right:' . ($attr['columnGap'] / 2) . 'px;';
			$css .= '}';
		}
		if (isset($attr['style']) && ('bubble' === $attr['style'] || 'inlineimage' === $attr['style'])) {
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-text-wrap:after {';
			if (isset($attr['containerBorderWidth']) && is_array($attr['containerBorderWidth']) && !empty($attr['containerBorderWidth'][2])) {
				$css .= 'margin-top: ' . $attr['containerBorderWidth'][2] . 'px;';
			}
			if (isset($attr['containerBorder']) && !empty($attr['containerBorder'])) {
				$alpha = (isset($attr['containerBorderOpacity']) && is_numeric($attr['containerBorderOpacity']) ? $attr['containerBorderOpacity'] : 1);
				$css .= 'border-top-color: ' . $this->hex2rgba($attr['containerBorder'], $alpha) . ';';
			}
			$css .= '}';
		}
		if (isset($attr['titleFont']) && is_array($attr['titleFont']) && is_array($attr['titleFont'][0])) {
			$title_font = $attr['titleFont'][0];

			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-title {';
			if (isset($title_font['color']) && !empty($title_font['color'])) {
				$css .= 'color:' . $title_font['color'] . ';';
			}
			if (isset($title_font['size']) && is_array($title_font['size']) && !empty($title_font['size'][0])) {
				$css .= 'font-size:' . $title_font['size'][0] . (!isset($title_font['sizeType']) ? 'px' : $title_font['sizeType']) . ';';
			}
			if (isset($title_font['lineHeight']) && is_array($title_font['lineHeight']) && !empty($title_font['lineHeight'][0])) {
				$css .= 'line-height:' . $title_font['lineHeight'][0] . (!isset($title_font['lineType']) ? 'px' : $title_font['lineType']) . ';';
			}
			if (isset($title_font['letterSpacing']) && !empty($title_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $title_font['letterSpacing'] . 'px;';
			}
			if (isset($title_font['textTransform']) && !empty($title_font['textTransform'])) {
				$css .= 'text-transform:' . $title_font['textTransform'] . ';';
			}
			if (isset($title_font['family']) && !empty($title_font['family'])) {
				$css .= 'font-family:' . $title_font['family'] . ';';
			}
			if (isset($title_font['style']) && !empty($title_font['style'])) {
				$css .= 'font-style:' . $title_font['style'] . ';';
			}
			if (isset($title_font['weight']) && !empty($title_font['weight'])) {
				$css .= 'font-weight:' . $title_font['weight'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['titleFont']) && is_array($attr['titleFont']) && isset($attr['titleFont'][0]) && is_array($attr['titleFont'][0]) && ((isset($attr['titleFont'][0]['size']) && is_array($attr['titleFont'][0]['size']) && isset($attr['titleFont'][0]['size'][1]) && !empty($attr['titleFont'][0]['size'][1])) || (isset($attr['titleFont'][0]['lineHeight']) && is_array($attr['titleFont'][0]['lineHeight']) && isset($attr['titleFont'][0]['lineHeight'][1]) && !empty($attr['titleFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-title {';
			if (isset($attr['titleFont'][0]['size'][1]) && !empty($attr['titleFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['titleFont'][0]['size'][1] . (!isset($attr['titleFont'][0]['sizeType']) ? 'px' : $attr['titleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleFont'][0]['lineHeight'][1]) && !empty($attr['titleFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][1] . (!isset($attr['titleFont'][0]['lineType']) ? 'px' : $attr['titleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['titleFont']) && is_array($attr['titleFont']) && isset($attr['titleFont'][0]) && is_array($attr['titleFont'][0]) && ((isset($attr['titleFont'][0]['size']) && is_array($attr['titleFont'][0]['size']) && isset($attr['titleFont'][0]['size'][2]) && !empty($attr['titleFont'][0]['size'][2])) || (isset($attr['titleFont'][0]['lineHeight']) && is_array($attr['titleFont'][0]['lineHeight']) && isset($attr['titleFont'][0]['lineHeight'][2]) && !empty($attr['titleFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-title {';
			if (isset($attr['titleFont'][0]['size'][2]) && !empty($attr['titleFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['titleFont'][0]['size'][2] . (!isset($attr['titleFont'][0]['sizeType']) ? 'px' : $attr['titleFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['titleFont'][0]['lineHeight'][2]) && !empty($attr['titleFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][2] . (!isset($attr['titleFont'][0]['lineType']) ? 'px' : $attr['titleFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['contentFont']) && is_array($attr['contentFont']) && is_array($attr['contentFont'][0])) {
			$content_font = $attr['contentFont'][0];

			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-content {';
			if (isset($content_font['color']) && !empty($content_font['color'])) {
				$css .= 'color:' . $content_font['color'] . ';';
			}
			if (isset($content_font['size']) && is_array($content_font['size']) && !empty($content_font['size'][0])) {
				$css .= 'font-size:' . $content_font['size'][0] . (!isset($content_font['sizeType']) ? 'px' : $content_font['sizeType']) . ';';
			}
			if (isset($content_font['lineHeight']) && is_array($content_font['lineHeight']) && !empty($content_font['lineHeight'][0])) {
				$css .= 'line-height:' . $content_font['lineHeight'][0] . (!isset($content_font['lineType']) ? 'px' : $content_font['lineType']) . ';';
			}
			if (isset($content_font['letterSpacing']) && !empty($content_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $content_font['letterSpacing'] . 'px;';
			}
			if (isset($content_font['textTransform']) && !empty($content_font['textTransform'])) {
				$css .= 'text-transform:' . $content_font['textTransform'] . ';';
			}
			if (isset($content_font['family']) && !empty($content_font['family'])) {
				$css .= 'font-family:' . $content_font['family'] . ';';
			}
			if (isset($content_font['style']) && !empty($content_font['style'])) {
				$css .= 'font-style:' . $content_font['style'] . ';';
			}
			if (isset($content_font['weight']) && !empty($content_font['weight'])) {
				$css .= 'font-weight:' . $content_font['weight'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['contentFont']) && is_array($attr['contentFont']) && isset($attr['contentFont'][0]) && is_array($attr['contentFont'][0]) && ((isset($attr['contentFont'][0]['size']) && is_array($attr['contentFont'][0]['size']) && isset($attr['contentFont'][0]['size'][1]) && !empty($attr['contentFont'][0]['size'][1])) || (isset($attr['contentFont'][0]['lineHeight']) && is_array($attr['contentFont'][0]['lineHeight']) && isset($attr['contentFont'][0]['lineHeight'][1]) && !empty($attr['contentFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-content {';
			if (isset($attr['contentFont'][0]['size'][1]) && !empty($attr['contentFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['contentFont'][0]['size'][1] . (!isset($attr['contentFont'][0]['sizeType']) ? 'px' : $attr['contentFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['contentFont'][0]['lineHeight'][1]) && !empty($attr['contentFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['contentFont'][0]['lineHeight'][1] . (!isset($attr['contentFont'][0]['lineType']) ? 'px' : $attr['contentFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['contentFont']) && is_array($attr['contentFont']) && isset($attr['contentFont'][0]) && is_array($attr['contentFont'][0]) && ((isset($attr['contentFont'][0]['size']) && is_array($attr['contentFont'][0]['size']) && isset($attr['contentFont'][0]['size'][2]) && !empty($attr['contentFont'][0]['size'][2])) || (isset($attr['contentFont'][0]['lineHeight']) && is_array($attr['contentFont'][0]['lineHeight']) && isset($attr['contentFont'][0]['lineHeight'][2]) && !empty($attr['contentFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-content {';
			if (isset($attr['contentFont'][0]['size'][2]) && !empty($attr['contentFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['contentFont'][0]['size'][2] . (!isset($attr['contentFont'][0]['sizeType']) ? 'px' : $attr['contentFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['contentFont'][0]['lineHeight'][2]) && !empty($attr['contentFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['contentFont'][0]['lineHeight'][2] . (!isset($attr['contentFont'][0]['lineType']) ? 'px' : $attr['contentFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['nameFont']) && is_array($attr['nameFont']) && is_array($attr['nameFont'][0])) {
			$name_font = $attr['nameFont'][0];

			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-name {';
			if (isset($name_font['color']) && !empty($name_font['color'])) {
				$css .= 'color:' . $name_font['color'] . ';';
			}
			if (isset($name_font['size']) && is_array($name_font['size']) && !empty($name_font['size'][0])) {
				$css .= 'font-size:' . $name_font['size'][0] . (!isset($name_font['sizeType']) ? 'px' : $name_font['sizeType']) . ';';
			}
			if (isset($name_font['lineHeight']) && is_array($name_font['lineHeight']) && !empty($name_font['lineHeight'][0])) {
				$css .= 'line-height:' . $name_font['lineHeight'][0] . (!isset($name_font['lineType']) ? 'px' : $name_font['lineType']) . ';';
			}
			if (isset($name_font['letterSpacing']) && !empty($name_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $name_font['letterSpacing'] . 'px;';
			}
			if (isset($name_font['textTransform']) && !empty($name_font['textTransform'])) {
				$css .= 'text-transform:' . $name_font['textTransform'] . ';';
			}
			if (isset($name_font['family']) && !empty($name_font['family'])) {
				$css .= 'font-family:' . $name_font['family'] . ';';
			}
			if (isset($name_font['style']) && !empty($name_font['style'])) {
				$css .= 'font-style:' . $name_font['style'] . ';';
			}
			if (isset($name_font['weight']) && !empty($name_font['weight'])) {
				$css .= 'font-weight:' . $name_font['weight'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['nameFont']) && is_array($attr['nameFont']) && isset($attr['nameFont'][0]) && is_array($attr['nameFont'][0]) && ((isset($attr['nameFont'][0]['size']) && is_array($attr['nameFont'][0]['size']) && isset($attr['nameFont'][0]['size'][1]) && !empty($attr['nameFont'][0]['size'][1])) || (isset($attr['nameFont'][0]['lineHeight']) && is_array($attr['nameFont'][0]['lineHeight']) && isset($attr['nameFont'][0]['lineHeight'][1]) && !empty($attr['nameFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-name {';
			if (isset($attr['nameFont'][0]['size'][1]) && !empty($attr['nameFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['nameFont'][0]['size'][1] . (!isset($attr['nameFont'][0]['sizeType']) ? 'px' : $attr['nameFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['nameFont'][0]['lineHeight'][1]) && !empty($attr['nameFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['nameFont'][0]['lineHeight'][1] . (!isset($attr['nameFont'][0]['lineType']) ? 'px' : $attr['nameFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['nameFont']) && is_array($attr['nameFont']) && isset($attr['nameFont'][0]) && is_array($attr['nameFont'][0]) && ((isset($attr['nameFont'][0]['size']) && is_array($attr['nameFont'][0]['size']) && isset($attr['nameFont'][0]['size'][2]) && !empty($attr['nameFont'][0]['size'][2])) || (isset($attr['nameFont'][0]['lineHeight']) && is_array($attr['nameFont'][0]['lineHeight']) && isset($attr['nameFont'][0]['lineHeight'][2]) && !empty($attr['nameFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-name {';
			if (isset($attr['nameFont'][0]['size'][2]) && !empty($attr['nameFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['nameFont'][0]['size'][2] . (!isset($attr['nameFont'][0]['sizeType']) ? 'px' : $attr['nameFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['nameFont'][0]['lineHeight'][2]) && !empty($attr['nameFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['nameFont'][0]['lineHeight'][2] . (!isset($attr['nameFont'][0]['lineType']) ? 'px' : $attr['nameFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['occupationFont']) && is_array($attr['occupationFont']) && is_array($attr['occupationFont'][0])) {
			$occupation_font = $attr['occupationFont'][0];

			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-occupation {';
			if (isset($occupation_font['color']) && !empty($occupation_font['color'])) {
				$css .= 'color:' . $occupation_font['color'] . ';';
			}
			if (isset($occupation_font['size']) && is_array($occupation_font['size']) && !empty($occupation_font['size'][0])) {
				$css .= 'font-size:' . $occupation_font['size'][0] . (!isset($occupation_font['sizeType']) ? 'px' : $occupation_font['sizeType']) . ';';
			}
			if (isset($occupation_font['lineHeight']) && is_array($occupation_font['lineHeight']) && !empty($occupation_font['lineHeight'][0])) {
				$css .= 'line-height:' . $occupation_font['lineHeight'][0] . (!isset($occupation_font['lineType']) ? 'px' : $occupation_font['lineType']) . ';';
			}
			if (isset($occupation_font['letterSpacing']) && !empty($occupation_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $occupation_font['letterSpacing'] . 'px;';
			}
			if (isset($occupation_font['textTransform']) && !empty($occupation_font['textTransform'])) {
				$css .= 'text-transform:' . $occupation_font['textTransform'] . ';';
			}
			if (isset($occupation_font['family']) && !empty($occupation_font['family'])) {
				$css .= 'font-family:' . $occupation_font['family'] . ';';
			}
			if (isset($occupation_font['style']) && !empty($occupation_font['style'])) {
				$css .= 'font-style:' . $occupation_font['style'] . ';';
			}
			if (isset($occupation_font['weight']) && !empty($occupation_font['weight'])) {
				$css .= 'font-weight:' . $occupation_font['weight'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['occupationFont']) && is_array($attr['occupationFont']) && isset($attr['occupationFont'][0]) && is_array($attr['occupationFont'][0]) && ((isset($attr['occupationFont'][0]['size']) && is_array($attr['occupationFont'][0]['size']) && isset($attr['occupationFont'][0]['size'][1]) && !empty($attr['occupationFont'][0]['size'][1])) || (isset($attr['occupationFont'][0]['lineHeight']) && is_array($attr['occupationFont'][0]['lineHeight']) && isset($attr['occupationFont'][0]['lineHeight'][1]) && !empty($attr['occupationFont'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-occupation {';
			if (isset($attr['occupationFont'][0]['size'][1]) && !empty($attr['occupationFont'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['occupationFont'][0]['size'][1] . (!isset($attr['occupationFont'][0]['sizeType']) ? 'px' : $attr['occupationFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['occupationFont'][0]['lineHeight'][1]) && !empty($attr['occupationFont'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['occupationFont'][0]['lineHeight'][1] . (!isset($attr['occupationFont'][0]['lineType']) ? 'px' : $attr['occupationFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['occupationFont']) && is_array($attr['occupationFont']) && isset($attr['occupationFont'][0]) && is_array($attr['occupationFont'][0]) && ((isset($attr['occupationFont'][0]['size']) && is_array($attr['occupationFont'][0]['size']) && isset($attr['occupationFont'][0]['size'][2]) && !empty($attr['occupationFont'][0]['size'][2])) || (isset($attr['occupationFont'][0]['lineHeight']) && is_array($attr['occupationFont'][0]['lineHeight']) && isset($attr['occupationFont'][0]['lineHeight'][2]) && !empty($attr['occupationFont'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-blocks-testimonials-wrap' . $unique_id . ' .amp-testimonial-occupation {';
			if (isset($attr['occupationFont'][0]['size'][2]) && !empty($attr['occupationFont'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['occupationFont'][0]['size'][2] . (!isset($attr['occupationFont'][0]['sizeType']) ? 'px' : $attr['occupationFont'][0]['sizeType']) . ';';
			}
			if (isset($attr['occupationFont'][0]['lineHeight'][2]) && !empty($attr['occupationFont'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['occupationFont'][0]['lineHeight'][2] . (!isset($attr['occupationFont'][0]['lineType']) ? 'px' : $attr['occupationFont'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds CSS for form block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_form_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['style']) && is_array($attr['style']) && isset($attr['style'][0]) && is_array($attr['style'][0])) {
			$style = $attr['style'][0];
			if (isset($style['rowGap']) && is_numeric($style['rowGap'])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field {';
				$css .= 'margin-bottom:' . $style['rowGap'] . (isset($style['rowGapType']) && !empty($style['rowGapType']) ? $style['rowGapType'] : 'px') . ';';
				$css .= '}';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field.amp-pre-submit-field {';
				$css .= 'margin-bottom:0;';
				$css .= '}';
			}
			if (isset($style['gutter']) && is_numeric($style['gutter'])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field {';
				$css .= 'padding-right:' . floor($style['gutter'] / 2) . (isset($style['gutterType']) && !empty($style['gutterType']) ? $style['gutterType'] : 'px') . ';';
				$css .= 'padding-left:' . floor($style['gutter'] / 2) . (isset($style['gutterType']) && !empty($style['gutterType']) ? $style['gutterType'] : 'px') . ';';
				$css .= '}';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form {';
				$css .= 'margin-right:-' . floor($style['gutter'] / 2) . (isset($style['gutterType']) && !empty($style['gutterType']) ? $style['gutterType'] : 'px') . ';';
				$css .= 'margin-left:-' . floor($style['gutter'] / 2) . (isset($style['gutterType']) && !empty($style['gutterType']) ? $style['gutterType'] : 'px') . ';';
				$css .= '}';
			}
			if (isset($style['requiredColor']) && !empty($style['requiredColor'])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field label .required {';
				$css .= 'color:' . $style['requiredColor'] . ';';
				$css .= '}';
			}
			if ((isset($style['color']) && !empty($style['color'])) || (isset($style['background']) && !empty($style['background'])) || (isset($style['border']) && !empty($style['border'])) || (isset($style['backgroundType']) && 'gradient' === $style['backgroundType']) || (isset($style['boxShadow']) && is_array($style['boxShadow']) && isset($style['boxShadow'][0]) && true === $style['boxShadow'][0]) || (isset($style['borderRadius']) && is_numeric($style['borderRadius'])) || (isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][0])) || (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][0])) || (isset($style['borderWidth']) && is_array($style['borderWidth']) && is_numeric($style['borderWidth'][0]))) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field, .amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-select-style-field {';
				if (isset($style['color']) && !empty($style['color'])) {
					$css .= 'color:' . $style['color'] . ';';
				}
				if (isset($style['borderRadius']) && is_numeric($style['borderRadius'])) {
					$css .= 'border-radius:' . $style['borderRadius'] . 'px;';
				}
				if (isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][0])) {
					$css .= 'font-size:' . $style['fontSize'][0] . (isset($style['fontSizeType']) && !empty($style['fontSizeType']) ? $style['fontSizeType'] : 'px') . ';';
				}
				if (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][0])) {
					$css .= 'line-height:' . $style['lineHeight'][0] . (isset($style['lineType']) && !empty($style['lineType']) ? $style['lineType'] : 'px') . ';';
				}
				if (isset($style['borderWidth']) && is_array($style['borderWidth']) && is_numeric($style['borderWidth'][0])) {
					$css .= 'border-width:' . $style['borderWidth'][0] . 'px ' . $style['borderWidth'][1] . 'px ' . $style['borderWidth'][2] . 'px ' . $style['borderWidth'][3] . 'px;';
				}
				if (isset($style['backgroundType']) && 'gradient' === $style['backgroundType']) {
					$bg1 = (!isset($style['background']) || 'transparent' === $style['background'] ? 'rgba(255,255,255,0)' : $this->hex2rgba($style['background'], (isset($style['backgroundOpacity']) && is_numeric($style['backgroundOpacity']) ? $style['backgroundOpacity'] : 1)));
					$bg2 = (isset($style['gradient'][0]) && !empty($style['gradient'][0]) ? $this->hex2rgba($style['gradient'][0], (isset($style['gradient'][1]) && is_numeric($style['gradient'][1]) ? $style['gradient'][1] : 1)) : $this->hex2rgba('#999999', (isset($style['gradient'][1]) && is_numeric($style['gradient'][1]) ? $style['gradient'][1] : 1)));
					if (isset($style['gradient'][4]) && 'radial' === $style['gradient'][4]) {
						$css .= 'background:radial-gradient(at ' . (isset($style['gradient'][6]) && !empty($style['gradient'][6]) ? $style['gradient'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($style['gradient'][2]) && is_numeric($style['gradient'][2]) ? $style['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($style['gradient'][3]) && is_numeric($style['gradient'][3]) ? $style['gradient'][3] : '100') . '%);';
					} else if (!isset($style['gradient'][4]) || 'radial' !== $style['gradient'][4]) {
						$css .= 'background:linear-gradient(' . (isset($style['gradient'][5]) && !empty($style['gradient'][5]) ? $style['gradient'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($style['gradient'][2]) && is_numeric($style['gradient'][2]) ? $style['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($style['gradient'][3]) && is_numeric($style['gradient'][3]) ? $style['gradient'][3] : '100') . '%);';
					}
				} else if (isset($style['background']) && !empty($style['background'])) {
					$alpha = (isset($style['backgroundOpacity']) && is_numeric($style['backgroundOpacity']) ? $style['backgroundOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($style['background'], $alpha) . ';';
				}
				if (isset($style['border']) && !empty($style['border'])) {
					$alpha = (isset($style['borderOpacity']) && is_numeric($style['borderOpacity']) ? $style['borderOpacity'] : 1);
					$css .= 'border-color:' . $this->hex2rgba($style['border'], $alpha) . ';';
				}
				if (isset($style['boxShadow']) && is_array($style['boxShadow']) && isset($style['boxShadow'][0]) && true === $style['boxShadow'][0]) {
					$css .= 'box-shadow:' . (isset($style['boxShadow'][7]) && true === $style['boxShadow'][7] ? 'inset ' : '') . (isset($style['boxShadow'][3]) && is_numeric($style['boxShadow'][3]) ? $style['boxShadow'][3] : '1') . 'px ' . (isset($style['boxShadow'][4]) && is_numeric($style['boxShadow'][4]) ? $style['boxShadow'][4] : '1') . 'px ' . (isset($style['boxShadow'][5]) && is_numeric($style['boxShadow'][5]) ? $style['boxShadow'][5] : '2') . 'px ' . (isset($style['boxShadow'][6]) && is_numeric($style['boxShadow'][6]) ? $style['boxShadow'][6] : '0') . 'px ' . $this->hex2rgba((isset($style['boxShadow'][1]) && !empty($style['boxShadow'][1]) ? $style['boxShadow'][1] : '#000000'), (isset($style['boxShadow'][2]) && is_numeric($style['boxShadow'][2]) ? $style['boxShadow'][2] : 0.2)) . ';';
				}
				$css .= '}';
			}
			if ((isset($style['colorActive']) && !empty($style['colorActive'])) || (isset($style['backgroundActive']) && !empty($style['backgroundActive'])) || (isset($style['borderActive']) && !empty($style['borderActive'])) || (isset($style['backgroundActiveType']) && 'gradient' === $style['backgroundActiveType']) || (isset($style['boxShadow']) && is_array($style['boxShadow']) && isset($style['boxShadow'][0]) && true === $style['boxShadow'][0])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field:focus, .amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-select-style-field:focus {';
				if (isset($style['colorActive']) && !empty($style['colorActive'])) {
					$css .= 'color:' . $style['colorActive'] . ';';
				}
				if (isset($style['borderActive']) && !empty($style['borderActive'])) {
					$alpha = (isset($style['borderActiveOpacity']) && is_numeric($style['borderActiveOpacity']) ? $style['borderActiveOpacity'] : 1);
					$css .= 'border-color:' . $this->hex2rgba($style['borderActive'], $alpha) . ';';
				}
				if (isset($style['boxShadowActive']) && is_array($style['boxShadowActive']) && isset($style['boxShadowActive'][0]) && true === $style['boxShadowActive'][0]) {
					$css .= 'box-shadow:' . (isset($style['boxShadowActive'][7]) && true === $style['boxShadowActive'][7] ? 'inset ' : '') . (isset($style['boxShadowActive'][3]) && is_numeric($style['boxShadowActive'][3]) ? $style['boxShadowActive'][3] : '2') . 'px ' . (isset($style['boxShadowActive'][4]) && is_numeric($style['boxShadowActive'][4]) ? $style['boxShadowActive'][4] : '2') . 'px ' . (isset($style['boxShadowActive'][5]) && is_numeric($style['boxShadowActive'][5]) ? $style['boxShadowActive'][5] : '3') . 'px ' . (isset($style['boxShadowActive'][6]) && is_numeric($style['boxShadowActive'][6]) ? $style['boxShadowActive'][6] : '0') . 'px ' . $this->hex2rgba((isset($style['boxShadowActive'][1]) && !empty($style['boxShadowActive'][1]) ? $style['boxShadowActive'][1] : '#000000'), (isset($style['boxShadowActive'][2]) && is_numeric($style['boxShadowActive'][2]) ? $style['boxShadowActive'][2] : 0.4)) . ';';
				}
				if (isset($style['backgroundActiveType']) && 'gradient' === $style['backgroundActiveType']) {
					$bg1 = (!isset($style['backgroundActive']) ? $this->hex2rgba('#444444', (isset($style['backgroundActiveOpacity']) && is_numeric($style['backgroundActiveOpacity']) ? $style['backgroundActiveOpacity'] : 1)) : $this->hex2rgba($style['backgroundActive'], (isset($style['backgroundActiveOpacity']) && is_numeric($style['backgroundActiveOpacity']) ? $style['backgroundActiveOpacity'] : 1)));
					$bg2 = (isset($style['gradientActive'][0]) && !empty($style['gradientActive'][0]) ? $this->hex2rgba($style['gradientActive'][0], (isset($style['gradientActive'][1]) && is_numeric($style['gradientActive'][1]) ? $style['gradientActive'][1] : 1)) : $this->hex2rgba('#999999', (isset($style['gradientActive'][1]) && is_numeric($style['gradientActive'][1]) ? $style['gradientActive'][1] : 1)));
					if (isset($style['gradientActive'][4]) && 'radial' === $style['gradientActive'][4]) {
						$css .= 'background:radial-gradient(at ' . (isset($style['gradientActive'][6]) && !empty($style['gradientActive'][6]) ? $style['gradientActive'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($style['gradientActive'][2]) && is_numeric($style['gradientActive'][2]) ? $style['gradientActive'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($style['gradientActive'][3]) && is_numeric($style['gradientActive'][3]) ? $style['gradientActive'][3] : '100') . '%);';
					} else if (!isset($style['gradientActive'][4]) || 'radial' !== $style['gradientActive'][4]) {
						$css .= 'background:linear-gradient(' . (isset($style['gradientActive'][5]) && !empty($style['gradientActive'][5]) ? $style['gradientActive'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($style['gradientActive'][2]) && is_numeric($style['gradientActive'][2]) ? $style['gradientActive'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($style['gradientActive'][3]) && is_numeric($style['gradientActive'][3]) ? $style['gradientActive'][3] : '100') . '%);';
					}
				} else if (isset($style['backgroundActive']) && !empty($style['backgroundActive'])) {
					$alpha = (isset($style['backgroundActiveOpacity']) && is_numeric($style['backgroundActiveOpacity']) ? $style['backgroundActiveOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($style['backgroundActive'], $alpha) . ';';
				}
				$css .= '}';
			}
			if ((isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][1])) || (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][1]))) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field, .amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-select-style-field {';
				if (isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][1])) {
					$css .= 'font-size:' . $style['fontSize'][1] . (isset($style['fontSizeType']) && !empty($style['fontSizeType']) ? $style['fontSizeType'] : 'px') . ';';
				}
				if (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][1])) {
					$css .= 'line-height:' . $style['lineHeight'][1] . (isset($style['lineType']) && !empty($style['lineType']) ? $style['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ((isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][2])) || (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][2]))) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field, .amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-select-style-field {';
				if (isset($style['fontSize']) && is_array($style['fontSize']) && is_numeric($style['fontSize'][2])) {
					$css .= 'font-size:' . $style['fontSize'][2] . (isset($style['fontSizeType']) && !empty($style['fontSizeType']) ? $style['fontSizeType'] : 'px') . ';';
				}
				if (isset($style['lineHeight']) && is_array($style['lineHeight']) && is_numeric($style['lineHeight'][2])) {
					$css .= 'line-height:' . $style['lineHeight'][2] . (isset($style['lineType']) && !empty($style['lineType']) ? $style['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if (isset($style['size']) && 'custom' && $style['size'] && isset($style['deskPadding']) && is_array($style['deskPadding']) && isset($style['deskPadding'][0]) && is_numeric($style['deskPadding'][0])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field {';
				if (isset($style['deskPadding'][0]) && is_numeric($style['deskPadding'][0])) {
					$css .= 'padding-top:' . $style['deskPadding'][0] . 'px;';
				}
				if (isset($style['deskPadding'][1]) && is_numeric($style['deskPadding'][1])) {
					$css .= 'padding-right:' . $style['deskPadding'][1] . 'px;';
				}
				if (isset($style['deskPadding'][2]) && is_numeric($style['deskPadding'][2])) {
					$css .= 'padding-bottom:' . $style['deskPadding'][2] . 'px;';
				}
				if (isset($style['deskPadding'][3]) && is_numeric($style['deskPadding'][3])) {
					$css .= 'padding-left:' . $style['deskPadding'][3] . 'px;';
				}
				$css .= '}';
			}
			if (isset($style['size']) && 'custom' && $style['size'] && isset($style['tabletPadding']) && is_array($style['tabletPadding']) && isset($style['tabletPadding'][0]) && is_numeric($style['tabletPadding'][0])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field {';
				if (isset($style['tabletPadding'][0]) && is_numeric($style['tabletPadding'][0])) {
					$css .= 'padding-top:' . $style['tabletPadding'][0] . 'px;';
				}
				if (isset($style['tabletPadding'][1]) && is_numeric($style['tabletPadding'][1])) {
					$css .= 'padding-right:' . $style['tabletPadding'][1] . 'px;';
				}
				if (isset($style['tabletPadding'][2]) && is_numeric($style['tabletPadding'][2])) {
					$css .= 'padding-bottom:' . $style['tabletPadding'][2] . 'px;';
				}
				if (isset($style['tabletPadding'][3]) && is_numeric($style['tabletPadding'][3])) {
					$css .= 'padding-left:' . $style['tabletPadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
			if (isset($style['size']) && 'custom' && $style['size'] && isset($style['mobilePadding']) && is_array($style['mobilePadding']) && isset($style['mobilePadding'][0]) && is_numeric($style['mobilePadding'][0])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-text-style-field {';
				if (isset($style['mobilePadding'][0]) && is_numeric($style['mobilePadding'][0])) {
					$css .= 'padding-top:' . $style['mobilePadding'][0] . 'px;';
				}
				if (isset($style['mobilePadding'][1]) && is_numeric($style['mobilePadding'][1])) {
					$css .= 'padding-right:' . $style['mobilePadding'][1] . 'px;';
				}
				if (isset($style['mobilePadding'][2]) && is_numeric($style['mobilePadding'][2])) {
					$css .= 'padding-bottom:' . $style['mobilePadding'][2] . 'px;';
				}
				if (isset($style['mobilePadding'][3]) && is_numeric($style['mobilePadding'][3])) {
					$css .= 'padding-left:' . $style['mobilePadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['labelFont']) && is_array($attr['labelFont']) && isset($attr['labelFont'][0]) && is_array($attr['labelFont'][0])) {
			$label_font = $attr['labelFont'][0];
			$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field label {';
			if (isset($label_font['color']) && !empty($label_font['color'])) {
				$css .= 'color:' . $label_font['color'] . ';';
			}
			if (isset($label_font['size']) && is_array($label_font['size']) && is_numeric($label_font['size'][0])) {
				$css .= 'font-size:' . $label_font['size'][0] . (!isset($label_font['sizeType']) ? 'px' : $label_font['sizeType']) . ';';
			}
			if (isset($label_font['lineHeight']) && is_array($label_font['lineHeight']) && is_numeric($label_font['lineHeight'][0])) {
				$css .= 'line-height:' . $label_font['lineHeight'][0] . (!isset($label_font['lineType']) ? 'px' : $label_font['lineType']) . ';';
			}
			if (isset($label_font['letterSpacing']) && is_numeric($label_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $label_font['letterSpacing'] . 'px;';
			}
			if (isset($label_font['textTransform']) && !empty($label_font['textTransform'])) {
				$css .= 'text-transform:' . $label_font['textTransform'] . ';';
			}
			if (isset($label_font['family']) && !empty($label_font['family'])) {
				$css .= 'font-family:' . $label_font['family'] . ';';
			}
			if (isset($label_font['style']) && !empty($label_font['style'])) {
				$css .= 'font-style:' . $label_font['style'] . ';';
			}
			if (isset($label_font['weight']) && !empty($label_font['weight'])) {
				$css .= 'font-weight:' . $label_font['weight'] . ';';
			}
			if (isset($label_font['padding']) && is_array($label_font['padding']) && is_numeric($label_font['padding'][0])) {
				$css .= 'padding-top:' . $label_font['padding'][0] . 'px;';
			}
			if (isset($label_font['padding']) && is_array($label_font['padding']) && is_numeric($label_font['padding'][1])) {
				$css .= 'padding-right:' . $label_font['padding'][1] . 'px;';
			}
			if (isset($label_font['padding']) && is_array($label_font['padding']) && is_numeric($label_font['padding'][2])) {
				$css .= 'padding-bottom:' . $label_font['padding'][2] . 'px;';
			}
			if (isset($label_font['padding']) && is_array($label_font['padding']) && is_numeric($label_font['padding'][3])) {
				$css .= 'padding-left:' . $label_font['padding'][3] . 'px;';
			}
			if (isset($label_font['margin']) && is_array($label_font['margin']) && is_numeric($label_font['margin'][0])) {
				$css .= 'margin-top:' . $label_font['margin'][0] . 'px;';
			}
			if (isset($label_font['margin']) && is_array($label_font['margin']) && is_numeric($label_font['margin'][1])) {
				$css .= 'margin-right:' . $label_font['margin'][1] . 'px;';
			}
			if (isset($label_font['margin']) && is_array($label_font['margin']) && is_numeric($label_font['margin'][2])) {
				$css .= 'margin-bottom:' . $label_font['margin'][2] . 'px;';
			}
			if (isset($label_font['margin']) && is_array($label_font['margin']) && is_numeric($label_font['margin'][3])) {
				$css .= 'margin-left:' . $label_font['margin'][3] . 'px;';
			}
			$css .= '}';
			if ((isset($label_font['size']) && is_array($label_font['size']) && is_numeric($label_font['size'][1])) || (isset($label_font['lineHeight']) && is_array($label_font['lineHeight']) && is_numeric($label_font['lineHeight'][1]))) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field label {';
				if (isset($label_font['size']) && is_array($label_font['size']) && is_numeric($label_font['size'][1])) {
					$css .= 'font-size:' . $label_font['size'][1] . (isset($label_font['fontSizeType']) && !empty($label_font['fontSizeType']) ? $label_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($label_font['lineHeight']) && is_array($label_font['lineHeight']) && is_numeric($label_font['lineHeight'][1])) {
					$css .= 'line-height:' . $label_font['lineHeight'][1] . (isset($label_font['lineType']) && !empty($label_font['lineType']) ? $label_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ((isset($label_font['size']) && is_array($label_font['size']) && is_numeric($label_font['size'][2])) || (isset($label_font['lineHeight']) && is_array($label_font['lineHeight']) && is_numeric($label_font['lineHeight'][2]))) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field label {';
				if (isset($label_font['size']) && is_array($label_font['size']) && is_numeric($label_font['size'][2])) {
					$css .= 'font-size:' . $label_font['size'][2] . (isset($label_font['fontSizeType']) && !empty($label_font['fontSizeType']) ? $label_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($label_font['lineHeight']) && is_array($label_font['lineHeight']) && is_numeric($label_font['lineHeight'][2])) {
					$css .= 'line-height:' . $label_font['lineHeight'][2] . (isset($label_font['lineType']) && !empty($label_font['lineType']) ? $label_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['submit']) && is_array($attr['submit']) && isset($attr['submit'][0]) && is_array($attr['submit'][0])) {
			$submit = $attr['submit'][0];
			$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
			if (isset($submit['widthType']) && 'fixed' === $submit['widthType'] && isset($submit['fixedWidth']) && is_array($submit['fixedWidth']) && isset($submit['fixedWidth'][0]) && !empty($submit['fixedWidth'][0])) {
				$css .= 'width:' . $submit['fixedWidth'][0] . 'px;';
			}
			if (isset($submit['color']) && !empty($submit['color'])) {
				$css .= 'color:' . $submit['color'] . ';';
			}
			if (isset($submit['borderRadius']) && !empty($submit['borderRadius'])) {
				$css .= 'border-radius:' . $submit['borderRadius'] . 'px;';
			}
			if (isset($submit['borderWidth']) && is_array($submit['borderWidth']) && is_numeric($submit['borderWidth'][0])) {
				$css .= 'border-width:' . $submit['borderWidth'][0] . 'px ' . $submit['borderWidth'][1] . 'px ' . $submit['borderWidth'][2] . 'px ' . $submit['borderWidth'][3] . 'px;';
			}
			if (isset($submit['backgroundType']) && 'gradient' === $submit['backgroundType'] || isset($submit['backgroundHoverType']) && 'gradient' === $submit['backgroundHoverType']) {
				$bgtype = 'gradient';
			} else {
				$bgtype = 'solid';
			}
			if (isset($submit['backgroundType']) && 'gradient' === $submit['backgroundType']) {
				$bg1 = (!isset($submit['background']) || 'transparent' === $submit['background'] ? 'rgba(255,255,255,0)' : $this->hex2rgba($submit['background'], (isset($submit['backgroundOpacity']) && is_numeric($submit['backgroundOpacity']) ? $submit['backgroundOpacity'] : 1)));
				$bg2 = (isset($submit['gradient'][0]) && !empty($submit['gradient'][0]) ? $this->hex2rgba($submit['gradient'][0], (isset($submit['gradient'][1]) && is_numeric($submit['gradient'][1]) ? $submit['gradient'][1] : 1)) : $this->hex2rgba('#999999', (isset($submit['gradient'][1]) && is_numeric($submit['gradient'][1]) ? $submit['gradient'][1] : 1)));
				if (isset($submit['gradient'][4]) && 'radial' === $submit['gradient'][4]) {
					$css .= 'background:radial-gradient(at ' . (isset($submit['gradient'][6]) && !empty($submit['gradient'][6]) ? $submit['gradient'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($submit['gradient'][2]) && is_numeric($submit['gradient'][2]) ? $submit['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($submit['gradient'][3]) && is_numeric($submit['gradient'][3]) ? $submit['gradient'][3] : '100') . '%);';
				} else if (!isset($submit['gradient'][4]) || 'radial' !== $submit['gradient'][4]) {
					$css .= 'background:linear-gradient(' . (isset($submit['gradient'][5]) && !empty($submit['gradient'][5]) ? $submit['gradient'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($submit['gradient'][2]) && is_numeric($submit['gradient'][2]) ? $submit['gradient'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($submit['gradient'][3]) && is_numeric($submit['gradient'][3]) ? $submit['gradient'][3] : '100') . '%);';
				}
			} else if (isset($submit['background']) && !empty($submit['background'])) {
				$alpha = (isset($submit['backgroundOpacity']) && is_numeric($submit['backgroundOpacity']) ? $submit['backgroundOpacity'] : 1);
				$css .= 'background:' . $this->hex2rgba($submit['background'], $alpha) . ';';
			}
			if (isset($submit['border']) && !empty($submit['border'])) {
				$alpha = (isset($submit['borderOpacity']) && is_numeric($submit['borderOpacity']) ? $submit['borderOpacity'] : 1);
				$css .= 'border-color:' . $this->hex2rgba($submit['border'], $alpha) . ';';
			}
			if (isset($submit['boxShadow']) && is_array($submit['boxShadow']) && isset($submit['boxShadow'][0]) && true === $submit['boxShadow'][0]) {
				$css .= 'box-shadow:' . (isset($submit['boxShadow'][7]) && true === $submit['boxShadow'][7] ? 'inset ' : '') . (isset($submit['boxShadow'][3]) && is_numeric($submit['boxShadow'][3]) ? $submit['boxShadow'][3] : '1') . 'px ' . (isset($submit['boxShadow'][4]) && is_numeric($submit['boxShadow'][4]) ? $submit['boxShadow'][4] : '1') . 'px ' . (isset($submit['boxShadow'][5]) && is_numeric($submit['boxShadow'][5]) ? $submit['boxShadow'][5] : '2') . 'px ' . (isset($submit['boxShadow'][6]) && is_numeric($submit['boxShadow'][6]) ? $submit['boxShadow'][6] : '0') . 'px ' . $this->hex2rgba((isset($submit['boxShadow'][1]) && !empty($submit['boxShadow'][1]) ? $submit['boxShadow'][1] : '#000000'), (isset($submit['boxShadow'][2]) && is_numeric($submit['boxShadow'][2]) ? $submit['boxShadow'][2] : 0.2)) . ';';
			}
			$css .= '}';
			$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit:hover, .amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit:focus  {';
			if (isset($submit['colorHover']) && !empty($submit['colorHover'])) {
				$css .= 'color:' . $submit['colorHover'] . ';';
			}
			if (isset($submit['borderHover']) && !empty($submit['borderHover'])) {
				$alpha = (isset($submit['borderHoverOpacity']) && is_numeric($submit['borderHoverOpacity']) ? $submit['borderHoverOpacity'] : 1);
				$css .= 'border-color:' . $this->hex2rgba($submit['borderHover'], $alpha) . ';';
			}
			if (isset($submit['boxShadowHover']) && is_array($submit['boxShadowHover']) && isset($submit['boxShadowHover'][0]) && true === $submit['boxShadowHover'][0] && isset($submit['boxShadowHover'][7]) && true !== $submit['boxShadowHover'][7]) {
				$css .= 'box-shadow:' . (isset($submit['boxShadowHover'][7]) && true === $submit['boxShadowHover'][7] ? 'inset ' : '') . (isset($submit['boxShadowHover'][3]) && is_numeric($submit['boxShadowHover'][3]) ? $submit['boxShadowHover'][3] : '2') . 'px ' . (isset($submit['boxShadowHover'][4]) && is_numeric($submit['boxShadowHover'][4]) ? $submit['boxShadowHover'][4] : '2') . 'px ' . (isset($submit['boxShadowHover'][5]) && is_numeric($submit['boxShadowHover'][5]) ? $submit['boxShadowHover'][5] : '3') . 'px ' . (isset($submit['boxShadowHover'][6]) && is_numeric($submit['boxShadowHover'][6]) ? $submit['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($submit['boxShadowHover'][1]) && !empty($submit['boxShadowHover'][1]) ? $submit['boxShadowHover'][1] : '#000000'), (isset($submit['boxShadowHover'][2]) && is_numeric($submit['boxShadowHover'][2]) ? $submit['boxShadowHover'][2] : 0.4)) . ';';
			}
			if ('gradient' !== $bgtype) {
				if (isset($submit['backgroundHover']) && !empty($submit['backgroundHover'])) {
					$alpha = (isset($submit['backgroundHoverOpacity']) && is_numeric($submit['backgroundHoverOpacity']) ? $submit['backgroundHoverOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($submit['backgroundHover'], $alpha) . ';';
				} else {
					$alpha = (isset($submit['backgroundHoverOpacity']) && is_numeric($submit['backgroundHoverOpacity']) ? $submit['backgroundHoverOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba('#444444', $alpha) . ';';
				}
				if (isset($submit['boxShadowHover']) && is_array($submit['boxShadowHover']) && isset($submit['boxShadowHover'][0]) && true === $submit['boxShadowHover'][0] && isset($submit['boxShadowHover'][7]) && true === $submit['boxShadowHover'][7]) {
					$css .= 'box-shadow:' . (isset($submit['boxShadowHover'][7]) && true === $submit['boxShadowHover'][7] ? 'inset ' : '') . (isset($submit['boxShadowHover'][3]) && is_numeric($submit['boxShadowHover'][3]) ? $submit['boxShadowHover'][3] : '2') . 'px ' . (isset($submit['boxShadowHover'][4]) && is_numeric($submit['boxShadowHover'][4]) ? $submit['boxShadowHover'][4] : '2') . 'px ' . (isset($submit['boxShadowHover'][5]) && is_numeric($submit['boxShadowHover'][5]) ? $submit['boxShadowHover'][5] : '3') . 'px ' . (isset($submit['boxShadowHover'][6]) && is_numeric($submit['boxShadowHover'][6]) ? $submit['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($submit['boxShadowHover'][1]) && !empty($submit['boxShadowHover'][1]) ? $submit['boxShadowHover'][1] : '#000000'), (isset($submit['boxShadowHover'][2]) && is_numeric($submit['boxShadowHover'][2]) ? $submit['boxShadowHover'][2] : 0.4)) . ';';
				}
			}
			$css .= '}';
			if ('gradient' === $bgtype) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit:before {';
				if (isset($submit['backgroundHoverType']) && 'gradient' === $submit['backgroundHoverType']) {
					$bg1 = (!isset($submit['backgroundHover']) ? $this->hex2rgba('#444444', (isset($submit['backgroundHoverOpacity']) && is_numeric($submit['backgroundHoverOpacity']) ? $submit['backgroundHoverOpacity'] : 1)) : $this->hex2rgba($submit['backgroundHover'], (isset($submit['backgroundHoverOpacity']) && is_numeric($submit['backgroundHoverOpacity']) ? $submit['backgroundHoverOpacity'] : 1)));
					$bg2 = (isset($submit['gradientHover'][0]) && !empty($submit['gradientHover'][0]) ? $this->hex2rgba($submit['gradientHover'][0], (isset($submit['gradientHover'][1]) && is_numeric($submit['gradientHover'][1]) ? $submit['gradientHover'][1] : 1)) : $this->hex2rgba('#999999', (isset($submit['gradientHover'][1]) && is_numeric($submit['gradientHover'][1]) ? $submit['gradientHover'][1] : 1)));
					if (isset($submit['gradientHover'][4]) && 'radial' === $submit['gradientHover'][4]) {
						$css .= 'background:radial-gradient(at ' . (isset($submit['gradientHover'][6]) && !empty($submit['gradientHover'][6]) ? $submit['gradientHover'][6] : 'center center') . ', ' . $bg1 . ' ' . (isset($submit['gradientHover'][2]) && is_numeric($submit['gradientHover'][2]) ? $submit['gradientHover'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($submit['gradientHover'][3]) && is_numeric($submit['gradientHover'][3]) ? $submit['gradientHover'][3] : '100') . '%);';
					} else if (!isset($submit['gradientHover'][4]) || 'radial' !== $submit['gradientHover'][4]) {
						$css .= 'background:linear-gradient(' . (isset($submit['gradientHover'][5]) && !empty($submit['gradientHover'][5]) ? $submit['gradientHover'][5] : '180') . 'deg, ' . $bg1 . ' ' . (isset($submit['gradientHover'][2]) && is_numeric($submit['gradientHover'][2]) ? $submit['gradientHover'][2] : '0') . '%, ' . $bg2 . ' ' . (isset($submit['gradientHover'][3]) && is_numeric($submit['gradientHover'][3]) ? $submit['gradientHover'][3] : '100') . '%);';
					}
				} else if (isset($submit['backgroundHover']) && !empty($submit['backgroundHover'])) {
					$alpha = (isset($submit['backgroundHoverOpacity']) && is_numeric($submit['backgroundHoverOpacity']) ? $submit['backgroundHoverOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($submit['backgroundHover'], $alpha) . ';';
				}
				if (isset($submit['boxShadowHover']) && is_array($submit['boxShadowHover']) && isset($submit['boxShadowHover'][0]) && true === $submit['boxShadowHover'][0] && isset($submit['boxShadowHover'][7]) && true === $submit['boxShadowHover'][7]) {
					$css .= 'box-shadow:' . (isset($submit['boxShadowHover'][7]) && true === $submit['boxShadowHover'][7] ? 'inset ' : '') . (isset($submit['boxShadowHover'][3]) && is_numeric($submit['boxShadowHover'][3]) ? $submit['boxShadowHover'][3] : '2') . 'px ' . (isset($submit['boxShadowHover'][4]) && is_numeric($submit['boxShadowHover'][4]) ? $submit['boxShadowHover'][4] : '2') . 'px ' . (isset($submit['boxShadowHover'][5]) && is_numeric($submit['boxShadowHover'][5]) ? $submit['boxShadowHover'][5] : '3') . 'px ' . (isset($submit['boxShadowHover'][6]) && is_numeric($submit['boxShadowHover'][6]) ? $submit['boxShadowHover'][6] : '0') . 'px ' . $this->hex2rgba((isset($submit['boxShadowHover'][1]) && !empty($submit['boxShadowHover'][1]) ? $submit['boxShadowHover'][1] : '#000000'), (isset($submit['boxShadowHover'][2]) && is_numeric($submit['boxShadowHover'][2]) ? $submit['boxShadowHover'][2] : 0.4)) . ';';
					if (isset($submit['borderRadius']) && is_numeric($submit['borderRadius'])) {
						$css .= 'border-radius:' . $submit['borderRadius'] . 'px;';
					}
				}
				$css .= '}';
			}
			if (isset($submit['size']) && 'custom' && $submit['size'] && isset($submit['deskPadding']) && is_array($submit['deskPadding']) && isset($submit['deskPadding'][0]) && is_numeric($submit['deskPadding'][0])) {
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
				if (isset($submit['deskPadding'][0]) && is_numeric($submit['deskPadding'][0])) {
					$css .= 'padding-top:' . $submit['deskPadding'][0] . 'px;';
				}
				if (isset($submit['deskPadding'][1]) && is_numeric($submit['deskPadding'][1])) {
					$css .= 'padding-right:' . $submit['deskPadding'][1] . 'px;';
				}
				if (isset($submit['deskPadding'][2]) && is_numeric($submit['deskPadding'][2])) {
					$css .= 'padding-bottom:' . $submit['deskPadding'][2] . 'px;';
				}
				if (isset($submit['deskPadding'][3]) && is_numeric($submit['deskPadding'][3])) {
					$css .= 'padding-left:' . $submit['deskPadding'][3] . 'px;';
				}
				$css .= '}';
			}
			if (isset($submit['size']) && 'custom' && $submit['size'] && isset($submit['tabletPadding']) && is_array($submit['tabletPadding']) && isset($submit['tabletPadding'][0]) && is_numeric($submit['tabletPadding'][0])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
				if (isset($submit['tabletPadding'][0]) && is_numeric($submit['tabletPadding'][0])) {
					$css .= 'padding-top:' . $submit['tabletPadding'][0] . 'px;';
				}
				if (isset($submit['tabletPadding'][1]) && is_numeric($submit['tabletPadding'][1])) {
					$css .= 'padding-right:' . $submit['tabletPadding'][1] . 'px;';
				}
				if (isset($submit['tabletPadding'][2]) && is_numeric($submit['tabletPadding'][2])) {
					$css .= 'padding-bottom:' . $submit['tabletPadding'][2] . 'px;';
				}
				if (isset($submit['tabletPadding'][3]) && is_numeric($submit['tabletPadding'][3])) {
					$css .= 'padding-left:' . $submit['tabletPadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
			if (isset($submit['size']) && 'custom' && $submit['size'] && isset($submit['mobilePadding']) && is_array($submit['mobilePadding']) && isset($submit['mobilePadding'][0]) && is_numeric($submit['mobilePadding'][0])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
				if (isset($submit['mobilePadding'][0]) && is_numeric($submit['mobilePadding'][0])) {
					$css .= 'padding-top:' . $submit['mobilePadding'][0] . 'px;';
				}
				if (isset($submit['mobilePadding'][1]) && is_numeric($submit['mobilePadding'][1])) {
					$css .= 'padding-right:' . $submit['mobilePadding'][1] . 'px;';
				}
				if (isset($submit['mobilePadding'][2]) && is_numeric($submit['mobilePadding'][2])) {
					$css .= 'padding-bottom:' . $submit['mobilePadding'][2] . 'px;';
				}
				if (isset($submit['mobilePadding'][3]) && is_numeric($submit['mobilePadding'][3])) {
					$css .= 'padding-left:' . $submit['mobilePadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['submitFont']) && is_array($attr['submitFont']) && isset($attr['submitFont'][0]) && is_array($attr['submitFont'][0])) {
			$submit_font = $attr['submitFont'][0];
			$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
			if (isset($submit_font['size']) && is_array($submit_font['size']) && is_numeric($submit_font['size'][0])) {
				$css .= 'font-size:' . $submit_font['size'][0] . (!isset($submit_font['sizeType']) ? 'px' : $submit_font['sizeType']) . ';';
			}
			if (isset($submit_font['lineHeight']) && is_array($submit_font['lineHeight']) && is_numeric($submit_font['lineHeight'][0])) {
				$css .= 'line-height:' . $submit_font['lineHeight'][0] . (!isset($submit_font['lineType']) ? 'px' : $submit_font['lineType']) . ';';
			}
			if (isset($submit_font['letterSpacing']) && is_numeric($submit_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $submit_font['letterSpacing'] . 'px;';
			}
			if (isset($submit_font['textTransform']) && !empty($submit_font['textTransform'])) {
				$css .= 'text-transform:' . $submit_font['textTransform'] . ';';
			}
			if (isset($submit_font['family']) && !empty($submit_font['family'])) {
				$css .= 'font-family:' . $submit_font['family'] . ';';
			}
			if (isset($submit_font['style']) && !empty($submit_font['style'])) {
				$css .= 'font-style:' . $submit_font['style'] . ';';
			}
			if (isset($submit_font['weight']) && !empty($submit_font['weight'])) {
				$css .= 'font-weight:' . $submit_font['weight'] . ';';
			}
			$css .= '}';
			if ((isset($submit_font['size']) && is_array($submit_font['size']) && is_numeric($submit_font['size'][1])) || (isset($submit_font['lineHeight']) && is_array($submit_font['lineHeight']) && is_numeric($submit_font['lineHeight'][1]))) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
				if (isset($submit_font['size']) && is_array($submit_font['size']) && is_numeric($submit_font['size'][1])) {
					$css .= 'font-size:' . $submit_font['size'][1] . (isset($submit_font['fontSizeType']) && !empty($submit_font['fontSizeType']) ? $submit_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($submit_font['lineHeight']) && is_array($submit_font['lineHeight']) && is_numeric($submit_font['lineHeight'][1])) {
					$css .= 'line-height:' . $submit_font['lineHeight'][1] . (isset($submit_font['lineType']) && !empty($submit_font['lineType']) ? $submit_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ((isset($submit_font['size']) && is_array($submit_font['size']) && is_numeric($submit_font['size'][2])) || (isset($submit_font['lineHeight']) && is_array($submit_font['lineHeight']) && is_numeric($submit_font['lineHeight'][2]))) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-pre-form .amp-blocks-form-field .amp-pre-forms-submit {';
				if (isset($submit_font['size']) && is_array($submit_font['size']) && is_numeric($submit_font['size'][2])) {
					$css .= 'font-size:' . $submit_font['size'][2] . (isset($submit_font['fontSizeType']) && !empty($submit_font['fontSizeType']) ? $submit_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($submit_font['lineHeight']) && is_array($submit_font['lineHeight']) && is_numeric($submit_font['lineHeight'][2])) {
					$css .= 'line-height:' . $submit_font['lineHeight'][2] . (isset($submit_font['lineType']) && !empty($submit_font['lineType']) ? $submit_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['messageFont']) && is_array($attr['messageFont']) && isset($attr['messageFont'][0]) && is_array($attr['messageFont'][0])) {
			$message_font = $attr['messageFont'][0];
			if ((isset($message_font['colorSuccess']) && !empty($message_font['colorSuccess'])) || (isset($message_font['backgroundSuccess']) && !empty($message_font['backgroundSuccess'])) || (isset($message_font['backgroundSuccess']) && !empty($message_font['backgroundSuccess']))) {
				$css .= '.amp-form-' . $unique_id . ' .amp-blocks-form-success {';
				if (isset($message_font['colorSuccess']) && !empty($message_font['colorSuccess'])) {
					$css .= 'color:' . $message_font['colorSuccess'] . ';';
				}
				if (isset($message_font['borderSuccess']) && !empty($message_font['borderSuccess'])) {
					$css .= 'border-color:' . $message_font['borderSuccess'] . ';';
				}
				if (isset($message_font['backgroundSuccess']) && !empty($message_font['backgroundSuccess'])) {
					$alpha = (isset($message_font['backgroundSuccessOpacity']) && is_numeric($message_font['backgroundSuccessOpacity']) ? $message_font['backgroundSuccessOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($message_font['backgroundSuccess'], $alpha) . ';';
				}
				$css .= '}';
			}
			if ((isset($message_font['colorError']) && !empty($message_font['colorError'])) || (isset($message_font['backgroundError']) && !empty($message_font['backgroundError'])) || (isset($message_font['backgroundError']) && !empty($message_font['backgroundError']))) {
				$css .= '.amp-form-' . $unique_id . ' .amp-blocks-form-warning {';
				if (isset($message_font['colorError']) && !empty($message_font['colorError'])) {
					$css .= 'color:' . $message_font['colorError'] . ';';
				}
				if (isset($message_font['borderError']) && !empty($message_font['borderError'])) {
					$css .= 'border-color:' . $message_font['borderError'] . ';';
				}
				if (isset($message_font['backgroundError']) && !empty($message_font['backgroundError'])) {
					$alpha = (isset($message_font['backgroundErrorOpacity']) && is_numeric($message_font['backgroundErrorOpacity']) ? $message_font['backgroundErrorOpacity'] : 1);
					$css .= 'background:' . $this->hex2rgba($message_font['backgroundError'], $alpha) . ';';
				}
				$css .= '}';
			}
			$css .= '.amp-form-' . $unique_id . ' .amp-blocks-form-message {';
			if (isset($message_font['borderRadius']) && !empty($message_font['borderRadius'])) {
				$css .= 'border-radius:' . $message_font['borderRadius'] . 'px;';
			}
			if (isset($message_font['borderWidth']) && is_array($message_font['borderWidth']) && is_numeric($message_font['borderWidth'][0])) {
				$css .= 'border-width:' . $message_font['borderWidth'][0] . 'px ' . $message_font['borderWidth'][1] . 'px ' . $message_font['borderWidth'][2] . 'px ' . $message_font['borderWidth'][3] . 'px;';
			}
			if (isset($message_font['size']) && is_array($message_font['size']) && is_numeric($message_font['size'][0])) {
				$css .= 'font-size:' . $message_font['size'][0] . (!isset($message_font['sizeType']) ? 'px' : $message_font['sizeType']) . ';';
			}
			if (isset($message_font['lineHeight']) && is_array($message_font['lineHeight']) && is_numeric($message_font['lineHeight'][0])) {
				$css .= 'line-height:' . $message_font['lineHeight'][0] . (!isset($message_font['lineType']) ? 'px' : $message_font['lineType']) . ';';
			}
			if (isset($message_font['letterSpacing']) && is_numeric($message_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $message_font['letterSpacing'] . 'px;';
			}
			if (isset($message_font['textTransform']) && !empty($message_font['textTransform'])) {
				$css .= 'text-transform:' . $message_font['textTransform'] . ';';
			}
			if (isset($message_font['family']) && !empty($message_font['family'])) {
				$css .= 'font-family:' . $message_font['family'] . ';';
			}
			if (isset($message_font['style']) && !empty($message_font['style'])) {
				$css .= 'font-style:' . $message_font['style'] . ';';
			}
			if (isset($message_font['weight']) && !empty($message_font['weight'])) {
				$css .= 'font-weight:' . $message_font['weight'] . ';';
			}
			if (isset($message_font['padding']) && is_array($message_font['padding']) && is_numeric($message_font['padding'][0])) {
				$css .= 'padding-top:' . $message_font['padding'][0] . 'px;';
			}
			if (isset($message_font['padding']) && is_array($message_font['padding']) && is_numeric($message_font['padding'][1])) {
				$css .= 'padding-right:' . $message_font['padding'][1] . 'px;';
			}
			if (isset($message_font['padding']) && is_array($message_font['padding']) && is_numeric($message_font['padding'][2])) {
				$css .= 'padding-bottom:' . $message_font['padding'][2] . 'px;';
			}
			if (isset($message_font['padding']) && is_array($message_font['padding']) && is_numeric($message_font['padding'][3])) {
				$css .= 'padding-left:' . $message_font['padding'][3] . 'px;';
			}
			if (isset($message_font['margin']) && is_array($message_font['margin']) && is_numeric($message_font['margin'][0])) {
				$css .= 'margin-top:' . $message_font['margin'][0] . 'px;';
			}
			if (isset($message_font['margin']) && is_array($message_font['margin']) && is_numeric($message_font['margin'][1])) {
				$css .= 'margin-right:' . $message_font['margin'][1] . 'px;';
			}
			if (isset($message_font['margin']) && is_array($message_font['margin']) && is_numeric($message_font['margin'][2])) {
				$css .= 'margin-bottom:' . $message_font['margin'][2] . 'px;';
			}
			if (isset($message_font['margin']) && is_array($message_font['margin']) && is_numeric($message_font['margin'][3])) {
				$css .= 'margin-left:' . $message_font['margin'][3] . 'px;';
			}
			$css .= '}';
			if ((isset($message_font['size']) && is_array($message_font['size']) && is_numeric($message_font['size'][1])) || (isset($message_font['lineHeight']) && is_array($message_font['lineHeight']) && is_numeric($message_font['lineHeight'][1]))) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-blocks-form-message {';
				if (isset($message_font['size']) && is_array($message_font['size']) && is_numeric($message_font['size'][1])) {
					$css .= 'font-size:' . $message_font['size'][1] . (isset($message_font['fontSizeType']) && !empty($message_font['fontSizeType']) ? $message_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($message_font['lineHeight']) && is_array($message_font['lineHeight']) && is_numeric($message_font['lineHeight'][1])) {
					$css .= 'line-height:' . $message_font['lineHeight'][1] . (isset($message_font['lineType']) && !empty($message_font['lineType']) ? $message_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ((isset($message_font['size']) && is_array($message_font['size']) && is_numeric($message_font['size'][2])) || (isset($message_font['lineHeight']) && is_array($message_font['lineHeight']) && is_numeric($message_font['lineHeight'][2]))) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-form-' . $unique_id . ' .amp-blocks-form-message {';
				if (isset($message_font['size']) && is_array($message_font['size']) && is_numeric($message_font['size'][2])) {
					$css .= 'font-size:' . $message_font['size'][2] . (isset($message_font['fontSizeType']) && !empty($message_font['fontSizeType']) ? $message_font['fontSizeType'] : 'px') . ';';
				}
				if (isset($message_font['lineHeight']) && is_array($message_font['lineHeight']) && is_numeric($message_font['lineHeight'][2])) {
					$css .= 'line-height:' . $message_font['lineHeight'][2] . (isset($message_font['lineType']) && !empty($message_font['lineType']) ? $message_font['lineType'] : 'px') . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}

		return $css;
	}

	/**
	 * Builds CSS for Gallery block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advancedgallery_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['gutter']) && is_array($attr['gutter']) && isset($attr['gutter'][0]) && is_numeric($attr['gutter'][0])) {
			$css .= 'ul.amp-pre-gallery-id-' . $unique_id . ' {';
			$css .= 'margin: -' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item {';
			$css .= 'padding:' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-pre-gallery-type-carousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init {';
			$css .= 'margin: 0 -' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-pre-gallery-type-carousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init .amp-pre-slide-item, .amp-pre-gallery-type-fluidcarousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init .amp-pre-slide-item, .amp-blocks-carousel-init:not(.slick-initialized) .amp-pre-slide-item {';
			$css .= 'padding: 4px ' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-pre-gallery-type-fluidcarousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init.amp-pre-carousel-mode-align-left .amp-pre-slide-item {';
			$css .= 'padding: 4px ' . ($attr['gutter'][0]) . 'px 4px 0;';
			$css .= '}';
			$css .= '.amp-pre-gallery-type-carousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init .slick-prev {';
			$css .= 'left:' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
			$css .= '.amp-pre-gallery-type-carousel.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-carousel .amp-blocks-carousel-init .slick-next {';
			$css .= 'right:' . ($attr['gutter'][0] / 2) . 'px;';
			$css .= '}';
		}
		if (isset($attr['type']) && 'fluidcarousel' === $attr['type'] && isset($attr['carouselHeight']) && is_array($attr['carouselHeight'])) {
			if (isset($attr['carouselHeight'][0]) && is_numeric($attr['carouselHeight'][0])) {
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][0] . 'px;';
				$css .= '}';
			}
			if (isset($attr['carouselHeight'][1]) && is_numeric($attr['carouselHeight'][1])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['carouselHeight'][2]) && is_numeric($attr['carouselHeight'][2])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-fluidcarousel .amp-blocks-carousel figure .amp-pre-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['type']) && 'tiles' === $attr['type'] && isset($attr['carouselHeight']) && is_array($attr['carouselHeight'])) {
			if (isset($attr['carouselHeight'][0]) && is_numeric($attr['carouselHeight'][0])) {
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles .amp-blocks-gallery-item .amp-blocks-gallery-item-inner img, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles > .amp-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][0] . 'px;';
				$css .= '}';
			}
			if (isset($attr['carouselHeight'][1]) && is_numeric($attr['carouselHeight'][1])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles .amp-blocks-gallery-item .amp-blocks-gallery-item-inner img, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles > .amp-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($attr['carouselHeight'][2]) && is_numeric($attr['carouselHeight'][2])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles .amp-blocks-gallery-item .amp-blocks-gallery-item-inner img, .amp-pre-gallery-id-' . $unique_id . '.amp-pre-gallery-ul.amp-pre-gallery-type-tiles > .amp-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['margin']) && is_array($attr['margin']) && is_array($attr['margin'][0])) {
			$margin = $attr['margin'][0];
			if (isset($margin['desk']) && is_array($margin['desk']) && is_numeric($margin['desk'][0])) {
				$css .= '.wp-block-amp-advancedgallery.amp-pre-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['desk'][0] . 'px ' . $margin['desk'][1] . 'px ' . $margin['desk'][2] . 'px ' . $margin['desk'][3] . 'px;';
				$css .= '}';
			}
			if (isset($margin['tablet']) && is_array($margin['tablet']) && is_numeric($margin['tablet'][0])) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-amp-advancedgallery.amp-pre-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['tablet'][0] . 'px ' . $margin['tablet'][1] . 'px ' . $margin['tablet'][2] . 'px ' . $margin['tablet'][3] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if (isset($margin['mobile']) && is_array($margin['mobile']) && is_numeric($margin['mobile'][0])) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-amp-advancedgallery.amp-pre-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['mobile'][0] . 'px ' . $margin['mobile'][1] . 'px ' . $margin['mobile'][2] . 'px ' . $margin['mobile'][3] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if (isset($attr['imageRadius']) && is_array($attr['imageRadius']) && isset($attr['imageRadius'][0]) && is_numeric($attr['imageRadius'][0])) {
			$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-pre-gal-image-radius {';
			$css .= 'border-radius: ' . $attr['imageRadius'][0] . 'px ' . (is_numeric($attr['imageRadius'][1]) ? $attr['imageRadius'][1] : 0) . 'px ' . (is_numeric($attr['imageRadius'][2]) ? $attr['imageRadius'][2] : 0) . 'px ' . (is_numeric($attr['imageRadius'][3]) ? $attr['imageRadius'][3] : 0) . 'px;';
			$css .= '}';
		}
		if (isset($attr['displayShadow']) && !empty($attr['displayShadow']) && true === $attr['displayShadow']) {
			if (isset($attr['shadow']) && is_array($attr['shadow']) && is_array($attr['shadow'][0])) {
				$shadow = $attr['shadow'][0];
				$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-pre-gal-image-radius {';
				$css .= 'box-shadow:' . $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $this->hex2rgba($shadow['color'], $shadow['opacity']) . ';';
				$css .= '}';
			}
			if (isset($attr['shadowHover']) && is_array($attr['shadowHover']) && is_array($attr['shadowHover'][0])) {
				$shadow_hover = $attr['shadowHover'][0];
				$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item:hover .amp-pre-gal-image-radius {';
				$css .= 'box-shadow:' . $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $this->hex2rgba($shadow_hover['color'], $shadow_hover['opacity']) . ';';
				$css .= '}';
			} else {
				$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item:hover .amp-pre-gal-image-radius {';
				$css .= 'box-shadow:4px 2px 14px 0px rgba(0,0,0,0.2);';
				$css .= '}';
			}
		}
		if (isset($attr['showCaption']) && true === $attr['showCaption'] && isset($attr['captionStyles']) && is_array($attr['captionStyles']) && is_array($attr['captionStyles'][0])) {
			$caption_font = $attr['captionStyles'][0];
			$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-blocks-gallery-item-inner .amp-blocks-gallery-item__caption {';
			if (isset($caption_font['color']) && !empty($caption_font['color'])) {
				$css .= 'color:' . $caption_font['color'] . ';';
			}
			if (isset($caption_font['background']) && !empty($caption_font['background'])) {
				$css .= 'background:linear-gradient( 0deg, ' . $this->hex2rgba($caption_font['background'], (isset($caption_font['backgroundOpacity']) && is_numeric($caption_font['backgroundOpacity'])) ? $caption_font['backgroundOpacity'] : '0.5') . ' 0, ' . $this->hex2rgba($caption_font['background'], 0) . ' 100% );';
			}
			if (isset($caption_font['size']) && is_array($caption_font['size']) && !empty($caption_font['size'][0])) {
				$css .= 'font-size:' . $caption_font['size'][0] . (!isset($caption_font['sizeType']) ? 'px' : $caption_font['sizeType']) . ';';
			}
			if (isset($caption_font['lineHeight']) && is_array($caption_font['lineHeight']) && !empty($caption_font['lineHeight'][0])) {
				$css .= 'line-height:' . $caption_font['lineHeight'][0] . (!isset($caption_font['lineType']) ? 'px' : $caption_font['lineType']) . ';';
			}
			if (isset($caption_font['letterSpacing']) && !empty($caption_font['letterSpacing'])) {
				$css .= 'letter-spacing:' . $caption_font['letterSpacing'] . 'px;';
			}
			if (isset($caption_font['textTransform']) && !empty($caption_font['textTransform'])) {
				$css .= 'text-transform:' . $caption_font['textTransform'] . ';';
			}
			if (isset($caption_font['family']) && !empty($caption_font['family'])) {
				$css .= 'font-family:' . $caption_font['family'] . ';';
			}
			if (isset($caption_font['style']) && !empty($caption_font['style'])) {
				$css .= 'font-style:' . $caption_font['style'] . ';';
			}
			if (isset($caption_font['weight']) && !empty($caption_font['weight'])) {
				$css .= 'font-weight:' . $caption_font['weight'] . ';';
			}
			$css .= '}';
			if (isset($caption_font['background']) && !empty($caption_font['background'])) {
				$css .= '.amp-pre-gallery-caption-style-cover-hover.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-blocks-gallery-item-inner .amp-blocks-gallery-item__caption, .amp-pre-gallery-caption-style-below.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-blocks-gallery-item-inner .amp-blocks-gallery-item__caption {';
				$css .= 'background:' . $this->hex2rgba($caption_font['background'], (isset($caption_font['backgroundOpacity']) && is_numeric($caption_font['backgroundOpacity'])) ? $caption_font['backgroundOpacity'] : '0.5') . ';';
				$css .= '}';
			}
		}
		if (isset($attr['showCaption']) && true === $attr['showCaption'] && isset($attr['captionStyles']) && is_array($attr['captionStyles']) && isset($attr['captionStyles'][0]) && is_array($attr['captionStyles'][0]) && ((isset($attr['captionStyles'][0]['size']) && is_array($attr['captionStyles'][0]['size']) && isset($attr['captionStyles'][0]['size'][1]) && !empty($attr['captionStyles'][0]['size'][1])) || (isset($attr['captionStyles'][0]['lineHeight']) && is_array($attr['captionStyles'][0]['lineHeight']) && isset($attr['captionStyles'][0]['lineHeight'][1]) && !empty($attr['captionStyles'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-blocks-gallery-item__caption {';
			if (isset($attr['captionStyles'][0]['size'][1]) && !empty($attr['captionStyles'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['captionStyles'][0]['size'][1] . (!isset($attr['captionStyles'][0]['sizeType']) ? 'px' : $attr['captionStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['captionStyles'][0]['lineHeight'][1]) && !empty($attr['captionStyles'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['captionStyles'][0]['lineHeight'][1] . (!isset($attr['captionStyles'][0]['lineType']) ? 'px' : $attr['captionStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['showCaption']) && true === $attr['showCaption'] && isset($attr['captionStyles']) && is_array($attr['captionStyles']) && isset($attr['captionStyles'][0]) && is_array($attr['captionStyles'][0]) && ((isset($attr['captionStyles'][0]['size']) && is_array($attr['captionStyles'][0]['size']) && isset($attr['captionStyles'][0]['size'][2]) && !empty($attr['captionStyles'][0]['size'][2])) || (isset($attr['captionStyles'][0]['lineHeight']) && is_array($attr['captionStyles'][0]['lineHeight']) && isset($attr['captionStyles'][0]['lineHeight'][2]) && !empty($attr['captionStyles'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-pre-gallery-id-' . $unique_id . ' .amp-blocks-gallery-item .amp-blocks-gallery-item__caption {';
			if (isset($attr['captionStyles'][0]['size'][2]) && !empty($attr['captionStyles'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['captionStyles'][0]['size'][2] . (!isset($attr['captionStyles'][0]['sizeType']) ? 'px' : $attr['captionStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['captionStyles'][0]['lineHeight'][2]) && !empty($attr['captionStyles'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['captionStyles'][0]['lineHeight'][2] . (!isset($attr['captionStyles'][0]['lineType']) ? 'px' : $attr['captionStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}

		return $css;
	}

	/**
	 * Builds CSS for Icon List block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_iconlist_array($attr, $unique_id)
	{
		$css = '';
		if (isset($attr['listMargin']) && is_array($attr['listMargin']) && isset($attr['listMargin'][0])) {
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list {';
			$css .= 'margin:' . $attr['listMargin'][0] . 'px ' . $attr['listMargin'][1] . 'px ' . $attr['listMargin'][2] . 'px ' . $attr['listMargin'][3] . 'px;';
			$css .= '}';
		}
		if (isset($attr['listGap']) && !empty($attr['listGap'])) {
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap:not(:last-child) {';
			$css .= 'margin-bottom:' . $attr['listGap'] . 'px;';
			$css .= '}';
		}
		if (isset($attr['listLabelGap']) && !empty($attr['listLabelGap'])) {
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap .amp-svg-icon-list-single {';
			$css .= 'margin-right:' . $attr['listLabelGap'] . 'px;';
			$css .= '}';
		}
		if (isset($attr['listStyles']) && is_array($attr['listStyles']) && is_array($attr['listStyles'][0])) {
			$list_styles = $attr['listStyles'][0];
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap, .amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap a {';
			if (isset($list_styles['color']) && !empty($list_styles['color'])) {
				$css .= 'color:' . $list_styles['color'] . ';';
			}
			if (isset($list_styles['size']) && is_array($list_styles['size']) && !empty($list_styles['size'][0])) {
				$css .= 'font-size:' . $list_styles['size'][0] . (!isset($list_styles['sizeType']) ? 'px' : $list_styles['sizeType']) . ';';
			}
			if (isset($list_styles['lineHeight']) && is_array($list_styles['lineHeight']) && !empty($list_styles['lineHeight'][0])) {
				$css .= 'line-height:' . $list_styles['lineHeight'][0] . (!isset($list_styles['lineType']) ? 'px' : $list_styles['lineType']) . ';';
			}
			if (isset($list_styles['letterSpacing']) && !empty($list_styles['letterSpacing'])) {
				$css .= 'letter-spacing:' . $list_styles['letterSpacing'] . 'px;';
			}
			if (isset($list_styles['textTransform']) && !empty($list_styles['textTransform'])) {
				$css .= 'text-transform:' . $list_styles['textTransform'] . ';';
			}
			if (isset($list_styles['family']) && !empty($list_styles['family'])) {
				$css .= 'font-family:' . $list_styles['family'] . ';';
			}
			if (isset($list_styles['style']) && !empty($list_styles['style'])) {
				$css .= 'font-style:' . $list_styles['style'] . ';';
			}
			if (isset($list_styles['weight']) && !empty($list_styles['weight'])) {
				$css .= 'font-weight:' . $list_styles['weight'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['listStyles']) && is_array($attr['listStyles']) && isset($attr['listStyles'][0]) && is_array($attr['listStyles'][0]) && ((isset($attr['listStyles'][0]['size']) && is_array($attr['listStyles'][0]['size']) && isset($attr['listStyles'][0]['size'][1]) && !empty($attr['listStyles'][0]['size'][1])) || (isset($attr['listStyles'][0]['lineHeight']) && is_array($attr['listStyles'][0]['lineHeight']) && isset($attr['listStyles'][0]['lineHeight'][1]) && !empty($attr['listStyles'][0]['lineHeight'][1])))) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap {';
			if (isset($attr['listStyles'][0]['size'][1]) && !empty($attr['listStyles'][0]['size'][1])) {
				$css .= 'font-size:' . $attr['listStyles'][0]['size'][1] . (!isset($attr['listStyles'][0]['sizeType']) ? 'px' : $attr['listStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['listStyles'][0]['lineHeight'][1]) && !empty($attr['listStyles'][0]['lineHeight'][1])) {
				$css .= 'line-height:' . $attr['listStyles'][0]['lineHeight'][1] . (!isset($attr['listStyles'][0]['lineType']) ? 'px' : $attr['listStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if (isset($attr['listStyles']) && is_array($attr['listStyles']) && isset($attr['listStyles'][0]) && is_array($attr['listStyles'][0]) && ((isset($attr['listStyles'][0]['size']) && is_array($attr['listStyles'][0]['size']) && isset($attr['listStyles'][0]['size'][2]) && !empty($attr['listStyles'][0]['size'][2])) || (isset($attr['listStyles'][0]['lineHeight']) && is_array($attr['listStyles'][0]['lineHeight']) && isset($attr['listStyles'][0]['lineHeight'][2]) && !empty($attr['listStyles'][0]['lineHeight'][2])))) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.amp-svg-icon-list-items' . $unique_id . ' ul.amp-svg-icon-list .amp-svg-icon-list-item-wrap {';
			if (isset($attr['listStyles'][0]['size'][2]) && !empty($attr['listStyles'][0]['size'][2])) {
				$css .= 'font-size:' . $attr['listStyles'][0]['size'][2] . (!isset($attr['listStyles'][0]['sizeType']) ? 'px' : $attr['listStyles'][0]['sizeType']) . ';';
			}
			if (isset($attr['listStyles'][0]['lineHeight'][2]) && !empty($attr['listStyles'][0]['lineHeight'][2])) {
				$css .= 'line-height:' . $attr['listStyles'][0]['lineHeight'][2] . (!isset($attr['listStyles'][0]['lineType']) ? 'px' : $attr['listStyles'][0]['lineType']) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 *
	 * Register and Enqueue block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets()
	{
		// If in the backend, bail out.
		if (is_admin()) {
			return;
		}
		// Lets register all the block styles.
		wp_register_style('amp-blocks-btn', AMP_BLOCKS_DIR_URI . 'dist/blocks/btn.style.build.css', array(), AMP_BLOCKS_VERSION);
		wp_register_style('amp-blocks-rowlayout', AMP_BLOCKS_DIR_URI . 'dist/blocks/row.style.build.css', array(), AMP_BLOCKS_VERSION);
		wp_register_style('amp-blocks-image', AMP_BLOCKS_DIR_URI . 'dist/blocks/image.style.build.css', array(), AMP_BLOCKS_VERSION);
		wp_register_style('amp-blocks-common', AMP_BLOCKS_DIR_URI . 'dist/blocks/common.style.build.css', array(), AMP_BLOCKS_VERSION);
		wp_enqueue_style('amp-blocks-common');
		wp_register_style( 'amp-blocks-form', AMP_BLOCKS_DIR_URI . 'dist/blocks/form.style.build.css', array(), AMP_BLOCKS_VERSION );
		wp_register_script( 'amp-blocks-form', AMP_BLOCKS_DIR_URI . 'dist/assets/js/amp-form.js', array( 'jquery' ), AMP_BLOCKS_VERSION, true );
		// wp_enqueue_style('amp-blocks-common', AMP_BLOCKS_DIR_URI . 'dist/blocks/common.style.build.css', array(), AMP_BLOCKS_VERSION);
		wp_localize_script(
			'amp-blocks-form',
			'amp_blocks_form_params',
			array(
				'ajaxurl'       => admin_url( 'admin-ajax.php' ),
				'error_message' => __( 'Please fix the errors to proceed', 'amp-blocks' ),
				'nonce'         => wp_create_nonce( 'amp_form_nonce' ),
				'required'      => __( 'is required', 'amp-blocks' ),
				'mismatch'      => __( 'does not match', 'amp-blocks' ),
				'validation'    => __( 'is not valid', 'amp-blocks' ),
				'duplicate'     => __( 'requires a unique entry and this value has already been used', 'amp-blocks' ),
				'item'          => __( 'Item', 'amp-blocks' ),
			)
		);
	}


	/**
	 * Outputs extra css for blocks.
	 */
	public function frontend_inline_css()
	{
		if (self::$ampcheck == 'amp') {
			echo file_get_contents(AMP_BLOCKS_DIR_URI . 'dist/blocks/row.style.build.css');
			echo file_get_contents(AMP_BLOCKS_DIR_URI . 'dist/blocks/btn.style.build.css');
			echo file_get_contents(AMP_BLOCKS_DIR_URI . 'dist/blocks/image.style.build.css');
			echo file_get_contents(AMP_BLOCKS_DIR_URI . 'dist/blocks/common.style.build.css');
			echo file_get_contents(AMP_BLOCKS_DIR_URI . 'dist/blocks/form.style.build.css');
		}
		if (function_exists('has_blocks') && has_blocks(get_the_ID())) {
			global $post;
			if (!is_object($post)) {
				return;
			}
			$blocks = $this->amp_parse_blocks($post->post_content);
			// print_r( $blocks );
			if (!is_array($blocks) || empty($blocks)) {
				return;
			}
			foreach ($blocks as $indexkey => $block) {
				if (!is_object($block) && is_array($block) && isset($block['blockName'])) {
					if ('amp/rowlayout' === $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							$this->render_row_layout_css_head($blockattr);
							$this->render_row_layout_scripts($blockattr);
						}
					}
					if ('amp/column' === $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							$this->render_column_layout_css_head($blockattr);
						}
					}
					if ('amp/advancedheading' === $block['blockName'] || 'ampblocks/heading' === $block['blockName'] || 'ampblocks/icon-list' == $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							$this->render_advanced_heading_css_head($blockattr);
							$this->blocks_advanced_heading_gfont($blockattr);
						}
					}
					if ('amp/advancedbtn' === $block['blockName'] || 'amp/buttongroup' === $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							$this->render_advanced_btn_css_head($blockattr);
							$this->blocks_advanced_btn_gfont($blockattr);
						}
					}
					if ('amp/icon' === $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							$this->render_icon_css_head($blockattr);
						}
					}
					if ( 'ampblocks/form' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->blocks_form_scripts_check( $blockattr );
							$this->render_form_css_head( $blockattr );
						}
					}
					if ('core/block' === $block['blockName']) {
						if (isset($block['attrs']) && is_array($block['attrs'])) {
							$blockattr = $block['attrs'];
							if (isset($blockattr['ref'])) {
								$reusable_block = get_post($blockattr['ref']);
								if ($reusable_block && 'wp_block' == $reusable_block->post_type) {
									$reuse_data_block = $this->amp_parse_blocks($reusable_block->post_content);
									$this->blocks_cycle_through($reuse_data_block);
								}
							}
						}
					}
					if (isset($block['innerBlocks']) && !empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
						$this->blocks_cycle_through($block['innerBlocks']);
					}
				}
			}
		}
	}

	/**
	 * Gets the parsed blocks, need to use this becuase wordpress 5 doesn't seem to include gutenberg_parse_blocks
	 *
	 * @param string $content string of page/post content.
	 */
	public function amp_parse_blocks($content)
	{
		$parser_class = apply_filters('block_parser_class', 'WP_Block_Parser');
		if (class_exists($parser_class)) {
			$parser = new $parser_class();
			return $parser->parse($content);
		} elseif (function_exists('gutenberg_parse_blocks')) {
			return gutenberg_parse_blocks($content);
		} else {
			return false;
		}
	}

	/**
	 * Render Row Block CSS In Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_row_layout_css_head($attributes)
	{
		if (!wp_style_is('amp-blocks-rowlayout', 'enqueued')) {
			wp_enqueue_style('amp-blocks-rowlayout');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'rowlayout', $unique_id)) {
				$css = $this->row_layout_array_css($attributes, $unique_id);
				if (!empty($css)) {
					$css = apply_filters('as3cf_filter_post_local_to_provider', $css);
					$this->render_inline_css($css, $style_id);
				}
			}
		}
	}

	/**
	 * Render Column Block CSS Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_column_layout_css_head($attributes)
	{
		if (isset($attributes['uniqueID']) && !empty($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'column', $unique_id)) {
				$css = $this->column_layout_css($attributes, $unique_id);
				if (!empty($css)) {
					$css = apply_filters('as3cf_filter_post_local_to_provider', $css);
					$this->render_inline_css($css, $style_id);
				}
			}
		}
	}

	/**
	 * Render Advanced Heading Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_advanced_heading_css_head($attributes)
	{
		if (!wp_style_is('amp-blocks-heading', 'enqueued')) {
			wp_enqueue_style('amp-blocks-heading');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'advancedheading', $unique_id)) {
				$css = $this->blocks_advanced_heading_array($attributes, $unique_id);
				if (!empty($css)) {
					$this->render_inline_css($css, $style_id);
				}
			}
		}
	}

	/**
	 * Adds Google fonts for Advanced Heading block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_advanced_heading_gfont($attr)
	{
		if (isset($attr['googleFont']) && $attr['googleFont'] && (!isset($attr['loadGoogleFont']) || true == $attr['loadGoogleFont']) && isset($attr['typography'])) {
			// Check if the font has been added yet.
			if (!array_key_exists($attr['typography'], self::$gfonts)) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => (isset($attr['fontVariant']) && !empty($attr['fontVariant']) ? array($attr['fontVariant']) : array()),
					'fontsubsets' => (isset($attr['fontSubset']) && !empty($attr['fontSubset']) ? array($attr['fontSubset']) : array()),
				);
				self::$gfonts[$attr['typography']] = $add_font;
			} else {
				if (isset($attr['fontVariant']) && !empty($attr['fontVariant'])) {
					if (!in_array($attr['fontVariant'], self::$gfonts[$attr['typography']]['fontvariants'], true)) {
						array_push(self::$gfonts[$attr['typography']]['fontvariants'], $attr['fontVariant']);
					}
				}
				if (isset($attr['fontSubset']) && !empty($attr['fontSubset'])) {
					if (!in_array($attr['fontSubset'], self::$gfonts[$attr['typography']]['fontsubsets'], true)) {
						array_push(self::$gfonts[$attr['typography']]['fontsubsets'], $attr['fontSubset']);
					}
				}
			}
		}
		if (isset($attr['markGoogleFont']) && $attr['markGoogleFont'] && (!isset($attr['markLoadGoogleFont']) || true == $attr['markLoadGoogleFont']) && isset($attr['markTypography'])) {
			// Check if the font has been added yet.
			if (!array_key_exists($attr['markTypography'], self::$gfonts)) {
				$add_font = array(
					'fontfamily' => $attr['markTypography'],
					'fontvariants' => (isset($attr['markFontVariant']) && !empty($attr['markFontVariant']) ? array($attr['markFontVariant']) : array()),
					'fontsubsets' => (isset($attr['markFontSubset']) && !empty($attr['markFontSubset']) ? array($attr['markFontSubset']) : array()),
				);
				self::$gfonts[$attr['markTypography']] = $add_font;
			} else {
				if (isset($attr['markFontVariant']) && !empty($attr['markFontVariant'])) {
					if (!in_array($attr['markFontVariant'], self::$gfonts[$attr['markTypography']]['fontvariants'], true)) {
						array_push(self::$gfonts[$attr['markTypography']]['fontvariants'], $attr['markFontVariant']);
					}
				}
				if (isset($attr['markFontSubset']) && !empty($attr['markFontSubset'])) {
					if (!in_array($attr['markFontSubset'], self::$gfonts[$attr['markTypography']]['fontsubsets'], true)) {
						array_push(self::$gfonts[$attr['markTypography']]['fontsubsets'], $attr['markFontSubset']);
					}
				}
			}
		}
	}

	/**
	 * Render Advanced Btn Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_advanced_btn_css_head($attributes)
	{
		if (!wp_style_is('amp-blocks-btn', 'enqueued')) {
			wp_enqueue_style('amp-blocks-btn');
		}
		if (isset($attributes['uniqueID'])) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr($unique_id);
			if (!wp_style_is($style_id, 'enqueued') && apply_filters('amp_blocks_render_inline_css', true, 'advancedbtn', $unique_id)) {
				$css = $this->blocks_advanced_btn_array($attributes, $unique_id);
				if (!empty($css)) {
					$this->render_inline_css($css, $style_id);
				}
			}
		}
	}

	/**
	 * Builds CSS for Advanced Button block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_advanced_btn_gfont($attr)
	{
		if (isset($attr['googleFont']) && $attr['googleFont'] && (!isset($attr['loadGoogleFont']) || true == $attr['loadGoogleFont']) && isset($attr['typography'])) {
			// Check if the font has been added yet.
			if (!array_key_exists($attr['typography'], self::$gfonts)) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => (isset($attr['fontVariant']) && !empty($attr['fontVariant']) ? array($attr['fontVariant']) : array()),
					'fontsubsets' => (isset($attr['fontSubset']) && !empty($attr['fontSubset']) ? array($attr['fontSubset']) : array()),
				);
				self::$gfonts[$attr['typography']] = $add_font;
			} else {
				if (isset($attr['fontVariant']) && !empty($attr['fontVariant'])) {
					if (!in_array($attr['fontVariant'], self::$gfonts[$attr['typography']]['fontvariants'], true)) {
						array_push(self::$gfonts[$attr['typography']]['fontvariants'], $attr['fontVariant']);
					}
				}
				if (isset($attr['fontSubset']) && !empty($attr['fontSubset'])) {
					if (!in_array($attr['fontSubset'], self::$gfonts[$attr['typography']]['fontsubsets'], true)) {
						array_push(self::$gfonts[$attr['typography']]['fontsubsets'], $attr['fontSubset']);
					}
				}
			}
		}
	}

	/**
	 * Render Info Block CSS in Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_icon_css_head($attributes)
	{
		if (!wp_style_is('amp-blocks-icon', 'enqueued')) {
			wp_enqueue_style('amp-blocks-icon');
		}
	}
	/**
	 * Builds css for inner blocks
	 *
	 * @param array $inner_blocks array of inner blocks.
	 */
	public function blocks_cycle_through($inner_blocks)
	{
		foreach ($inner_blocks as $in_indexkey => $inner_block) {
			if (!is_object($inner_block) && is_array($inner_block) && isset($inner_block['blockName'])) {
				if ('amp/rowlayout' === $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						$this->render_row_layout_css_head($blockattr);
						$this->render_row_layout_scripts($blockattr);
					}
				}
				if ('amp/column' === $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						$this->render_column_layout_css_head($blockattr);
					}
				}
				if ('amp/advancedheading' === $inner_block['blockName'] || 'ampblocks/heading' === $inner_block['blockName'] || 'ampblocks/icon-list' == $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						$this->render_advanced_heading_css_head($blockattr);
						$this->blocks_advanced_heading_gfont($blockattr);
					}
				}
				if ('amp/advancedbtn' === $inner_block['blockName'] || 'amp/buttongroup' === $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						$this->render_advanced_btn_css_head($blockattr);
						$this->blocks_advanced_btn_gfont($blockattr);
					}
				}
				if ('amp/icon' === $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						$this->render_icon_css_head($blockattr);
					}
				}
				if ( 'ampblocks/form' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_form_css_head( $blockattr );
						$this->blocks_form_scripts_check( $blockattr );
					}
				}
				if ('core/block' === $inner_block['blockName']) {
					if (isset($inner_block['attrs']) && is_array($inner_block['attrs'])) {
						$blockattr = $inner_block['attrs'];
						if (isset($blockattr['ref'])) {
							$reusable_block = get_post($blockattr['ref']);
							if ($reusable_block && 'wp_block' == $reusable_block->post_type) {
								$reuse_data_block = $this->amp_parse_blocks($reusable_block->post_content);
								$this->blocks_cycle_through($reuse_data_block);
							}
						}
					}
				}
				if (isset($inner_block['innerBlocks']) && !empty($inner_block['innerBlocks']) && is_array($inner_block['innerBlocks'])) {
					$this->blocks_cycle_through($inner_block['innerBlocks']);
				}
			}
		}
	}

		/**
	 * Render form CSS In Head
	 *
	 * @param array $attributes the blocks attributes.
	 */
	public function render_form_css_head( $attributes ) {
	
		if ( ! wp_style_is( 'amp-blocks-form', 'enqueued' ) ) {
			wp_enqueue_style( 'amp-blocks-form' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'amp-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_form_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Grabs the scripts that are needed so we can load in the head.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_form_scripts_check( $attr ) {
		wp_enqueue_script( 'amp-blocks-form' );
		if ( isset( $attr['recaptcha'] ) && $attr['recaptcha'] ) {
			wp_enqueue_script( 'google-recaptcha-v3' );
		}
		if ( isset( $attr['labelFont'] ) && is_array( $attr['labelFont'] ) && isset( $attr['labelFont'][0] ) && is_array( $attr['labelFont'][0] ) && isset( $attr['labelFont'][0]['google'] ) && $attr['labelFont'][0]['google'] && ( ! isset( $attr['labelFont'][0]['loadGoogle'] ) || true === $attr['labelFont'][0]['loadGoogle'] ) && isset( $attr['labelFont'][0]['family'] ) ) {
			$label_font = $attr['labelFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $label_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $label_font['family'],
					'fontvariants' => ( isset( $label_font['variant'] ) && ! empty( $label_font['variant'] ) ? array( $label_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $label_font['subset'] ) && ! empty( $label_font['subset'] ) ? array( $label_font['subset'] ) : array() ),
				);
				self::$gfonts[ $label_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $label_font['variant'], self::$gfonts[ $label_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontvariants'], $label_font['variant'] );
				}
				if ( ! in_array( $label_font['subset'], self::$gfonts[ $label_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontsubsets'], $label_font['subset'] );
				}
			}
		}
		if ( isset( $attr['submitFont'] ) && is_array( $attr['submitFont'] ) && isset( $attr['submitFont'][0] ) && is_array( $attr['submitFont'][0] ) && isset( $attr['submitFont'][0]['google'] ) && $attr['submitFont'][0]['google'] && ( ! isset( $attr['submitFont'][0]['loadGoogle'] ) || true === $attr['submitFont'][0]['loadGoogle'] ) && isset( $attr['submitFont'][0]['family'] ) ) {
			$submit_font = $attr['submitFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $submit_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $submit_font['family'],
					'fontvariants' => ( isset( $submit_font['variant'] ) && ! empty( $submit_font['variant'] ) ? array( $submit_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $submit_font['subset'] ) && ! empty( $submit_font['subset'] ) ? array( $submit_font['subset'] ) : array() ),
				);
				self::$gfonts[ $submit_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $submit_font['variant'], self::$gfonts[ $submit_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontvariants'], $submit_font['variant'] );
				}
				if ( ! in_array( $submit_font['subset'], self::$gfonts[ $submit_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontsubsets'], $submit_font['subset'] );
				}
			}
		}
		if ( isset( $attr['messageFont'] ) && is_array( $attr['messageFont'] ) && isset( $attr['messageFont'][0] ) && is_array( $attr['messageFont'][0] ) && isset( $attr['messageFont'][0]['google'] ) && $attr['messageFont'][0]['google'] && ( ! isset( $attr['messageFont'][0]['loadGoogle'] ) || true === $attr['messageFont'][0]['loadGoogle'] ) && isset( $attr['messageFont'][0]['family'] ) ) {
			$message_font = $attr['messageFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $message_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $message_font['family'],
					'fontvariants' => ( isset( $message_font['variant'] ) && ! empty( $message_font['variant'] ) ? array( $message_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $message_font['subset'] ) && ! empty( $message_font['subset'] ) ? array( $message_font['subset'] ) : array() ),
				);
				self::$gfonts[ $message_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $message_font['variant'], self::$gfonts[ $message_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $message_font['family'] ]['fontvariants'], $message_font['variant'] );
				}
				if ( ! in_array( $message_font['subset'], self::$gfonts[ $message_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $message_font['family'] ]['fontsubsets'], $message_font['subset'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for column layout block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks parent attr ID.
	 * @param number $column_key the blocks key.
	 */
	public function column_layout_array_css($attr, $unique_id, $column_key)
	{
		$css = '';
		if (isset($attr['topPadding']) || isset($attr['bottomPadding']) || isset($attr['leftPadding']) || isset($attr['rightPadding']) || isset($attr['topMargin']) || isset($attr['bottomMargin']) || isset($attr['rightMargin']) || isset($attr['leftMargin'])) {
			$css .= '#ri' . $unique_id . ' > .cw > .c-' . $column_key . ' > .ci {';
			if (isset($attr['topPadding'])) {
				$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
			}
			if (isset($attr['bottomPadding'])) {
				$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
			}
			if (isset($attr['leftPadding'])) {
				$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
			}
			if (isset($attr['rightPadding'])) {
				$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
			}
			if (isset($attr['topMargin'])) {
				$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
			}
			if (isset($attr['bottomMargin'])) {
				$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
			}
			if (isset($attr['rightMargin'])) {
				$css .= 'margin-right:' . $attr['rightMargin'] . 'px;';
			}
			if (isset($attr['leftMargin'])) {
				$css .= 'margin-left:' . $attr['leftMargin'] . 'px;';
			}
			$css .= '}';
		}
		if (isset($attr['zIndex'])) {
			$css .= '#ri' . $unique_id . ' > .cw > .c-' . $column_key . ' {';
			if (isset($attr['zIndex'])) {
				$css .= 'z-index:' . $attr['zIndex'] . ';';
			}
			$css .= '}';
		}
		if (isset($attr['topPaddingM']) || isset($attr['bottomPaddingM']) || isset($attr['leftPaddingM']) || isset($attr['rightPaddingM']) || isset($attr['topMarginM']) || isset($attr['bottomMarginM']) || isset($attr['rightMarginM']) || isset($attr['leftMarginM'])) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#ri' . $unique_id . ' > .cw > .c-' . $column_key . ' > .ci {';
			if (isset($attr['topPaddingM'])) {
				$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
			}
			if (isset($attr['bottomPaddingM'])) {
				$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
			}
			if (isset($attr['leftPaddingM'])) {
				$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
			}
			if (isset($attr['rightPaddingM'])) {
				$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
			}
			if (isset($attr['topMarginM'])) {
				$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
			}
			if (isset($attr['bottomMarginM'])) {
				$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
			}
			if (isset($attr['rightMarginM'])) {
				$css .= 'margin-right:' . $attr['rightMarginM'] . 'px;';
			}
			if (isset($attr['leftMarginM'])) {
				$css .= 'margin-left:' . $attr['leftMarginM'] . 'px;';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
}

Amp_Blocks_Frontend::get_instance();
