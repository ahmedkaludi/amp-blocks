<?php
/**
 * Enqueue admin CSS/JS and edit width functions
 *
 * @since   1.0.0
 * @package Amp Blocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}
add_theme_support( 'align-wide' );
/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function amp_gutenberg_editor_assets()
{
	// Scripts.
	wp_register_script('amp-blocks-js', AMP_BLOCKS_DIR_URI . 'dist/blocks.build.js', array('wp-api-fetch', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api', 'wp-edit-post'), AMP_BLOCKS_VERSION, true);
	$editor_widths = get_option('amp_blocks_editor_width', array());
	$sidebar_size = 750;
	$nosidebar_size = 1140;
	$jssize = 2000;
	if (!isset($editor_widths['enable_editor_width']) || 'true' === $editor_widths['enable_editor_width']) {
		$add_size = 30;
		$post_type = get_post_type();
		if (isset($editor_widths['page_default']) && !empty($editor_widths['page_default']) && isset($editor_widths['post_default']) && !empty($editor_widths['post_default'])) {
			if (isset($post_type) && 'page' === $post_type) {
				$defualt_size_type = $editor_widths['page_default'];
			} else {
				$defualt_size_type = $editor_widths['post_default'];
			}
		} else {
			$defualt_size_type = 'sidebar';
		}
		if (isset($editor_widths['sidebar']) && !empty($editor_widths['sidebar'])) {
			$sidebar_size = $editor_widths['sidebar'] + $add_size;
		} else {
			$sidebar_size = 750;
		}
		if (isset($editor_widths['nosidebar']) && !empty($editor_widths['nosidebar'])) {
			$nosidebar_size = $editor_widths['nosidebar'] + $add_size;
		} else {
			$nosidebar_size = 1140 + $add_size;
		}
		if ('sidebar' == $defualt_size_type) {
			$default_size = $sidebar_size;
		} elseif ('fullwidth' == $defualt_size_type) {
			$default_size = 'none';
		} else {
			$default_size = $nosidebar_size;
		}
		if ('none' === $default_size) {
			$jssize = 2000;
		} else {
			$jssize = $default_size;
		}
	}
	if (current_user_can(apply_filters('amp_blocks_admin_role', 'manage_options'))) {
		$userrole = 'admin';
	} else if (current_user_can(apply_filters('amp_blocks_editor_role', 'delete_others_pages'))) {
		$userrole = 'editor';
	} else if (current_user_can(apply_filters('amp_blocks_author_role', 'publish_posts'))) {
		$userrole = 'author';
	} else if (current_user_can(apply_filters('amp_blocks_contributor_role', 'edit_posts'))) {
		$userrole = 'contributor';
	} else {
		$userrole = 'none';
	}
	wp_localize_script(
		'amp-blocks-js',
		'amp_blocks_params',
		array(
			'sidebar_size' => $sidebar_size,
			'nosidebar_size' => $nosidebar_size,
			'userrole' => $jssize,
			'config' => get_option('amp_blocks_config_blocks'),
			'configuration' => get_option('amp_blocks_config_blocks'),
			'userrole' => get_option('amp_blocks_settings_blocks'),
			'userrole' => $userrole,
			'design_library_status' => get_transient( 'amp_blocks_design_library' ),
			'AMP_BLOCKS_DIR_URI' => AMP_BLOCKS_DIR_URI,
			'amp_blocks_nonce' => wp_create_nonce('amp_blocks_nonce')
		)
	);
	// Styles.
	wp_register_style('amp-blocks-editor-css', AMP_BLOCKS_DIR_URI . 'dist/blocks.editor.build.css', array('wp-edit-blocks'), AMP_BLOCKS_VERSION);
	// Limited Margins removed
	// $editor_widths = get_option( 'amp_blocks_editor_width', array() );
	// if ( isset( $editor_widths['limited_margins'] ) && 'true' === $editor_widths['limited_margins'] ) {
	// 	wp_enqueue_style( 'amp-blocks-limited-margins-css', AMP_BLOCKS_DIR_URI . 'dist/limited-margins.css', array( 'wp-edit-blocks' ), AMP_BLOCKS_VERSION );
	// }
	if (function_exists('wp_set_script_translations')) {
		wp_set_script_translations('amp-blocks-js', 'amp-blocks');
	}
}

add_action('init', 'amp_gutenberg_editor_assets');


/**
 * Register Meta for blocks width
 */
