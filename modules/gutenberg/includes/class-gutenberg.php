<?php
/**
 * Class AMPBLOCKS_Gutenberg
 *
 * @author   Magazine3
 * @category Backend
 * @path  modules/gutenberg/includes/class-gutenberg
 * @Since Version 1.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

class AMPBLOCKS_Gutenberg {

    /**
     * Static private variable to hold instance this class
     * @var type 
     */
    private static $instance;
    /**
     * This is class constructer to use all the hooks and filters used in this class
     */
    private function __construct() {
        add_action( 'init', array( $this, 'register_cta' ) );                   
        add_action( 'enqueue_block_editor_assets', array( $this, 'register_admin_assets' ) ); 
        add_action( 'enqueue_block_assets', array( $this, 'register_frontend_assets' ) ); 
        add_filter( 'block_categories', array( $this, 'ampblocks_add_blocks_categories' ) );   
        add_action( 'amp_post_template_css', array($this, 'ampblocks_amp_css'));  
    }
        /**
         * Function to enqueue frontend assets for gutenberg blocks
         * @Since Version 1.0
         */
    public function register_frontend_assets() {
        if(!is_admin()){
            
            global $post;

            wp_enqueue_style(
                'ampblocks-gutenberg-global-css-reg',
                AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/global.css',
                array()                        
            );

            if(function_exists('parse_blocks') && is_object($post)){

                $blocks = parse_blocks($post->post_content);
                
                
                foreach ($blocks as $parse_blocks){
                    
                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/cta'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/cta.css',
                            array()                        
                        );
    
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/button'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/button.css',
                            array()                        
                        );
    
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/testimonial'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/testimonial.css',
                            array()                        
                        );
    
                    }

                } // foreach ends here
    
            } // function ends here
            
        }                               
    }
    
    public function ampblocks_amp_css(){
        
        global $post;

        $global_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/global.css';
        
        $cta_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/amp/ab-cta.css';

        $button_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/amp/ab-button.css';

        $testimonial_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/amp/ab-testimonial.css';

        echo file_get_contents($global_css);       

        if(function_exists('parse_blocks') && is_object($post)){

            $blocks = parse_blocks($post->post_content);

            foreach ($blocks as $parse_blocks){

                if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/cta'){

                    echo @file_get_contents($cta_css);

                }

                if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/button'){

                    echo @file_get_contents($button_css);

                }

                if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/testimonial'){

                    echo @file_get_contents($testimonial_css);

                }

            } // foreach ends here

        } // function ends here

    }
    
    /**
     * Function to enqueue admin assets for gutenberg blocks
     * @Since Version 1.0
     */
    public function register_admin_assets() {
            
        if ( !function_exists( 'register_block_type' ) ) {
                // no Gutenberg, Abort
                return;
        } 
        wp_register_style(
            'ampblocks-gutenberg-css-reg-editor',
            AMP_BLOCKS_PLUGIN_URL . 'modules/gutenberg/assets/css/editor/editor.css',
            array( 'wp-edit-blocks' )
        );

        // Call to Action Scripts
        wp_register_script(
            'ampblocks-cta-reg',
            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/blocks/cta.js',
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' )
        );
        $inline_script = array( 
            'title' => 'Call to Action'
        );                  
        wp_localize_script( 'ampblocks-cta-reg', 'ampblocksGutenbergCTA', $inline_script );
    
        wp_enqueue_script( 'ampblocks-cta-reg' );  
        
        // Button  Scripts
        wp_register_script(
            'ampblocks-button-reg',
            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/blocks/button.js',
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' )
        );
        $inline_script = array( 
            'title' => 'Button'
        );                  
        wp_localize_script( 'ampblocks-button-reg', 'ampblocksGutenbergButton', $inline_script );
    
        wp_enqueue_script( 'ampblocks-button-reg' );  
        
        //Testimonial scripts
        wp_register_script(
            'ampblocks-testimonial-reg',
            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/blocks/testimonial.js',
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' )
        );
        $inline_script = array( 
            'title' => 'Testimonial'
        );                  
        wp_localize_script( 'ampblocks-testimonial-reg', 'ampblocksGutenbergtestimonial', $inline_script );
    
        wp_enqueue_script( 'ampblocks-testimonial-reg' ); 


	}
    /**
     * Register a Call to Action
     * @return type
     * @since version 1.0
     */
    public function register_cta() {

        if ( !function_exists( 'register_block_type' ) ) {
            // no Gutenberg, Abort
            return;
        }                                   
         
        register_block_type( 'ampblocks/cta', array(
            'style'         => 'ampblocks-gutenberg-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-cta-reg',
            'render_callback' => array( $this, 'render_cta_data' ),
        ) );

        register_block_type( 'ampblocks/button', array(
            'style'         => 'ampblocks-gutenberg-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-button-reg',
            'render_callback' => array( $this, 'render_button_data' ),
        ) );

        register_block_type( 'ampblocks/testimonial', array(
            'style'         => 'ampblocks-gutenberg-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-testimonial-reg',
            'render_callback' => array( $this, 'render_testimonial_data' ),
        ) );
                                        
                    
    }
    /**
     * Function to register schema blocks category in Gutenberg block's categories list
     * @param array $categories
     * @return array
     * @since version 1.0
     */	        
    public function ampblocks_add_blocks_categories($categories){
    
    $categories[] = array(
            'slug'  => 'amp-blocks',
            'title' => esc_html__('AMP Blocks','amp-blocks')
    );
        
        return $categories;
        
    }    
	        
    /**
     * Return the unique instance 
     * @return type instance
     * @since version 1.0
     */
    public static function get_instance() {
    	if ( null == self::$instance ) {
    		self::$instance = new self;
    	}
	   return self::$instance;
    }

}

if ( class_exists( 'AMPBLOCKS_Gutenberg') ) {
	AMPBLOCKS_Gutenberg::get_instance();
}