<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

function ampblock_get_latest_post(){

    $posts = array();

    $next_args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'numberposts'=>10,
        'order'=>'DESC',
        );
       
    $the_query = get_posts( $next_args );
    // The Loop
    if ( $the_query ) {
        
        foreach ( $the_query as $post ) {
            $author_id = $post->post_author;
            //your html here for latest 2
            $post_cat = '';
            $category_obj = get_the_category($post->ID);            
            $post_cat = $category_obj[0]->name;
            $post_cat_link = get_category_link( $category_obj[0]->term_id);

            $posts[] = array(
                        'id'=> $post->ID,
                        'url'=> get_permalink($post->ID),
                        'title' => $post->post_title,
                        'excerpt' => get_the_excerpt($post->ID),
                        'image' => get_the_post_thumbnail_url($post->ID),
                        'category' => $post_cat,
                        'category_link' => $post_cat_link,
                        'author' => get_the_author_meta('display_name',$author_id),
                        'author_url' => get_author_posts_url($author_id),
                        'author_image' => get_avatar_url($author_id),
                        'date' => get_the_date('j F Y',$post->ID),
                        'comments' => get_comments_number($post->ID). esc_html__(' comments', 'amp-blocks'),

                     );
        }
    }
    /* Restore original Post Data */
    wp_reset_postdata();
    wp_reset_query();

    return $posts;

}