function amp_blocks_init_post_meta()
{

	register_post_meta(
		'',
		'amp_blocks_editor_width',
		array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
		)
	);
}

add_action('init', 'amp_blocks_init_post_meta');

/**
 * Add inline css editor width
 */
function amp_blocks_admin_editor_width()
{
	$editor_widths = get_option('amp_blocks_editor_width', array());
	if (!isset($editor_widths['enable_editor_width']) || 'true' === $editor_widths['enable_editor_width']) {
		if (isset($editor_widths['limited_margins']) && 'true' === $editor_widths['limited_margins']) {
			$add_size = 10;
		} else {
			$add_size = 30;
		}
		$post_type = get_post_type();
		if (isset($editor_widths['page_default']) && !empty($editor_widths['page_default']) && isset($editor_widths['post_default']) && !empty($editor_widths['post_default'])) {
			if (isset($post_type) && 'page' === $post_type) {
				$defualt_size_type = $editor_widths['page_default'];
			} else {
				$defualt_size_type = $editor_widths['post_default'];
			}
		} else {
			$defualt_size_type = 'sidebar';
		}
		if (isset($editor_widths['sidebar']) && !empty($editor_widths['sidebar'])) {
			$sidebar_size = $editor_widths['sidebar'] + $add_size;
		} else {
			$sidebar_size = 750;
		}
		if (isset($editor_widths['nosidebar']) && !empty($editor_widths['nosidebar'])) {
			$nosidebar_size = $editor_widths['nosidebar'] + $add_size;
		} else {
			$nosidebar_size = 1140 + $add_size;
		}
		if ('sidebar' == $defualt_size_type) {
			$default_size = $sidebar_size;
		} elseif ('fullwidth' == $defualt_size_type) {
			$default_size = 'none';
		} else {
			$default_size = $nosidebar_size;
		}
		if ('none' === $default_size) {
			$jssize = 2000;
		} else {
			$jssize = $default_size;
		}
		echo '<style type="text/css" id="amp-block-editor-width">';
		echo 'body.gutenberg-editor-page.amp-editor-width-default .editor-post-title__block,
		body.gutenberg-editor-page.amp-editor-width-default .editor-default-block-appender,
		body.gutenberg-editor-page.amp-editor-width-default .editor-block-list__block,
		body.block-editor-page.amp-editor-width-default .wp-block {
			max-width: ' . esc_attr($default_size) . (is_numeric($default_size) ? 'px' : '') . ';
		}';
		echo 'body.gutenberg-editor-page.amp-editor-width-sidebar .editor-post-title__block,
		body.gutenberg-editor-page.amp-editor-width-sidebar .editor-default-block-appender,
		body.gutenberg-editor-page.amp-editor-width-sidebar .editor-block-list__block,
		body.block-editor-page.amp-editor-width-sidebar .wp-block {
			max-width: ' . esc_attr($sidebar_size) . 'px;
		}';
		echo 'body.gutenberg-editor-page.amp-editor-width-nosidebar .editor-post-title__block,
		body.gutenberg-editor-page.amp-editor-width-nosidebar .editor-default-block-appender,
		body.gutenberg-editor-page.amp-editor-width-nosidebar .editor-block-list__block,
		body.block-editor-page.amp-editor-width-nosidebar .wp-block {
			max-width: ' . esc_attr($nosidebar_size) . 'px;
		}';
		echo 'body.gutenberg-editor-page.amp-editor-width-fullwidth .editor-post-title__block,
		body.gutenberg-editor-page.amp-editor-width-fullwidth .editor-default-block-appender,
		body.gutenberg-editor-page.amp-editor-width-fullwidth .editor-block-list__block,
		body.block-editor-page.amp-editor-width-fullwidth .wp-block {
			max-width: none;
		}';
		echo 'body.gutenberg-editor-page .editor-block-list__layout .editor-block-list__block[data-align=wide],
		body.block-editor-page .editor-block-list__layout .wp-block[data-align=wide] {
			width: auto;
			max-width: ' . esc_attr($nosidebar_size + 200) . 'px;
		}';

		echo 'body.gutenberg-editor-page .editor-block-list__layout .editor-block-list__block[data-align=full],
		body.block-editor-page .editor-block-list__layout .wp-block[data-align=full] {
			max-width: none;
		}';
		echo '</style>';
		echo '<script> var amp_blocks_sidebar_size = ' . esc_attr($sidebar_size) . '; var amp_blocks_nosidebar_size = ' . esc_attr($nosidebar_size) . '; var amp_blocks_default_size = ' . esc_attr($jssize) . ';</script>';
	}
}

