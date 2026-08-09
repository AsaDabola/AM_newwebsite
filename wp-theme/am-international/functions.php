<?php
/**
 * AM International theme bootstrap.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

define( 'AM_THEME_VERSION', '1.0.0' );

require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/template-tags.php';
require_once get_template_directory() . '/inc/nav-walker.php';
require_once get_template_directory() . '/inc/post-types.php';
require_once get_template_directory() . '/inc/customizer.php';

/**
 * Custom post types register their own rewrite rules, which only take effect
 * after a flush. Doing it once on activation saves the "why is my chapter page
 * a 404" support call.
 */
function am_flush_rewrites() {
	am_register_post_types();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'am_flush_rewrites' );

function am_flush_rewrites_off() {
	flush_rewrite_rules();
}
add_action( 'switch_theme', 'am_flush_rewrites_off' );

/**
 * The design has no comment thread, so remove the UI rather than leaving a
 * half-styled one behind.
 */
function am_disable_comments_support() {
	remove_post_type_support( 'post', 'comments' );
	remove_post_type_support( 'page', 'comments' );
}
add_action( 'init', 'am_disable_comments_support' );

/**
 * Strip the WordPress emoji script - the theme does not need it and it costs
 * a request plus inline JS on every page.
 */
function am_dequeue_emoji() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
}
add_action( 'init', 'am_dequeue_emoji' );

/**
 * Reveal animations are applied by main.js to anything carrying data-reveal.
 * Editor-authored blocks do not have it, so opt the main content wrapper in.
 */
function am_reveal_attr() {
	return ' data-reveal';
}
