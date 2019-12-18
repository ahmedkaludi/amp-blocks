<?php
/*
Plugin Name: AMP Blocks
Description: AMP Blocks is a professional page building content blocks for the WordPress Gutenberg block editor which shows the Design in AMP and Non AMP Pages.
Version: 0.3
Text Domain: amp-blocks
Domain Path: /languages
Author: Magazine3
Author URI: 
Donate link: https://www.paypal.me/Kaludi/25
License: GPL2
*/
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

define('AMP_BLOCKS_VERSION', '0.3');
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
require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/class-gutenberg.php';
require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/service.php';
require_once AMP_BLOCKS_DIR_NAME.'/modules/gutenberg/includes/aq_resizer.php';



