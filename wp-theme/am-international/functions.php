<?php
/**
 * AM International theme bootstrap.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

define( 'AM_THEME_VERSION', '1.0.1' );

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
 * Reassert this theme's homepage over a page builder.
 *
 * Elementor's "Elementor Full Width" page template - and Elementor Pro's Theme
 * Builder - hook template_include and replace front-page.php with the page's
 * builder content. On a site whose existing homepage was built with Elementor,
 * that means activating this theme shows the old homepage wrapped in the new
 * header and footer, and the designed homepage never appears.
 *
 * Running late on the same filter puts front-page.php back. Site owners who
 * would rather keep a builder-made homepage can switch this off in
 * Customize -> AM homepage -> Hero + globe.
 *
 * @param string $template Template path chosen so far.
 * @return string
 */
function am_force_front_page_template( $template ) {
	// Only the front page itself, and not its paged continuations.
	if ( ! is_front_page() || is_paged() ) {
		return $template;
	}

	if ( ! am_mod( 'home_force_template' ) ) {
		return $template;
	}

	// Leave the Elementor editor and its preview alone, or the page cannot be
	// edited with the builder at all.
	if ( isset( $_GET['elementor-preview'] ) || ( function_exists( 'elementor_load_plugin' ) && isset( $_GET['action'] ) && 'elementor' === $_GET['action'] ) ) {
		return $template;
	}

	$front = locate_template( 'front-page.php' );

	return $front ? $front : $template;
}
// Priority 999 so this runs after page builders have had their say.
add_filter( 'template_include', 'am_force_front_page_template', 999 );

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
