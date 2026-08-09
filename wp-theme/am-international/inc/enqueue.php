<?php
/**
 * Styles and scripts.
 *
 * Everything is served from the theme - no Google Fonts, no CDN, no external
 * requests at all.
 *
 * @package AM_International
 */

defined( 'ABSPATH' ) || exit;

/**
 * Front-end assets.
 */
function am_enqueue_assets() {
	$dir     = get_template_directory();
	$uri     = get_template_directory_uri();
	$version = wp_get_theme()->get( 'Version' );

	// Cache-bust on file change rather than on theme version alone, so edits
	// during development are picked up without bumping the version.
	$main_css = $uri . '/assets/css/main.css';
	$css_ver  = file_exists( $dir . '/assets/css/main.css' )
		? filemtime( $dir . '/assets/css/main.css' )
		: $version;

	wp_enqueue_style( 'am-main', $main_css, array(), $css_ver );

	// style.css holds only the WordPress-specific overrides, so it loads after.
	wp_enqueue_style(
		'am-theme',
		get_stylesheet_uri(),
		array( 'am-main' ),
		file_exists( get_stylesheet_directory() . '/style.css' )
			? filemtime( get_stylesheet_directory() . '/style.css' )
			: $version
	);

	wp_enqueue_script(
		'am-main',
		$uri . '/assets/js/main.js',
		array(),
		file_exists( $dir . '/assets/js/main.js' ) ? filemtime( $dir . '/assets/js/main.js' ) : $version,
		true
	);

	// The globe is only needed where it is actually drawn.
	if ( am_page_has_globe() ) {
		wp_enqueue_script(
			'am-globe-data',
			$uri . '/assets/js/globe-data.js',
			array(),
			file_exists( $dir . '/assets/js/globe-data.js' ) ? filemtime( $dir . '/assets/js/globe-data.js' ) : $version,
			true
		);

		wp_enqueue_script(
			'am-globe',
			$uri . '/assets/js/globe.js',
			array( 'am-globe-data' ),
			file_exists( $dir . '/assets/js/globe.js' ) ? filemtime( $dir . '/assets/js/globe.js' ) : $version,
			true
		);

		// Hand the real chapter coordinates to the globe. When no chapter has
		// coordinates yet, nothing is printed and globe.js falls back to its
		// built-in sample markers.
		$markers = am_get_globe_markers();
		if ( $markers ) {
			wp_add_inline_script(
				'am-globe',
				'window.AM_GLOBE_MARKERS = ' . wp_json_encode( $markers ) . ';',
				'before'
			);
		}
	}

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'am_enqueue_assets' );

/**
 * Preload the two fonts used above the fold.
 */
function am_preload_fonts() {
	$uri = get_template_directory_uri();
	foreach ( array( 'archivo-latin-800-normal.woff2', 'inter-latin-400-normal.woff2' ) as $font ) {
		printf(
			'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
			esc_url( $uri . '/assets/fonts/' . $font )
		);
	}
	echo '<meta name="theme-color" content="#050a2e">' . "\n";
}
add_action( 'wp_head', 'am_preload_fonts', 1 );

/**
 * Editor styles so the block editor roughly matches the front end.
 */
function am_editor_styles() {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );
}
add_action( 'after_setup_theme', 'am_editor_styles' );