add_action('admin_head-post.php', 'amp_blocks_admin_editor_width', 100);
add_action('admin_head-post-new.php', 'amp_blocks_admin_editor_width', 100);

/**
 * Add class to match editor width.
 *
 * @param string $classes string of body classes.
 */
function amp_blocks_admin_body_class($classes)
{
	$screen = get_current_screen();
	if ('post' == $screen->base) {
		global $post;
		$editorwidth = get_post_meta($post->ID, 'amp_blocks_editor_width', true);
		if (isset($editorwidth) && !empty($editorwidth) && 'default' !== $editorwidth) {
			$classes .= ' amp-editor-width-' . esc_attr($editorwidth);
		} else {
			$classes .= ' amp-editor-width-default';
		}
	}
	return $classes;
}

add_filter('admin_body_class', 'amp_blocks_admin_body_class');




/**
 * Get other templates (e.g. product attributes) passing attributes and including the file.
 *
 * @param string $template_name Template name.
 * @param array $args Arguments. (default: array).
 * @param string $template_path Template path. (default: '').
 * @param string $default_path Default path. (default: '').
 */
function amp_blocks_get_template($template_name, $args = array(), $template_path = '', $default_path = '')
{
	$cache_key = sanitize_key(implode('-', array('template', $template_name, $template_path, $default_path, AMP_BLOCKS_VERSION)));
	$template = (string)wp_cache_get($cache_key, 'amp-blocks');

	if (!$template) {
		$template = amp_blocks_locate_template($template_name, $template_path, $default_path);
		wp_cache_set($cache_key, $template, 'amp-blocks');
	}

	// Allow 3rd party plugin filter template file from their plugin.
	$filter_template = apply_filters('amp_blocks_get_template', $template, $template_name, $args, $template_path, $default_path);

	if ($filter_template !== $template) {
		if (!file_exists($filter_template)) {
			return;
		}
		$template = $filter_template;
	}

	$action_args = array(
		'template_name' => $template_name,
		'template_path' => $template_path,
		'located' => $template,
		'args' => $args,
	);

	if (!empty($args) && is_array($args)) {
		if (isset($args['action_args'])) {
			unset($args['action_args']);
		}
		extract($args); // @codingStandardsIgnoreLine
	}

	do_action('amp_blocks_before_template_part', $action_args['template_name'], $action_args['template_path'], $action_args['located'], $action_args['args']);

	include $action_args['located'];

	do_action('amp_blocks_before_template_part', $action_args['template_name'], $action_args['template_path'], $action_args['located'], $action_args['args']);
}

/**
 * Locate a template and return the path for inclusion.
 *
 * This is the load order:
 *
 * yourtheme/$template_path/$template_name
 * yourtheme/$template_name
 * $default_path/$template_name
 *
 * @param string $template_name Template name.
 * @param string $template_path Template path. (default: '').
 * @param string $default_path Default path. (default: '').
 * @return string
 */
function amp_blocks_locate_template($template_name, $template_path = '', $default_path = '')
{
	if (!$template_path) {
		$template_path = apply_filters('amp_blocks_template_path', 'ampblocks/');
	}

	if (!$default_path) {
		$default_path = AMP_BLOCKS_DIR_PATH . 'dist/templates/';
	}

	// Look within passed path within the theme - this is priority.
	$template = locate_template(
		array(
			trailingslashit($template_path) . $template_name,
			$template_name,
		)
	);

	// Get default template/.
	if (!$template) {
		$template = $default_path . $template_name;
	}

	// Return what we found.
	return apply_filters('amp_blocks_locate_template', $template, $template_name, $template_path);
}
add_filter("theme_templates", function($default_template){
    $default_template['dist/template.php'] = "Amp Block";
    return $default_template;
  });

  add_filter("template_include", function($template_name){
    $object = get_queried_object();
	$template = get_page_template_slug( $object );
    if($template=='dist/template.php'){
      $template_name = AMP_BLOCKS_DIR_PATH.$template;
    }
    return $template_name;
  },99);