<?php
/**
 * Our Network - the chapter directory.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

get_header();

am_page_hero(
	post_type_archive_title( '', false ),
	__( 'Search by school or city. If there is nothing near you yet, that is an invitation.', 'am-international' ),
	am_crumbs( array( array( __( 'Our Network', 'am-international' ), '' ) ) )
);

get_template_part( 'template-parts/home/finder', null, array(
	'eyebrow' => __( 'Not on the list?', 'am-international' ),
	'heading' => __( 'Start one where you are.', 'am-international' ),
	'body'    => __( 'Two or three committed students are enough to begin. We bring the training, the curriculum and a staff coach.', 'am-international' ),
) );

get_footer();
