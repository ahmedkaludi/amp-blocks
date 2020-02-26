<?php
get_header();
if(class_exists('AMPFORWP_Content') && get_theme_support('amp-template-mode') && !is_customize_preview()){
	$content = get_the_content();
	$sanitizer_obj = new AMPFORWP_Content( $content,
				 apply_filters( 'amp_content_embed_handlers_template_mode', array(
					'AMP_Core_Block_Handler' => array(),
					'AMP_Twitter_Embed_Handler' => array(),
					'AMP_YouTube_Embed_Handler' => array(),
					'AMP_DailyMotion_Embed_Handler' => array(),
					'AMP_Vimeo_Embed_Handler' => array(),
					'AMP_SoundCloud_Embed_Handler' => array(),
					'AMP_Instagram_Embed_Handler' => array(),
					'AMP_Vine_Embed_Handler' => array(),
					'AMP_Facebook_Embed_Handler' => array(),
					'AMP_Pinterest_Embed_Handler' => array(),
					'AMP_Gallery_Embed_Handler' => array(),
					'AMP_Playlist_Embed_Handler'    => array(),
					'AMP_Wistia_Embed_Handler' => array(),
				) ),
				apply_filters( 'amp_content_sanitizers_template_mode', array(
					 'AMP_Style_Sanitizer' => array(),
					 'AMP_Blacklist_Sanitizer' => array(),
					 'AMP_Img_Sanitizer' => array(),
					 'AMP_Gallery_Block_Sanitizer' => array(),
					 'AMP_Video_Sanitizer' => array(),
					 'AMP_Audio_Sanitizer' => array(),
					 'AMP_Playbuzz_Sanitizer' => array(),
					 'AMP_Iframe_Sanitizer' => array(
						 'add_placeholder' => true,
					 ),
					 'AMP_Block_Sanitizer' => array(),
				) ),
				array(
					'content_max_width' => 990,
				)
			);
		 echo $sanitizer_obj->get_amp_content();
}else{
echo get_the_content();

}
get_footer();