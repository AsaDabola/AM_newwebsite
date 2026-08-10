<?php
/**
 * Single am_chapter.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

while ( have_posts() ) :
	the_post();
	get_template_part( 'template-parts/content/single-cpt' );
endwhile;

get_footer();
