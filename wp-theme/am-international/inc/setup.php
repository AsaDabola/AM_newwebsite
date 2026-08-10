<?php
/**
 * Theme supports, menus and image sizes.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register theme features and navigation locations.
 */
function am_theme_setup() {
	load_theme_textdomain( 'am-international', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-logo', array(
		'height'      => 60,
		'width'       => 220,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'html5', array(
		'search-form',
		'gallery',
		'caption',
		'style',
		'script',
		'navigation-widgets',
	) );

	// The design supplies its own colour system; hide the editor's palette so
	// authors cannot introduce off-brand colours.
	add_theme_support( 'editor-color-palette', array(
		array(
			'name'  => __( 'AM Blue', 'am-international' ),
			'slug'  => 'am-blue',
			'color' => '#1449c6',
		),
		array(
			'name'  => __( 'AM Navy', 'am-international' ),
			'slug'  => 'am-navy',
			'color' => '#0a0f5c',
		),
		array(
			'name'  => __( 'AM Space', 'am-international' ),
			'slug'  => 'am-space',
			'color' => '#050a2e',
		),
		array(
			'name'  => __( 'Mist', 'am-international' ),
			'slug'  => 'am-mist',
			'color' => '#f1f3f7',
		),
		array(
			'name'  => __( 'Ink', 'am-international' ),
			'slug'  => 'am-ink',
			'color' => '#101828',
		),
		array(
			'name'  => __( 'White', 'am-international' ),
			'slug'  => 'am-white',
			'color' => '#ffffff',
		),
	) );
	add_theme_support( 'disable-custom-colors' );

	register_nav_menus( array(
		'primary'    => __( 'Primary (header mega menu)', 'am-international' ),
		'utility'    => __( 'Utility bar (small links above the header)', 'am-international' ),
		'quicklinks' => __( 'Homepage quick links (the four cards under the hero)', 'am-international' ),
		'footer_1'  => __( 'Footer column 1', 'am-international' ),
		'footer_2'  => __( 'Footer column 2', 'am-international' ),
		'footer_3'  => __( 'Footer column 3', 'am-international' ),
		'footer_4'  => __( 'Footer column 4', 'am-international' ),
		'legal'     => __( 'Footer legal links', 'am-international' ),
	) );

	// Card artwork is 16:10; people are square; the portrait slot is 4:5.
	add_image_size( 'am-card', 800, 500, true );
	add_image_size( 'am-feature', 1200, 800, true );
	add_image_size( 'am-square', 600, 600, true );
	add_image_size( 'am-portrait', 640, 800, true );
}
add_action( 'after_setup_theme', 'am_theme_setup' );

/**
 * Content width used by oEmbeds and wide images.
 */
function am_content_width() {
	$GLOBALS['content_width'] = 1200;
}
add_action( 'after_setup_theme', 'am_content_width', 0 );

/**
 * Widget area in the footer, for anything the menus cannot express.
 */
function am_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Footer note', 'am-international' ),
		'id'            => 'footer-note',
		'description'   => __( 'Optional extra content shown under the footer address block.', 'am-international' ),
		'before_widget' => '<div id="%1$s" class="footer__widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>',
	) );
}
add_action( 'widgets_init', 'am_widgets_init' );

/**
 * Trim the excerpt to a card-friendly length and drop the [...] marker.
 */
function am_excerpt_length() {
	return 26;
}
add_filter( 'excerpt_length', 'am_excerpt_length' );

function am_excerpt_more() {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'am_excerpt_more' );

/**
 * Body classes that let the stylesheet reason about page type.
 */
function am_body_classes( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'is-home';
	}
	if ( ! is_active_sidebar( 'footer-note' ) ) {
		$classes[] = 'no-footer-widget';
	}
	return $classes;
}
add_filter( 'body_class', 'am_body_classes' );
