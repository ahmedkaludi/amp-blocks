<?php
/*
Plugin Name: AMP Blocks
Description: AMP Blocks is a professional page building content blocks for the WordPress Gutenberg block editor which shows the Design in AMP and Non AMP Pages.
Version: 1.4.6
Text Domain: amp-blocks
Domain Path: /languages
Author: Magazine3
Author URI:https://blocks.ampforwp.com/
Donate link: https://www.paypal.me/Kaludi/25
License: GPL2
*/
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

define('AMP_BLOCKS_VERSION', '1.4.6');
define('AMP_BLOCKS_DIR_NAME_FILE', __FILE__ );
define('AMP_BLOCKS_DIR_NAME', dirname( __FILE__ ));
define('AMP_BLOCKS_DIR_URI', plugin_dir_url(__FILE__));
define('AMP_BLOCKS_DIR_PATH', plugin_dir_path(__FILE__));
// the name of the settings page for the license input to be displayed
if(! defined('AMP_BLOCKS_ITEM_FOLDER_NAME')){
    $folderName = basename(__DIR__);
    define( 'AMP_BLOCKS_ITEM_FOLDER_NAME', $folderName );
}
define('AMP_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ));
define('AMP_BLOCKS_PLUGIN_BASENAME', plugin_basename(__FILE__));

//Module files load
// require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/class-gutenberg.php';
// require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/service.php';
// require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/aq_resizer.php';
add_filter( 'block_categories', 'ampblocks_add_blocks_categories' );  
/**
 * Function to register schema blocks category in Gutenberg block's categories list
 * @param array $categories
 * @return array
 * @since version 1.0
 */
function ampblocks_add_blocks_categories($categories)
{
    $categories[] = array(
        'slug'  => 'amp-blocks',
        'title' => esc_html__('AMP Blocks', 'amp-blocks')
    );
    return $categories;
}
/**
 * Load Plugin
 */
function amp_blocks_init()
{
    require_once AMP_BLOCKS_DIR_PATH . 'dist/init.php';
    require_once AMP_BLOCKS_DIR_PATH . 'dist/class-amp-blocks-frontend.php';
}
add_action('plugins_loaded', 'amp_blocks_init');

add_action( 'wp_ajax_amp_blocks_set_transient', 'amp_blocks_set_transient' );
add_action( 'wp_ajax_nopriv_amp_blocks_set_transient', 'amp_blocks_set_transient' );

function amp_blocks_set_transient (){
    $amp_blocks_nonce = $_REQUEST['security'];
	if ( wp_verify_nonce( $amp_blocks_nonce, 'amp_blocks_nonce' )){
        set_transient('amp_blocks_design_library',$_REQUEST['status']);
        update_post_meta( $_REQUEST['post_ID'], '_wp_page_template', 'dist/template.php' );
    }
	
}