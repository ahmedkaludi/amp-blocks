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
                            'ampblocks-gutenberg-cta-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/cta.css',
                            array()                        
                        );
    
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/button'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-button-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/button.css',
                            array()                        
                        );
    
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/testimonial'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-testimonial-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/testimonial.css',
                            array()                        
                        );
                        
                        wp_enqueue_script(
                            'ampblocksSDFSAFSdddDAFSDAF',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/js/slider.js',array( 'jquery', 'jquery-ui-core' ),
                            AMP_BLOCKS_VERSION                            
                        );
                        
                        wp_enqueue_script(
                            'ampblocksSDFSAFSDAFSDAF',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/js/jquery.flexslider.js',array( 'jquery', 'jquery-ui-core' ),
                            AMP_BLOCKS_VERSION                            
                        );
                        
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/team'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-team-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/team.css',
                            array()                        
                        );
    
                    }

                    if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/latestposts'){
                        
                        wp_enqueue_style(
                            'ampblocks-gutenberg-team-non-amp-css-reg',
                            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/css/non-amp/latestposts.css',
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

        $team_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/amp/ab-team.css';

        $latestposts_css  =  AMP_BLOCKS_DIR_PATH . '/modules/gutenberg/assets/css/amp/ab-latestposts.css';

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

                if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/team'){

                    echo @file_get_contents($team_css);

                }

                if(isset($parse_blocks['blockName']) && $parse_blocks['blockName'] === 'ampblocks/latestposts'){

                    echo @file_get_contents($latestposts_css);

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
            'title' => 'Testimonial Slider',
            'media_url' =>  AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/images/user-df-img.png',
        );                  
        wp_localize_script( 'ampblocks-testimonial-reg', 'ampblocksGutenbergtestimonial', $inline_script );
    
        wp_enqueue_script( 'ampblocks-testimonial-reg' ); 

        // Team  Scripts
        wp_register_script(
            'ampblocks-team-reg',
            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/blocks/team.js',
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' )
        );
        $inline_script = array( 
            'title' => 'Team',
            'media_url' =>  AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/images/user-df-img.png',
        );                  
        wp_localize_script( 'ampblocks-team-reg', 'ampblocksGutenbergTeam', $inline_script );
    
        wp_enqueue_script( 'ampblocks-team-reg' );  


        // Latest Posts  Scripts
        wp_register_script(
            'ampblocks-latestposts-reg',
            AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/blocks/latestposts.js',
            array( 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' )
        );
         
        $posts = ampblock_get_latest_post();
       
        $inline_script = array( 
            'posts' => $posts
        );                  
        wp_localize_script( 'ampblocks-latestposts-reg', 'ampblocksGutenbergLatestposts', $inline_script );
    
        wp_enqueue_script( 'ampblocks-latestposts-reg' ); 
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
            'style'         => 'ampblocks-gutenberg-cta-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-cta-reg',
            'render_callback' => array( $this, 'render_cta_data' ),
        ) );

        register_block_type( 'ampblocks/button', array(
            'style'         => 'ampblocks-gutenberg-button-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-button-reg',
            'render_callback' => array( $this, 'render_button_data' ),
        ) );

        register_block_type( 'ampblocks/testimonial', array(
            'style'         => 'ampblocks-gutenberg-testimonial-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-testimonial-reg',
            'render_callback' => array( $this, 'render_testimonial_data' ),
        ) );

        register_block_type( 'ampblocks/team', array(
            'style'         => 'ampblocks-gutenberg-team-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-team-reg',
            'render_callback' => array( $this, 'render_team_data' ),
        ) );

        register_block_type( 'ampblocks/latestposts', array(
            'style'         => 'ampblocks-gutenberg-latestposts-css-reg',
            'editor_style'  => 'ampblocks-gutenberg-css-reg-editor',
            'editor_script' => 'ampblocks-latestposts-reg',
            'render_callback' => array( $this, 'render_latestposts_data' ),
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

    // Testimonial Block Server side markup
    function render_testimonial_data($attributes){
        ob_start();

        if ( !isset( $attributes ) ) {
			ob_end_clean();
                                                                       
			return '';
        }
        
        $content_color = '#3b3170';
        $author_color = '#3b3170';
        $social_txtcolor = '#b8b8b8';
        $cntn_align = 'center';

        if(isset($attributes['testi_content_color'])){
            $content_color = $attributes['testi_content_color'];
        }
        if(isset($attributes['testi_authr_nm_color'])){
            $author_color = $attributes['testi_authr_nm_color'];
        }
        if(isset($attributes['testi_social_fld_nm_color'])){
            $social_txtcolor = $attributes['testi_social_fld_nm_color'];
        }
        if(isset($attributes['alignment'])){
            $cntn_align = $attributes['alignment'];
        }
        
        if($attributes['items']){
            if(function_exists('ampforwp_is_amp_endpoint') && ampforwp_is_amp_endpoint()){
                $dotsTemplate = '';
                echo '
                <amp-carousel class="ab-tsti-w" width="400" height="250" layout="responsive" autoplay
                delay="3000" type="slides"  on="slideChange:AMP.setState({selected: {slide: event.index}})" id="carouselWithPreview-ampblock"> ';
                    foreach($attributes['items'] as $key=>$item){
                        echo '<li style="text-align:'.esc_attr($cntn_align).';">';
                            echo '<div class="ab-tsti-cnt" style="color:'.esc_attr($content_color).';">'.esc_html__($item['testi_content'], 'amp-blocks').'</div>';
                            echo '<div class="c-img">';
                            echo '<amp-img layout="responsive" width="70" height="70" src='.esc_url($item['mediaURL']).'></amp-img>';
                            echo '</div>';
                            echo '<div class="ab-tsti-nm" style="color:'.esc_attr($author_color).';">'.esc_html__($item['testi_authr_nm'], 'amp-blocks').'</div>';
                            echo '<div class="ab-tsti-spf" style="color:'.esc_attr($social_txtcolor).';">'.esc_html__($item['testi_social_fld_nm'], 'amp-blocks').'</div>';
                        echo '</li>';
                        $class = '';
                        if($key==0){ $class="active";}
                        $dotsTemplate .= '<li><div role="button" tabindex="'.esc_attr($key).'" class="'.esc_attr($class).'"  on="tap:carouselWithPreview-ampblock.goToSlide(index='.$key.')" [class]="selected.slide == '.$key.' ? \'active\' : \'\'"><span>'.$key.'</span></div></li>';

                    } // foreach ends here
                echo '</amp-carousel>';
                echo '<ul class="amp-dts" >'.$dotsTemplate.'</ul>';
            }else{
                echo '<div class="flexslider">
                   <ul class="slides">';
                    foreach($attributes['items'] as $item){
                        echo '<li style="text-align:'.esc_attr($cntn_align).';">';
                            echo '<div class="ab-tsti-cnt" style="color:'.esc_attr($content_color).';">'.esc_html__($item['testi_content'], 'amp-blocks').'</div>';
                            echo '<img src='.esc_url($item['mediaURL']).'>';
                            echo '<div class="ab-tsti-nm" style="color:'.esc_attr($author_color).';">'.esc_html__($item['testi_authr_nm'], 'amp-blocks').'</div>';
                            echo '<div class="ab-tsti-spf" style="color:'.esc_attr($social_txtcolor).';">'.esc_html__($item['testi_social_fld_nm'], 'amp-blocks').'</div>';
                        echo '</li>';

                    } // foreach ends here

                echo '</ul></div>';
            }

        } // attributes ends 

        return ob_get_clean();

    } //function ends here

    // Team Block Server side markup
    function render_team_data($attributes){
        
        ob_start();

        if ( !isset( $attributes ) ) {
			ob_end_clean();
                                                                       
			return '';
        }
        if(empty($attributes['items'] )){
            $attributes['items'][0] = array(
                'index' => 0,
                'mediaURL' => AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/images/user-df-img.png',
                'tm_name' => 'Raju Jeelaga',
                'tm_position' => 'Developer',
                'tm_desc' => 'Lorem ipsum dolor, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim',
            );
            $attributes['items'][1] = array(
                'index' => 1,
                'mediaURL' => AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/images/user-df-img.png',
                'tm_name' => 'Sanjevv',
                'tm_position' => 'Frontend Developer',
                'tm_desc' => 'Lorem ipsum dolor, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim',
            );
            $attributes['items'][2] = array(
                'index' => 2,
                'mediaURL' => AMP_BLOCKS_PLUGIN_URL . '/modules/gutenberg/assets/images/user-df-img.png',
                'tm_name' => 'Matt',
                'tm_position' => 'Head of the Development',
                'tm_desc' => 'Lorem ipsum dolor, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim',
            );

        }

        $tm_tlt  = 'Our Team';
        $tm_description = 'Our Team Consists Only of the Best Talents';
        $tm_tlt_color = '#000000';
        $tm_dsc_color = '#333333';
        $tm_name_color = '#111';
        $tm_position_color = '#111';
        $tm_cnt_color = '#333';
        $cntn_align = 'center';

        if(isset($attributes['team_tlt'])){
            $tm_tlt = $attributes['team_tlt'];
        }
        if(isset($attributes['team_desc'])){
            $tm_description = $attributes['team_desc'];
        }
        if(isset($attributes['team_tlt_color'])){
            $tm_tlt_color = $attributes['team_tlt_color'];
        }
        if(isset($attributes['team_desc_color'])){
            $tm_dsc_color = $attributes['team_desc_color'];
        }
        if(isset($attributes['tm_name_color'])){
            $tm_name_color = $attributes['tm_name_color'];
        }
        if(isset($attributes['tm_position_color'])){
            $tm_position_color = $attributes['tm_position_color'];
        }
        if(isset($attributes['tm_desc_color'])){
            $tm_cnt_color = $attributes['tm_desc_color'];
        }
        if(isset($attributes['alignment'])){
            $cntn_align = $attributes['alignment'];
        }
        if($attributes['items']){
            if(function_exists('ampforwp_is_amp_endpoint') && ampforwp_is_amp_endpoint()){
                echo '<div class="ab-team-blk" style="text-align:'.esc_attr($cntn_align).';">
                        <h1 class="ab-team-tlt" style="color:'.esc_attr($tm_tlt_color).';">'.esc_attr($tm_tlt).'</h1>
                        <span class="ab-team_dsc" style="color:'.esc_attr($tm_dsc_color).';">'.esc_attr($tm_description).'</span>
                        <ul class="ab-tm-lst">';
                    foreach($attributes['items'] as $key=>$item){
                        echo '<li>';
                            echo '<div class="c-img">';
                            echo '<amp-img layout="responsive" width="70" height="70" src='.esc_url($item['mediaURL']).'></amp-img>';
                            echo '</div>';
                            echo '<div class="ab-tm-nm" style="color:'.esc_attr($tm_name_color).';">'.esc_html__($item['tm_name'], 'amp-blocks').'</div>';
                            echo '<span class="ab-tm-position" style="color:'.esc_attr($tm_position_color).';">'.esc_html__($item['tm_position'], 'amp-blocks').'</span>';
                            echo '<p class="ab-tm-desc" style="color:'.esc_attr($tm_cnt_color).';">'.esc_html__($item['tm_desc'], 'amp-blocks').'</p>';
                        echo '</li>';
                    } // foreach ends here
                    echo '</ul></div>';
            }else{
                echo '<div class="ab-team-blk" style="text-align:'.esc_attr($cntn_align).';">
                <h1 class="ab-team-tlt" style="color:'.esc_attr($tm_tlt_color).';">'.esc_attr($tm_tlt).'</h1>
                <span class="ab-team_dsc" style="color:'.esc_attr($tm_dsc_color).';">'.esc_attr($tm_description).'</span>
                <ul class="ab-tm-lst">';
                    foreach($attributes['items'] as $item){
                        echo '<li>';
                        echo '<img layout="responsive" width="70" height="70" src='.esc_url($item['mediaURL']).'>';
                        echo '<div class="ab-tm-nm" style="color:'.esc_attr($tm_name_color).';">'.esc_html__($item['tm_name'], 'amp-blocks').'</div>';
                        echo '<span class="ab-tm-position" style="color:'.esc_attr($tm_position_color).';">'.esc_html__($item['tm_position'], 'amp-blocks').'</span>';
                        echo '<p class="ab-tm-desc" style="color:'.esc_attr($tm_cnt_color).';">'.esc_html__($item['tm_desc'], 'amp-blocks').'</p>';
                    echo '</li>';

                    } // foreach ends here

                echo '</ul></div>';
            }

        } // attributes ends 

        return ob_get_clean();



    } //function ends here

    // Latest post Markup
    function render_latestposts_data($attributes){
        $posts = ampblock_get_latest_post();
        
        ob_start();
        if ( !isset( $attributes ) ) {
			ob_end_clean();
                                                                       
			return '';
        }
            $lp_background_color = '#F2EDF0';
            $lp_title_color = '#1d1d1d';
            $lp_excerpt_color = '#848484';
            $lp_meta_color = '#242424';
            $cntn_align = 'left';

        if($posts){

            echo '<div class="lp-wrap" style="background:'.esc_attr($lp_background_color).';">';
                foreach($posts as $value){
                    echo '<li class="lst-pst" style="text-align:'.esc_attr($cntn_align).';">';
                        echo '<div class="lp-left">';
                            //echo '<span> class="lp-cat" style="color:'.esc_attr($lp_meta_color).';">'.esc_html__($value['category'], 'amp-blocks').'</span>';
                            echo '<h3 class="ab-lp-tlt"><a href="'.$value['url'].'" target="_blank" style="color:'.esc_attr($lp_title_color).';">' .esc_html__($value['title'], 'amp-blocks').'</a></h3>';
                            echo '<div class="excerpt" style="color:'.esc_attr($lp_excerpt_color).';">'.esc_html__($value['excerpt'], 'amp-blocks').'</div>';
                        echo '</div>';
                        echo '<div class="lp-rght">';
                            echo '<a href="'.$value['url'].'" target="_blank" ><img layout="responsive" src='.esc_url($value['image']).'></a>';
                        echo '</div>';
                    echo '</li>';
                } // for each ends
            echo '</div>';

        } 
        return ob_get_clean();

    } //function ends here


}

if ( class_exists( 'AMPBLOCKS_Gutenberg') ) {
	AMPBLOCKS_Gutenberg::get_instance();
}